<template>
  <div class="m-auto md:w-2/3">
    <h2 class="p-5 text-2xl">{{ post?.title }}</h2>
    <p class="px-5 text-left text-sm">
      {{ post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : '' }}
    </p>
    <p class="p-5 text-left">{{ post?.content }}</p>
  </div>
</template>

<script setup lang="ts">
import type { GroupPost } from '@/shared/types/group/group.types';
import { onBeforeMount, ref, type Ref } from 'vue';
import { groupsService } from '../services/groupsService.provider';
import { useRoute } from 'vue-router';

const route = useRoute();
const post: Ref<GroupPost | undefined> = ref(undefined);

onBeforeMount(async () => {
  if (typeof route.params.postId === 'string') {
    post.value = await groupsService.getGroupPost(route.params.postId);
    console.log(post.value);
  }
});
</script>
