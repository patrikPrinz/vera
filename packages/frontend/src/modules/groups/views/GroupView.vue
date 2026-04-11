<template>
  <div>
    <router-link to="/groups" class="m-5 block"
      >< {{ i18n.t('groups.groupSelection') }}</router-link
    >
    <h2 class="m-3 text-2xl">{{ group?.name }}</h2>
    <div v-if="authStore.hasRoles(['admin', 'group_admin'], group?.id)">
      <router-link :to="`/groups/admin/${group?.id}`">
        {{ $t('groups.adminGroup') }}
      </router-link>
    </div>
    <div v-if="canCreatePost">
      <router-link
        :to="`/groups/${group?.id}/post/publish`"
        class="cursor-pointer"
        ><BiListPlus
      /></router-link>
    </div>
    <div
      v-for="post in posts"
      :key="post.id"
      class="m-auto my-5 w-2/3 rounded-xl p-3 md:border-2"
    >
      <router-link :to="`/groups/post/${post.id}`">
        <h3 class="text-xl">{{ post.title }}</h3>
        <p class="text-left text-sm">
          {{
            post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''
          }}
        </p>
        <p class="text-left">{{ contentPreview(post.content) }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BiListPlus } from 'vue-icons-plus/bi';
import { onBeforeMount, ref, type Ref } from 'vue';
import { groupsService } from '../services/groupsService.provider';
import { useRoute } from 'vue-router';
import type { Group } from '@/shared/types/auth/auth.types';
import type { GroupPost } from '@/shared/types/group/group.types';
import { useAuthStore } from '@/modules/auth/authStore';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const canCreatePost: Ref<boolean> = ref(
  authStore.hasRoles(
    ['group_admin', 'group_content_admin'],
    route?.params?.id as string,
  ),
);
const group: Ref<Group | undefined> = ref(undefined);
const posts: Ref<GroupPost[]> = ref([]);

onBeforeMount(async () => {
  const id = route?.params?.id;
  if (typeof id === 'string') {
    group.value = await groupsService.getGroup(id);
    posts.value = await groupsService.getGroupPosts(id);
  }
});

function contentPreview(content: string, length: number = 150): string {
  return content.length > length ? content.slice(0, length) + '...' : content;
}
</script>
