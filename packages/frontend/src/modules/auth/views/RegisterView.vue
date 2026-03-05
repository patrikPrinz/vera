<template>
  <form @submit.prevent="registerAction">
    <div
      class="text-l m-auto mt-14 flex w-1/2 flex-col justify-start text-start"
    >
      <h2 class="mb-4 text-2xl font-bold">{{ i18n.t('login.register') }}</h2>
      <label for="login-login-input" class="font-bold">E-mail:</label>
      <input
        type="email"
        name="login"
        id="login-login-input"
        class="border-text mb-8 cursor-text rounded-lg border-2 p-2"
        v-model="email"
        required
      />

      <label for="login-password-input" class="font-bold"
        >{{ i18n.t('general.password') }}:</label
      >
      <input
        type="password"
        name="password"
        id="login-password-input"
        class="border-text mb-8 cursor-text rounded-lg border-2 p-2"
        v-model="password"
        required
      />

      <label for="login-password-check-input" class="font-bold"
        >{{ i18n.t('general.passwordConfirm') }}:</label
      >
      <input
        type="password"
        name="passwordCheck"
        id="login-password-check-input"
        class="border-text cursor-text rounded-lg border-2 p-2"
        v-model="passwordCheck"
        required
      />

      <div class="flex flex-row">
        <button
          type="submit"
          class="bg-primary border-text text-text-inverse dark:text-text hover:border-text-inverse my-8 cursor-pointer rounded-lg border-2 p-2 px-4 text-xl"
        >
          {{ i18n.t('general.send') }}
        </button>
      </div>
    </div>
  </form>
</template>
<script setup lang="ts">
import { useKeyboardHandler } from '@/composables/keyboardHandler';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { authService } from '../services/authService.provider';
import router from '@/router';

const email = ref('');
const password = ref('');
const passwordCheck = ref('');

const toast = useToast();
const i18n = useI18n();

const { registerKey, unregisterKey } = useKeyboardHandler();

async function registerAction() {
  if (!comparePasswords(password.value, passwordCheck.value)) {
    toast.warning(i18n.t('login.wrongPasswordCheck'));
    return;
  }
  const registerResult = await authService.register(
    email.value,
    password.value,
    passwordCheck.value,
  );
  if (registerResult) {
    await router.push('/');
  } else {
    toast.error('login.duplicateRegisterMethod');
  }
}

function comparePasswords(password: string, passwordCheck: string): boolean {
  return password === passwordCheck;
}

onMounted(() => {
  registerKey('Enter', async () => {
    await registerAction();
  });
});

onUnmounted(() => {
  unregisterKey('Enter');
});
</script>
