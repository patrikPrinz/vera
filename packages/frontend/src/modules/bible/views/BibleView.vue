<template>
    <main>
      <BooksComponent v-if="!bibleStore.isBookSet() && !bibleStore.isChapterSet()" />
      <ChaptersComponent v-else-if="bibleStore.isBookSet() && !bibleStore.isChapterSet()" />
      <ChapterComponent v-else />
    </main>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useBibleStore } from '../stores/bibleStore';
import BooksComponent from '../components/BooksComponent.vue';
import ChaptersComponent from '../components/ChaptersComponent.vue';
import ChapterComponent from '../components/ChapterComponent.vue';

const bibleStore = useBibleStore();

onBeforeMount(async () => {
  await bibleStore.initialize();
});
</script>