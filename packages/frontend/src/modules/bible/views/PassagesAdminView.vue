<template>
  <router-link v-if="id" :to="`/bible/passage/${id}`"
    ><BiSolidHappyHeartEyes /></router-link
  ><PassageEditorComponent :id="id" :date="date" />
</template>

<script setup lang="ts">
import { BiSolidHappyHeartEyes } from 'vue-icons-plus/bi';
import { useRoute } from 'vue-router';
import PassageEditorComponent from '../components/PassageEditorComponent.vue';

const route = useRoute();
const date = Array.isArray(route.query.date)
  ? route.query.date[0]
  : route.query.date;
const id = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
</script>
