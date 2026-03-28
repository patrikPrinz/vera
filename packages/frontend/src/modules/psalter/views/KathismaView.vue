<template>
  <div v-if="$route.params?.number">
    <KathismaViewer :number="$route.params.number" />
  </div>
  <KathismaSelector :kathismaCount="20" v-else></KathismaSelector>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import KathismaViewer from '../components/KathismaViewer.vue';
import KathismaSelector from '../components/KathismaSelector.vue';

onBeforeMount(() => {
  console.log('Psalter');
});
</script>
