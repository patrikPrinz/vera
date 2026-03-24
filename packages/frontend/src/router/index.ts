import { useAuthStore } from '@/modules/auth/authStore';
import HomeView from '../modules/main/views/HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import AdminView from '@/modules/admin/views/AdminView.vue';
import UsersAdminView from '@/modules/admin/views/UsersAdminView.vue';
import BibleView from '@/modules/bible/views/BibleView.vue';
import AuthView from '@/modules/auth/views/AuthView.vue';
import LoginView from '@/modules/auth/views/LoginView.vue';
import RegisterView from '../modules/auth/views/RegisterView.vue';
import GroupsAdminView from '@/modules/admin/views/GroupsAdminView.vue';
import UserGroupsView from '@/modules/user/views/UserGroupsView.vue';
import BookmarkView from '@/modules/user/views/BookmarkView.vue';
import PsalterView from '@/modules/psalter/views/PsalterView.vue';
import KathismaView from '@/modules/psalter/views/KathismaView.vue';
import PsalmView from '@/modules/psalter/views/PsalmView.vue';
import GroupsView from '@/modules/groups/views/GroupsView.vue';
import GroupAdminView from '@/modules/groups/views/GroupAdminView.vue';
import GroupView from '@/modules/groups/views/GroupView.vue';

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
      { path: 'users', component: UsersAdminView },
      { path: 'groups', component: GroupsAdminView },
    ],
  },
  {
    path: '/psalter',
    component: PsalterView,
    children: [
      { path: 'kathisma', component: KathismaView },
      { path: 'kathisma/:number', component: KathismaView },
      { path: 'psalm', component: PsalmView },
      { path: 'psalm/:number', component: PsalmView },
    ],
  },

  {
    path: '/groups',
    children: [
      { path: '', component: GroupsView },
      { path: 'admin/:id', component: GroupAdminView },
      { path: ':id', component: GroupView },
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
