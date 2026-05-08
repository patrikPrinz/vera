<template>
  <input type="text" v-model="keyword" />
  <ButtonComponent @click="search">{{
    i18n.t('general.search')
  }}</ButtonComponent>
  <ul class="m-auto text-left md:w-2/3">
    <li
      @click="goToLocation(verseToLocation(r))"
      v-for="r in results"
      class="p-2"
    >
      <p class="font-bold">
        {{ formatBibleLocation(verseToLocation(r)) }}
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
import type {
  BibleLocation,
  BibleVerse,
} from '@/shared/types/bible/bible.types';
import { useBibleReferenceFormatter } from '@/composables/bibleReferenceFormatter';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const i18n = useI18n();
const keyword = ref('');
const bibleStore = useBibleStore();
const results: Ref<BibleVerse[]> = ref([]);
const { formatBibleLocation } = useBibleReferenceFormatter();
const router = useRouter();

onMounted(async () => {
  await bibleStore.initialize();
});

async function search() {
  results.value = await bibleService.searchKeyword(
    keyword.value,
    bibleStore.getCurrentTranslation() ?? 'CZECEP',
  );
}

function verseToLocation(v: BibleVerse): BibleLocation {
  return {
    translation: v.translation,
    book: v.book,
    chapter: v.chapter,
    verse: v.verse,
  };
}

async function goToLocation(location: BibleLocation) {
  bibleStore.setCurrentBook(location.book);
  bibleStore.setCurrentChapter(location.chapter);
  await router.push({ path: '/bible', hash: `#verse-${location.verse}` });
}
</script>
