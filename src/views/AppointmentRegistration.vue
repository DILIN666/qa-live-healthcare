<template>
  <div class="appointment-registration">
    <div class="appointment-container">
      <!-- 身份验证 -->
      <div v-if="!currentPatient" class="auth-section">
        <div class="auth-card">
          <h1>预约挂号</h1>
          <p>请先验证您的身份</p>
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
            description="输入任意姓名和生日即可使用。首次输入会自动创建账户，再次输入相同信息即可登录。"
            type="info"
            show-icon
          />
        </div>
      </div>

      <!-- 已验证身份 -->
      <div v-else class="patient-portal">
        <div class="portal-header">
          <div class="patient-info">
            <UserOutlined class="patient-icon-large" />
            <div>
              <h1>{{ currentPatient.name }} 的预约挂号</h1>
              <p>选择医生，预约线下门诊</p>
            </div>
          </div>
          <div class="portal-actions">
            <a-button @click="logoutPatient">
              <LogoutOutlined />
              切换用户
            </a-button>
          </div>
        </div>

        <a-tabs v-model:activeKey="activeTab" class="portal-tabs">
          <!-- 预约挂号 Tab -->
          <a-tab-pane key="book" tab="预约挂号">
            <div class="book-section">
              <div class="form-item">
                <label>选择医生</label>
                <a-select
                  v-model:value="selectedDoctorId"
                  size="large"
                  placeholder="请选择您要预约的医生"
                  style="width: 100%"
                  @change="onDoctorChange"
                >
                  <a-select-option
                    v-for="doctor in availableDoctors"
                    :key="doctor.id"
                    :value="doctor.id"
                  >
                    <div class="doctor-option">
                      <img :src="doctor.avatar" :alt="doctor.name" class="doctor-option-avatar" />
                      <div>
                        <div>{{ doctor.name }}</div>
                        <div style="font-size: 12px; color: #999;">
                          {{ doctor.title }} · {{ doctor.department }}
                        </div>
                      </div>
                    </div>
                  </a-select-option>
                </a-select>
              </div>

              <div v-if="selectedDoctorId" class="schedule-section">
                <h3>选择排班</h3>
                <SchedulePicker :doctorId="selectedDoctorId" @select="onScheduleSelect" />
              </div>

              <!-- 预约表单 -->
              <div v-if="selectedSchedule" class="appointment-form">
                <a-card title="填写预约信息" class="form-card">
                  <div class="selected-schedule-info">
                    <a-tag color="blue">{{ formatDate(selectedSchedule.date) }}</a-tag>
                    <a-tag color="blue">{{ formatTimeSlot(selectedSchedule.timeSlot) }}</a-tag>
                    <a-tag color="green">剩余 {{ selectedSchedule.totalSlots - selectedSchedule.bookedCount }} 号</a-tag>
                  </div>
                  <a-form layout="vertical">
                    <a-form-item label="症状描述">
                      <a-textarea
                        v-model:value="symptoms"
                        :rows="4"
                        placeholder="请简要描述您的症状，方便医生提前了解..."
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-button type="primary" size="large" @click="submitAppointment" :loading="submitting">
                        确认预约
                      </a-button>
                      <a-button style="margin-left: 12px" @click="cancelSelection">
                        取消
                      </a-button>
                    </a-form-item>
                  </a-form>
                </a-card>
              </div>
            </div>
          </a-tab-pane>

          <!-- 我的预约 Tab -->
          <a-tab-pane key="myAppointments" tab="我的预约">
            <div class="my-appointments">
              <a-empty v-if="myAppointments.length === 0" description="暂无预约记录" />
              <a-table
                v-else
                :columns="appointmentColumns"
                :dataSource="myAppointments"
                :rowKey="(record: Appointment) => record.id"
                :pagination="false"
                size="middle"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'date'">
                    {{ formatDate(record.date) }}
                  </template>
                  <template v-else-if="column.key === 'timeSlot'">
                    {{ formatTimeSlot(record.timeSlot) }}
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <a-tag :color="statusColorMap[record.status]">
                      {{ statusTextMap[record.status] }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <a-button
                      v-if="record.status === 'booked'"
                      type="link"
                      danger
                      @click="handleCancelAppointment(record.id)"
                    >
                      取消预约
                    </a-button>
                    <span v-else style="color: #999">-</span>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import {
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue';
import { store, Doctor, Schedule, Appointment } from '../store';
import SchedulePicker from '../components/SchedulePicker.vue';

const route = useRoute();

const currentPatient = computed(() => store.state.currentPatient);
const availableDoctors = computed(() => store.getActiveDoctors());
const myAppointments = computed(() =>
  currentPatient.value
    ? store.getAppointmentsByPatient(currentPatient.value.id).sort(
        (a, b) => b.date.localeCompare(a.date) || b.createTime.localeCompare(a.createTime)
      )
    : []
);

const activeTab = ref('book');
const selectedDoctorId = ref<string>('');
const selectedSchedule = ref<Schedule | null>(null);
const symptoms = ref('');
const submitting = ref(false);

const authForm = reactive({
  name: '',
  birthday: null as Dayjs | null,
});

const authRules = {
  name: [{ required: true, message: '请输入姓名' }],
  birthday: [{ required: true, message: '请选择生日' }],
};

const statusColorMap: Record<string, string> = {
  booked: 'blue',
  completed: 'green',
  no_show: 'orange',
  cancelled: 'red',
};

const statusTextMap: Record<string, string> = {
  booked: '已预约',
  completed: '已完成',
  no_show: '未到诊',
  cancelled: '已取消',
};

const appointmentColumns = [
  { title: '医生', dataIndex: 'doctorName', key: 'doctorName' },
  { title: '日期', dataIndex: 'date', key: 'date' },
  { title: '时段', dataIndex: 'timeSlot', key: 'timeSlot' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '症状', dataIndex: 'symptoms', key: 'symptoms', ellipsis: true },
  { title: '操作', key: 'action', width: 120 },
];

onMounted(() => {
  const doctorUsername = route.params.doctorUsername as string;
  if (doctorUsername) {
    const doctor = store.getDoctorByUsername(doctorUsername);
    if (doctor && doctor.isActive) {
      selectedDoctorId.value = doctor.id;
    }
  }
});

const verifyPatient = () => {
  const birthday = authForm.birthday?.format('YYYY-MM-DD');
  if (!birthday) {
    message.error('请选择生日');
    return;
  }
  const existingCount = store.state.patients.filter(
    p => p.name === authForm.name && p.birthday === birthday
  ).length;
  store.verifyPatient(authForm.name, birthday);
  message.success(existingCount > 0 ? '验证成功，欢迎回来!' : '首次登录，已为您创建账户!');
};

const logoutPatient = () => {
  store.logoutPatient();
  selectedDoctorId.value = '';
  selectedSchedule.value = null;
  message.success('已切换用户');
};

const onDoctorChange = () => {
  selectedSchedule.value = null;
};

const onScheduleSelect = (schedule: Schedule) => {
  selectedSchedule.value = schedule;
};

const cancelSelection = () => {
  selectedSchedule.value = null;
  symptoms.value = '';
};

const submitAppointment = () => {
  if (!selectedSchedule.value || !currentPatient.value) return;
  const doctor = store.state.doctors.find(d => d.id === selectedDoctorId.value);
  if (!doctor) return;

  submitting.value = true;
  setTimeout(() => {
    const result = store.addAppointment({
      scheduleId: selectedSchedule.value!.id,
      patientId: currentPatient.value!.id,
      patientName: currentPatient.value!.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: selectedSchedule.value!.date,
      timeSlot: selectedSchedule.value!.timeSlot,
      symptoms: symptoms.value || '未填写',
    });

    if (result) {
      message.success('预约成功!');
      selectedSchedule.value = null;
      symptoms.value = '';
      activeTab.value = 'myAppointments';
    } else {
      message.error('预约失败，号源可能已满');
    }
    submitting.value = false;
  }, 300);
};

const handleCancelAppointment = (apptId: string) => {
  Modal.confirm({
    title: '确认取消',
    content: '确定要取消该预约吗？取消后号源将被释放。',
    okText: '确认取消',
    cancelText: '返回',
    okType: 'danger',
    onOk() {
      const success = store.cancelAppointment(apptId);
      if (success) {
        message.success('预约已取消');
      } else {
        message.error('取消失败，请重试');
      }
    },
  });
};

const formatDate = (date: string) => {
  const d = dayjs(date);
  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][d.day()];
  return `${d.format('MM-DD')} 周${weekDay}`;
};

const formatTimeSlot = (slot: 'morning' | 'afternoon') => {
  return slot === 'morning' ? '上午' : '下午';
};
</script>

<style scoped>
.appointment-registration {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.appointment-container {
  max-width: 1200px;
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

.patient-portal {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.portal-header {
  background: linear-gradient(135deg, #36b37e 0%, #00875a 100%);
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

.portal-tabs {
  padding: 0 24px;
}

.book-section {
  padding: 24px 0;
}

.form-item {
  margin-bottom: 24px;
}

.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.schedule-section {
  margin-bottom: 24px;
}

.schedule-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px;
}

.appointment-form {
  margin-top: 24px;
}

.form-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.selected-schedule-info {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.my-appointments {
  padding: 24px 0;
}

.doctor-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doctor-option-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
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
