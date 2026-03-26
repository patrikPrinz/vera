<template>
  <form class="m-auto flex flex-col md:w-2/3">
    <label class="w-fit" for="create-post-title-input">Název:</label>
    <input
      v-model="postTitle"
      id="create-post-title-input"
      type="text"
      class="my-2 bg-amber-50 p-1"
      required
    />
    <textarea v-model="postContent" class="bg-amber-50"></textarea>
    <button
      class="hover:bg-primary hover:border-text m-2 w-fit rounded-xl border-2 p-2 px-5"
      @click.prevent="publishPost()"
    >
      {{ i18n.t('groups.publish') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { groupsService } from '../services/groupsService.provider';
import { ref, type Ref } from 'vue';
import type { GroupPost } from '@/shared/types/group/group.types';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/modules/auth/authStore';
import router from '@/router';

const route = useRoute();
const i18n = useI18n();
const authStore = useAuthStore();
const postTitle: Ref<string> = ref('');
const postContent: Ref<string> = ref('');

async function publishPost() {
  if (typeof route.params.groupId === 'string') {
    const post: GroupPost = {
      groupId: route.params.groupId,
      authorId: authStore.getId(),
      title: postTitle.value,
      content: postContent.value,
    };
    console.log(post);
    await groupsService.createPost(post);
    await router.push(`/groups/${route.params.groupId}`);
  }
}
</script>
