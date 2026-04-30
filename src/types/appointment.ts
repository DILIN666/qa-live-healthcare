/**
 * 预约挂号类型定义
 *
 * 本文件定义了预约挂号功能所需的数据类型，包括：
 * - 排班信息（Schedule）：医生的出诊时间安排
 * - 预约信息（Appointment）：患者的预约记录
 *
 * @module types/appointment
 */

/** 排班时段枚举 */
export enum TimeSlot {
  /** 上午 */
  Morning = 'morning',
  /** 下午 */
  Afternoon = 'afternoon',
  /** 晚上 */
  Evening = 'evening',
}

/** 预约状态枚举 */
export enum AppointmentStatus {
  /** 已预约，待就诊 */
  Scheduled = 'scheduled',
  /** 已完成 */
  Completed = 'completed',
  /** 已取消 */
  Cancelled = 'cancelled',
  /** 未到诊 */
  NoShow = 'no-show',
}

/**
 * 医生排班信息
 */
export interface Schedule {
  /**
   * 排班唯一标识
   * 格式：sch + 时间戳
   */
  id: string;

  /**
   * 关联医生ID
   * 引用 Doctor.id
   */
  doctorId: string;

  /**
   * 出诊日期
   * 格式：YYYY-MM-DD
   */
  date: string;

  /**
   * 出诊时段
   * morning | afternoon | evening
   */
  timeSlot: TimeSlot;

  /**
   * 该时段总可预约名额
   * 整数，表示最多可接受的预约人数
   */
  totalSlots: number;

  /**
   * 已预约人数
   * 整数，初始值为 0，预约成功后 +1，取消后 -1
   */
  bookedSlots: number;
}

/**
 * 患者预约信息
 */
export interface Appointment {
  /**
   * 预约唯一标识
   * 格式：apt + 时间戳
   */
  id: string;

  /**
   * 患者ID
   * 引用 Patient.id
   */
  patientId: string;

  /**
   * 患者姓名（冗余存储）
   * 便于直接展示，避免关联查询
   */
  patientName: string;

  /**
   * 联系电话
   * 用于预约确认和提醒
   */
  phone: string;

  /**
   * 医生ID
   * 引用 Doctor.id
   */
  doctorId: string;

  /**
   * 医生姓名（冗余存储）
   * 便于直接展示，避免关联查询
   */
  doctorName: string;

  /**
   * 关联排班ID
   * 引用 Schedule.id
   */
  scheduleId: string;

  /**
   * 患者就诊备注（选填）
   * 患者描述的症状或想咨询的问题
   * 空字符串表示未填写
   */
  notes: string;

  /**
   * 预约状态
   * scheduled | completed | cancelled | no-show
   * 默认值为 scheduled
   */
  status: AppointmentStatus;

  /**
   * 创建时间
   * ISO 8601 格式
   */
  createdAt: string;

  /**
   * 取消时间
   * 未取消时为 null
   */
  cancelledAt: string | null;
}
