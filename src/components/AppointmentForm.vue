<template>
  <div class="appointment-form">
    <div class="schedule-info-bar">
      <CalendarOutlined class="info-icon" />
      <span class="info-doctor">{{ doctorName }}</span>
      <span class="info-separator">·</span>
      <span class="info-time">{{ formatScheduleTime(selectedSchedule) }}</span>
    </div>

    <a-form
      :model="form"
      :rules="rules"
      ref="formRef"
      layout="vertical"
      class="form-body"
    >
      <a-form-item label="患者姓名" name="patientName">
        <a-input
          v-model:value="form.patientName"
          placeholder="请输入您的姓名"
          :maxlength="20"
          show-count
        />
      </a-form-item>

      <a-form-item label="联系电话" name="phone">
        <a-input
          v-model:value="form.phone"
          placeholder="请输入联系电话"
          :maxlength="11"
        />
      </a-form-item>

      <a-form-item label="就诊备注" name="notes">
        <a-textarea
          v-model:value="form.notes"
          placeholder="请描述您的症状或需求（选填）"
          :rows="4"
          :maxlength="500"
          show-count
        />
      </a-form-item>

      <a-form-item>
        <a-button
          type="primary"
          :loading="submitting"
          :disabled="!hasPatient"
          block
          size="large"
          @click="handleSubmit"
        >
          确认预约
        </a-button>
        <div v-if="!hasPatient" class="identity-warning">
          <WarningOutlined />
          请先在「<router-link to="/consultation">问诊验证</router-link>」页面完成身份验证
        </div>
      </a-form-item>
    </a-form>

    <a-modal
      v-model:open="showSuccessModal"
      title="预约成功"
      :footer="null"
      centered
    >
      <div class="success-content">
        <div class="success-icon">
          <CheckCircleOutlined />
        </div>
        <h3>预约已确认</h3>
        <div class="success-detail">
          <div class="detail-row">
            <span class="detail-label">预约编号</span>
            <span class="detail-value appointment-id">{{ createdAppointment?.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">医生</span>
            <span class="detail-value">{{ createdAppointment?.doctorName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">预约时间</span>
            <span class="detail-value">{{ createdAppointment ? formatScheduleTimeByDate(createdAppointment.scheduleId) : '' }}</span>
          </div>
        </div>
        <a-button type="primary" block @click="handleModalClose">
          完成
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { FormInstance, message } from 'ant-design-vue';
import { CalendarOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { store, Schedule, Appointment } from '../store';
import { TimeSlot } from '../types/appointment';

interface Props {
  selectedSchedule: Schedule;
  doctorName: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  completed: [appointment: Appointment];
}>();

const router = useRouter();
const formRef = ref<FormInstance>();
const submitting = ref(false);
const showSuccessModal = ref(false);
const createdAppointment = ref<Appointment | null>(null);

const hasPatient = computed(() => !!store.state.currentPatient);

const form = reactive({
  patientName: '',
  phone: '',
  notes: '',
});

const rules = {
  patientName: [
    { required: true, message: '请输入患者姓名' },
    { min: 2, message: '姓名长度不能少于 2 个字符' },
    { max: 20, message: '姓名长度不能超过 20 个字符' },
  ],
  phone: [
    { required: true, message: '请输入联系电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号（11位，以1开头）' },
  ],
  notes: [
    { max: 500, message: '备注最多 500 个字符' },
  ],
};

const TIME_LABELS: Record<TimeSlot, string> = {
  morning: '上午 (08:00-12:00)',
  afternoon: '下午 (14:00-18:00)',
  evening: '晚上 (18:00-22:00)',
};

const formatScheduleTime = (schedule: Schedule) => {
  return `${dayjs(schedule.date).format('YYYY-MM-DD')} ${TIME_LABELS[schedule.timeSlot]}`;
};

const formatScheduleTimeByDate = (scheduleId: string) => {
  // scheduleId format: sched-{doctorId}-{date}-{timeSlot}
  const parts = scheduleId.split('-');
  if (parts.length >= 5) {
    const date = parts[3];
    const timeSlot = parts[4] as TimeSlot;
    return `${date} ${TIME_LABELS[timeSlot] || timeSlot}`;
  }
  return scheduleId;
};

const resetForm = () => {
  form.patientName = '';
  form.phone = '';
  form.notes = '';
  formRef.value?.resetFields();
};

watch(() => props.selectedSchedule, () => {
  resetForm();
});

const handleSubmit = async () => {
  if (!hasPatient.value) {
    message.error('请先完成身份验证');
    router.push('/consultation');
    return;
  }

  try {
    await formRef.value?.validate();
  } catch {
    return;
  }

  if (submitting.value) return;

  submitting.value = true;

  try {
    const currentPatient = store.state.currentPatient!;

    const appointment = store.createAppointment({
      patientId: currentPatient.id,
      patientName: form.patientName,
      phone: form.phone,
      doctorId: props.selectedSchedule.doctorId,
      doctorName: props.doctorName,
      scheduleId: props.selectedSchedule.id,
      notes: form.notes || undefined,
    });

    createdAppointment.value = appointment;
    showSuccessModal.value = true;
  } catch (err: unknown) {
    const error = err as Error;
    message.error(error.message || '预约创建失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  resetForm();
  emit('completed', createdAppointment.value!);
};
</script>

<style scoped>
.appointment-form {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.schedule-info-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #52c41a;
}

.info-icon {
  font-size: 16px;
}

.info-doctor {
  color: #333;
  font-weight: 600;
}

.info-separator {
  color: #d9d9d9;
}

.info-time {
  color: #666;
}

.form-body {
  max-width: 480px;
}

.identity-warning {
  margin-top: 8px;
  font-size: 12px;
  color: #ff4d4f;
  display: flex;
  align-items: center;
  gap: 4px;
}

.identity-warning a {
  color: #1890ff;
}

.success-content {
  text-align: center;
  padding: 8px 0;
}

.success-icon {
  font-size: 56px;
  color: #52c41a;
  margin-bottom: 12px;
  line-height: 1;
}

.success-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
}

.success-detail {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  text-align: left;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 13px;
  color: #999;
}

.detail-value {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.appointment-id {
  font-family: 'Courier New', monospace;
  color: #1890ff;
  font-size: 12px;
}
</style>
