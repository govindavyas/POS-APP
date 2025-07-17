import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Signup from './views/Signup.vue';
import Dashboard from './views/Dashboard.vue';
import Profile from './views/Profile.vue';
import Businesses from './views/Businesses.vue';
import BusinessProfile from './views/BusinessProfile.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/businesses', name: 'Businesses', component: Businesses },
  { path: '/business-profile', name: 'BusinessProfile', component: BusinessProfile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
