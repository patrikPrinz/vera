<template>
  <nav class="flex justify-around py-2">
    <div class="flex">
      <button class="mx-2 cursor-pointer" @click="$emit('returnEvent')">
        <BsArrowUpSquare />
      </button>
      <h2 class="">{{ props.title }}</h2>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { BsArrowUpSquare } from 'vue-icons-plus/bs';
import { useKeyboardHandler } from '../../composables/keyboardHandler';
import { onMounted, onUnmounted } from 'vue';

const props = defineProps(['title']);
const emit = defineEmits(['returnEvent']);

const { registerKey, unregisterKey } = useKeyboardHandler();
onMounted(() => {
  registerKey('Backspace', () => {
    emit('returnEvent');
  });
});

onUnmounted(() => {
  unregisterKey('Backspace');
});
</script>
