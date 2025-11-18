<template>
    <main>
      ahoy-hoy
      <ul>
        <li v-for="book in data.value">{{ book.book }}</li>
      </ul>
    </main>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import type { BibleTranslation } from '@/shared/types/index';

const data = ref();

onMounted(async () => {
  data.value = await loadBibleBooks('CZECEP');
  console.log(data.value);
});

async function loadBibleBooks(translation: string): Promise<BibleTranslation> {
  try {
    const response = await axios.get('http://localhost:3000/api/bible/translation/' + translation + '/books');
    console.log(response);
    if (response.data) {
      return response.data as BibleTranslation;
    }
  }
  catch (_error) {
    return undefined;
  }
}
</script>