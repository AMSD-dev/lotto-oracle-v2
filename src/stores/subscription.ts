// src/stores/subscription.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useSubscriptionStore = defineStore('subscription', () => {
  const active = ref(false);
  const expiryDate = ref<string | null>(null);

  function setActive(payload: { expiryDate: string }) {
    active.value = true;
    expiryDate.value = payload.expiryDate;
  }

  function clear() {
    active.value = false;
    expiryDate.value = null;
  }

  const isExpired = computed(() => {
    if (!expiryDate.value) return true;
    return new Date(expiryDate.value) <= new Date();
  });

  return {
    active,
    expiryDate,
    isExpired,
    setActive,
    clear,
  };
});
