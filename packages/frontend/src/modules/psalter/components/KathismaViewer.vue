<template>
  <PrayerViewerComponent :prayer="prayer"></PrayerViewerComponent>
</template>
<script setup lang="ts">
import type { Prayer } from '@/shared/types/prayer/prayer.types';
import PrayerViewerComponent from './PrayerViewerComponent.vue';
import { onBeforeMount, ref, type Ref } from 'vue';
import { psalterService } from '../services/psalterService.provider';
import { usePrayerStore } from '@/stores/prayerStore';
const prayer: Ref<Prayer | undefined> = ref(undefined);

const props = defineProps<{ number?: number }>();
const prayerStore = usePrayerStore();

onBeforeMount(async () => {
  const number = props.number;
  if (number) {
    prayer.value = await psalterService.getKathisma(
      prayerStore.getLanguage(),
      props.number,
    );
  }
});
</script>
