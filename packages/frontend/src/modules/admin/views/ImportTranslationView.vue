<template>
  aaaaa
  <input type="file" ref="translation" />
  <button @click="uploadFile()">{{ i18n.t('general.send') }}</button>
</template>

<script setup lang="ts">
import { bibleService } from '@/modules/bible/services/bibleServices.provider';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const toast = useToast();
const i18n = useI18n();
const translation = ref<HTMLInputElement | null>(null);

async function uploadFile() {
  const file = translation.value?.files?.[0];
  if (!file) {
    toast.warning('Vyberte soubor.');
    return;
  }
  const success = await bibleService.importTranslation(file);
  if (success) {
    toast.success('Soubor byl úspěšně odeslán.');
  } else {
    toast.error('Odeslání souboru selhalo.');
  }
}
</script>
