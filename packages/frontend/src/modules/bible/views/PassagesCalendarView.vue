<template>
  <section class="m-auto flex flex-col md:w-2/3">
    <input
      type="date"
      class="m-auto w-fit"
      v-model="date"
      @change="updateDate()"
    />
    <div v-if="passages.length" v-for="passage in passages" :key="passage.id">
      <PassageComponent :passage="passage" />
      <ButtonComponent
        @click="editPassage(passage.id)"
        v-if="authStore.hasRoles(['admin', 'calendar_admin'])"
        ><BiPencil></BiPencil
      ></ButtonComponent>
    </div>
    <ButtonComponent
      v-if="authStore.hasRoles(['admin', 'calendar_admin'])"
      class="w-fit"
      @click="addPassage(date)"
      ><BiPlus
    /></ButtonComponent>
  </section>
</template>

<script setup lang="ts">
import ButtonComponent from '@/components/assets/ButtonComponent.vue';
import { BiPlus, BiPencil } from 'vue-icons-plus/bi';
import PassageComponent from '../components/PassageComponent.vue';
import { onMounted, ref, type Ref } from 'vue';
import { passageService } from '../services/bibleServices.provider';
import { useRoute, useRouter } from 'vue-router';
import type { BiblePassage } from '@/shared/types/bible/passage.types';
import { useAuthStore } from '@/modules/auth/authStore';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const passages: Ref<BiblePassage[]> = ref([]);
const date = ref('');

onMounted(async () => {
  const param = route.params.date;
  date.value = Array.isArray(param) ? param[0] : param;
  const result = await passageService.findPassagesByDate(date.value);
  if (result) {
    passages.value = result;
  }
});

async function updateDate() {
  await router.push(`${date.value}`);
}

async function editPassage(id?: string) {
  if (id) {
    await router.push(`/bible/admin/passages/${id}`);
  }
}

async function addPassage(date: string) {
  await router.push({ path: '/bible/admin/passages', query: { date: date } });
}
</script>
