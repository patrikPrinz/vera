<template>
  <header class="flex justify-between bg-red-500">
    <div class="grow-0">
      <router-link to="/">
        <h1 class="p-2 font-bold">{{ $t('general.appName') }}</h1>
      </router-link>
    </div>
    <div class="grow-0 p-2 cursor-pointer" @click="toggleMenu()">
      <BiX v-if="showMenu" />
      <BiMenu v-else />
    </div>
  </header>
  <div :class="(showMenu ? '' : 'hidden')" class="flex justify-start fixed before:fixed before:min-h-screen before:min-w-full min-w-full before:bg-amber-100 before:opacity-[.5]">
    <aside class="bg-red-300 opacity-[1] min-h-screen min-w-1/2 z-10">
      <nav>
        <ul>
          <li v-for="option in menuOptions">
            <router-link class="p-2 font-bold cursor-pointer" :to="`/${option}`" @click="hideMenu()">{{ $t(option) }}</router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { BiMenu, BiX } from 'vue-icons-plus/bi';
import { ref } from 'vue';

const menuOptions = ['bible'];
const showMenu = ref(false);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function hideMenu() {
  showMenu.value = false;
}
</script>