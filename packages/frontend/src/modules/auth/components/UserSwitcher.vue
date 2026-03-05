<template>
  <label
    for="user-switcher-show-menu"
    class="hover:bg-secondary cursor-pointer p-2"
  >
    <div>
      <BiUserCircle />
    </div>
  </label>

  <input
    type="checkbox"
    class="hidden"
    id="user-switcher-show-menu"
    v-model="showMenu"
  />

  <div class="absolute top-12" v-if="showMenu == true">
    <div v-if="true"></div>
    <div v-else><router-link to="/auth/login"></router-link></div>
  </div>
</template>

<script setup lang="ts">
import { BiUserCircle } from 'vue-icons-plus/bi';
import { ref } from 'vue';

const showMenu = ref(false);
</script>
