import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';
import patientData from '../data/patient-user.json';
import questionData from '../data/question-list.json';
import type { Schedule, Appointment } from '../types/appointment';
import { AppointmentStatus } from '../types/appointment';
import scheduleData from '../data/schedule-list.json';
import appointmentData from '../data/appointment-list.json';

export interface Doctor {
  id: string;
  username: string;
  password: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  experience: string;
  specialties: string[];
  isActive: boolean;
}

export interface Patient {
  id: string;
  name: string;
  birthday: string;
  phone: string;
  gender: string;
}

export interface Question {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  question: string;
  submitTime: string;
  status: 'pending' | 'answered';
  answer: string | null;
  answerTime: string | null;
}

/** 创建预约的输入数据类型 */
export interface CreateAppointmentData {
  /** 患者ID */
  patientId: string;
  /** 患者姓名 */
  patientName: string;
  /** 联系电话 */
  phone: string;
  /** 医生ID */
  doctorId: string;
  /** 医生姓名 */
  doctorName: string;
  /** 排班ID */
  scheduleId: string;
  /** 就诊备注（选填） */
  notes?: string;
}

interface State {
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
  /** 排班列表 */
  schedules: Schedule[];
  /** 预约列表 */
  appointments: Appointment[];
}

const state = reactive<State>({
  doctors: doctorData as Doctor[],
  patients: patientData as Patient[],
  questions: questionData as Question[],
  currentDoctor: null,
  currentPatient: null,
  // TASK-003 将提供完整数据，此处先用空数组兜底
  schedules: (scheduleData || []) as Schedule[],
  appointments: (appointmentData || []) as Appointment[],
});

