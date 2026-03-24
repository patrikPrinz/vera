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
              <SelectMenuItem>
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

const groups: Ref<Group[]> = ref([]);
const authStore = useAuthStore();

onBeforeMount(async () => {
  groups.value = await groupsService.listUserGroups(authStore.getId());
});

function leaveGroup(groupId?: string) {
  console.log(`leaving ${groupId}`);
}
</script>
