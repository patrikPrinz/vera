<template>
  <div class="flex w-full flex-row">
    <section>
      {{ passageLocation }}<br />
      <div class="flex flex-row">
        <label for="passage-input-title">Název: </label>
        <input id="passage-input-title" v-model="passage.title" />
      </div>
      <select v-model="passage.passageLocation.book">
        <option
          v-for="book in booksList"
          :value="book.bookNumber"
          :key="book.bookNumber"
        >
          {{ book.code }}
        </option></select><br/>
      <label>Datum:</label>
      <input type="date" v-model="passage.calendarDate"></input><br/>
      <ButtonComponent @click="savePassage()">Uložit</ButtonComponent>
      <fieldset
        class="border-text m-auto my-5 rounded-xl border-2 p-3 md:w-2/3 md:text-left"
        v-for="(segment, index) in passage.passageLocation.segments"
        :key="index"
      >
        <p>Začátek:</p>
        <button @click="passage.passageLocation.segments.splice(index, 1)">
          <BiX />
        </button>
        <div class="mb-3 flex flex-row space-x-20">
          <span
            ><label>Kapitola: </label>
            <input type="number" class="w-14" v-model="segment.startChapter"
          /></span>
          <span>
            <label>Verš: </label>
            <input type="number" class="w-14" v-model="segment.startVerse" />
          </span>
        </div>

        <p class="border-t-2 pt-3">Konec:</p>
        <div class="flex flex-row space-x-20">
          <span
            ><label>Kapitola: </label>
            <input type="number" class="w-14" v-model="segment.endChapter"
          /></span>
          <span>
            <label>Verš: </label>
            <input type="number" class="w-14" v-model="segment.endVerse" />
          </span>
        </div>
      </fieldset>
      <div>

      <ButtonComponent @click="addSegment()">+</ButtonComponent>
      </div>
    </section>
    <section>
      <PassageComponent v-if="passage" :passage="passage" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { BiX } from 'vue-icons-plus/bi';
import ButtonComponent from '@/components/assets/ButtonComponent.vue';
import PassageComponent from './PassageComponent.vue';
import { useAuthStore } from '@/modules/auth/authStore';
import type { BibleBookMetadata } from '@/shared/types/bible/bible.types';
import type {
  BiblePassage,
  PassageSegment,
} from '@/shared/types/bible/passage.types';
import { watch, onMounted, ref, type Ref } from 'vue';
import {
  bibleService,
  passageService,
} from '../services/bibleServices.provider';
import { useBibleStore } from '../stores/bibleStore';
import { useBibleReferenceFormatter } from '@/composables/bibleReferenceFormatter';
import router from '@/router';
const { formatBiblePassageLocation } = useBibleReferenceFormatter();
const bibleStore = useBibleStore();
const authStore = useAuthStore();
const props = defineProps<{ id?: string; date?: string | null }>();
const passage: Ref<BiblePassage> = ref(newPassage());
const booksList: Ref<BibleBookMetadata[]> = ref([]);
const passageLocation = ref('');
console.log(props.date);
watch(
  passage,
  async (newValue) => {
    passageLocation.value = await formatBiblePassageLocation(newValue);
  },
  { deep: true },
);

onMounted(async () => {
  await bibleStore.initialize();
  const translation = bibleStore.getCurrentTranslation();
  const translationMetadata =
    await bibleService.getTranslationMetadata(translation);
  booksList.value = translationMetadata?.books ?? [];
  if (props.id) {
    const loadedPassage = await passageService.findPassageById(props.id);
    if (loadedPassage) {
      passage.value = loadedPassage;
    }
  }
  passageLocation.value = await formatBiblePassageLocation(passage.value);
  console.log(props.date);
});

function newPassage(): BiblePassage {
  return {
    authorId: authStore.getId(),
    title: '',
    calendarDate: props.date ?? null,
    passageLocation: {
      book: 1,
      segments: [newSegment()],
    },
  } as BiblePassage;
}

function newSegment(): PassageSegment {
  return { startChapter: 1, startVerse: 1, endVerse: 1 } as PassageSegment;
}

function addSegment() {
  passage.value.passageLocation.segments.push(newSegment());
}

async function savePassage() {
  if (passage.value.id) {
    await passageService.updatePassage(passage.value);
  } else {
    const insertedPassage = await passageService.createPassage(passage.value);
    if (insertedPassage) {
      console.log(insertedPassage);
      await router.push(`/bible/passage/${insertedPassage.id}`);
    }
  }
}
</script>
