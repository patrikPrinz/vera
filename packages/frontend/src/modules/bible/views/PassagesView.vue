<template>
  <PassageComponent :passage="passage" />
</template>

<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';
import { passageService } from '../services/bibleServices.provider';
import { useRoute } from 'vue-router';
import type { BiblePassage } from '@/shared/types/bible/passage.types';
import PassageComponent from '../components/PassageComponent.vue';
const route = useRoute();
const passage: Ref<BiblePassage | undefined> = ref(undefined);

onBeforeMount(async () => {
  const param = route.params.id;
  const id = Array.isArray(param) ? param[0] : param;
  const result = await passageService.findPassageById(id);
  if (result) {
    passage.value = result;
  }
});
</script>
