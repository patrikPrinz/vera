<template>
  <h2 class="text-3xl font-bold">{{ prayer?.title }}</h2>
  <div class="text-left">
    <p v-for="verse in prayer?.verses">
      <span v-if="verse.type == 'title'" class="font-bold">{{
        verse.text
      }}</span>
      <span v-if="verse.type == 'text'">{{ verse.text }}</span>
    </p>
  </div>
</template>
<script setup lang="ts">
import type { Prayer } from '@/shared/types/prayer/prayer.types';

const { prayer } = defineProps<{ prayer?: Prayer }>();
</script>
