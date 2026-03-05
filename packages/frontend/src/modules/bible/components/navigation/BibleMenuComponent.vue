<template>
  <nav class="bg-primary fixed bottom-0 left-0 flex w-full justify-between">
    <ul
      v-if="chapters == true"
      class="flex space-x-2"
      :class="{ 'pointer-events-none text-gray-600': activeVerse == undefined }"
    >
      <li class="hover:bg-secondary cursor-pointer p-2"><BiSolidBookmark /></li>
      <li class="hover:bg-secondary cursor-pointer p-2"><BiNote /></li>
      <li class="hover:bg-secondary cursor-pointer p-2"><BiHighlight /></li>
    </ul>
    <div v-else></div>

    <p v-if="activeVerse">{{ activeVerse.verse }}</p>

    <div class="hover:bg-secondary cursor-pointer p-2">
      <BiDotsVerticalRounded />
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { BibleVerse } from '@/shared/types/bible/bible.types';
import {
  BiNote,
  BiSolidBookmark,
  BiDotsVerticalRounded,
  BiHighlight,
} from 'vue-icons-plus/bi';
defineProps<{
  chapters?: boolean;
  activeVerse?: BibleVerse;
}>();
</script>
