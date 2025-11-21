<template>
  <NavigationComponent :title="bookTitle" @returnEvent="returnEvent" />
  <ul>
    <li v-for="chapter in chapters">
      <button @click="bibleStore.setCurrentChapter(chapter.chapter)">
        {{ chapter.chapter }}
      </button>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useBibleStore } from '../stores/bibleStore';
import type { BibleChapter } from '@/shared/types/bible/bible.types';
import { BibleHttpService } from '../services/bibleHttp.service';
import { httpClient } from '@/shared/httpClient/HttpProvider';
import NavigationComponent from './navigation/NavigationComponent.vue';

const chapters: Ref<BibleChapter[] | undefined> = ref(undefined);
const bibleStore = useBibleStore();
const httpService = new BibleHttpService(httpClient);
const bookTitle = ref('');

onMounted(async () => {
  const translation = bibleStore.getCurrentTranslation();
  const book = bibleStore.getCurrentBook();
  if (translation && book) {
    chapters.value = await httpService.getBibleChapters(translation, book);
    bookTitle.value = bibleStore.getBookMetadata(book)?.name ?? '';
  }
});

function returnEvent() {
  bibleStore.setCurrentBook(undefined);
}
</script>