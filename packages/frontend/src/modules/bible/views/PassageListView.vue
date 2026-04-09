<template>
  <router-link to="/bible/admin/passages"
    ><ButtonComponent><BiPlus /></ButtonComponent
  ></router-link>
  <div
    class="border-text m-auto my-4 rounded-xl border-2 md:w-2/3"
    v-for="passage in passages"
  >
    <router-link :to="`/bible/passage/${passage.id}`">
      <PassageComponent :passage="passage"
    /></router-link>
  </div>
</template>
<script setup lang="ts">
import { BiPlus } from 'vue-icons-plus/bi';
import ButtonComponent from '@/components/assets/ButtonComponent.vue';
import PassageComponent from '../components/PassageComponent.vue';
import { useAuthStore } from '@/modules/auth/authStore';
import type { BiblePassage } from '@/shared/types/bible/passage.types';
import { onMounted, ref, type Ref } from 'vue';
import { passageService } from '../services/bibleServices.provider';

const authStore = useAuthStore();
const passages: Ref<BiblePassage[]> = ref([]);
onMounted(async () => {
  const result = await passageService.findPassagesByAuthor(authStore.getId());
  if (result) {
    passages.value = result;
  }
});
</script>
