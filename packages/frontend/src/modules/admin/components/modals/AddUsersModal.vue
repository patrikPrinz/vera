<template>
  <VueFinalModal
    class="flex items-center justify-center bg-transparent"
    content-class="mb-4 ml-4 bg-secondary rounded p-4 shadow"
  >
    <div class="mb-2 flex flex-col gap-2">
      <span
        v-for="user in users"
        class="text-text-inverse flex justify-between gap-4 rounded p-1 text-xl"
      >
        {{ user.email }}

        <div v-if="assignedUserIds.includes(user.id)">
          <FaUserMinus
            class="cursor-pointer text-pink-900"
            @click="removeUserFromGroup(user.id)"
          />
        </div>
        <div v-else>
          <button class="cursor-pointer" @click="addUserToGroup(user.id)">
            <FaUserPlus />
          </button>
        </div>
      </span>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { BiCheck, BiX } from 'vue-icons-plus/bi';
import { FaUserPlus, FaUserMinus } from 'vue-icons-plus/fa';
import { VueFinalModal } from 'vue-final-modal';
import { onBeforeMount, ref, type Ref } from 'vue';
import type { UserDetails } from '@/shared/types/auth/auth.types';
import { adminService } from '../../services/adminService.provider';

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
  if (!assignedUserIds.value.includes(userId)) {
    const result = await adminService.addUserToGroup(props.groupId, userId);
    if (result) {
      assignedUserIds.value.push(userId);
    }
  }
}

async function removeUserFromGroup(userId: string) {
  if (assignedUserIds.value.includes(userId)) {
    const result = await adminService.removeUserFromGroup(
      props.groupId,
      userId,
    );
    if (result) {
      const userIndex = assignedUserIds.value.indexOf(userId);
      assignedUserIds.value.splice(userIndex, 1);
    }
  }
}
</script>
