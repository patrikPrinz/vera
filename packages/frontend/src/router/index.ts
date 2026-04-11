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
import KathismaView from '@/modules/psalter/views/KathismaView.vue';
import PsalmView from '@/modules/psalter/views/PsalmView.vue';
import GroupsView from '@/modules/groups/views/GroupsView.vue';
import GroupAdminView from '@/modules/groups/views/GroupAdminView.vue';
import GroupView from '@/modules/groups/views/GroupView.vue';
import PostView from '@/modules/groups/views/PostView.vue';
import CreatePostView from '@/modules/groups/views/CreatePostView.vue';
import PassagesView from '@/modules/bible/views/PassagesView.vue';
import PassagesAdminView from '@/modules/bible/views/PassagesAdminView.vue';
import PassagesCalendarView from '@/modules/bible/views/PassagesCalendarView.vue';
import KathismaSelectView from '@/modules/psalter/views/KathismaSelectView.vue';
import PsalmSelectView from '@/modules/psalter/views/PsalmSelectView.vue';
import PassageListView from '@/modules/bible/views/PassageListView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/bible',
    name: 'bible',
    children: [
      { path: '', component: BibleView },
      {
        path: 'calendar',
        redirect: `/bible/calendar/${new Date().toISOString().slice(0, 10)}`,
      },
      { path: 'passages', component: PassageListView },
      { path: 'calendar/:date', component: PassagesCalendarView },
      { path: 'passage/:id', component: PassagesView },
      {
        path: 'admin/passages/:id',
        meta: { requiresAuth: true },
        component: PassagesAdminView,
      },
      {
        name: 'createPassage',
        path: 'admin/passages/',
        meta: { requiresAuth: true },
        component: PassagesAdminView,
      },
    ],
  },
  {
    path: '/auth',

    children: [
      {
        path: '',
        name: 'auth',
        meta: { requiresAuth: true },
        component: AuthView,
      },
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
    name: 'psalter',
    children: [
      { path: '', redirect: '/psalter/kathisma' },
      { path: 'kathisma', component: KathismaSelectView },
      { path: 'kathisma/:number', component: KathismaView },
      { path: 'psalm', component: PsalmSelectView },
      { path: 'psalm/:number', component: PsalmView },
    ],
  },

  {
    path: '/groups',
    meta: { requiresAuth: true },
    children: [
      { path: ':groupId/post/publish', component: CreatePostView },
      { path: 'post/:postId', component: PostView },
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
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
