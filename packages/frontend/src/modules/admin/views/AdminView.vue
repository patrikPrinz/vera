<template>
  <div>
    <nav
      class="bg-primary text-text-inverse dark:text-text fixed left-0 z-0 h-min w-full"
    >
      <ul class="z-0 flex">
        <li>
          <router-link class="hover:bg-secondary block p-3" to="/admin/users">{{
            i18n.t('admin.users')
          }}</router-link>
        </li>
        <li>
          <router-link
            class="hover:bg-secondary block p-3"
            to="/admin/groups"
            >{{ i18n.t('admin.groups') }}</router-link
          >
        </li>
        <li>
          <router-link
            class="hover:bg-secondary block p-3"
            to="/admin/import-translation"
            >{{ i18n.t('admin.translations') }}</router-link
          >
        </li>
        <li>
          <router-link
            class="hover:bg-secondary block p-3"
            to="/admin/import-psalter"
            >{{ i18n.t('admin.psalter') }}</router-link
          >
        </li>
      </ul>
    </nav>

    <main class="pt-16">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
</script>
