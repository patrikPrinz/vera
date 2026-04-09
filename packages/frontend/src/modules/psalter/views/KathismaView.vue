<template>
  <div v-if="$route.params?.number">
    <router-link to="/psalter/kathisma"
      >< {{ i18n.t('psalter.selectKathisma') }}</router-link
    >
    <KathismaViewer :number="kathismaNumber" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import KathismaViewer from '../components/KathismaViewer.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const route = useRoute();
const i18n = useI18n();
const kathismaNumber = Number(
  Array.isArray(route.params.number)
    ? route.params.number[0]
    : route.params.number,
);
onBeforeMount(() => {
  console.log('Psalter');
});
</script>
