<template>
  {{ $route.params.id }}
  {{ group }}
</template>

<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';
import { groupsService } from '../services/groupsService.provider';
import { useRoute } from 'vue-router';
import type { Group } from '@/shared/types/auth/auth.types';

const route = useRoute();
const group: Ref<Group | undefined> = ref(undefined);

onBeforeMount(async () => {
  const id = route?.params?.id;
  if (typeof id === 'string') {
    group.value = await groupsService.getGroup(id);
  }
});
</script>
