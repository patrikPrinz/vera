<template>
  <NavigationComponent :title="bookTitle" @returnEvent="returnEvent" />
  <ul class="flex flex-wrap justify-around">
    <li v-for="chapter in chapters">
      <button
        class="border-text hover:bg-secondary hover:text-text-inverse dark:hover:text-text text-l m-3 h-12 w-12 cursor-pointer rounded-md border-2 py-2"
        @click="bibleStore.setCurrentChapter(chapter.chapter)"
      >
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
