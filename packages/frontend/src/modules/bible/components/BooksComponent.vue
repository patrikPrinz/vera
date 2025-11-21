<template>
  <ul>
    <li v-for="book in books">
      <button @click="bibleStore.setCurrentBook(book.book)">
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