<template>
  Ahoy-hoy
  <button @click="logoutAction()">{{ i18n.t('login.logout') }}</button>
</template>

<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '../authStore';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const i18n = useI18n();

async function logoutAction() {
  await authStore.logout();
  await router.push({ path: '/' });
}
</script>
