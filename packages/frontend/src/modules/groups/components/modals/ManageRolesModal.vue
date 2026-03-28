<template>
  <VueFinalModal
    class="flex items-center justify-center bg-transparent"
    content-class="mb-4 ml-4 bg-secondary rounded shadow"
  >
    <div class="bg-primary p-2">
      <p class="text-text-inverse">{{ i18n.t('admin.manageRoles') }}:</p>
    </div>
    <div class="m-4 mb-2 flex flex-col gap-2">
      <div
        v-for="role in roles"
        class="text-text-inverse cursor-pointer rounded p-1 text-xl"
      >
        <span v-if="role.groupRole">
          {{ role.name ?? role.code }}
          <button
            v-if="assignedRoles.find((e) => e.code == role.code)"
            @click="unassignRole(role)"
          >
            <BiX></BiX>
          </button>
          <button v-else @click="assignRole(role)">
            <BiPlus></BiPlus>
          </button>
        </span>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { authService } from '@/modules/auth/services/authService.provider';
import type { Role, UserRoleRecord } from '@/shared/types/auth/auth.types';
import { onBeforeMount, ref, type Ref } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import { BiPlus, BiX } from 'vue-icons-plus/bi';
import { adminService } from '@/modules/admin/services/adminService.provider';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const props = defineProps<{ userId: string; groupId: string }>();
const roles: Ref<Role[]> = ref([]);
const assignedRoles: Ref<UserRoleRecord[]> = ref([]);

onBeforeMount(async () => {
  const loadedRoles = await adminService.listRoles();
  roles.value = loadedRoles;
  const loadedUserRoles = await authService.userRoles(props.userId);
  assignedRoles.value = loadedUserRoles;
});

async function assignRole(role: Role) {
  if (!assignedRoles.value.find((e) => e.code == role.code) && role.id) {
    const result = await adminService.assignRole(
      role.id,
      props.userId,
      props.groupId,
    );
    if (result) {
      assignedRoles.value.push({
        code: role.code,
        name: role.name,
        group: props.groupId,
      });
    }
  }
}

async function unassignRole(role: Role) {
  if (role.id) {
    console.log(role);
    const result = await adminService.unassignRole(
      role.id,
      props.userId,
      props.groupId,
    );
    console.log(result);
    if (result) {
      assignedRoles.value = assignedRoles.value.filter(
        (e) => e.code != role.code,
      );
    }
  }
}
</script>
