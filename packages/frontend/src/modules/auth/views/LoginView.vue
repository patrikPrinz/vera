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
      <ButtonComponent @click="loginAction()" type="submit">
        {{ i18n.t('login.login') }}
      </ButtonComponent>
    </div>
  </div>
  <LinkComponent to="/auth/register">
    {{ i18n.t('login.register') }}
  </LinkComponent>
</template>

<script setup lang="ts">
import LinkComponent from '@/components/assets/LinkComponent.vue';
import ButtonComponent from '@/components/assets/ButtonComponent.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { useAuthStore } from '../authStore';
import { useToast } from 'vue-toastification';
import { keyboardHandler } from '@/composables/keyboardHandler.provider';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const login = ref('');
const password = ref('');
const { registerKey, unregisterKey } = keyboardHandler;
const i18n = useI18n();
const route = useRoute();
const router = useRouter();

async function loginAction() {
  if (!validateEmail(login.value) || !validatePassword(password.value)) {
    toast.warning(i18n.t('login.missingCredentials'));
    return;
  }
  const authStore = useAuthStore();
  const logInResult = await authStore.login(login.value, password.value);
  if (logInResult) {
    const redirect = route.query.redirect as string | undefined;

    await router.push(redirect ?? '/auth');
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

  if (route.query.registered) {
    toast.success(i18n.t('login.registerSuccess'));
  }
});

onUnmounted(() => {
  unregisterKey('Enter');
});
</script>
