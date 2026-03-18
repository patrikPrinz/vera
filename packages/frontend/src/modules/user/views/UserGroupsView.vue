<template>
  <div class="flex">
    <div class="border-text-inverse" v-for="group in groups" :key="group.id">
      {{ group.name }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';
import { userService } from '../services/userService.provider';
import type { Group } from '@/shared/types/auth/auth.types';

const groups: Ref<Group[]> = ref([]);

onBeforeMount(async () => {
  const response = await userService.getUserGroups();
  groups.value = response;
});
</script>
