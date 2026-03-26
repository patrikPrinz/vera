<template>
  <router-link to="/groups" class="m-5 block"
    >< {{ i18n.t('groups.groupSelection') }}</router-link
  >
  <h2 class="text-2xl">{{ group?.name }}</h2>

  <table class="m-auto my-5 text-left md:w-2/3">
    <thead>
      <tr>
        <th>{{ i18n.t('general.email') }}</th>
        <th>{{ i18n.t('general.name') }}</th>
        <th>{{ i18n.t('general.operations') }}</th>
      </tr>
    </thead>
    <tr v-for="user in users" :key="user.id">
      <td>{{ user?.email }}</td>
      <td>{{ user?.username ?? '---' }}</td>
      <td>
        <button
          class="hover:bg-primary cursor-pointer rounded-xl p-2"
          @click="removeFromGroup(user.id)"
        >
          Remove
        </button>
      </td>
      <td>
        <button
          class="hover:bg-primary cursor-pointer rounded-xl p-2"
          @click="openRolesModal(user.id)"
        >
          Roles
        </button>
      </td>
    </tr>
  </table>
</template>
<script setup lang="ts">
import type { Group, UserDetails } from '@/shared/types/auth/auth.types';
import { onBeforeMount, ref, type Ref } from 'vue';
import { groupsService } from '../services/groupsService.provider';
import { useRoute } from 'vue-router';
import { adminService } from '@/modules/admin/services/adminService.provider';
import { useI18n } from 'vue-i18n';
import ManageRolesModal from '../components/modals/ManageRolesModal.vue';
import { useModal } from 'vue-final-modal';

const i18n = useI18n();
const route = useRoute();
const group: Ref<Group | undefined> = ref(undefined);
const users: Ref<UserDetails[]> = ref([]);

onBeforeMount(async () => {
  if (typeof route.params.id === 'string') {
    group.value = await groupsService.getGroup(route.params.id);
    users.value = await adminService.listGroupUsers(route.params.id);
  }
});

async function removeFromGroup(userId: string) {
  const removed = await adminService.removeUserFromGroup(
    route.params.id as string,
    userId,
  );
  if (removed) {
    users.value = users.value.filter((user) => user.id !== userId);
  }
}

function openRolesModal(userId: string) {
  if (!userId) {
    throw new ReferenceError('Group ID is required');
  }
  return new Promise(() => {
    let groupId;
    if (typeof route.params.id !== 'string') {
      groupId = route.params.id[0];
    } else {
      groupId = route.params.id;
    }
    const { open } = useModal({
      component: ManageRolesModal,
      attrs: {
        userId: userId,
        groupId: groupId,
      },
    });
    void open();
  });
}
</script>
