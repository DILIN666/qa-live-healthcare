<template>
  <div class="schedule-picker">
    <a-empty v-if="schedules.length === 0" description="暂无排班信息" />

    <div v-else class="schedule-list">
      <div
        v-for="schedule in schedules"
        :key="schedule.id"
        class="schedule-card"
        :class="{
          'schedule-card--full': getRemaining(schedule) === 0,
          'schedule-card--selected': selectedScheduleId === schedule.id
        }"
        @click="handleSelect(schedule)"
      >
        <div class="schedule-date">
          <CalendarOutlined class="schedule-icon" />
          <span>{{ formatDate(schedule.date) }}</span>
        </div>
        <div class="schedule-time">
          <ClockCircleOutlined class="schedule-icon" />
          <span>{{ formatTimeSlot(schedule.timeSlot) }}</span>
        </div>
        <div class="schedule-slots">
          <a-tag :color="getRemaining(schedule) > 0 ? 'green' : 'red'">
            {{ getRemaining(schedule) > 0 ? `剩余 ${getRemaining(schedule)} 号` : '已满' }}
          </a-tag>
          <span class="slots-total">{{ schedule.bookedCount }}/{{ schedule.totalSlots }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
import { store, Schedule } from '../store';
import dayjs from 'dayjs';

const props = defineProps<{
  doctorId: string;
}>();

const emit = defineEmits<{
  (e: 'select', schedule: Schedule): void;
}>();

const selectedScheduleId = ref<string | null>(null);

const schedules = computed(() => {
  return store
    .getSchedulesByDoctor(props.doctorId)
    .filter(s => dayjs(s.date).isAfter(dayjs().subtract(1, 'day')))
    .sort((a, b) => {
      const dateDiff = a.date.localeCompare(b.date);
      if (dateDiff !== 0) return dateDiff;
      return a.timeSlot === 'morning' ? -1 : 1;
    });
});

const getRemaining = (schedule: Schedule) => {
  return schedule.totalSlots - schedule.bookedCount;
};

const formatDate = (date: string) => {
  const d = dayjs(date);
  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][d.day()];
  return `${d.format('YYYY-MM-DD')} 周${weekDay}`;
};

const formatTimeSlot = (slot: 'morning' | 'afternoon') => {
  return slot === 'morning' ? '上午 08:00-12:00' : '下午 14:00-17:00';
};

const handleSelect = (schedule: Schedule) => {
  if (getRemaining(schedule) === 0) return;
  selectedScheduleId.value = schedule.id;
  emit('select', schedule);
};
</script>

<style scoped>
.schedule-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.schedule-card {
  background: #fff;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.schedule-card:hover:not(.schedule-card--full) {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.schedule-card--selected {
  border-color: #1890ff;
  background: #e6f7ff;
}

.schedule-card--full {
  cursor: not-allowed;
  opacity: 0.6;
  background: #fafafa;
}

.schedule-date,
.schedule-time {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.schedule-icon {
  color: #1890ff;
}

.schedule-slots {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.slots-total {
  font-size: 12px;
  color: #999;
}
</style>
