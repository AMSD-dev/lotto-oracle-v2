import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '../stores/app';

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../pages/HomePage.vue'),
        meta: { requiresSubscription: true },
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('../pages/SettingsPage.vue'),
        meta: { requiresSubscription: true },
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('../pages/UserProfilePage.vue'),
        meta: { requiresSubscription: true },
      },
      {
        path: '/zodiac',
        name: 'zodiac',
        component: () => import('../pages/ZodiacPage.vue'),
        meta: { requiresSubscription: true },
      },
      {
        path: '/generate',
        name: 'generate',
        component: () => import('../pages/GeneratePage.vue'),
        meta: { requiresSubscription: true },
      },
      {
        path: '/statistics',
        name: 'statistics',
        component: () => import('../pages/StatisticsPage.vue'),
        meta: { requiresSubscription: true },
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../pages/AboutPage.vue'),
      },
      {
        path: '/paywall',
        name: 'paywall',
        component: () => import('../pages/PaywallPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const appStore = useAppStore();

  if (to.meta.requiresSubscription && !appStore.isSubscribed) {
    next({ name: 'paywall' });
  } else if (to.name === 'paywall' && appStore.isSubscribed) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
