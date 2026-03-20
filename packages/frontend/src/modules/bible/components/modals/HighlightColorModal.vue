<template>
  <VueFinalModal
    class="flex items-center justify-center bg-transparent"
    content-class="mb-4 ml-4 bg-secondary rounded p-4 shadow"
  >
    <form class="mb-2 flex flex-col gap-2">
      <div v-for="color in colors" class="h-min" :class="`bg-${color}`">
        <input
          name="color"
          type="radio"
          :key="color"
          :id="`highlight-color-${color}`"
          :value="color"
          class="m-2 cursor-pointer"
          :class="color == 'null' ? 'hidden' : ''"
          v-model="selectedColor"
        />
        <label
          :for="`highlight-color-${color}`"
          class="text-text-inverse cursor-pointer"
        >
          <BiX v-if="color == 'null'" class="text-xl text-red-800"></BiX>
          <span v-else>{{ color }}</span>
        </label>
      </div>
    </form>

    <button
      @click="submit"
      class="bg-primary cursor-pointer rounded p-1 px-3 text-xl text-amber-50 hover:border-slate-950"
    >
      Ok
    </button>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import { BiX } from 'vue-icons-plus/bi';
import { onBeforeMount, ref, type Ref } from 'vue';
const emit = defineEmits(['resolve']);
const selectedColor: Ref<string | undefined> = ref(undefined);
const props = defineProps<{
  color?: string;
}>();
const colors = [
  'red-400',
  'red-500',
  'sky-500',
  'pink-600',
  'green-400',
  'null',
];

onBeforeMount(() => {
  selectedColor.value = props.color;
});

function submit() {
  emit('resolve', selectedColor.value);
}
</script>
