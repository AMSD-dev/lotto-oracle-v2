import { ref } from 'vue';
import axios from 'axios';
import { useStorage } from './useStorage';
import lotto2022 from '../assets/data/lotto_2022.json';
import lotto2023 from '../assets/data/lotto_2023.json';
import lotto2024 from '../assets/data/lotto_2024.json';
import lotto2025 from '../assets/data/lotto_2025.json';
import max2022 from '../assets/data/max_2022.json';
import max2023 from '../assets/data/max_2023.json';
import max2024 from '../assets/data/max_2024.json';
import max2025 from '../assets/data/max_2025.json';
import power2022 from '../assets/data/power_2022.json';
import power2023 from '../assets/data/power_2023.json';
import power2024 from '../assets/data/power_2024.json';
import power2025 from '../assets/data/power_2025.json';

export interface LottoDraw {
  id: string;
  date: string;
  numbers: number[];
  bonus?: number;
  jackpot?: string;
}

export type GameType = 'lotto' | 'max' | 'power';

const DRAWS_KEY = 'lotto_oracle_draws';
const LAST_UPDATE_KEY = 'lotto_oracle_last_update';
const REMOTE_API_URL = 'https://api.example.com/lottery/draws';

export function useDraws() {
  const storage = useStorage();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

   const loadBundledData = (game: GameType): LottoDraw[] => {
    switch (game) {
      case 'lotto':
        return [...lotto2022, ...lotto2023, ...lotto2024, ...lotto2025] as LottoDraw[];
      case 'max':
        return [...max2022, ...max2023, ...max2024, ...max2025] as LottoDraw[];
      case 'power':
        return [...power2022, ...power2023, ...power2024, ...power2025] as LottoDraw[];
      default:
        return [];
    }
  };

  const getLocalDraws = (game: GameType): LottoDraw[] => {
    return storage.get<LottoDraw[]>(`${DRAWS_KEY}${game}`, []);
  };
  
  // Add this helper inside useDraws()
  const getDrawsByYear = (game: GameType, year: number): LottoDraw[] => {
    const allDraws = getLocalDraws(game);
    return allDraws.filter(draw => new Date(draw.date).getFullYear() === year);
  };

  const saveDraws = (game: GameType, draws: LottoDraw[]): void => {
    const sortedDraws = draws.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    storage.set(`${DRAWS_KEY}${game}`, sortedDraws);
    storage.set(`${LAST_UPDATE_KEY}${game}`, new Date().toISOString());
  };

  const initializeDraws = async (game: GameType): Promise<LottoDraw[]> => {
    const localDraws = getLocalDraws(game);
    if (localDraws.length > 0) return localDraws;

    const bundledDraws = loadBundledData(game);
    saveDraws(game, bundledDraws);
    return bundledDraws;
  };

 
  const deduplicateDraws = (draws: LottoDraw[]): LottoDraw[] => {
    const seen = new Set<string>();
    return draws.filter(draw => {
      if (seen.has(draw.id)) return false;
      seen.add(draw.id);
      return true;
    });
  };

  const updateDrawData = async (game: GameType): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.get<LottoDraw[]>(
        `${REMOTE_API_URL}/${game}/draws`,
        { timeout: 10000 }
      );
      const remoteDraws = response.data;
      const localDraws = getLocalDraws(game);

      const mergedDraws = deduplicateDraws([...remoteDraws, ...localDraws]);
      saveDraws(game, mergedDraws);
      return true;
    } catch (err) {
      error.value = 'Update failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

    const getLastUpdateTime = (game: GameType): string | null => {
    return storage.get<string | null>(`${LAST_UPDATE_KEY}${game}`, null);
  };

  const getDrawStats = (draws: LottoDraw[]) => {
    const numberFrequency = new Map<number, number>();

    draws.forEach(draw => {
      draw.numbers.forEach(num => {
        numberFrequency.set(num, (numberFrequency.get(num) || 0) + 1);
      });
    });

    const sortedFrequency = Array.from(numberFrequency.entries()).sort((a, b) => b[1] - a[1]);

    return {
      totalDraws: draws.length,
      mostCommon: sortedFrequency.slice(0, 10),
      leastCommon: sortedFrequency.slice(-10).reverse(),
    };
  };

  return {
    isLoading,
    error,
    initializeDraws,
    getLocalDraws,
    updateDrawData,
    getLastUpdateTime,
    getDrawStats,
    loadBundledData,
    getDrawsByYear
  };
}
