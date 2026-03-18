<template>
  <router-link to="/auth/register">
    <BiSolidPlusSquare class="text-2xl"></BiSolidPlusSquare>
  </router-link>
  <table class="table-auto, m-auto mt-5 w-1/2">
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.username ?? '-' }}</td>
        <td>
          <BiRefresh
            class="cursor-pointer text-xl"
            @click="resetPassword(user.id)"
          ></BiRefresh>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { BiSolidPlusSquare, BiRefresh } from 'vue-icons-plus/bi';
import { onBeforeMount, ref, type Ref } from 'vue';
import type { UserDetails } from '@/shared/types/auth/auth.types';
import { adminService } from '../services/adminService.provider';

const users: Ref<UserDetails[]> = ref([]);

onBeforeMount(async () => {
  console.log(await adminService.listUsers());
  users.value = await adminService.listUsers();
});

const resetPassword = (userId: string) => {
  console.log(userId);
  //await adminService.resetPassword(userId);
  //toast.success('Password reset sent.');
};
</script>
