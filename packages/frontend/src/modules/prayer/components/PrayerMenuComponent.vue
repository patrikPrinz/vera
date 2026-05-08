<template>
  <nav
    class="bg-primary dark:text-text text-text-inverse fixed bottom-0 left-0 flex w-full justify-between"
  >
    <div class="hover:bg-secondary cursor-pointer p-0.5">
      <SelectMenuDropdown>
        <template #trigger
          ><i> <BiDotsVerticalRounded /> </i
        ></template>
        <SelectMenuBody>
          <SelectMenuChildLevel>
            <template #trigger>
              <SelectMenuItem>
                {{ i18n.t('pryaer.switchLanguage') }}</SelectMenuItem
              >
            </template>
            <SelectMenuItem
              v-for="language in languages"
              @click="switchLanguage(language)"
              >{{ language }}</SelectMenuItem
            >
          </SelectMenuChildLevel>
        </SelectMenuBody>
      </SelectMenuDropdown>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  SelectMenuDropdown,
  SelectMenuBody,
  SelectMenuItem,
  SelectMenuChildLevel,
} from 'v-selectmenu';
import { BiDotsVerticalRounded } from 'vue-icons-plus/bi';
import { onBeforeMount, ref, type Ref } from 'vue';
import { usePrayerStore } from '@/stores/prayerStore';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const prayerStore = usePrayerStore();
const languages: Ref<string[]> = ref([]);
onBeforeMount(async () => {
  languages.value = await prayerStore.listLanguages();
});

function switchLanguage(language: string) {
  prayerStore.setLanguage(language);
  location.reload();
}
</script>
