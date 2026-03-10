<template>
  <VueFinalModal
    class="flex items-end justify-start bg-transparent"
    content-class="mb-4 ml-4 bg-gray-800 rounded p-4 shadow"
  >
    <div class="mb-2 flex gap-2">
      <span v-for="bookmark in bookmarks">
        <button @click="submit(bookmark.id)">
          {{ bookmark.name }}
        </button>
      </span>
    </div>

    <button @click="newBookmark" class="text-amber-50">+</button>
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
