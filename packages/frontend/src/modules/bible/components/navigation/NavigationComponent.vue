<template>
<nav class="flex justify-between py-2">
  <button @click="$emit('returnEvent')"><BsArrowLeftSquare /></button>
  <h2 class="">{{ props.title }}</h2>
  <span></span>
</nav>
</template>

<script setup lang="ts">
import { BsArrowLeftSquare } from 'vue-icons-plus/bs';
const props = defineProps(['title'])
</script>