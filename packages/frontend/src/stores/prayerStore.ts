import { psalterService } from '@/modules/psalter/services/psalterService.provider';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const usePrayerStore = defineStore('prayer', () => {
  const language: Ref<string | undefined> = ref(undefined);

  function getLanguage(): string {
    if (!language.value) {
      language.value = loadLanguage();
    }
    return language.value;
  }

  function setLanguage(value: string): void {
    localStorage.setItem('prayerLanguage', value);
    language.value = value;
  }

  function loadLanguage() {
    const storageValue = localStorage.getItem('prayerLanguage');
    return storageValue ?? 'CZE';
  }

  async function listLanguages(): Promise<string[]> {
    return await psalterService.listLanguages();
  }

  return {
    getLanguage,
    setLanguage,
    listLanguages,
  };
});
