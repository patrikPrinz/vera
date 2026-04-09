<template>
  <h2 class="p-2 text-2xl">{{ i18n.t('psalter.selectPsalm') }}</h2>
  <ul class="m-auto flex flex-wrap justify-around md:w-1/2">
    <li v-for="psalm in psalms">
      <button
        @click="goToPsalm(psalm.psalmNumber)"
        class="border-text hover:bg-secondary hover:text-text-inverse dark:hover:text-text text-l m-3 h-12 cursor-pointer rounded-md border-2 p-2"
      >
        {{ psalm.title }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import router from '@/router';
import type { PsalmMetadata } from '@/shared/types/psalter/psalter.types';
import { onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { psalterService } from '../services/psalterService.provider';

const psalms: Ref<PsalmMetadata[]> = ref([]);

const i18n = useI18n();

onMounted(async () => {
  const result = await psalterService.listPsalms('CZE');
  psalms.value = result;
});

async function goToPsalm(kathisma: number) {
  await router.push(`/psalter/psalm/${kathisma}`);
}
</script>
