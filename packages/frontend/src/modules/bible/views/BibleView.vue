<template>
    <main>
      ahoy-hoy
    </main>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

const data = ref();

onMounted(async () => {
  data.value = await loadBibleBooks('CZECEP');
});

async function loadBibleBooks(translation: string) {
  const response = (await axios.get('http://server:3000/api/bible/translation/' + translation + '/books')).data as BibleBook[];
  return response;
}

interface BibleBook {
  bookNumber: number;
  name: string;
  code: string;
}
</script>