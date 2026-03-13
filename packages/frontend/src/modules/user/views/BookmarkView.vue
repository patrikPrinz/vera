<template>
  <ul>
    <li v-for="bookmark in bookmarks">
      <div
        class="border-text m-5 flex cursor-pointer rounded-lg border-2 p-2"
        @click="goToBookmarkAction(bookmark.location)"
      >
        <span>
          <BiSolidBookmark class="size-18" />
        </span>
        <div class="flex w-full justify-between">
          <div class="m-2 text-left">
            <p class="font-bold">{{ bookmark.name }}</p>
            <p>{{ formatBibleLocation(bookmark.location) }}</p>
          </div>
          <i
            class="h-fit rounded-md p-1 hover:bg-pink-900"
            @click.stop="removeBookmarkAction(bookmark)"
          >
            <BiTrash />
          </i>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import router from '@/router';
import { BiSolidBookmark, BiTrash } from 'vue-icons-plus/bi';
import { onBeforeMount, ref, type Ref } from 'vue';
import { userService } from '../services/userService.provider';
import type { Bookmark } from '@/shared/types/user/user.types';
import { useBibleStore } from '@/modules/bible/stores/bibleStore';
import { useBibleReferenceFormatter } from '@/composables/bibleReferenceFormatter';
import type { BibleLocation } from '@/shared/types/bible/bible.types';

const bibleStore = useBibleStore();
const bookmarks: Ref<Bookmark[]> = ref([]);

onBeforeMount(async () => {
  await bibleStore.initialize();
  const translation = bibleStore.getCurrentTranslation();
  if (translation) {
    bookmarks.value = await userService.getTranslationBookmrks(translation);
  }
});

const { formatBibleLocation } = useBibleReferenceFormatter();

async function goToBookmarkAction(location: BibleLocation) {
  bibleStore.setCurrentBook(location.book);
  bibleStore.setCurrentChapter(location.chapter);
  await router.push({ path: '/bible', hash: `#verse-${location.verse}` });
}

async function removeBookmarkAction(bookmark: Bookmark) {
  const remove: boolean = await userService.removeBookmark(bookmark);
  if (remove) {
    const translation = bibleStore.getCurrentTranslation();
    if (translation) {
      bookmarks.value = await userService.getTranslationBookmrks(translation);
    }
  }
}
</script>
