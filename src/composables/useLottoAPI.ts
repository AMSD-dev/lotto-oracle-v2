import axios from 'axios';

export interface LottoAPIResult {
  id: string;
  date: string;
  numbers: number[];
  bonus: number;
  jackpot: string;
}

export function useLottoAPI() {
  const API_BASE_URL = 'https://lottoresults-api.onrender.com/api';

  const fetchLottoMax = async (): Promise<LottoAPIResult[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lotto-max`);
      return formatResults(response.data, 'max');
    } catch (error) {
      console.error('Failed to fetch Lotto Max:', error);
      return [];
    }
  };

  const fetchLotto649 = async (): Promise<LottoAPIResult[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lotto-649`);
      return formatResults(response.data, 'lotto');
    } catch (error) {
      console.error('Failed to fetch Lotto 6/49:', error);
      return [];
    }
  };

  const fetchPowerball = async (): Promise<LottoAPIResult[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/powerball`);
      return formatResults(response.data, 'power');
    } catch (error) {
      console.error('Failed to fetch Powerball:', error);
      return [];
    }
  };

  const formatResults = (data: any, gameType: string): LottoAPIResult[] => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((draw: any) => {
      let numbers: number[] = [];
      let bonus: number = 0;

      if (gameType === 'max') {
        numbers = draw.numbers || [];
        bonus = draw.bonus || 0;
      } else if (gameType === 'lotto') {
        numbers = draw.numbers || [];
        bonus = draw.bonus || 0;
      } else if (gameType === 'power') {
        numbers = draw.numbers || [];
        bonus = draw.powerball || draw.bonus || 0;
      }

      return {
        id: draw.id || draw.date,
        date: draw.date || draw.drawDate || '',
        numbers: numbers,
        bonus: bonus,
        jackpot: draw.jackpot || draw.estimatedJackpot || 'N/A',
      };
    });
  };

  const getCurrentYearResults = async (gameType: 'lotto' | 'max' | 'power'): Promise<LottoAPIResult[]> => {
    const currentYear = new Date().getFullYear();

    try {
      let results: LottoAPIResult[] = [];

      switch (gameType) {
        case 'max':
          results = await fetchLottoMax();
          break;
        case 'lotto':
          results = await fetchLotto649();
          break;
        case 'power':
          results = await fetchPowerball();
          break;
      }

      return results.filter(draw => {
        const drawYear = new Date(draw.date).getFullYear();
        return drawYear === currentYear;
      });
    } catch (error) {
      console.error(`Failed to fetch ${gameType} current year:`, error);
      return [];
    }
  };

  return {
    fetchLottoMax,
    fetchLotto649,
    fetchPowerball,
    getCurrentYearResults,
  };
}
