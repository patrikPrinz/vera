<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit';
}>();
</script>

<template>
  <button
    :type="type ?? 'button'"
    :class="[
      'bg-primary border-text text-text-inverse dark:text-text hover:border-text-inverse my-4 cursor-pointer rounded-lg border-2 p-1 px-4',
      $attrs.class,
    ]"
  >
    <slot />
  </button>
</template>
