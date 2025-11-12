<script setup lang="ts">
import NavBar from './components/navigation/NavBar.vue';

</script>

<template>
  <NavBar />
  <div class="px-4">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
