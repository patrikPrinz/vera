<template>
  <nav
    class="bg-primary dark:text-text text-text-inverse fixed bottom-0 left-0 flex w-full justify-between"
  >
    <ul
      v-if="chapters == true"
      class="flex space-x-2"
      :class="{ 'pointer-events-none text-gray-600': activeVerse == undefined }"
    >
      <li
        class="hover:bg-secondary cursor-pointer p-2"
        @click.prevent="addBookmark"
      >
        <BiSolidBookmark />
      </li>
      <li
        class="hover:bg-secondary cursor-pointer p-2"
        @click="
          updateNote(activeVerse ? metadata?.[activeVerse.verse] : undefined)
        "
      >
        <BiNote />
      </li>
      <li
        class="hover:bg-secondary cursor-pointer p-2"
        @click="
          updateColor(activeVerse ? metadata?.[activeVerse.verse] : undefined)
        "
      >
        <BiHighlight />
      </li>
    </ul>
    <div v-else></div>

    <p v-if="activeVerse">
      <span>{{ activeVerse.verse }}</span>
      <button class="cursor-pointer" @click="$emit('unsetVerseEvent')">
        <i><BiX /></i>
      </button>
    </p>

    <div class="hover:bg-secondary cursor-pointer p-0.5">
      <SelectMenuDropdown>
        <template #trigger
          ><i> <BiDotsVerticalRounded /> </i
        ></template>
        <SelectMenuBody>
          <SelectMenuItem>
            <router-link to="/user/bookmarks">
              {{ $t('user.bookmarks') }}
            </router-link>
          </SelectMenuItem>
          <SelectMenuChildLevel>
            <template #trigger>
              <SelectMenuItem> Změnit překlad </SelectMenuItem>
            </template>
            <SelectMenuItem
              v-for="translation in translations"
              @click="bibleStore.setCurrentTranslation(translation.translation)"
              >{{ translation.translation }}</SelectMenuItem
            >
          </SelectMenuChildLevel>
        </SelectMenuBody>
      </SelectMenuDropdown>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  SelectMenuDropdown,
  SelectMenuBody,
  SelectMenuItem,
  SelectMenuChildLevel,
} from 'v-selectmenu';
import type {
  BibleLocation,
  BibleVerse,
} from '@/shared/types/bible/bible.types';
import {
  BiNote,
  BiSolidBookmark,
  BiDotsVerticalRounded,
  BiHighlight,
  BiX,
} from 'vue-icons-plus/bi';
import { useModal } from 'vue-final-modal';
import HighlightColorModal from '../modals/HighlightColorModal.vue';
import type { UserVerseMetadata } from '@/shared/types/user/user.types';
import { userService } from '@/modules/user/services/userService.provider';
import { toRefs, onBeforeMount, ref, type Ref } from 'vue';
import { useAuthStore } from '@/modules/auth/authStore';
import { useBibleStore } from '../../stores/bibleStore';
import NoteModal from '../modals/NoteModal.vue';
import BookmarkModal from '../modals/BookmarkModal.vue';
const bibleStore = useBibleStore();
const authStore = useAuthStore();
const props = defineProps<{
  chapters: boolean;
  activeVerse: BibleVerse | undefined;
  metadata: Record<string, UserVerseMetadata> | undefined;
}>();
const { chapters, activeVerse, metadata } = toRefs(props);
const translations: Ref<{ translation: string }[]> = ref([]);

onBeforeMount(async () => {
  translations.value = await bibleStore.listTranslations();
});

function newVerseMetadata(): UserVerseMetadata | undefined {
  const translation = bibleStore.getCurrentTranslation();
  if (activeVerse?.value && translation) {
    return {
      authorId: authStore.getId(),
      noteText: '',
      highlightColor: '',
      location: {
        translation: translation,
        book: activeVerse.value.book,
        chapter: activeVerse.value.chapter,
        verse: activeVerse.value.verse,
      },
    };
  }
  throw new ReferenceError('activeVerse and bibleStore have to be initialized');
}

async function updateColor(metadataItem: UserVerseMetadata | undefined) {
  metadataItem ??= newVerseMetadata();
  if (metadataItem) {
    metadataItem.highlightColor = await openHighlightModal(
      metadataItem.highlightColor ?? 'null',
    );
    await updateVerseMetadata(metadataItem);
  }
}

async function updateNote(metadataItem: UserVerseMetadata | undefined) {
  metadataItem ??= newVerseMetadata();
  if (metadataItem) {
    metadataItem.noteText = await openNoteModal(metadataItem.noteText ?? '');
    await updateVerseMetadata(metadataItem);
  }
}
async function addBookmark() {
  const bookmarkId = await openBookmarkModal();
  await moveOrCreateBookmark(bookmarkId);
}

async function updateVerseMetadata(metadataItem: UserVerseMetadata) {
  console.log(metadataItem.id);
  if (metadataItem.id !== undefined) {
    await userService.updateVerseMetadata(metadataItem);
  } else {
    const updatedItem = await userService.createVerseMetadata(metadataItem);
    if (updatedItem && activeVerse?.value && metadata?.value) {
      metadata.value[activeVerse.value.verse] = metadataItem;
    }
  }
}

async function moveOrCreateBookmark(id: string | undefined) {
  const location = {
    translation: bibleStore.getCurrentTranslation(),
    book: activeVerse.value?.book,
    chapter: activeVerse.value?.chapter,
    verse: activeVerse.value?.verse,
  } as BibleLocation;
  if (id) {
    await userService.moveBookmark(id, location);
  } else {
    const name = window.prompt('Enter bookmark name:', undefined);
    if (name) {
      const bookmark = {
        authorId: authStore.getId(),
        name: name,
        location: location,
      };
      await userService.createBookmark(bookmark);
    }
  }
}

async function openHighlightModal(color: string): Promise<string> {
  return new Promise((resolve) => {
    const { open, close } = useModal({
      component: HighlightColorModal,
      attrs: {
        color,
        onResolve(data: string) {
          resolve(data);
          void close();
        },
      },
    });
    void open();
  });
}

async function openNoteModal(note: string): Promise<string> {
  return new Promise((resolve) => {
    const { open, close } = useModal({
      component: NoteModal,
      attrs: {
        note,
        onResolve(data: string) {
          resolve(data);
          void close();
        },
      },
    });
    void open();
  });
}

async function openBookmarkModal(): Promise<string> {
  return new Promise((resolve) => {
    const { open, close } = useModal({
      component: BookmarkModal,
      attrs: {
        onResolve(data: string) {
          resolve(data);
          void close();
        },
      },
    });
    void open();
  });
}
</script>
