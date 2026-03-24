<template>
  <PrayerViewerComponent :prayer="prayer"></PrayerViewerComponent>
</template>
<script setup lang="ts">
import type { Prayer } from '@/shared/types/prayer/prayer.types';
import PrayerViewerComponent from './PrayerViewerComponent.vue';
import { onBeforeMount, ref, type Ref } from 'vue';
import { psalterService } from '../services/psalterService.provider';
const prayer: Ref<Prayer | undefined> = ref(undefined);

const props = defineProps(['number']);

onBeforeMount(async () => {
  prayer.value = await psalterService.getKathisma('CZE', props.number);
});
</script>
