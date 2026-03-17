<template>
  <VueFinalModal
    class="flex items-center justify-center bg-transparent"
    content-class="mb-4 ml-4 bg-secondary rounded p-4 shadow"
  >
    <div class="mb-2 flex flex-col gap-2">
      <span
        v-for="user in users"
        class="text-text-inverse cursor-pointer rounded p-1 text-xl"
      >
        {{ user.email }}
        <button class="cursor-pointer" @click="addUserToGroup(user.id)">
          <BiCheck v-if="assignedUserIds.includes(user.id)" />
          <BiUserCheck v-else />
        </button>
      </span>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { BiUserCheck, BiCheck } from 'vue-icons-plus/bi';
import { VueFinalModal } from 'vue-final-modal';
import { onBeforeMount, ref, type Ref } from 'vue';
import type { UserDetails } from '@/shared/types/auth/auth.types';
import { adminService } from '../services/adminService.provider';

const users: Ref<UserDetails[]> = ref([]);
const props = defineProps<{
  groupId: string;
}>();
const assignedUserIds: Ref<string[]> = ref([]);

onBeforeMount(async () => {
  users.value = await adminService.listUsers();
  const assignedUsers = await adminService.listGroupUsers(props.groupId);
  assignedUserIds.value = assignedUsers.map((user) => user.id);
});

async function addUserToGroup(userId: string) {
  console.log(userId);
  if (!assignedUserIds.value.includes(userId)) {
    const result = await adminService.addUserToGroup(props.groupId, userId);
    if (result) {
      assignedUserIds.value.push(userId);
    }
  }
}
</script>
