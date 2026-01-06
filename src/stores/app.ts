import { defineStore } from 'pinia';
import { ref } from 'vue';
// import { usePayment } from '../composables/usePayment';
import {
  useDraws,
  type LottoDraw,
  type GameType,
} from '../composables/useDraws';
import { useSubscriptionStore } from './subscription';
import { useRouter } from 'vue-router';

export const useAppStore = defineStore('app', () => {
  const router = useRouter();
  // const { checkSubscriptionStatus, getSubscription } = usePayment();
  const { initializeDraws, getLocalDraws, getDrawsByYear } = useDraws();

  const draws = ref<LottoDraw[]>([]);
  const isInitialized = ref(false);
  // const isSubscribed = ref(false);
  const selectedGame = ref<GameType>('lotto');
  const selectedYear = ref<number | 'all'>('all');

  const initializeApp = async () => {
    if (isInitialized.value) return;
    // isSubscribed.value = checkSubscriptionStatus();

    // if (isSubscribed.value) {
    //   draws.value = await initializeDraws(selectedGame.value);
    // }

    //Check subscription status
    const subStore = useSubscriptionStore();
    // await subStore.refresh();

    // Redirect if not subscribed
    if (!subStore.active || subStore.isExpired) {
      router.replace({ name: 'paywall' });
    }

    isInitialized.value = true;
  };

  // const refreshSubscriptionStatus = () => {
  //   isSubscribed.value = checkSubscriptionStatus();
  // };

  const refreshDraws = () => {
    draws.value = getLocalDraws(selectedGame.value);
  };

  const changeGame = async (game: GameType) => {
    selectedGame.value = game;
    draws.value = await initializeDraws(game);

    // Apply year filter if necessary (coerce in case a string slipped in)
    if (selectedYear.value !== 'all') {
      const yearNum = Number(selectedYear.value);
      draws.value = draws.value.filter(
        (d) => new Date(d.date).getFullYear() === yearNum
      );
    }
  };

  const changeYear = (year: number | string) => {
    // normalize store's selectedYear to number | 'all'
    if (year === 'all') {
      selectedYear.value = 'all';
      draws.value = getLocalDraws(selectedGame.value);
      return;
    }

    const yearNum = Number(year);
    if (Number.isNaN(yearNum)) {
      // fallback to all if conversion fails
      selectedYear.value = 'all';
      draws.value = getLocalDraws(selectedGame.value);
      return;
    }

    selectedYear.value = yearNum;
    draws.value = getDrawsByYear(selectedGame.value, yearNum);
  };

  // const subscription = computed(() => getSubscription());

  // const daysRemaining = computed(() => {
  //   if (!subscription.value.expiryDate) return 0;
  //   const expiry = new Date(subscription.value.expiryDate);
  //   const now = new Date();
  //   const diff = expiry.getTime() - now.getTime();
  //   return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  // });

  return {
    draws,
    selectedGame,
    selectedYear,
    isInitialized,
    // isSubscribed,
    // subscription,
    // daysRemaining,
    initializeApp,
    // refreshSubscriptionStatus,
    refreshDraws,
    changeGame,
    changeYear,
  };
});
