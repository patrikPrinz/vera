<template>
  <ul class="flex flex-col justify-around">
    <li v-for="book in books">
      <button
        class="border-text p2 hover:bg-secondary hover:text-text-inverse dark:hover:text-text m-2 w-1/2 cursor-pointer rounded-2xl border-2 p-2"
        @click="bibleStore.setCurrentBook(book.book)"
      >
        {{ bibleStore.getBookMetadata(book.book)?.name }}
      </button>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useBibleStore } from '../stores/bibleStore';
import type { BibleBook } from '@/shared/types/bible/bible.types';
import { BibleHttpService } from '../services/bibleHttp.service';
import { httpClient } from '@/shared/httpClient/HttpProvider';

const books: Ref<BibleBook[] | undefined> = ref(undefined);
const bibleStore = useBibleStore();
const httpService = new BibleHttpService(httpClient);

onMounted(async () => {
  const translation = bibleStore.getCurrentTranslation();
  if (translation) {
    books.value = await httpService.getBibleBooks(translation);
  }
});
</script>
