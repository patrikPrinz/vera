<template>
  <div class="m-auto text-left" v-if="passage">
    <p class="m-2 text-lg">
      <b>{{ passage?.title }}:</b>
      {{ passageLocation }}
    </p>
    <p>
      <span v-for="verse in passageText">
        {{ verse.text + ' ' }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, watch, type Ref } from 'vue';
import type { BiblePassage } from '@/shared/types/bible/passage.types';
import { useBibleReferenceFormatter } from '@/composables/bibleReferenceFormatter';
import type { BibleVerse } from '@/shared/types/bible/bible.types';
import { useBibleStore } from '../stores/bibleStore';

const props = defineProps<{ passage?: BiblePassage }>();
const { passage } = toRefs(props);
const bibleStore = useBibleStore();

onMounted(async () => {
  await bibleStore.initialize();
});

const { passageToText, formatBiblePassageLocation } =
  useBibleReferenceFormatter();
const passageText: Ref<BibleVerse[]> = ref([]);
const passageLocation: Ref<string> = ref('');
watch(
  passage,
  async (newVal) => {
    if (!newVal) return;

    passageText.value = await passageToText(newVal);
    passageLocation.value = await formatBiblePassageLocation(newVal);
  },
  { immediate: true, deep: true },
);
</script>
