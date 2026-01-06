// src/composables/useBilling.ts
import { ref } from 'vue';
import { useSubscriptionStore } from '../stores/subscription';
import type { StoreProduct, StoreError } from 'src/types/billing';

declare const store: {
  INFO: number;
  PAID_SUBSCRIPTION: string;
  verbosity: number;
  register: (product: { id: string; type: string }) => void;
  when: (id: string) => {
    approved: (cb: (product: StoreProduct) => void) => void;
  };
  ready: (cb: () => void) => void;
  error: (cb: (err: StoreError) => void) => void;
  refresh: () => void;
  order: (id: string) => void;
};

const isReady = ref(false);

export function useBilling() {
  function initBilling() {
    store.verbosity = store.INFO;

    store.register({
      id: 'lotto_oracle_yearly',
      type: store.PAID_SUBSCRIPTION,
    });

    store
      .when('lotto_oracle_yearly')
      .approved(async (product: StoreProduct) => {
        await sendTokenToBackend(product);

        const subStore = useSubscriptionStore();

        if (product.expiryDate) {
          subStore.setActive({
            expiryDate: product.expiryDate,
          });
        }

        product.finish(); // acknowledge purchase
      });

    store.ready(() => {
      isReady.value = true;
    });

    store.error((err: StoreError) => {
      console.error('Billing error:', err);
    });

    store.refresh(); // restore / load purchases
  }

  function subscribe() {
    store.order('lotto_oracle_yearly');
  }

  return {
    initBilling,
    subscribe,
    isReady,
  };
}

// Backend verification
async function sendTokenToBackend(product: StoreProduct) {
  await fetch('/api/verify-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: product.id,
      purchaseToken: product.transaction.purchaseToken,
      orderId: product.transaction.id,
    }),
  });
}
