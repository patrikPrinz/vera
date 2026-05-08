<template>
  <p>{{ i18n.t('general.email') }}: {{ authStore.getEmail() }}</p>
  <p>
    <LinkComponent class="link" to="/user/reset-password">{{
      i18n.t('user.newPassword')
    }}</LinkComponent>
  </p>
  <ButtonComponent @click="logoutAction()">{{
    i18n.t('login.logout')
  }}</ButtonComponent>
</template>

<script setup lang="ts">
import ButtonComponent from '@/components/assets/ButtonComponent.vue';
import LinkComponent from '@/components/assets/LinkComponent.vue';
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
