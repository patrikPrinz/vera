<template>
  <router-link to="/psalter/psalm"
    >< {{ i18n.t('psalter.selectPsalm') }}</router-link
  >
  <PsalmViewer :number="psalmNumber" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import PsalmViewer from '../components/PsalmViewer.vue';
import { useI18n } from 'vue-i18n';
const route = useRoute();
const i18n = useI18n();
const psalmNumber = Number(
  Array.isArray(route.params.number)
    ? route.params.number[0]
    : route.params.number,
);
</script>
