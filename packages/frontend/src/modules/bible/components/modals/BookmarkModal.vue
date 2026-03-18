<template>
  <VueFinalModal
    class="flex items-center justify-center bg-transparent"
    content-class="mb-4 ml-4 bg-secondary rounded p-4 shadow"
  >
    <div class="mb-2 flex flex-col gap-2">
      <button
        v-for="bookmark in bookmarks"
        class="text-text-inverse hover:bg-primary cursor-pointer rounded p-1 text-xl"
        @click="submit(bookmark.id)"
      >
        {{ bookmark.name }}
      </button>
    </div>

    <button
      @click="newBookmark"
      class="text-text-inverse hover:bg-primary cursor-pointer rounded p-1 text-center text-2xl"
    >
      +
    </button>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import { onBeforeMount, ref, type Ref } from 'vue';
import { userService } from '@/modules/user/services/userService.provider';
import type { Bookmark } from '@/shared/types/user/user.types';
import { useBibleStore } from '../../stores/bibleStore';

const bookmarks: Ref<Bookmark[] | undefined> = ref(undefined);
const bibleStore = useBibleStore();

const emit = defineEmits(['resolve']);

onBeforeMount(async () => {
  const translation = bibleStore.getCurrentTranslation();
  if (translation) {
    bookmarks.value = await userService.getTranslationBookmrks(translation);
  }
});

function submit(id: string | undefined) {
  if (!id) {
    newBookmark();
  } else {
    emit('resolve', id);
  }
}
function newBookmark() {
  emit('resolve', undefined);
}
</script>
