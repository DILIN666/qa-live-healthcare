import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Consultation from '../views/Consultation.vue';
import DoctorLogin from '../views/DoctorLogin.vue';
import DoctorRoom from '../views/DoctorRoom.vue';
import Doctors from '../views/Doctors.vue';
import About from '../views/About.vue';
import PatientAppointments from '../views/PatientAppointments.vue';
import DoctorAppointments from '../views/DoctorAppointments.vue';
import { store } from '../store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/consultation',
    name: 'Consultation',
    component: Consultation,
  },
  {
    path: '/consultation/:doctorUsername',
    name: 'ConsultationRoom',
    component: Consultation,
  },
  {
    path: '/doctors',
    name: 'Doctors',
    component: Doctors,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/appointments',
    name: 'PatientAppointments',
    component: PatientAppointments,
    meta: { requiresPatientAuth: true },
  },
  {
    path: '/doctor/login',
    name: 'DoctorLogin',
    component: DoctorLogin,
  },
  {
    path: '/doctor/room/:username',
    name: 'DoctorRoom',
    component: DoctorRoom,
  },
  {
    path: '/doctor/appointments/:username',
    name: 'DoctorAppointments',
    component: DoctorAppointments,
    meta: { requiresDoctorAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresPatientAuth) {
    if (!store.state.currentPatient) {
      next({ path: '/consultation', query: { redirect: to.fullPath } });
      return;
    }
  }
  if (to.meta.requiresDoctorAuth) {
    if (!store.state.currentDoctor) {
      next({ path: '/doctor/login', query: { redirect: to.fullPath } });
      return;
    }
  }
  next();
});

export default router;
