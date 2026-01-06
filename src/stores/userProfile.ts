import { defineStore } from 'pinia';
import { useStorage } from '../composables/useStorage';

export interface UserProfile {
  name: string;
  birthdate: string;
  timeOfBirth?: string;
  gender?: string;
  zodiac: string;
  element: string;
  yinYang: string;
  trine: string[];
  auspiciousMonths: string[];
  characteristics: string[];
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  luckyNumbers: number[];
  manifestationGuidance: string;
  compatibility: string;
  weights: {
    stats: number;
    zodiac: number;
    auspicious: number;
  };
}

const PROFILE_KEY = 'lotto_oracle_user_profile';

export const useUserProfileStore = defineStore('userProfile', {
  state: () => ({
    profile: null as UserProfile | null,
    isProfileComplete: false,
  }),

  getters: {
    hasProfile: (state) => state.profile !== null && state.isProfileComplete,

    getUserName: (state) => state.profile?.name || '',

    getZodiacSign: (state) => state.profile?.zodiac || '',

    getElement: (state) => state.profile?.element || '',

    getLuckyNumbers: (state) => state.profile?.luckyNumbers || [],

    getAuspiciousMonths: (state) => state.profile?.auspiciousMonths || [],

    getTrineFamily: (state) => state.profile?.trine || [],

    getLifePathNumber: (state) => state.profile?.lifePathNumber || 0,

    getExpressionNumber: (state) => state.profile?.expressionNumber || 0,

    getFullProfile: (state) => state.profile,
  },

  actions: {
    setProfile(profile: UserProfile) {
      this.profile = profile;
      this.isProfileComplete = true;
      this.saveToStorage();
    },

    updateProfile(updates: Partial<UserProfile>) {
      if (this.profile) {
        this.profile = { ...this.profile, ...updates };
        this.saveToStorage();
      }
    },

    clearProfile() {
      this.profile = null;
      this.isProfileComplete = false;
      const storage = useStorage();
      storage.remove(PROFILE_KEY);
    },

    loadFromStorage() {
      const storage = useStorage();
      const saved = storage.get<UserProfile | null>(PROFILE_KEY, null);
      if (saved) {
        this.profile = saved;
        this.isProfileComplete = true;
      }
    },

    saveToStorage() {
      if (this.profile) {
        const storage = useStorage();
        storage.set(PROFILE_KEY, this.profile);
      }
    },
  },
});
