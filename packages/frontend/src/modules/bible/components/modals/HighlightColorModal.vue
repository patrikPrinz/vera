<template>
  <VueFinalModal
    class="flex items-end justify-start bg-transparent"
    content-class="mb-4 ml-4 bg-gray-800 rounded p-4 shadow"
  >
    <form class="mb-2 flex gap-2">
      <span v-for="color in colors">
        <input
          name="color"
          type="radio"
          :key="color"
          :id="`highlight-color-${color}`"
          :value="color"
          class="cursor-pointer"
          v-model="selectedColor"
        />
        <label :for="`highlight-color-${color}`" class="text-text-inverse">
          <BiX v-if="color == 'null'"></BiX>
          <span v-else>{{ color }}</span>
        </label>
      </span>
    </form>

    <button @click="submit" class="text-amber-50">Ok</button>
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
  'null',
  'red-400',
  'red-500',
  'sky-500',
  'pink-600',
  'green-400',
];

onBeforeMount(() => {
  selectedColor.value = props.color;
});

function submit() {
  emit('resolve', selectedColor.value);
}
</script>
