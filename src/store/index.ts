import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';
import patientData from '../data/patient-user.json';
import questionData from '../data/question-list.json';
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

export type TimeSlot = 'morning' | 'afternoon';

export type AppointmentStatus = 'booked' | 'completed' | 'no_show' | 'cancelled';

export interface Schedule {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: TimeSlot;
  totalSlots: number;
  bookedCount: number;
}

export interface Appointment {
  id: string;
  scheduleId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: TimeSlot;
  status: AppointmentStatus;
  symptoms: string;
  createTime: string;
  updateTime: string;
}

interface State {
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  schedules: Schedule[];
  appointments: Appointment[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
}

const state = reactive<State>({
  doctors: doctorData as Doctor[],
  patients: patientData as Patient[],
  questions: questionData as Question[],
  schedules: scheduleData as Schedule[],
  appointments: appointmentData as Appointment[],
  currentDoctor: null,
  currentPatient: null,
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

  // Schedule methods
  getSchedulesByDoctor(doctorId: string): Schedule[] {
    return state.schedules.filter(s => s.doctorId === doctorId);
  },

  getSchedulesByDate(date: string): Schedule[] {
    return state.schedules.filter(s => s.date === date);
  },

  addSchedule(schedule: Omit<Schedule, 'id' | 'bookedCount'>): Schedule {
    const newSchedule: Schedule = {
      ...schedule,
      id: `schedule${Date.now()}`,
      bookedCount: 0,
    };
    state.schedules.push(newSchedule);
    return newSchedule;
  },

  deleteSchedule(scheduleId: string): boolean {
    const hasBookedAppts = state.appointments.some(
      a => a.scheduleId === scheduleId && a.status === 'booked'
    );
    if (hasBookedAppts) return false;
    const index = state.schedules.findIndex(s => s.id === scheduleId);
    if (index === -1) return false;
    state.schedules.splice(index, 1);
    return true;
  },

  // Appointment methods
  addAppointment(appt: Omit<Appointment, 'id' | 'status' | 'createTime' | 'updateTime'>): Appointment | null {
    const schedule = state.schedules.find(s => s.id === appt.scheduleId);
    if (!schedule || schedule.bookedCount >= schedule.totalSlots) return null;
    const newAppt: Appointment = {
      ...appt,
      id: `appt${Date.now()}`,
      status: 'booked',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };
    schedule.bookedCount++;
    state.appointments.push(newAppt);
    return newAppt;
  },

  cancelAppointment(apptId: string): boolean {
    const appt = state.appointments.find(a => a.id === apptId);
    if (!appt || appt.status !== 'booked') return false;
    const schedule = state.schedules.find(s => s.id === appt.scheduleId);
    if (schedule) schedule.bookedCount--;
    appt.status = 'cancelled';
    appt.updateTime = new Date().toISOString();
    return true;
  },

  updateAppointmentStatus(apptId: string, status: AppointmentStatus): boolean {
    const appt = state.appointments.find(a => a.id === apptId);
    if (!appt) return false;
    appt.status = status;
    appt.updateTime = new Date().toISOString();
    return true;
  },

  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return state.appointments.filter(a => a.doctorId === doctorId);
  },

  getAppointmentsByPatient(patientId: string): Appointment[] {
    return state.appointments.filter(a => a.patientId === patientId);
  },
};
