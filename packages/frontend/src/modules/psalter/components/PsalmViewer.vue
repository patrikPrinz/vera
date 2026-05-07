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
const prayerStore = usePrayerStore();

const props = defineProps<{ number?: number }>();

onBeforeMount(async () => {
  const number = props.number;
  if (number) {
    prayer.value = await psalterService.getPsalm(
      prayerStore.getLanguage(),
      props.number,
    );
  }
});
</script>
