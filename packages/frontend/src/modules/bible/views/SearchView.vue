<template>
  <input type="text" v-model="keyword" />
  <ButtonComponent @click="search">Vyhledat</ButtonComponent>
  <ul class="m-auto text-left md:w-2/3">
    <li v-for="r in results" class="p-2">
      <p class="font-bold">
        {{
          formatBibleLocation({
            translation: r.translation,
            book: r.book,
            chapter: r.chapter,
            verse: r.verse,
          })
        }}
      </p>
      {{ r.text }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import ButtonComponent from '@/components/assets/ButtonComponent.vue';
import { bibleService } from '../services/bibleServices.provider';
import { useBibleStore } from '../stores/bibleStore';
import type { BibleVerse } from '@/shared/types/bible/bible.types';
import { useBibleReferenceFormatter } from '@/composables/bibleReferenceFormatter';

const keyword = ref('');
const bibleStore = useBibleStore();
const results: Ref<BibleVerse[]> = ref([]);
const { formatBibleLocation } = useBibleReferenceFormatter();

onMounted(async () => {
  await bibleStore.initialize();
});

async function search() {
  results.value = await bibleService.searchKeyword(
    keyword.value,
    bibleStore.getCurrentTranslation() ?? 'CZECEP',
  );
}
</script>
