<template>
  <VueFinalModal
    class="flex items-center justify-center bg-transparent"
    content-class="mb-4 ml-4 bg-secondary rounded p-4 shadow"
  >
    <div class="mb-2 flex flex-col gap-2">
      <span
        v-for="role in roles"
        class="text-text-inverse cursor-pointer rounded p-1 text-xl"
      >
        {{ role.name ?? role.code }}

        <div v-if="assignedRoles.find((e) => e.code == role.code)">
          <BiCheck />
          <BiX class="text-red-800" @click="unassignRole(role.code)" />
        </div>
        <div v-else>
          <button class="cursor-pointer" @click="assignRole(role.code)">
            <BiUserCheck />
          </button>
        </div>
      </span>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import type { UserRoleRecord } from '@/shared/types/auth/auth.types';
import { onBeforeMount, ref, type Ref } from 'vue';
import { adminService } from '../../services/adminService.provider';
import { useAuthStore } from '@/modules/auth/authStore';

const props = defineProps<{ userId: string }>();

const authStore = useAuthStore();
const roles: Ref<UserRoleRecord[]> = ref([]);
const assignedRoles: Ref<UserRoleRecord[]> = ref([]);

onBeforeMount(async () => {
  const loadedRoles = await adminService.listRoles();
  roles.value = loadedRoles;
  const loadedUserRoles = authStore.getUserRoles();
});
</script>
