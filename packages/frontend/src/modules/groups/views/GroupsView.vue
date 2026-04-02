<template>
  <h2>Groups</h2>
  <ul>
    <li v-for="group in groups">
      <router-link
        :to="`/groups/${group.id}`"
        class="border-text m-5 flex cursor-pointer rounded-lg border-2 p-2"
      >
        <span>
          <BiUserPin class="size-18" />
        </span>
        <div class="flex w-full justify-between">
          <div class="m-2 text-left">
            <p class="font-bold">{{ group.name }}</p>
          </div>
        </div>
        <div class="hover:bg-secondary h-fit w-fit cursor-pointer rounded p-1">
          <SelectMenuDropdown>
            <template #trigger
              ><i @click.prevent="console.log(group.id)">
                <BiDotsVerticalRounded /> </i
            ></template>
            <SelectMenuBody>
              <SelectMenuItem
                v-if="authStore.hasRoles(['admin', 'group_admin'], group.id)"
              >
                <router-link :to="`/groups/admin/${group.id}`">
                  {{ $t('groups.adminGroup') }}
                </router-link>
              </SelectMenuItem>
              <SelectMenuItem>
                <button @click="leaveGroup(group.id)">
                  {{ $t('groups.leaveGroup') }}
                </button>
              </SelectMenuItem>
            </SelectMenuBody>
          </SelectMenuDropdown>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {
  SelectMenuDropdown,
  SelectMenuBody,
  SelectMenuItem,
} from 'v-selectmenu';
import { BiUserPin, BiDotsVerticalRounded } from 'vue-icons-plus/bi';
import type { Group } from '@/shared/types/auth/auth.types';
import { onBeforeMount, ref, type Ref } from 'vue';
import { groupsService } from '../services/groupsService.provider';
import { useAuthStore } from '@/modules/auth/authStore';
import { useI18n } from 'vue-i18n';
import { adminService } from '@/modules/admin/services/adminService.provider';

const groups: Ref<Group[]> = ref([]);
const authStore = useAuthStore();
const i18n = useI18n();

onBeforeMount(async () => {
  groups.value = await groupsService.listUserGroups(authStore.getId());
});

async function leaveGroup(groupId?: string) {
  if (groupId && window.confirm(i18n.t('groups.leaveGroupConfirm'))) {
    const removedFromGroup = await adminService.removeUserFromGroup(
      groupId,
      authStore.getId(),
    );
    if (removedFromGroup) {
      groups.value = groups.value.filter((e) => e.id != groupId);
    }
  }
}
</script>
