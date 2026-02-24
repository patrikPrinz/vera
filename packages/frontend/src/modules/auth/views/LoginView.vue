<template>
  <div class="text-l m-auto mt-14 flex w-1/2 flex-col justify-start text-start">
    <h2 class="mb-4 text-2xl font-bold">{{ i18n.t('login.login') }}</h2>
    <label for="login-login-input" class="font-bold"
      >{{ i18n.t('general.email') }}:</label
    >
    <input
      type="email"
      name="login"
      id="login-login-input"
      class="border-text mb-8 cursor-text rounded-lg border-2 p-2"
      v-model="login"
      required
    />
    <label for="login-password-input" class="font-bold"
      >{{ i18n.t('general.password') }}:</label
    >
    <input
      type="password"
      name="password"
      id="login-password-input"
      class="border-text cursor-text rounded-lg border-2 p-2"
      v-model="password"
      required
    />

    <div class="flex flex-row">
      <button
        @click="loginAction()"
        type="submit"
        class="bg-primary border-text text-text-inverse dark:text-text hover:border-text-inverse my-8 cursor-pointer rounded-lg border-2 p-2 px-4 text-xl"
      >
        {{ i18n.t('login.login') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useAuthStore } from '../authStore';
import router from '@/router';
import { useToast } from 'vue-toastification';
import { useKeyboardHandler } from '@/composables/keyboardHandler';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const login = ref('');
const password = ref('');
const { registerKey, unregisterKey } = useKeyboardHandler();
const i18n = useI18n();

async function loginAction() {
  if (!validateEmail(login.value) || !validatePassword(password.value)) {
    toast.warning(i18n.t('login.missingCredentials'));
    return;
  }
  const authStore = useAuthStore();
  const logInResult = await authStore.login(login.value, password.value);
  if (logInResult) {
    console.log('success');
    await router.push({ path: '/auth' });
  } else {
    toast.error(i18n.t('login.incorrectCredentials'));
  }
}

function validateEmail(email: string) {
  return email.length != 0;
}

function validatePassword(password: string) {
  return password.length != 0;
}

onMounted(() => {
  registerKey('Enter', async () => {
    await loginAction();
  });
});

onUnmounted(() => {
  unregisterKey('Enter');
});
</script>
