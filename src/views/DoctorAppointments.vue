<template>
  <div class="doctor-appointments-page">
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <h1>预约管理</h1>
          <p class="subtitle">{{ currentDoctor?.name }} · {{ currentDoctor?.title }} · {{ currentDoctor?.department }}</p>
        </div>
        <div class="header-right">
          <a-button @click="refreshList">
            <ReloadOutlined :spin="refreshing" />
            刷新
          </a-button>
        </div>
      </div>

      <div class="statistics-bar">
        <a-card class="stat-card">
          <Statistic
            :value="todayScheduledCount"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <CalendarOutlined />
            </template>
            <template #suffix>
              <span class="stat-suffix">人</span>
            </template>
          </Statistic>
          <div class="stat-label">今日待就诊</div>
        </a-card>
        <a-card class="stat-card">
          <Statistic
            :value="todayArrivedCount"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <CheckCircleOutlined />
            </template>
            <template #suffix>
              <span class="stat-suffix">人</span>
            </template>
          </Statistic>
          <div class="stat-label">今日已到诊</div>
        </a-card>
        <a-card class="stat-card">
          <Statistic
            :value="todayNoShowCount"
            :value-style="{ color: '#ff4d4f' }"
          >
            <template #prefix>
              <CloseCircleOutlined />
            </template>
            <template #suffix>
              <span class="stat-suffix">人</span>
            </template>
          </Statistic>
          <div class="stat-label">今日未到诊</div>
        </a-card>
      </div>

      <div class="filter-bar">
        <span class="filter-label">筛选日期：</span>
        <a-space>
          <a-date-picker
            v-model:value="selectedDate"
            @change="handleDateChange"
            :disabled-date="disabledFutureDate"
          />
          <a-button size="small" @click="jumpToToday">今天</a-button>
          <a-button size="small" @click="jumpToTomorrow">明天</a-button>
        </a-space>
      </div>

      <a-table
        :columns="columns"
        :data-source="filteredAppointments"
        :loading="loading"
        row-key="id"
        :pagination="false"
        class="appointments-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'patientName'">
            <div class="patient-cell">
              <UserOutlined class="patient-icon" />
              <span>{{ record.patientName }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'scheduleTime'">
            <div class="time-cell">
              <div>{{ formatDate(record.scheduleId) }}</div>
              <div class="time-slot">{{ formatTimeSlot(record.scheduleId) }}</div>
            </div>
          </template>

          <template v-else-if="column.key === 'phone'">
            <span class="phone-cell">{{ record.phone }}</span>
          </template>

          <template v-else-if="column.key === 'notes'">
            <span v-if="record.notes" class="notes-cell">{{ record.notes }}</span>
            <span v-else class="notes-empty">—</span>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)" class="status-tag">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'action'">
            <template v-if="record.status === 'scheduled'">
              <a-space>
                <a-button
                  type="primary"
                  size="small"
                  :loading="actionLoading === record.id + '-arrived'"
                  @click="handleArrived(record)"
                >
                  到诊
                </a-button>
                <a-button
                  danger
                  size="small"
                  :loading="actionLoading === record.id + '-noshow'"
                  @click="handleNoShow(record)"
                >
                  未到
                </a-button>
              </a-space>
            </template>
            <span v-else class="action-done">—</span>
          </template>
        </template>

        <template #emptyText>
          <a-empty description="该日期暂无预约记录" />
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message, Statistic } from 'ant-design-vue';
import {
  ReloadOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import dayjs, { Dayjs } from 'dayjs';
import { store, Appointment, AppointmentStatus } from '../store';
import { TimeSlot } from '../types/appointment';

const route = useRoute();
const router = useRouter();

const username = route.params.username as string;
const loading = ref(false);
const refreshing = ref(false);
const actionLoading = ref<string | null>(null);

const selectedDate = ref<Dayjs>(dayjs());
const currentDoctor = computed(() => store.state.currentDoctor);

const allAppointments = computed(() => {
  if (!currentDoctor.value) return [];
  return store.getAppointmentsByDoctor(currentDoctor.value.id);
});

const filteredAppointments = computed(() => {
  const dateStr = selectedDate.value.format('YYYY-MM-DD');
  return allAppointments.value
    .filter(apt => {
      const aptDate = extractDate(apt.scheduleId);
      return aptDate === dateStr;
    })
    .sort((a, b) => {
      const slotOrder: Record<TimeSlot, number> = { morning: 1, afternoon: 2, evening: 3 };
      const slotA = (extractTimeSlot(a.scheduleId) as TimeSlot) || 'morning';
      const slotB = (extractTimeSlot(b.scheduleId) as TimeSlot) || 'morning';
      return (slotOrder[slotA] || 0) - (slotOrder[slotB] || 0);
    });
});

const todayScheduledCount = computed(() => {
  const today = dayjs().format('YYYY-MM-DD');
  return allAppointments.value.filter(
    apt => apt.status === 'scheduled' && extractDate(apt.scheduleId) === today
  ).length;
});

const todayArrivedCount = computed(() => {
  const today = dayjs().format('YYYY-MM-DD');
  return allAppointments.value.filter(
    apt => apt.status === 'completed' && extractDate(apt.scheduleId) === today
  ).length;
});

const todayNoShowCount = computed(() => {
  const today = dayjs().format('YYYY-MM-DD');
  return allAppointments.value.filter(
    apt => apt.status === 'no-show' && extractDate(apt.scheduleId) === today
  ).length;
});

const columns = [
  { title: '患者姓名', key: 'patientName', width: 160 },
  { title: '预约时间', key: 'scheduleTime', width: 180 },
  { title: '联系电话', key: 'phone', width: 140 },
  { title: '就诊备注', key: 'notes', minWidth: 160 },
  { title: '状态', key: 'status', width: 100 },
  { title: '操作', key: 'action', width: 140, align: 'center' as const },
];

const TIME_LABELS: Record<TimeSlot, string> = {
  morning: '上午',
  afternoon: '下午',
  evening: '晚上',
};

const extractDate = (scheduleId: string): string => {
  const parts = scheduleId.split('-');
  return parts.length >= 4 ? parts[3] : '';
};

const extractTimeSlot = (scheduleId: string): string => {
  const parts = scheduleId.split('-');
  return parts.length >= 5 ? parts[4] : 'morning';
};

const formatDate = (scheduleId: string) => {
  const date = extractDate(scheduleId);
  return dayjs(date).format('YYYY-MM-DD');
};

const formatTimeSlot = (scheduleId: string) => {
  const slot = extractTimeSlot(scheduleId) as TimeSlot;
  return TIME_LABELS[slot] || slot;
};

const getStatusColor = (status: AppointmentStatus): string => {
  const colors: Record<AppointmentStatus, string> = {
    scheduled: 'blue',
    completed: 'green',
    cancelled: 'default',
    'no-show': 'red',
  };
  return colors[status] || 'default';
};

const getStatusText = (status: AppointmentStatus): string => {
  const texts: Record<AppointmentStatus, string> = {
    scheduled: '待就诊',
    completed: '已到诊',
    cancelled: '已取消',
    'no-show': '未到诊',
  };
  return texts[status] || status;
};

const disabledFutureDate = (current: Dayjs) => {
  return current && current > dayjs().endOf('day');
};

const handleDateChange = () => {
  // Date changed, filteredAppointments computed will auto-update
};

const jumpToToday = () => {
  selectedDate.value = dayjs();
};

const jumpToTomorrow = () => {
  selectedDate.value = dayjs().add(1, 'day');
};

const refreshList = () => {
  refreshing.value = true;
  setTimeout(() => {
    refreshing.value = false;
    message.success('列表已刷新');
  }, 500);
};

const handleArrived = async (appointment: Appointment) => {
  if (actionLoading.value) return;
  actionLoading.value = `${appointment.id}-arrived`;
  try {
    store.markAppointmentArrived(appointment.id);
    message.success(`患者 ${appointment.patientName} 已到诊`);
  } catch (err: unknown) {
    const error = err as Error;
    message.error(error.message || '操作失败');
  } finally {
    actionLoading.value = null;
  }
};

const handleNoShow = async (appointment: Appointment) => {
  if (actionLoading.value) return;
  actionLoading.value = `${appointment.id}-noshow`;
  try {
    store.markAppointmentNoShow(appointment.id);
    message.warning(`患者 ${appointment.patientName} 已标记未到诊`);
  } catch (err: unknown) {
    const error = err as Error;
    message.error(error.message || '操作失败');
  } finally {
    actionLoading.value = null;
  }
};

onMounted(() => {
  if (!currentDoctor.value || currentDoctor.value.username !== username) {
    message.error('请先登录医生账号');
    router.push('/doctor/login');
  }
});
</script>

<style scoped>
.doctor-appointments-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.page-header h1 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px;
}

.subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.statistics-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.stat-suffix {
  font-size: 14px;
  color: #999;
  margin-left: 4px;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.filter-bar {
  background: #fff;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.appointments-table {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #333;
}

.patient-icon {
  color: #1890ff;
  font-size: 14px;
}

.time-cell {
  font-size: 14px;
  color: #333;
}

.time-slot {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.phone-cell {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #666;
}

.notes-cell {
  font-size: 13px;
  color: #666;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
}

.notes-empty {
  color: #d9d9d9;
}

.status-tag {
  border-radius: 4px;
  font-size: 12px;
}

.action-done {
  color: #d9d9d9;
  font-size: 14px;
}

@media (max-width: 768px) {
  .statistics-bar {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