export const store = {
  state,

  loginDoctor(username: string, password: string): Doctor | null {
    const doctor = state.doctors.find(
      d => d.username === username && d.password === password
    );
    if (doctor) {
      state.currentDoctor = doctor;
      return doctor;
    }
    return null;
  },

  logoutDoctor() {
    state.currentDoctor = null;
  },

  verifyPatient(name: string, birthday: string): Patient {
    let patient = state.patients.find(
      p => p.name === name && p.birthday === birthday
    );

    if (!patient) {
      patient = {
        id: `patient${Date.now()}`,
        name,
        birthday,
        phone: '',
        gender: '',
      };
      state.patients.push(patient);
    }

    state.currentPatient = patient;
    return patient;
  },

  logoutPatient() {
    state.currentPatient = null;
  },

  getQuestionsByDoctor(doctorId: string): Question[] {
    return state.questions.filter(q => q.doctorId === doctorId);
  },

  getQuestionsByPatient(patientId: string): Question[] {
    return state.questions.filter(q => q.patientId === patientId);
  },

  addQuestion(question: Omit<Question, 'id' | 'submitTime' | 'status' | 'answer' | 'answerTime'>): Question {
    const newQuestion: Question = {
      ...question,
      id: `q${Date.now()}`,
      submitTime: new Date().toISOString(),
      status: 'pending',
      answer: null,
      answerTime: null,
    };
    state.questions.push(newQuestion);
    return newQuestion;
  },

  answerQuestion(questionId: string, answer: string) {
    const question = state.questions.find(q => q.id === questionId);
    if (question) {
      question.status = 'answered';
      question.answer = answer;
      question.answerTime = new Date().toISOString();
    }
  },

  markQuestionAsAnswered(questionId: string) {
    const question = state.questions.find(q => q.id === questionId);
    if (question) {
      question.status = 'answered';
      question.answer = '已口述解答';
      question.answerTime = new Date().toISOString();
    }
  },

  getDoctorByUsername(username: string): Doctor | undefined {
    return state.doctors.find(d => d.username === username);
  },

  getActiveDoctors(): Doctor[] {
    return state.doctors.filter(d => d.isActive);
  },

  getStatistics() {
    const totalDoctors = state.doctors.length;
    const totalQuestions = state.questions.length;
    const activeSessions = state.questions.filter(q => q.status === 'pending').length;
    const totalSessions = state.doctors.filter(d => d.isActive).length;

    return {
      totalDoctors,
      totalQuestions,
      activeSessions,
      totalSessions,
    };
  },

  // ===== 排班相关方法 =====

  /**
   * 获取指定医生的所有排班
   */
  getSchedulesByDoctor(doctorId: string): Schedule[] {
    return state.schedules.filter(s => s.doctorId === doctorId);
  },

  /**
   * 获取指定医生指定日期的可预约时段
   * 仅返回有名额的时段（bookedSlots < totalSlots）
   */
  getAvailableSlots(doctorId: string, date: string): Schedule[] {
    return state.schedules.filter(
      s => s.doctorId === doctorId && s.date === date && s.bookedSlots < s.totalSlots
    );
  },

  /**
   * 通过排班ID获取排班信息
   */
  getScheduleById(scheduleId: string): Schedule | undefined {
    return state.schedules.find(s => s.id === scheduleId);
  },

  // ===== 预约相关方法 =====

  /**
   * 创建预约
   * 含名额校验 + 重复预约校验
   */
  createAppointment(data: CreateAppointmentData): Appointment {
    // 1. 校验排班是否存在
    const schedule = state.schedules.find(s => s.id === data.scheduleId);
    if (!schedule) {
      throw new Error('排班不存在');
    }

    // 2. 名额校验
    if (schedule.bookedSlots >= schedule.totalSlots) {
      throw new Error('该时段已满');
    }

    // 3. 重复预约校验（同一患者同一排班且状态为待就诊）
    const duplicate = state.appointments.find(
      a =>
        a.patientId === data.patientId &&
        a.scheduleId === data.scheduleId &&
        a.status === AppointmentStatus.Scheduled
    );
    if (duplicate) {
      throw new Error('您已预约该时段');
    }

    // 4. 创建预约记录
    const newAppointment: Appointment = {
      id: `apt${Date.now()}`,
      patientId: data.patientId,
      patientName: data.patientName,
      phone: data.phone,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      scheduleId: data.scheduleId,
      notes: data.notes || '',
      status: AppointmentStatus.Scheduled,
      createdAt: new Date().toISOString(),
      cancelledAt: null,
    };

    // 5. 更新预约列表和名额
    state.appointments.push(newAppointment);
    schedule.bookedSlots += 1;

    return newAppointment;
  },

  /**
   * 取消预约
   * 仅能取消 status 为 scheduled 的预约，并释放名额
   */
  cancelAppointment(appointmentId: string): void {
    const appointment = state.appointments.find(a => a.id === appointmentId);

    if (!appointment) {
      throw new Error('预约不存在');
    }

    if (appointment.status !== AppointmentStatus.Scheduled) {
      throw new Error('预约状态不可取消');
    }

    // 更新预约状态
    appointment.status = AppointmentStatus.Cancelled;
    appointment.cancelledAt = new Date().toISOString();

    // 释放名额
    const schedule = state.schedules.find(s => s.id === appointment.scheduleId);
    if (schedule && schedule.bookedSlots > 0) {
      schedule.bookedSlots -= 1;
    }
  },

  /**
   * 标记预约已到诊
   */
  markAppointmentArrived(appointmentId: string): void {
    const appointment = state.appointments.find(a => a.id === appointmentId);

    if (!appointment) {
      throw new Error('预约不存在');
    }

    if (appointment.status !== AppointmentStatus.Scheduled) {
      throw new Error('只能标记待就诊的预约');
    }

    appointment.status = AppointmentStatus.Completed;
  },

  /**
   * 标记预约未到诊
   */
  markAppointmentNoShow(appointmentId: string): void {
    const appointment = state.appointments.find(a => a.id === appointmentId);

    if (!appointment) {
      throw new Error('预约不存在');
    }

    if (appointment.status !== AppointmentStatus.Scheduled) {
      throw new Error('只能标记待就诊的预约');
    }

    appointment.status = AppointmentStatus.NoShow;
  },

  /**
   * 获取指定患者的所有预约
   */
  getAppointmentsByPatient(patientId: string): Appointment[] {
    return state.appointments.filter(a => a.patientId === patientId);
  },

  /**
   * 获取指定医生的所有预约
   */
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return state.appointments.filter(a => a.doctorId === doctorId);
  },
};
