<template>
  <div class="sticky top-0 z-50">
    <header
      class="bg-primary text-text-inverse dark:text-text flex justify-between"
    >
      <div class="grow-0">
        <router-link to="/">
          <h1 class="hover:bg-secondary p-3 pt-1.5 text-xl font-bold">
            {{ i18n.t('general.appName') }}
          </h1>
        </router-link>
      </div>
      <div class="flex space-x-2">
        <LocaleSwitcher class="p-2" />
        <UserSwitcher class="p-2" />
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
      </div>
    </header>

    <div
      :class="showMenu ? '' : 'pointer-events-none opacity-0'"
      class="absolute flex min-w-full justify-start transition-all duration-300 before:absolute before:min-h-screen before:min-w-full before:bg-slate-800 before:opacity-[.8]"
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
            <li v-for="(option, index) in menuOptions">
              <router-link
                class="hover:bg-primary block w-full cursor-pointer p-2 text-lg font-bold"
                :to="`/${option}`"
                @click="hideMenu()"
              >
                {{ i18n.t(`navigation.${option}`) }}
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin"
                class="hover:bg-primary block w-full cursor-pointer p-2 text-lg font-bold"
                v-if="authStore.hasRoles(['admin'])"
                >{{ i18n.t('navigation.adminSection') }}</router-link
              >
            </li>
            <li>
              <router-link
                to="/groups"
                class="hover:bg-primary block w-full cursor-pointer p-2 text-lg font-bold"
                v-if="authStore.isAuthenticatedSync()"
              >
                {{ i18n.t('navigation.groups') }}
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BiMenu, BiMoon, BiSun, BiX } from 'vue-icons-plus/bi';
import { ref, onMounted, onUnmounted } from 'vue';
import { useThemeStore } from '@/stores/themeStore';
import { useI18n } from 'vue-i18n';
import LocaleSwitcher from '@/shared/i18n/components/LocaleSwitcher.vue';
import UserSwitcher from '@/modules/auth/components/UserSwitcher.vue';
import { keyboardHandler } from '@/composables/keyboardHandler.provider';
import { useAuthStore } from '@/modules/auth/authStore';
const i18n = useI18n();

const authStore = useAuthStore();
const menuOptions = ['bible', 'psalter'];
const showMenu = ref(false);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function hideMenu() {
  showMenu.value = false;
}

const { registerKey, unregisterKey } = keyboardHandler;

onMounted(() => registerKey('Escape', hideMenu));
onUnmounted(() => unregisterKey('Escape'));

// light/dark theme switching
const themeStore = useThemeStore();
</script>
