<template>
  {{ route.params.date }}
  <div v-if="passages.length" v-for="passage in passages" :key="passage.id">
    <PassageComponent :passage="passage" />
  </div>
</template>

<script setup lang="ts">
import PassageComponent from '../components/PassageComponent.vue';
import { onMounted, ref, type Ref } from 'vue';
import { passageService } from '../services/bibleServices.provider';
import { useRoute } from 'vue-router';
import type { BiblePassage } from '@/shared/types/bible/passage.types';

const route = useRoute();
const passages: Ref<BiblePassage[]> = ref([]);

onMounted(async () => {
  const param = route.params.date;
  const date = Array.isArray(param) ? param[0] : param;
  const result = await passageService.findPassagesByDate(date);
  if (result) {
    passages.value = result;
  }
});
</script>
