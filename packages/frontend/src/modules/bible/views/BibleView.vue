<template>
  <main class="pb-8">
    <BooksComponent
      v-if="!bibleStore.isBookSet() && !bibleStore.isChapterSet()"
    />
    <ChaptersComponent
      v-else-if="bibleStore.isBookSet() && !bibleStore.isChapterSet()"
    />
    <ChapterComponent v-else @selectVerseEvent="selectVerseEvent" />
  </main>
  <BibleMenuComponent
    :chapters="bibleStore.isChapterSet()"
    :activeVerse="activeVerse"
  ></BibleMenuComponent>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';
import { useBibleStore } from '../stores/bibleStore';
import BibleMenuComponent from '../components/navigation/BibleMenuComponent.vue';
import BooksComponent from '../components/BooksComponent.vue';
import ChaptersComponent from '../components/ChaptersComponent.vue';
import ChapterComponent from '../components/ChapterComponent.vue';
import type { BibleVerse } from '@/shared/types/bible/bible.types';

const activeVerse: Ref<BibleVerse | undefined> = ref(undefined);

const bibleStore = useBibleStore();

onBeforeMount(async () => {
  await bibleStore.initialize();
});

function selectVerseEvent(verse: BibleVerse) {
  activeVerse.value = verse;
}
</script>
