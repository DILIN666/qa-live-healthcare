<template>
  <div class="patient-appointments">
    <div class="appointments-container">
      <div v-if="!currentPatient" class="auth-section">
        <div class="auth-card">
          <h1>患者身份验证</h1>
          <p>请输入您的姓名和生日以验证身份，查看预约记录</p>
          <a-form
            :model="authForm"
            :rules="authRules"
            @finish="verifyPatient"
            layout="vertical"
          >
            <a-form-item label="姓名" name="name">
              <a-input
                v-model:value="authForm.name"
                size="large"
                placeholder="请输入您的姓名"
              >
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item label="生日" name="birthday">
              <a-date-picker
                v-model:value="authForm.birthday"
                size="large"
                format="YYYY-MM-DD"
                placeholder="请选择您的生日"
                style="width: 100%"
              />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" size="large" block>
                验证身份
              </a-button>
            </a-form-item>
          </a-form>

          <a-alert
            message="提示"
            description="输入任意姓名和生日即可使用。首次输入会自动创建账户。"
            type="info"
            show-icon
          />
        </div>
      </div>

      <div v-else class="appointments-portal">
        <div class="portal-header">
          <div class="patient-info">
            <UserOutlined class="patient-icon-large" />
            <div>
              <h1>我的预约</h1>
              <p>管理您的预约记录</p>
            </div>
          </div>
          <div class="portal-actions">
            <a-button @click="logoutPatient">
              <LogoutOutlined />
              切换用户
            </a-button>
          </div>
        </div>

        <div class="appointments-content">
          <div class="section-header">
            <h2>预约记录</h2>
          </div>

          <a-tabs v-model:activeKey="activeTab" @change="onTabChange">
            <a-tab-pane key="all" tab="全部" />
            <a-tab-pane key="scheduled" tab="待就诊" />
            <a-tab-pane key="completed" tab="已完成" />
            <a-tab-pane key="cancelled" tab="已取消" />
          </a-tabs>

          <a-empty
            v-if="filteredAppointments.length === 0"
            :description="emptyDescription"
            class="empty-state"
          />

          <div v-else class="appointment-list">
            <a-card
              v-for="apt in filteredAppointments"
              :key="apt.id"
              class="appointment-item"
            >
              <template #title>
                <div class="appointment-title">
                  <div class="doctor-info">
                    <span class="doctor-name">{{ apt.doctorName }}</span>
                    <span class="appointment-id">编号: {{ apt.id }}</span>
                  </div>
                  <a-tag :color="getStatusColor(apt.status)">
                    {{ getStatusLabel(apt.status) }}
                  </a-tag>
                </div>
              </template>

              <div class="appointment-detail">
                <div class="detail-row">
                  <CalendarOutlined class="detail-icon" />
                  <span>{{ formatDate(apt.scheduleId) }}</span>
                </div>
                <div class="detail-row">
                  <ClockCircleOutlined class="detail-icon" />
                  <span>{{ formatTimeSlot(apt.scheduleId) }}</span>
                </div>
                <div v-if="apt.notes" class="detail-row notes-row">
                  <FileTextOutlined class="detail-icon" />
                  <span>{{ apt.notes }}</span>
                </div>
                <div class="detail-row">
                  <PhoneOutlined class="detail-icon" />
                  <span>{{ apt.phone }}</span>
                </div>
                <div class="detail-row submit-time">
                  <FieldTimeOutlined class="detail-icon" />
                  <span>预约时间: {{ formatTime(apt.createdAt) }}</span>
                </div>
              </div>

              <div v-if="apt.status === 'scheduled'" class="appointment-actions">
                <a-button
                  danger
                  @click="confirmCancel(apt)"
                  :loading="cancellingId === apt.id"
                >
                  <CloseCircleOutlined />
                  取消预约
                </a-button>
              </div>

              <div v-if="apt.status === 'cancelled' && apt.cancelledAt" class="cancelled-info">
                <ExclamationCircleOutlined />
                已取消于 {{ formatTime(apt.cancelledAt) }}
              </div>
            </a-card>
          </div>
        </div>
      </div>
    </div>

    <a-modal
      v-model:open="cancelModalVisible"
      title="确认取消预约"
      @ok="handleCancel"
      @cancel="closeCancelModal"
      :confirmLoading="cancelling"
    >
      <p>确定要取消与 <strong>{{ cancelTarget?.doctorName }}</strong> 的预约吗？</p>
      <p style="color: #999; font-size: 13px;">
        {{ formatDate(cancelTarget?.scheduleId || '') }} {{ formatTimeSlot(cancelTarget?.scheduleId || '') }}
      </p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import {
  UserOutlined,
  LogoutOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PhoneOutlined,
  FieldTimeOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { store } from '../store';
import type { Appointment } from '../types/appointment';
import { Dayjs } from 'dayjs';

const currentPatient = computed(() => store.state.currentPatient);
const activeTab = ref('all');
const cancellingId = ref<string | null>(null);
const cancelling = ref(false);
const cancelModalVisible = ref(false);
const cancelTarget = ref<Appointment | null>(null);

const authForm = reactive({
  name: '',
  birthday: null as Dayjs | null,
});

const authRules = {
  name: [{ required: true, message: '请输入姓名' }],
  birthday: [{ required: true, message: '请选择生日' }],
};

const myAppointments = computed(() => {
  if (!currentPatient.value) return [];
  return store.getAppointmentsByPatient(currentPatient.value.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const filteredAppointments = computed(() => {
  if (activeTab.value === 'all') return myAppointments.value;
  return myAppointments.value.filter(apt => apt.status === activeTab.value);
});

const emptyDescription = computed(() => {
  const map: Record<string, string> = {
    all: '暂无预约记录',
    scheduled: '暂无待就诊的预约',
    completed: '暂无已完成的预约',
    cancelled: '暂无已取消的预约',
  };
  return map[activeTab.value] || '暂无预约记录';
});

const verifyPatient = () => {
  const birthday = authForm.birthday?.format('YYYY-MM-DD');
  if (!birthday) {
    message.error('请选择生日');
    return;
  }
  store.verifyPatient(authForm.name, birthday);
  message.success('验证成功');
};

const logoutPatient = () => {
  store.logoutPatient();
  activeTab.value = 'all';
  message.success('已切换用户');
};

const onTabChange = () => {
  // 切换时无需额外操作，computed 自动响应
};

const confirmCancel = (apt: Appointment) => {
  cancelTarget.value = apt;
  cancelModalVisible.value = true;
};

const closeCancelModal = () => {
  cancelModalVisible.value = false;
  cancelTarget.value = null;
};

const handleCancel = () => {
  if (!cancelTarget.value) return;

  cancelling.value = true;
  cancellingId.value = cancelTarget.value.id;

  setTimeout(() => {
    try {
      store.cancelAppointment(cancelTarget.value!.id);
      message.success('预约已取消');
      closeCancelModal();
    } catch (err: any) {
      message.error(err.message || '取消失败');
    } finally {
      cancelling.value = false;
      cancellingId.value = null;
    }
  }, 300);
};

const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    scheduled: 'blue',
    completed: 'green',
    cancelled: 'default',
    'no-show': 'red',
  };
  return map[status] || 'default';
};

const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    scheduled: '待就诊',
    completed: '已完成',
    cancelled: '已取消',
    'no-show': '未到诊',
  };
  return map[status] || status;
};

