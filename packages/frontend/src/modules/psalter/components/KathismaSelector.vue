<template>
  <ul class="m-auto flex flex-wrap justify-around md:w-1/2">
    <li v-for="kathisma in kathismaCount">
      <button
        @click="goToKathisma(kathisma)"
        class="border-text hover:bg-secondary hover:text-text-inverse dark:hover:text-text text-l m-3 h-12 w-12 cursor-pointer rounded-md border-2 py-2"
      >
        {{ kathisma }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import router from '@/router';
import { toRefs } from 'vue';

const props = defineProps<{ kathismaCount?: number }>();
const { kathismaCount } = toRefs(props);

async function goToKathisma(kathisma: number) {
  await router.push(`/psalter/kathisma/${kathisma}`);
}
</script>
