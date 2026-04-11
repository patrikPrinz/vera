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
import { ref, toRefs, watch, type Ref } from 'vue';
import type { BiblePassage } from '@/shared/types/bible/passage.types';
import { useBibleReferenceFormatter } from '@/composables/bibleReferenceFormatter';
import type { BibleVerse } from '@/shared/types/bible/bible.types';

const props = defineProps<{ passage?: BiblePassage }>();
const { passage } = toRefs(props);

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
