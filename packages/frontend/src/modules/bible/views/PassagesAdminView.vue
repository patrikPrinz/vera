<template>
  <router-link v-if="id" :to="`/bible/passage/${id}`"
    ><BiCheck class="m-2 h-8 w-8 rounded-md border" /></router-link
  ><PassageEditorComponent :id="id" :date="date" />
  <BibleMenuComponent :chapters="false"></BibleMenuComponent>
</template>

<script setup lang="ts">
import { BiCheck } from 'vue-icons-plus/bi';
import { useRoute } from 'vue-router';
import BibleMenuComponent from '../components/navigation/BibleMenuComponent.vue';
import PassageEditorComponent from '../components/PassageEditorComponent.vue';

const route = useRoute();
const date = Array.isArray(route.query.date)
  ? route.query.date[0]
  : route.query.date;
const id = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
</script>
