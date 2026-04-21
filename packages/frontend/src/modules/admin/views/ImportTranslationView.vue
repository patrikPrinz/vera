<template>
  <h2 class="text-2xl">Překlady Bible</h2>

  <input type="file" ref="translation" /><br />
  <ButtonComponent @click="uploadFile()">{{
    i18n.t('general.send')
  }}</ButtonComponent>

  <div class="relative">
    <div
      v-if="loading"
      class="bg-text-inverse dark:bg-text border-text absolute inset-0 m-auto my-5 flex w-fit items-center justify-center rounded-xl border-2 p-10"
    >
      <div
        class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from '@/components/assets/ButtonComponent.vue';
import { bibleService } from '@/modules/bible/services/bibleServices.provider';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const toast = useToast();
const i18n = useI18n();
const translation = ref<HTMLInputElement | null>(null);
const loading = ref(false);

async function uploadFile() {
  const file = translation.value?.files?.[0];
  if (!file) {
    toast.warning('Vyberte soubor.');
    return;
  }
  loading.value = true;
  const success = await bibleService.importTranslation(file);
  loading.value = false;
  if (success) {
    toast.success('Soubor byl úspěšně odeslán.');
  } else {
    toast.error('Odeslání souboru selhalo.');
  }
}
</script>
