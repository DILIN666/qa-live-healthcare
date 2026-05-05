<template>
  <div class="doctor-room">
    <div class="room-container" v-if="currentDoctor">
      <div class="room-header">
        <div class="doctor-info">
          <img :src="currentDoctor.avatar" :alt="currentDoctor.name" class="doctor-avatar" />
          <div>
            <h1>{{ currentDoctor.name }}的诊室</h1>
            <p>{{ currentDoctor.title }} · {{ currentDoctor.department }}</p>
          </div>
        </div>
        <div class="room-actions">
          <a-button @click="copyRoomUrl">
            <CopyOutlined />
            复制诊室链接
          </a-button>
          <a-button danger @click="logout">
            <LogoutOutlined />
            退出登录
          </a-button>
        </div>
      </div>

      <div class="room-url">
        <a-alert
          :message="`诊室URL: ${roomUrl}`"
          type="success"
          show-icon
        />
      </div>

      <a-tabs v-model:activeKey="activeTab" class="room-tabs">
        <!-- 问诊 Tab -->
        <a-tab-pane key="consultation" tab="问诊">
          <div class="questions-section">
            <div class="section-header">
              <h2>待响应问题 ({{ pendingQuestions.length }})</h2>
              <a-button type="primary" @click="refreshQuestions">
                <ReloadOutlined />
                刷新
              </a-button>
            </div>

            <a-empty v-if="pendingQuestions.length === 0" description="暂无待响应问题" />

            <div v-else class="questions-list">
              <div
                v-for="question in pendingQuestions"
                :key="question.id"
                class="question-card"
              >
                <div class="question-header">
                  <div class="patient-info">
                    <UserOutlined class="patient-icon" />
                    <span class="patient-name">{{ question.patientName }}</span>
                  </div>
                  <span class="submit-time">{{ formatTime(question.submitTime) }}</span>
                </div>
                <div class="question-content">
                  <p>{{ question.question }}</p>
                </div>
                <div class="question-actions">
                  <a-button type="primary" @click="showAnswerModal(question)">
                    <EditOutlined />
                    文字回复
                  </a-button>
                  <a-button @click="markAsAnswered(question.id)">
                    <CheckOutlined />
                    标记已解答
                  </a-button>
                </div>
              </div>
            </div>
          </div>

          <div class="answered-section">
            <h2>已解答问题 ({{ answeredQuestions.length }})</h2>
            <a-collapse v-if="answeredQuestions.length > 0" accordion>
              <a-collapse-panel
                v-for="question in answeredQuestions"
                :key="question.id"
                :header="`${question.patientName}: ${question.question.substring(0, 50)}...`"
              >
                <div class="answered-content">
                  <p class="question-text"><strong>问题:</strong> {{ question.question }}</p>
                  <p class="answer-text"><strong>回复:</strong> {{ question.answer }}</p>
                  <p class="answer-time">回复时间: {{ formatTime(question.answerTime!) }}</p>
                </div>
              </a-collapse-panel>
            </a-collapse>
            <a-empty v-else description="暂无已解答问题" />
          </div>
        </a-tab-pane>

        <!-- 排班管理 Tab -->
        <a-tab-pane key="schedule" tab="排班管理">
          <div class="schedule-manage">
            <div class="section-header">
              <h2>排班列表</h2>
              <a-button type="primary" @click="showAddScheduleModal">
                <PlusOutlined />
                添加排班
              </a-button>
            </div>

            <a-table
              :columns="scheduleColumns"
              :dataSource="mySchedules"
              :rowKey="(record: Schedule) => record.id"
              :pagination="false"
              size="middle"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'date'">
                  {{ formatDate(record.date) }}
                </template>
                <template v-else-if="column.key === 'timeSlot'">
                  {{ record.timeSlot === 'morning' ? '上午' : '下午' }}
                </template>
                <template v-else-if="column.key === 'slots'">
                  <a-tag :color="record.bookedCount >= record.totalSlots ? 'red' : 'blue'">
                    {{ record.bookedCount }}/{{ record.totalSlots }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-popconfirm
                    title="确定要删除该排班吗？"
                    @confirm="handleDeleteSchedule(record.id)"
                    ok-text="确定"
                    cancel-text="取消"
                  >
                    <a-button type="link" danger>删除</a-button>
                  </a-popconfirm>
                </template>
              </template>
            </a-table>

            <a-empty v-if="mySchedules.length === 0" description="暂无排班" style="margin-top: 24px" />
          </div>
        </a-tab-pane>

        <!-- 预约列表 Tab -->
        <a-tab-pane key="appointments" tab="预约列表">
          <div class="appointment-manage">
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
                  {{ record.timeSlot === 'morning' ? '上午' : '下午' }}
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="statusColorMap[record.status]">
                    {{ statusTextMap[record.status] }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <template v-if="record.status === 'booked'">
                    <a-button type="link" @click="handleUpdateStatus(record.id, 'completed')">
                      已完成
                    </a-button>
                    <a-button type="link" danger @click="handleUpdateStatus(record.id, 'no_show')">
                      未到诊
                    </a-button>
                  </template>
                  <span v-else style="color: #999">-</span>
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>

      <!-- 回复问题 Modal -->
      <a-modal
        v-model:open="answerModalVisible"
        title="回复问题"
        @ok="submitAnswer"
        @cancel="closeAnswerModal"
        :confirmLoading="submitting"
      >
        <div v-if="selectedQuestion" class="modal-content">
          <div class="question-info">
            <p><strong>患者:</strong> {{ selectedQuestion.patientName }}</p>
            <p><strong>问题:</strong> {{ selectedQuestion.question }}</p>
          </div>
          <a-form-item label="您的回复">
            <a-textarea
              v-model:value="answerText"
              :rows="6"
              placeholder="请输入您的专业建议和回复..."
            />
          </a-form-item>
        </div>
      </a-modal>

      <!-- 添加排班 Modal -->
      <a-modal
        v-model:open="addScheduleModalVisible"
        title="添加排班"
        @ok="submitAddSchedule"
        @cancel="closeAddScheduleModal"
        :confirmLoading="addScheduleSubmitting"
      >
        <a-form layout="vertical">
          <a-form-item label="日期" required>
            <a-date-picker
              v-model:value="newScheduleDate"
              style="width: 100%"
              format="YYYY-MM-DD"
              placeholder="请选择日期"
              :disabledDate="(current: Dayjs) => current && current < dayjs().startOf('day')"
            />
          </a-form-item>
          <a-form-item label="时段" required>
            <a-select v-model:value="newScheduleTimeSlot" placeholder="请选择时段">
              <a-select-option value="morning">上午</a-select-option>
              <a-select-option value="afternoon">下午</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="号源数量" required>
            <a-input-number
              v-model:value="newScheduleTotalSlots"
              :min="1"
              :max="100"
              style="width: 100%"
              placeholder="请输入号源数量"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import {
  CopyOutlined,
  LogoutOutlined,
  ReloadOutlined,
  UserOutlined,
  EditOutlined,
  CheckOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import { store, Question, Schedule, Appointment, TimeSlot } from '../store';

const route = useRoute();
const router = useRouter();

const username = route.params.username as string;
const currentDoctor = computed(() => store.state.currentDoctor);
const roomUrl = computed(() => `${window.location.origin}/consultation/${username}`);

const activeTab = ref('consultation');

// 问诊相关
const pendingQuestions = computed(() =>
  currentDoctor.value
    ? store.getQuestionsByDoctor(currentDoctor.value.id).filter(q => q.status === 'pending')
    : []
);

const answeredQuestions = computed(() =>
  currentDoctor.value
    ? store.getQuestionsByDoctor(currentDoctor.value.id).filter(q => q.status === 'answered')
    : []
);

const answerModalVisible = ref(false);
const selectedQuestion = ref<Question | null>(null);
const answerText = ref('');
const submitting = ref(false);

// 排班管理相关
const mySchedules = computed(() =>
  currentDoctor.value
    ? store.getSchedulesByDoctor(currentDoctor.value.id).sort((a, b) => a.date.localeCompare(b.date))
    : []
);

const scheduleColumns = [
  { title: '日期', dataIndex: 'date', key: 'date' },
  { title: '时段', dataIndex: 'timeSlot', key: 'timeSlot' },
  { title: '号源', key: 'slots' },
  { title: '操作', key: 'action', width: 100 },
];

const addScheduleModalVisible = ref(false);
const addScheduleSubmitting = ref(false);
const newScheduleDate = ref<Dayjs | null>(null);
const newScheduleTimeSlot = ref<TimeSlot | undefined>(undefined);
const newScheduleTotalSlots = ref<number>(20);

// 预约列表相关
const myAppointments = computed(() =>
  currentDoctor.value
    ? store.getAppointmentsByDoctor(currentDoctor.value.id).sort(
        (a, b) => b.date.localeCompare(a.date) || b.createTime.localeCompare(a.createTime)
      )
    : []
);

const appointmentColumns = [
  { title: '患者', dataIndex: 'patientName', key: 'patientName' },
  { title: '日期', dataIndex: 'date', key: 'date' },
  { title: '时段', dataIndex: 'timeSlot', key: 'timeSlot' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '症状', dataIndex: 'symptoms', key: 'symptoms', ellipsis: true },
  { title: '操作', key: 'action', width: 160 },
];

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

onMounted(() => {
  if (!currentDoctor.value || currentDoctor.value.username !== username) {
    message.error('请先登录');
    router.push('/doctor/login');
  }
});

const copyRoomUrl = () => {
  navigator.clipboard.writeText(roomUrl.value);
  message.success('诊室链接已复制到剪贴板');
};

const logout = () => {
  store.logoutDoctor();
  message.success('已退出登录');
  router.push('/');
};

const refreshQuestions = () => {
  message.success('已刷新问题列表');
};

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
};

const formatDate = (date: string) => {
  const d = dayjs(date);
  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][d.day()];
  return `${d.format('YYYY-MM-DD')} 周${weekDay}`;
};

// 问诊操作
const showAnswerModal = (question: Question) => {
  selectedQuestion.value = question;
  answerText.value = '';
  answerModalVisible.value = true;
};

const closeAnswerModal = () => {
  answerModalVisible.value = false;
  selectedQuestion.value = null;
  answerText.value = '';
};

const submitAnswer = () => {
  if (!answerText.value.trim()) {
    message.error('请输入回复内容');
    return;
  }
  submitting.value = true;
  setTimeout(() => {
    if (selectedQuestion.value) {
      store.answerQuestion(selectedQuestion.value.id, answerText.value);
      message.success('回复成功');
      closeAnswerModal();
    }
    submitting.value = false;
  }, 500);
};

const markAsAnswered = (questionId: string) => {
  store.markQuestionAsAnswered(questionId);
  message.success('已标记为已解答');
};

// 排班管理操作
const showAddScheduleModal = () => {
  newScheduleDate.value = null;
  newScheduleTimeSlot.value = undefined;
  newScheduleTotalSlots.value = 20;
  addScheduleModalVisible.value = true;
};

const closeAddScheduleModal = () => {
  addScheduleModalVisible.value = false;
};

const submitAddSchedule = () => {
  if (!newScheduleDate.value || !newScheduleTimeSlot.value) {
    message.error('请填写完整的排班信息');
    return;
  }

  const dateStr = newScheduleDate.value.format('YYYY-MM-DD');

  // 检查重复排班
  const exists = mySchedules.value.some(
    s => s.date === dateStr && s.timeSlot === newScheduleTimeSlot.value
  );
  if (exists) {
    message.error('该日期和时段已有排班，请勿重复添加');
    return;
  }

  addScheduleSubmitting.value = true;
  setTimeout(() => {
    if (currentDoctor.value) {
      store.addSchedule({
        doctorId: currentDoctor.value.id,
        doctorName: currentDoctor.value.name,
        date: dateStr,
        timeSlot: newScheduleTimeSlot.value!,
        totalSlots: newScheduleTotalSlots.value,
      });
      message.success('排班添加成功');
      closeAddScheduleModal();
    }
    addScheduleSubmitting.value = false;
  }, 300);
};

const handleDeleteSchedule = (scheduleId: string) => {
  const success = store.deleteSchedule(scheduleId);
  if (success) {
    message.success('排班已删除');
  } else {
    message.error('删除失败，该排班下有未取消的预约');
  }
};

// 预约列表操作
const handleUpdateStatus = (apptId: string, status: 'completed' | 'no_show') => {
  const success = store.updateAppointmentStatus(apptId, status);
  if (success) {
    message.success(status === 'completed' ? '已标记为完成' : '已标记为未到诊');
  } else {
    message.error('操作失败');
  }
};
</script>

<style scoped>
.doctor-room {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.room-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.room-header {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.doctor-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.doctor-info h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px;
}

.doctor-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.room-actions {
  display: flex;
  gap: 12px;
}

.room-url {
  margin-bottom: 24px;
}

.room-tabs {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.questions-section,
.answered-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-header h2,
.answered-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.patient-icon {
  font-size: 16px;
  color: #1890ff;
}

.patient-name {
  font-weight: 600;
  color: #333;
}

.submit-time {
  font-size: 12px;
  color: #999;
}

.question-content {
  margin-bottom: 12px;
}

.question-content p {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.question-actions {
  display: flex;
  gap: 12px;
}

.answered-content {
  padding: 12px 0;
}

.question-text,
.answer-text {
  margin-bottom: 12px;
  line-height: 1.6;
}

.answer-time {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.modal-content .question-info {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.modal-content .question-info p {
  margin: 8px 0;
  line-height: 1.6;
}

.schedule-manage,
.appointment-manage {
  padding: 0;
}

@media (max-width: 768px) {
  .room-header {
    flex-direction: column;
    gap: 16px;
  }

  .room-actions {
    width: 100%;
    flex-direction: column;
  }

  .question-actions {
    flex-direction: column;
  }
}
</style>
