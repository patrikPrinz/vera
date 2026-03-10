<template>
  <main class="pb-8">
    <BooksComponent
      v-if="!bibleStore.isBookSet() && !bibleStore.isChapterSet()"
    />
    <ChaptersComponent
      v-else-if="bibleStore.isBookSet() && !bibleStore.isChapterSet()"
    />
    <ChapterComponent
      v-else
      :activeVerse="activeVerse"
      :metadata="metadata"
      @selectVerseEvent="selectVerseEvent"
      @unsetVerseEvent="unsetVerseEvent"
      @setMetadataEvent="setMetadataEvent"
    />
  </main>
  <BibleMenuComponent
    v-if="authStore.isAuthenticatedSync()"
    @unsetVerseEvent="unsetVerseEvent"
    :chapters="bibleStore.isChapterSet()"
    :activeVerse="activeVerse"
    :metadata="metadata"
  ></BibleMenuComponent>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';
import { useBibleStore } from '../stores/bibleStore';
import BibleMenuComponent from '../components/navigation/BibleMenuComponent.vue';
import BooksComponent from '../components/BooksComponent.vue';
import ChaptersComponent from '../components/ChaptersComponent.vue';
import ChapterComponent from '../components/ChapterComponent.vue';
import type { BibleVerse } from '@/shared/types/bible/bible.types';
import type { UserVerseMetadata } from '@/shared/types/user/user.types';
import { useAuthStore } from '@/modules/auth/authStore';
const metadata: Ref<Record<string, UserVerseMetadata> | undefined> = ref({});
const activeVerse: Ref<BibleVerse | undefined> = ref(undefined);

const authStore = useAuthStore();
const bibleStore = useBibleStore();

onBeforeMount(async () => {
  await bibleStore.initialize();
});

function setMetadataEvent(
  newMetadata: Record<string, UserVerseMetadata> | undefined,
) {
  metadata.value = newMetadata;
}

function selectVerseEvent(verse: BibleVerse) {
  activeVerse.value = verse;
}

function unsetVerseEvent() {
  activeVerse.value = undefined;
}
</script>
