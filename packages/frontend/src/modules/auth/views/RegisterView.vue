<template>
  <div class="text-l m-auto mt-14 flex w-1/2 flex-col justify-start text-start">
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
      v-model="password"
      required
    />

    <div class="flex flex-row">
      <button
        @click="registerAction()"
        type="submit"
        class="bg-primary border-text text-text-inverse dark:text-text hover:border-text-inverse my-8 cursor-pointer rounded-lg border-2 p-2 px-4 text-xl"
      >
        {{ i18n.t('general.send') }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useKeyboardHandler } from '@/composables/keyboardHandler';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const email = ref('');
const password = ref('');
const passwordCheck = ref('');

const i18n = useI18n();
const { registerKeyy, unregisterKey } = useKeyboardHandler();

function registerAction() {
  if (!comparePasswords(password.value, passwordCheck.value)) {
    return;
  }
  console.log('registering...');
}

function comparePasswords(password: string, passwordCheck: string): boolean {
  return password === passwordCheck;
}
</script>
