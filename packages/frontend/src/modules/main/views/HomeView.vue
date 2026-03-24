<template>
  <main class="home m-auto flex justify-center">
    <router-link to="/bible">
      <div
        class="border-text hover:bg-secondary hover:text-text-inverse dark:hover:text-text text-l m-3 border-spacing-1 cursor-pointer rounded-md border-2 p-4 px-6"
      >
        <BiCross class="m-auto" />
        <span>{{ i18n.t('navigation.bible') }}</span>
      </div>
    </router-link>
    <router-link to="/psalter">
      <div
        class="border-text hover:bg-secondary hover:text-text-inverse dark:hover:text-text text-l m-3 border-spacing-1 cursor-pointer rounded-md border-2 p-4 px-6"
      >
        <BiCross class="m-auto" />
        <span>{{ i18n.t('navigation.psalter') }}</span>
      </div>
    </router-link>
  </main>
</template>

<script setup lang="ts">
import { BiCross } from 'vue-icons-plus/bi';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
</script>
