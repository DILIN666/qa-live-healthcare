<template>
  <div class="schedule-picker">
    <div class="picker-header">
      <h3>选择预约时间</h3>
      <span v-if="doctorName" class="doctor-name">{{ doctorName }}</span>
    </div>

    <a-spin :spinning="loading">
      <div v-if="scheduleDays.length === 0" class="empty-state">
        <a-empty description="该医生暂无排班信息" />
      </div>

      <div v-else class="schedule-calendar">
        <div
          v-for="day in scheduleDays"
          :key="day.date"
          class="day-card"
        >
          <div class="day-header">
            <span class="day-date">{{ formatDayDate(day.date) }}</span>
            <span class="day-week">{{ formatDayWeek(day.date) }}</span>
          </div>

          <div class="slots-container">
            <div
              v-for="slot in day.slots"
              :key="slot.id"
              class="time-slot"
              :class="getSlotClass(slot)"
              :title="getSlotTooltip(slot)"
              @click="handleSelect(slot)"
            >
              <span class="slot-name">{{ getSlotName(slot.timeSlot) }}</span>
              <span class="slot-count">{{ getSlotCount(slot) }}</span>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { aSpin, aEmpty } from 'ant-design-vue';
import dayjs from 'dayjs';
import { store } from '../store';
import type { Schedule } from '../types/appointment';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);

const props = defineProps<{
  doctorId: string;
}>();

const emit = defineEmits<{
  selected: [scheduleId: string];
}>();

const loading = ref(false);

const timeSlotMap: Record<string, string> = {
  morning: '上午',
  afternoon: '下午',
  evening: '晚上',
};

const timeSlotTimeMap: Record<string, string> = {
  morning: '08:00-12:00',
  afternoon: '14:00-18:00',
  evening: '19:00-21:00',
};

// 未来 7 天（含今天）
const scheduleDays = computed(() => {
  const days: Array<{ date: string; slots: Schedule[] }> = [];
  const today = dayjs().format('YYYY-MM-DD');

  for (let i = 0; i < 7; i++) {
    const date = dayjs().add(i, 'day').format('YYYY-MM-DD');
    const slotsForDay = store.getSchedulesByDoctor(props.doctorId)
      .filter(s => s.date === date)
      .sort((a, b) => {
        const order = { morning: 0, afternoon: 1, evening: 2 };
        return (order[a.timeSlot as keyof typeof order] ?? 99) - (order[b.timeSlot as keyof typeof order] ?? 99);
      });
    days.push({ date, slots: slotsForDay });
  }

  return days.filter(d => d.slots.length > 0);
});

const doctorName = computed(() => {
  const doctor = store.state.doctors.find(d => d.id === props.doctorId);
  return doctor?.name || '';
});

const isSlotAvailable = (slot: Schedule): boolean => {
  const slotDate = dayjs(slot.date);
  const today = dayjs().startOf('day');
  if (slotDate.isBefore(today)) return false; // 已过期
  return slot.bookedSlots < slot.totalSlots;
};

const isSlotPast = (slot: Schedule): boolean => {
  return dayjs(slot.date).isBefore(dayjs().startOf('day'));
};

const isSlotFull = (slot: Schedule): boolean => {
  return slot.bookedSlots >= slot.totalSlots;
};

const getSlotClass = (slot: Schedule): Record<string, boolean> => ({
  'slot-available': isSlotAvailable(slot) && !isSlotSelected(slot.id),
  'slot-full': isSlotFull(slot),
  'slot-past': isSlotPast(slot),
  'slot-selected': isSlotSelected(slot.id),
});

const selectedScheduleId = ref<string | null>(null);

const isSlotSelected = (scheduleId: string): boolean => {
  return selectedScheduleId.value === scheduleId;
};

const handleSelect = (slot: Schedule) => {
  if (!isSlotAvailable(slot)) return;
  if (isSlotSelected(slot.id)) {
    selectedScheduleId.value = null;
    return;
  }
  selectedScheduleId.value = slot.id;
  emit('selected', slot.id);
};

const getSlotName = (slot: string): string => {
  return timeSlotMap[slot] || slot;
};

const getSlotCount = (slot: Schedule): string => {
  if (slot.bookedSlots >= slot.totalSlots) return '已满';
  const remaining = slot.totalSlots - slot.bookedSlots;
  return `${remaining}/${slot.totalSlots}`;
};

const getSlotTooltip = (slot: Schedule): string => {
  const timeRange = timeSlotTimeMap[slot.timeSlot] || '';
  const available = slot.totalSlots - slot.bookedSlots;
  if (isSlotPast(slot)) return '已过期';
  if (isSlotFull(slot)) return `已满（${timeRange}）`;
  return `剩余 ${available} 个名额（${timeRange}）`;
};

const formatDayDate = (date: string): string => {
  return dayjs(date).format('M月D日');
};

const formatDayWeek = (date: string): string => {
  const weekMap: Record<number, string> = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
  };
  return weekMap[dayjs(date).day()] || '';
};

// 监听 doctorId 变化时重置选中状态
watch(() => props.doctorId, () => {
  selectedScheduleId.value = null;
});
</script>

<style scoped>
.schedule-picker {
  width: 100%;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.picker-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.doctor-name {
  font-size: 14px;
  color: #1890ff;
  font-weight: 500;
}

.schedule-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
}

.day-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 12px;
  min-width: 0;
}

.day-header {
  text-align: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.day-date {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.day-week {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.slots-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.time-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 4px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.slot-available {
  background: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

.slot-available:hover {
  background: #bae7ff;
  border-color: #40a9ff;
}

.slot-selected {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.slot-selected .slot-count {
  color: rgba(255, 255, 255, 0.85);
}

.slot-full {
  background: #f5f5f5;
  border-color: #d9d9d9;
  color: #bfbfbf;
  cursor: not-allowed;
}

.slot-past {
  background: #f5f5f5;
  border-color: #d9d9d9;
  color: #bfbfbf;
  cursor: not-allowed;
}

.slot-name {
  font-weight: 500;
}

.slot-count {
  font-size: 10px;
  color: #8c8c8c;
  margin-top: 2px;
}

.empty-state {
  padding: 48px 0;
  text-align: center;
}

@media (max-width: 1200px) {
  .schedule-calendar {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .schedule-calendar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .schedule-calendar {
    grid-template-columns: 1fr;
  }
}
</style>
