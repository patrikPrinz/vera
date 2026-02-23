<template>
  Ahoy-hoy
  <button @click="logoutAction()">Log out</button>
</template>

<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '../authStore';

const authStore = useAuthStore();

async function logoutAction() {
  await authStore.logout();
  await router.push({ path: '/' });
}
</script>
