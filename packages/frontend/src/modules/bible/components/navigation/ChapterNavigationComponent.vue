<template>
  <nav class="my-2 flex justify-between">
    <BsArrowLeftSquare
      class="cursor-pointer"
      v-if="!props.firstItem"
      @click="$emit('previousItemEvent')"
    />
    <div v-else></div>
    <BsArrowRightSquare
      class="cursor-pointer"
      v-if="!props.lastItem"
      @click="$emit('nextItemEvent')"
    />
    <div v-else></div>
  </nav>
</template>

<script setup lang="ts">
import { BsArrowLeftSquare, BsArrowRightSquare } from 'vue-icons-plus/bs';
import { keyboardHandler } from '@/composables/keyboardHandler.provider';
import { onMounted, onUnmounted } from 'vue';

const props = defineProps(['firstItem', 'lastItem']);
const emit = defineEmits(['previousItemEvent', 'nextItemEvent']);

const { registerKey, unregisterKey } = keyboardHandler;
onMounted(() => {
  registerKey('ArrowLeft', () => {
    emit('previousItemEvent');
  });
  registerKey('ArrowRight', () => {
    emit('nextItemEvent');
  });
});

onUnmounted(() => {
  unregisterKey('ArrowLeft');
  unregisterKey('ArrowRight');
});
</script>
