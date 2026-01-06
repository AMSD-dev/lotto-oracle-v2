import { ref } from 'vue';
import { useStorage } from './useStorage';

export interface Subscription {
  isActive: boolean;
  purchaseDate: string | null;
  expiryDate: string | null;
  transactionId: string | null;
}

const SUBSCRIPTION_KEY = 'lotto_oracle_subscription';
const SUBSCRIPTION_DURATION_DAYS = 365;

export function usePayment() {
  const storage = useStorage();
  const isProcessing = ref(false);
  const error = ref<string | null>(null);

  const getSubscription = (): Subscription => {
    return storage.get<Subscription>(SUBSCRIPTION_KEY, {
      isActive: false,
      purchaseDate: null,
      expiryDate: null,
      transactionId: null,
    });
  };

  const checkSubscriptionStatus = (): boolean => {
    const subscription = getSubscription();
    if (!subscription.isActive || !subscription.expiryDate) return false;

    const expiryDate = new Date(subscription.expiryDate);
    const now = new Date();

    if (now > expiryDate) {
      subscription.isActive = false;
      storage.set(SUBSCRIPTION_KEY, subscription);
      return false;
    }
    return true;
  };

  const purchaseSubscription = async (): Promise<boolean> => {
    isProcessing.value = true;
    error.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const purchaseDate = new Date();
      const expiryDate = new Date(purchaseDate);
      expiryDate.setDate(expiryDate.getDate() + SUBSCRIPTION_DURATION_DAYS);

      const subscription: Subscription = {
        isActive: true,
        purchaseDate: purchaseDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        transactionId: `mock_${Date.now()}`,
      };

      storage.set(SUBSCRIPTION_KEY, subscription);
      return true;
    } catch (err) {
      error.value = 'Purchase failed';
      return false;
    } finally {
      isProcessing.value = false;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    isProcessing.value = true;
    error.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const existingSubscription = getSubscription();
      if (existingSubscription.isActive && checkSubscriptionStatus()) {
        return true;
      }

      const mockRestored = Math.random() > 0.3;
      if (mockRestored) {
        const purchaseDate = new Date();
        purchaseDate.setDate(purchaseDate.getDate() - 100);

        const expiryDate = new Date(purchaseDate);
        expiryDate.setDate(expiryDate.getDate() + SUBSCRIPTION_DURATION_DAYS);

        const subscription: Subscription = {
          isActive: true,
          purchaseDate: purchaseDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          transactionId: `restored_${Date.now()}`,
        };

        storage.set(SUBSCRIPTION_KEY, subscription);
        return true;
      } else {
        error.value = 'No previous purchases found';
        return false;
      }
    } catch (err) {
      error.value = 'Restore failed';
      return false;
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    isProcessing,
    error,
    getSubscription,
    checkSubscriptionStatus,
    purchaseSubscription,
    restorePurchases,
  };
}
