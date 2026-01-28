import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const theme: Ref<string> = ref(initializeTheme());

  const darkTheme = computed(() => {
    return theme.value == 'dark';
  });
  function initializeTheme() {
    const darkTheme =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    return darkTheme ? 'dark' : 'light';
  }

  function setTheme(newTheme: string) {
    localStorage.theme = newTheme;
    theme.value = initializeTheme();
  }

  function toggleTheme() {
    if (theme.value == 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }

  function getTheme() {
    return theme.value;
  }

  return {
    theme,
    initializeTheme,
    setTheme,
    toggleTheme,
    getTheme,
    darkTheme,
  };
});
