<template><PassageEditorComponent :id="id" /></template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import PassageEditorComponent from '../components/PassageEditorComponent.vue';

const route = useRoute();
const id = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
</script>
