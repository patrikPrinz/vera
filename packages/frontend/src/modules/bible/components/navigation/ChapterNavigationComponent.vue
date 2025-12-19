<template>
  <nav class="flex justify-between my-2">
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

const props = defineProps(['firstItem', 'lastItem']);
</script>
