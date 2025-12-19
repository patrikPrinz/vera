<template>
  <div class="sticky top-0">
    <header
      class="bg-primary text-text-inverse dark:text-text flex justify-between"
    >
      <div class="grow-0">
        <router-link to="/">
          <h1 class="hover:bg-secondary p-3 pt-1.5 text-xl font-bold">
            {{ $t('general.appName') }}
          </h1>
        </router-link>
      </div>
      <div class="hover:bg-secondary">
        <div
          class="grow-0 cursor-pointer p-2 transition duration-300"
          :class="{ 'rotate-90': showMenu }"
          @click="toggleMenu()"
        >
          <BiX class="fade show" v-if="showMenu" />
          <BiMenu class="fade show" v-else />
        </div>
      </div>
    </header>

    <div
      :class="showMenu ? '' : 'pointer-events-none opacity-0'"
      class="fixed flex min-w-full justify-start transition-all duration-300 before:fixed before:min-h-screen before:min-w-full before:bg-slate-800 before:opacity-[.8]"
    >
      <div
        class="bg-white-100 absolute inset-0 opacity-50"
        @click="hideMenu()"
      ></div>
      <aside
        class="bg-secondary text-text-inverse dark:text-text z-10 min-h-screen min-w-1/2 transform opacity-[1] transition-transform duration-300 md:min-w-1/4"
        :class="showMenu ? 'translate-x-0' : '-translate-x-full'"
      >
        <button
          class="cursor-pointer p-2 transition duration-500"
          :class="{ 'rotate-90': themeStore.darkTheme }"
          @click="themeStore.toggleTheme()"
        >
          <BiSun class="fade show h-7 w-7" v-if="themeStore.darkTheme" />
          <BiMoon class="fade show h-7 w-7" v-else />
        </button>
        <nav>
          <ul>
            <li v-for="option in menuOptions">
              <router-link
                class="hover:bg-primary block w-full cursor-pointer text-lg font-bold"
                :to="`/${option}`"
                @click="hideMenu()"
                >{{ $t(option) }}</router-link
              >
            </li>
            <li>ahoy-hoy</li>
          </ul>
        </nav>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BiMenu, BiMoon, BiSun, BiX } from 'vue-icons-plus/bi';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useThemeStore } from '@/stores/themeStore';

const menuOptions = ['bible'];
const showMenu = ref(false);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function hideMenu() {
  showMenu.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') hideMenu();
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));

watch(showMenu, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

// light/dark theme switching
const themeStore = useThemeStore();
</script>