const formatTime = (time: string): string => {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
};

const timeSlotMap: Record<string, string> = {
  morning: '上午',
  afternoon: '下午',
  evening: '晚上',
};

const formatTimeSlot = (scheduleId: string): string => {
  if (!scheduleId) return '';
  const schedule = store.getScheduleById(scheduleId);
  if (!schedule) return scheduleId;
  return `${timeSlotMap[schedule.timeSlot] || schedule.timeSlot}（${schedule.timeSlot}）`;
};

const formatDate = (scheduleId: string): string => {
  if (!scheduleId) return '';
  const schedule = store.getScheduleById(scheduleId);
  if (!schedule) return scheduleId;
  return dayjs(schedule.date).format('YYYY-MM-DD');
};
</script>

<style scoped>
.patient-appointments {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.appointments-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.auth-section {
  min-height: calc(100vh - 112px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.auth-card h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
}

.auth-card > p {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 32px;
}

.appointments-portal {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.portal-header {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.patient-icon-large {
  font-size: 48px;
  color: #fff;
}

.patient-info h1 {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
}

.patient-info p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.appointments-content {
  padding: 24px;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.empty-state {
  margin-top: 48px;
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.appointment-item {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.appointment-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.doctor-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.doctor-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.appointment-id {
  font-size: 12px;
  color: #999;
}

.appointment-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #555;
}

.detail-icon {
  color: #1890ff;
  margin-top: 2px;
  flex-shrink: 0;
}

.notes-row {
  color: #666;
  font-style: italic;
}

.submit-time {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

.appointment-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.cancelled-info {
  margin-top: 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .auth-card {
    margin: 24px;
    padding: 32px 24px;
  }

  .portal-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .portal-actions {
    width: 100%;
  }
}
</style>
