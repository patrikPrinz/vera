import { useAuthStore } from '@/modules/auth/authStore';
import HomeView from '../modules/main/views/HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import AdminView from '@/modules/admin/views/AdminView.vue';
import UsersView from '@/modules/admin/views/UsersView.vue';
import BibleView from '@/modules/bible/views/BibleView.vue';
import AuthView from '@/modules/auth/views/AuthView.vue';
import LoginView from '@/modules/auth/views/LoginView.vue';
import RegisterView from '../modules/auth/views/RegisterView.vue';
import GroupsView from '@/modules/admin/views/GroupsView.vue';
import UserGroupsView from '@/modules/user/views/UserGroupsView.vue';
import BookmarkView from '@/modules/user/views/BookmarkView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/bible',
    name: 'bible',
    component: BibleView,
  },
  {
    path: '/auth',
    name: 'auth',
    children: [
      { path: '', meta: { requiresAuth: true }, component: AuthView },
      { path: 'login', component: LoginView },
      { path: 'register', component: RegisterView },
    ],
  },

  {
    path: '/user',
    meta: { requiresAuth: true },
    children: [
      { path: 'bookmarks', component: BookmarkView },
      {
        path: 'groups',
        component: UserGroupsView,
      },
    ],
  },

  {
    path: '/admin',
    meta: { requiresAuth: true },
    component: AdminView,
    children: [
      { path: 'users', component: UsersView },
      { path: 'groups', component: GroupsView },
    ],
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
