<template>
  <Dropdown class="m-0 p-0">
    <template #trigger class="m-0">
      <i class="hover:bg-secondary m-0 cursor-pointer p-1"
        ><BiSolidUserCircle
      /></i>
    </template>
    <DropdownContent>
      <div v-if="authStore.isAuthenticatedSync()">
        <div>
          <LinkComponent to="/auth">{{ authStore.getEmail() }}</LinkComponent>
        </div>
        <div class="cursor-pointer" @click="logoutAction">
          {{ i18n.t('login.logout') }}
        </div>
      </div>
      <div v-else>
        <router-link to="/auth/login">{{ i18n.t('login.login') }}</router-link>
      </div>
    </DropdownContent>
  </Dropdown>
</template>

<script setup lang="ts">
import LinkComponent from '@/components/assets/LinkComponent.vue';
import { Dropdown, DropdownContent } from 'v-dropdown';
import { BiSolidUserCircle } from 'vue-icons-plus/bi';
import { useAuthStore } from '../authStore';
import { useI18n } from 'vue-i18n';
import router from '@/router';
const authStore = useAuthStore();
const i18n = useI18n();

async function logoutAction() {
  await authStore.logout();
  await router.push({ path: '/' });
}
</script>
