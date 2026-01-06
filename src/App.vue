<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { App } from '@capacitor/app';
import { useAppStore } from './stores/app';

const appStore = useAppStore();

onMounted(async () => {
  await appStore.initializeApp();
});

App.addListener('resume', async () => {
  await appStore.initializeApp();
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
}

#app {
  width: 100%;
  height: 100vh;
}
</style>
