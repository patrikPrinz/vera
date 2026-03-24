<script setup lang="ts">
import NavBar from './components/navigation/NavBar.vue';
import { useThemeStore } from './stores/themeStore';
import { ModalsContainer } from 'vue-final-modal';
import FooterComponent from './components/FooterComponent.vue';

const themeStore = useThemeStore();
</script>

<template>
  <div class="min-h-screen pb-3" :class="themeStore.darkTheme ? 'dark' : ''">
    <NavBar />
    <div class="bg-background px-4">
      <router-view />
      <ModalsContainer />
    </div>
  </div>
  <FooterComponent />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text);
  background-color: var(--color-background);
}
#app .dark {
  color: var(--color-text);
  background-color: var(--color-background);
}
</style>
