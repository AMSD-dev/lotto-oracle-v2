import { createApp } from 'vue';
import { Quasar, Notify } from 'quasar';
import router from './router';
import App from './App.vue';
import { LocalNotifications } from '@capacitor/local-notifications';

import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/dist/quasar.css';

async function setupNotifications() {
  // Ask permission (Android 13+)
  const perm = await LocalNotifications.requestPermissions();

  if (perm.display === 'granted') {
    // Create notification channel (Android 8+)
    await LocalNotifications.createChannel({
      id: 'lotto_alerts',
      name: 'Lotto Alerts',
      description: 'Lotto reminders and number alerts',
      importance: 4, // HIGH
    });
  }

  // 3FORCE Android to evaluate permission by scheduling
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 9999,
        title: 'Initializing notifications',
        body: 'Setting up alerts',
        schedule: { at: new Date(Date.now() + 1000) },
        channelId: 'lotto_alerts',
      },
    ],
  });
}

// Run once at app startup
setupNotifications();

const app = createApp(App);

app.use(Quasar, {
  plugins: { Notify },
  config: { notify: {} },
});

app.use(router);

app.mount('#app');
