<template>
  <div>
    <button @click="addGroup" class="justify-self-start">
      <BiSolidPlusSquare class="h-auto w-8 cursor-pointer"></BiSolidPlusSquare>
    </button>
    <table class="table-auto, m-auto mt-5 w-1/2">
      <thead>
        <tr>
          <th>#</th>
          <th>{{ i18n.t('general.name') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in groups" :key="group.id">
          <td>{{ group.id }}</td>
          <td>{{ group.name }}</td>
          <td>
            <BiSolidPlusSquare
              class="cursor-pointer text-xl"
              @click="openUserModal(group.id)"
            ></BiSolidPlusSquare>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Group } from '@/shared/types/auth/auth.types';
import { onBeforeMount, type Ref, ref } from 'vue';
import { BiSolidPlusSquare } from 'vue-icons-plus/bi';
import AddUsersModal from '../components/modals/AddUsersModal.vue';
import { adminService } from '../services/adminService.provider';
import { useModal } from 'vue-final-modal';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const groups: Ref<Group[]> = ref([]);

onBeforeMount(async () => {
  groups.value = await adminService.listGroups();
});

async function addGroup() {
  const groupName = prompt('Enter group name:');
  if (groupName) {
    const newGroup: Group = { name: groupName };
    const createdGroup = await adminService.createGroup(newGroup);
    if (createdGroup) {
      groups.value.push(createdGroup);
    }
  }
}

async function openUserModal(groupId: string | undefined): Promise<void> {
  if (!groupId) {
    throw new ReferenceError('Group ID is required');
  }
  return new Promise(() => {
    const { open } = useModal({
      component: AddUsersModal,
      attrs: {
        groupId: groupId,
      },
    });
    void open();
  });
}
</script>
