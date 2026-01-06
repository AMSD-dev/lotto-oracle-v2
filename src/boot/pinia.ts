import { createPinia } from 'pinia';
import { App } from 'vue';

export default async ({ app }: { app: App }) => {
  app.use(createPinia());
};
