<template>
  <form @submit.prevent="resetPasswordAction">
    <div
      class="text-l m-auto mt-14 flex w-1/2 flex-col justify-start text-start"
    >
      <h2 class="mb-4 text-2xl font-bold">
        {{ i18n.t('user.resetPassword') }}
      </h2>

      <label for="login-password-input" class="font-bold"
        >{{ i18n.t('user.newPassword') }}:</label
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
        <ButtonComponent type="submit">
          {{ i18n.t('general.send') }}
        </ButtonComponent>
      </div>
    </div>
  </form>
</template>
<script setup lang="ts">
import ButtonComponent from '@/components/assets/ButtonComponent.vue';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { authService } from '@/modules/auth/services/authService.provider';
import router from '@/router';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/modules/auth/authStore';

const password = ref('');
const passwordCheck = ref('');

const authStore = useAuthStore();
const toast = useToast();
const i18n = useI18n();
const route = useRoute();
const userId = ref(authStore.getId());

onMounted(() => {
  if (route.params.id && !Array.isArray(route.params.id)) {
    userId.value = route.params.id;
  }
});

async function resetPasswordAction() {
  if (!comparePasswords(password.value, passwordCheck.value)) {
    toast.warning(i18n.t('login.wrongPasswordCheck'));
    return;
  }
  const passwordResetResult = await authService.resetPassword(
    userId.value,
    password.value,
    passwordCheck.value,
  );
  if (passwordResetResult) {
    const redirect = route.query.redirect as string | undefined;
    await router.push({
      path: redirect ?? '/auth',
      query: { passwordReset: '' },
    });
  }
}

function comparePasswords(password: string, passwordCheck: string): boolean {
  return password === passwordCheck;
}
</script>
