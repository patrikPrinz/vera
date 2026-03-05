import { useAuthStore } from '@/modules/auth/authStore';
import HomeView from '../modules/main/views/HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/bible',
    name: 'bible',
    component: () => import('../modules/bible/views/BibleView.vue'),
  },
  {
    path: '/auth',
    name: 'auth',
    meta: { requiresAuth: true },
    component: () => import('../modules/auth/views/AuthView.vue'),
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../modules/auth/views/LoginView.vue'),
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('../modules/auth/views/RegisterView.vue'),
  },

  {
    path: '/user/bookmarks',
    name: 'bookmarks',
    component: () => import('../modules/user/views/BookmarkView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    const authStore = useAuthStore();
    const authenticated = await authStore.isAuthenticated();
    if (!authenticated) {
      next('/auth/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
