<template>
  <NavigationComponent :title="chapterTitle" @returnEvent="returnEvent" />
  <ChapterNavigationComponent
    :firstItem="firstChapter"
    :lastItem="lastChapter"
    @previousItemEvent="previousItemEvent"
    @nextItemEvent="nextItemEvent"
  />

  <p
    @click="$emit('selectVerseEvent', verse)"
    v-for="(verse, key) in verses"
    :id="`verse-${verse.verse}`"
    class="scroll-ms-8 py-1 text-left"
    :class="[
      { 'font-bold': verse == activeVerse },
      metadata?.[verse.verse] && `bg-${metadata[verse.verse].highlightColor}`,
    ]"
  >
    <span class="pe-1 font-bold">{{ verse.verse }}.</span>{{ verse.text }}
    <br /><i v-if="metadata?.[verse.verse] !== undefined">{{
      metadata[verse.verse].noteText
    }}</i>
  </p>

  <ChapterNavigationComponent
    :firstItem="firstChapter"
    :lastItem="lastChapter"
    @previousItemEvent="previousItemEvent"
    @nextItemEvent="nextItemEvent"
  />
</template>
<script setup lang="ts">
import { computed, onMounted, ref, toRefs, type Ref } from 'vue';
import { useBibleStore } from '../stores/bibleStore';
import type { BibleVerse } from '@/shared/types/bible/bible.types';
import { BibleHttpService } from '../services/bibleHttp.service';
import { httpClient } from '@/shared/httpClient/HttpProvider';
import NavigationComponent from './navigation/NavigationComponent.vue';
import ChapterNavigationComponent from './navigation/ChapterNavigationComponent.vue';
import { userService } from '@/modules/user/services/userService.provider';
import type { UserVerseMetadata } from '@/shared/types/user/user.types';

const emit = defineEmits([
  'unsetVerseEvent',
  'selectVerseEvent',
  'setMetadataEvent',
]);
const props = defineProps<{
  activeVerse: BibleVerse | undefined;
  metadata: Record<string, UserVerseMetadata> | undefined;
}>();
const { activeVerse, metadata } = toRefs(props);

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
    chapterCount.value = (
      await httpService.getBibleChapters(translation, book)
    ).length;

    const metadataRaw = await userService.loadMetadataFromChapter(
      translation,
      book,
      chapter,
    );
    if (metadata) {
      emit(
        'setMetadataEvent',
        Object.fromEntries(metadataRaw.map((m) => [m.location.verse, m])),
      );
    }
    emit('unsetVerseEvent');
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
