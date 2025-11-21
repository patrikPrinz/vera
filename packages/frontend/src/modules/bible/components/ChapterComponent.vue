<template>
  <NavigationComponent :title="chapterTitle" @returnEvent="returnEvent" />
  <ChapterNavigationComponent :firstItem="firstChapter" :lastItem="lastChapter" @previousItemEvent="previousItemEvent" @nextItemEvent="nextItemEvent"/>
  <p class="py-1 text-left" v-for="verse in verses">
    <span class="font-bold pe-1">{{ verse.verse }}.</span>{{ verse.text }}
  </p>

</template>
<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { useBibleStore } from '../stores/bibleStore';
import type { BibleVerse } from '@/shared/types/bible/bible.types';
import { BibleHttpService } from '../services/bibleHttp.service';
import { httpClient } from '@/shared/httpClient/HttpProvider';
import NavigationComponent from './navigation/NavigationComponent.vue';
import ChapterNavigationComponent from './navigation/ChapterNavigationComponent.vue';

const verses: Ref<BibleVerse[] | undefined> = ref(undefined);
const bibleStore = useBibleStore();
const httpService = new BibleHttpService(httpClient);
const chapterTitle = ref('');
const chapterCount = ref(0);

const firstChapter = computed(() => {
  return bibleStore.getCurrentChapter() == 1;
});

const lastChapter = computed(() => {
  return bibleStore.getCurrentChapter() == chapterCount.value;
});

onMounted(async () => {
  await refreshChapter();
});

async function refreshChapter() {
  const translation = bibleStore.getCurrentTranslation();
  const book = bibleStore.getCurrentBook();
  const chapter = bibleStore.getCurrentChapter();
  if (translation && book && chapter) {
    verses.value = await httpService.getBibleVerses(translation, book, chapter);
    chapterTitle.value = `${bibleStore.getBookMetadata(book)?.name}; ${chapter.toString()}`;
    chapterCount.value = (await httpService.getBibleChapters(translation, book)).length
  }
}

function returnEvent() {
  bibleStore.setCurrentChapter(undefined);
}

async function previousItemEvent() {
  const currentChapter = bibleStore.getCurrentChapter();
  if (!firstChapter.value && currentChapter) {
    bibleStore.setCurrentChapter(currentChapter - 1);
    await refreshChapter();
  }
}

async function nextItemEvent() {
  const currentChapter = bibleStore.getCurrentChapter();
  if (!lastChapter.value && currentChapter) {
    bibleStore.setCurrentChapter(currentChapter + 1);
    await refreshChapter();
  }
}

</script>