<template>
  <h2>{{ i18n.t('admin.psalter') }}</h2>
  <input type="file" ref="psalter" />
  <button @click="uploadFile()">{{ i18n.t('general.send') }}</button>
</template>

<script setup lang="ts">
import { psalterService } from '@/modules/psalter/services/psalterService.provider';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const toast = useToast();
const i18n = useI18n();
const psalter = ref<HTMLInputElement | null>(null);

async function uploadFile() {
  const file = psalter.value?.files?.[0];
  if (!file) {
    toast.warning('Vyberte soubor.');
    return;
  }
  const success = await psalterService.importKathisma(file);
  if (success) {
    toast.success('Soubor byl úspěšně odeslán.');
  } else {
    toast.error('Odeslání souboru selhalo.');
  }
}
</script>
