<script setup lang="ts">
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from 'vue-router';

defineProps<{
  to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
}>();
</script>

<template>
  <router-link :to="to" :class="['text-text underline', $attrs.class]">
    <slot />
  </router-link>
</template>
