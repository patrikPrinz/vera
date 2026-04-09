<template>
  <router-link :to="`/bible/admin/passages/${passage?.id}`"
    ><BiPencil
  /></router-link>
  <PassageComponent :passage="passage" />
</template>

<script setup lang="ts">
import { BiPencil } from 'vue-icons-plus/bi';
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
