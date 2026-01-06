<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          <div style="display: flex; align-items: center;">
            <img :src="logoW" alt="Lotto Oracle Logo" style="height: 24px; margin-right: 8px;" />
            <span>Lotto Oracle</span>
          </div>
        </q-toolbar-title>
        <q-btn flat dense round icon="menu" @click="toggleDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="right" overlay bordered :width="280">
      <q-list>
        <q-item-label header class="text-weight-bold">
          Navigation
        </q-item-label>

        <q-item clickable v-ripple :active="route.name === 'home'" @click="navigateTo('home')">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="route.name === 'profile'" @click="navigateTo('profile')">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>User Profile</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="route.name === 'generate'" @click="navigateTo('generate')">
          <q-item-section avatar>
            <q-icon name="casino" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Generate Numbers</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="route.name === 'statistics'" @click="navigateTo('statistics')">
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Statistics</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="route.name === 'zodiac'" @click="navigateTo('zodiac')">
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Zodiac Insights</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="route.name === 'settings'" @click="navigateTo('settings')">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="route.name === 'about'" @click="navigateTo('about')">
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>
            <q-item-label>About</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item-label header class="text-weight-bold">
          Subscription
        </q-item-label>

        <q-item v-if="appStore.isSubscribed">
          <q-item-section avatar>
            <q-icon name="check_circle" color="positive" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Active</q-item-label>
            <q-item-label caption>
              {{ appStore.daysRemaining }} days left
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-else>
          <q-item-section avatar>
            <q-icon name="info" color="grey" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Not Active</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '../stores/app';
import logoW from 'src/assets/logo-w.png'

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

const drawer = ref(false);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const navigateTo = (name: string) => {
  router.push({ name });
  drawer.value = false;
};
</script>
