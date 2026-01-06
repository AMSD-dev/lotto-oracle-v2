import { ref } from 'vue';
import { useStorage } from './useStorage';
import type { LottoDraw } from './useDraws';
import type { ZodiacResult } from './useZodiac';
import { useZodiacYear } from './useZodiacYear';
import { usePatternAnalysis } from './usePatternAnalysis';
import type { UserProfile } from '../stores/userProfile';

export interface NumberExplanation {
  number: number;
  reason: string;
  method: string;
}

export interface GeneratedSet {
  method: string;
  title: string;
  description: string;
  mainNumbers: NumberExplanation[];
  bonusNumber: NumberExplanation | null;
  timestamp: string;
  confidence: number;
}

export interface UserPreference {
  favorStatistics: number;
  favorZodiac: number;
  favorAuspicious: number;
}

export interface LotteryType {
  id: string;
  name: string;
  mainCount: number;
  mainMax: number;
  bonusCount: number;
  bonusMax: number;
  description: string;
}

export const LOTTERY_TYPES: LotteryType[] = [
  {
    id: 'lotto649',
    name: 'Lotto 6/49',
    mainCount: 6,
    mainMax: 49,
    bonusCount: 0,
    bonusMax: 0,
    description: '6 numbers from 1 to 49',
  },
  {
    id: 'lottomax',
    name: 'Lotto Max',
    mainCount: 7,
    mainMax: 50,
    bonusCount: 0,
    bonusMax: 0,
    description: '7 numbers from 1 to 50',
  },
  {
    id: 'powerball',
    name: 'Powerball',
    mainCount: 5,
    mainMax: 69,
    bonusCount: 1,
    bonusMax: 26,
    description: '5 numbers from 1 to 69 and 1 Powerball from 1 to 26',
  },
];

const PREFERENCE_KEY = 'lotto_oracle_user_preference';
const LOTTERY_TYPE_KEY = 'lotto_oracle_lottery_type';

export function useGenerator() {
  const storage = useStorage();
  const isGenerating = ref(false);
  const allGeneratedSets = ref<GeneratedSet[]>([]);

  const defaultPreference: UserPreference = {
    favorStatistics: 50,
    favorZodiac: 30,
    favorAuspicious: 20,
  };

  const getUserPreference = (): UserPreference => {
    return storage.get<UserPreference>(PREFERENCE_KEY, defaultPreference);
  };

  const setUserPreference = (pref: UserPreference): void => {
    storage.set(PREFERENCE_KEY, pref);
  };

  const getSelectedLotteryType = (): LotteryType => {
    const savedId = storage.get<string>(LOTTERY_TYPE_KEY, 'lotto649');
    return LOTTERY_TYPES.find(lt => lt.id === savedId) || LOTTERY_TYPES[0];
  };

  const setSelectedLotteryType = (lotteryTypeId: string): void => {
    storage.set(LOTTERY_TYPE_KEY, lotteryTypeId);
  };

  const getNumberFrequency = (draws: LottoDraw[]): Map<number, number> => {
    const frequency = new Map<number, number>();
    draws.forEach(draw => {
      draw.numbers.forEach(num => {
        frequency.set(num, (frequency.get(num) || 0) + 1);
      });
    });
    return frequency;
  };

  const getHotNumbers = (draws: LottoDraw[], topN: number = 10): [number, number][] => {
    const frequency = getNumberFrequency(draws);
    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN);
  };

  const getLastYearTrends = (draws: LottoDraw[], currentMonth: number): [number, number][] => {
    const lastYear = new Date().getFullYear() - 1;
    const lastYearDraws = draws.filter(draw => {
      const drawDate = new Date(draw.date);
      return drawDate.getFullYear() === lastYear && drawDate.getMonth() === currentMonth;
    });

    const frequency = getNumberFrequency(lastYearDraws);
    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  const isAuspiciousMonth = (zodiacData: ZodiacResult | null): boolean => {
    if (!zodiacData) return false;
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    return zodiacData.auspiciousMonths.includes(currentMonth);
  };

  const generateZodiacLuckyNumbers = (zodiacData: ZodiacResult | null, lotteryType: LotteryType): GeneratedSet => {
    const numbers: NumberExplanation[] = [];

    if (zodiacData && zodiacData.luckyNumbers.length > 0) {
      const validLuckyNumbers = zodiacData.luckyNumbers.filter(n => n <= lotteryType.mainMax);
      const selected = validLuckyNumbers.slice(0, lotteryType.mainCount);

      while (selected.length < lotteryType.mainCount) {
        const random = Math.floor(Math.random() * lotteryType.mainMax) + 1;
        if (!selected.includes(random)) {
          selected.push(random);
        }
      }

      selected.sort((a, b) => a - b).forEach((num, idx) => {
        if (idx < validLuckyNumbers.length) {
          numbers.push({
            number: num,
            reason: 'Lucky number for ' + zodiacData.sign + ' (' + zodiacData.element + ' element)',
            method: 'zodiac'
          });
        } else {
          numbers.push({
            number: num,
            reason: 'Compatible with ' + zodiacData.sign + ' energy',
            method: 'zodiac'
          });
        }
      });
    } else {
      for (let i = 0; i < lotteryType.mainCount; i++) {
        const num = Math.floor(Math.random() * lotteryType.mainMax) + 1;
        numbers.push({
          number: num,
          reason: 'Selected based on cosmic alignment',
          method: 'zodiac'
        });
      }
    }

    let bonusNumber: NumberExplanation | null = null;

    if (lotteryType.bonusCount > 0) {
      const bonusMax = lotteryType.bonusMax;
      const bonusNum = Math.floor(Math.random() * bonusMax) + 1;
      bonusNumber = {
        number: bonusNum,
        reason: zodiacData ? 'Powerball for ' + zodiacData.sign : 'Cosmic powerball number',
        method: 'zodiac'
      };
    }

    return {
      method: 'zodiac',
      title: 'Zodiac Lucky Numbers',
      description: zodiacData
        ? 'Numbers aligned with your ' + zodiacData.sign + ' zodiac sign and ' + zodiacData.element + ' element'
        : 'Numbers selected based on universal zodiac principles',
      mainNumbers: numbers,
      bonusNumber: bonusNumber,
      timestamp: new Date().toISOString(),
      confidence: 75,
    };
  };

  const generateAuspiciousMonthNumbers = (
    zodiacData: ZodiacResult | null,
    _draws: LottoDraw[],
    lotteryType: LotteryType
  ): GeneratedSet => {
    const numbers: NumberExplanation[] = [];
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
    const isAuspicious = isAuspiciousMonth(zodiacData);

    const dateNumbers = [
      currentDate.getDate(),
      currentDate.getMonth() + 1,
      currentDate.getFullYear() % 100,
    ].filter(n => n <= lotteryType.mainMax);

    dateNumbers.forEach(num => {
      numbers.push({
        number: num,
        reason: isAuspicious
          ? 'Current date in auspicious month (' + currentMonth + ')'
          : 'Current date numerology (' + currentMonth + ')',
        method: 'auspicious'
      });
    });

    if (zodiacData && isAuspicious) {
      const zodiacNums = zodiacData.luckyNumbers
        .filter(n => n <= lotteryType.mainMax && !numbers.map(ne => ne.number).includes(n))
        .slice(0, 3);

      zodiacNums.forEach(num => {
        numbers.push({
          number: num,
          reason: zodiacData.sign + ' number in auspicious ' + currentMonth,
          method: 'auspicious'
        });
      });
    }

    while (numbers.length < lotteryType.mainCount) {
      const random = Math.floor(Math.random() * lotteryType.mainMax) + 1;
      if (!numbers.map(ne => ne.number).includes(random)) {
        numbers.push({
          number: random,
          reason: 'Favorable for ' + currentMonth,
          method: 'auspicious'
        });
      }
    }

    numbers.sort((a, b) => a.number - b.number);

    let bonusNumber: NumberExplanation | null = null;
    if (lotteryType.bonusCount > 0) {
      const bonusNum = Math.floor(Math.random() * lotteryType.bonusMax) + 1;
      bonusNumber = {
        number: bonusNum,
        reason: 'Lucky powerball for ' + currentMonth,
        method: 'auspicious'
      };
    }

    return {
      method: 'auspicious',
      title: 'Auspicious Month Numbers',
      description: isAuspicious && zodiacData
        ? currentMonth + ' is auspicious for ' + zodiacData.sign + '! These numbers carry favorable energy.'
        : 'Numbers selected for ' + currentMonth + ' using date numerology',
      mainNumbers: numbers.slice(0, lotteryType.mainCount),
      bonusNumber: bonusNumber,
      timestamp: new Date().toISOString(),
      confidence: isAuspicious ? 80 : 65,
    };
  };

  const generateHistoricalFrequency = (draws: LottoDraw[], _lotteryType: LotteryType): GeneratedSet => {
    const numbers: NumberExplanation[] = [];
    
    if (draws.length === 0) {
      for (let i = 0; i < 6; i++) {
        const num = Math.floor(Math.random() * 49) + 1;
        numbers.push({
          number: num,
          reason: 'No historical data available',
          method: 'frequency'
        });
      }
    } else {
      const hotNumbers = getHotNumbers(draws, 10);
      
      hotNumbers.slice(0, 6).forEach(([num, freq]) => {
        numbers.push({
          number: num,
          reason: 'Appeared ' + freq + ' times in ' + draws.length + ' draws (' + ((freq / draws.length) * 100).toFixed(1) + '%)',
          method: 'frequency'
        });
      });
    }

    numbers.sort((a, b) => a.number - b.number);

    const availableBonus = Array.from({ length: 49 }, (_, i) => i + 1)
      .filter(n => !numbers.map(ne => ne.number).includes(n));
    const bonusNum = availableBonus[Math.floor(Math.random() * availableBonus.length)];

    return {
      method: 'frequency',
      title: 'Historical Frequency',
      description: 'Numbers that appeared most frequently in the last ' + draws.length + ' draws',
      mainNumbers: numbers.slice(0, 6),
      bonusNumber: {
        number: bonusNum,
        reason: 'High frequency bonus number',
        method: 'frequency'
      },
      timestamp: new Date().toISOString(),
      confidence: draws.length > 50 ? 85 : 70,
    };
  };

  const generateLastYearTrends = (draws: LottoDraw[], _lotteryType: LotteryType): GeneratedSet => {
    const numbers: NumberExplanation[] = [];
    const currentMonth = new Date().getMonth();
    const currentMonthName = new Date().toLocaleString('en-US', { month: 'long' });
    const lastYear = new Date().getFullYear() - 1;

    const trends = getLastYearTrends(draws, currentMonth);

    if (trends.length === 0) {
      for (let i = 0; i < 6; i++) {
        const num = Math.floor(Math.random() * 49) + 1;
        numbers.push({
          number: num,
          reason: 'No ' + currentMonthName + ' ' + lastYear + ' data available',
          method: 'last_year'
        });
      }
    } else {
      trends.slice(0, 6).forEach(([num, freq]) => {
        numbers.push({
          number: num,
          reason: 'Appeared ' + freq + ' times in ' + currentMonthName + ' ' + lastYear,
          method: 'last_year'
        });
      });

      while (numbers.length < 6) {
        const random = Math.floor(Math.random() * 49) + 1;
        if (!numbers.map(ne => ne.number).includes(random)) {
          numbers.push({
            number: random,
            reason: 'Seasonal pattern for ' + currentMonthName,
            method: 'last_year'
          });
        }
      }
    }

    numbers.sort((a, b) => a.number - b.number);

    const availableBonus = Array.from({ length: 49 }, (_, i) => i + 1)
      .filter(n => !numbers.map(ne => ne.number).includes(n));
    const bonusNum = availableBonus[Math.floor(Math.random() * availableBonus.length)];

    return {
      method: 'last_year',
      title: 'Last Year Trends',
      description: 'Numbers that performed well in ' + currentMonthName + ' ' + lastYear,
      mainNumbers: numbers.slice(0, 6),
      bonusNumber: {
        number: bonusNum,
        reason: currentMonthName + ' ' + lastYear + ' bonus',
        method: 'last_year'
      },
      timestamp: new Date().toISOString(),
      confidence: trends.length >= 3 ? 75 : 60,
    };
  };

  const generateUserPreferenceBased = (
    zodiacData: ZodiacResult | null,
    draws: LottoDraw[],
    _lotteryType: LotteryType
  ): GeneratedSet => {
    const pref = getUserPreference();
    const numbers: NumberExplanation[] = [];

    const statCount = Math.round((pref.favorStatistics / 100) * 6);
    const zodiacCount = Math.round((pref.favorZodiac / 100) * 6);
    const auspCount = 6 - statCount - zodiacCount;

    if (statCount > 0 && draws.length > 0) {
      const hotNumbers = getHotNumbers(draws, 10);
      hotNumbers.slice(0, statCount).forEach(([num, freq]) => {
        numbers.push({
          number: num,
          reason: 'High frequency (' + freq + 'x) - matches your preference for statistics',
          method: 'preference'
        });
      });
    }

    if (zodiacCount > 0 && zodiacData) {
      const zodiacNums = zodiacData.luckyNumbers
        .filter(n => !numbers.map(ne => ne.number).includes(n))
        .slice(0, zodiacCount);
      
      zodiacNums.forEach(num => {
        numbers.push({
          number: num,
          reason: zodiacData.sign + ' lucky number - matches your zodiac preference',
          method: 'preference'
        });
      });
    }

    if (auspCount > 0) {
      const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
      const isAuspicious = isAuspiciousMonth(zodiacData);
      
      for (let i = 0; i < auspCount; i++) {
        const random = Math.floor(Math.random() * 49) + 1;
        if (!numbers.map(ne => ne.number).includes(random)) {
          numbers.push({
            number: random,
            reason: isAuspicious 
              ? 'Auspicious ' + currentMonth + ' number - matches your preference'
              : currentMonth + ' numerology - matches your preference',
            method: 'preference'
          });
        }
      }
    }

    while (numbers.length < 6) {
      const random = Math.floor(Math.random() * 49) + 1;
      if (!numbers.map(ne => ne.number).includes(random)) {
        numbers.push({
          number: random,
          reason: 'Balanced selection based on your preferences',
          method: 'preference'
        });
      }
    }

    numbers.sort((a, b) => a.number - b.number);

    const availableBonus = Array.from({ length: 49 }, (_, i) => i + 1)
      .filter(n => !numbers.map(ne => ne.number).includes(n));
    const bonusNum = availableBonus[Math.floor(Math.random() * availableBonus.length)];

    return {
      method: 'preference',
      title: 'Your Preference Mix',
      description: 'Customized blend: ' + pref.favorStatistics + '% Statistics, ' + pref.favorZodiac + '% Zodiac, ' + pref.favorAuspicious + '% Auspicious',
      mainNumbers: numbers.slice(0, 6),
      bonusNumber: {
        number: bonusNum,
        reason: 'Bonus matching your preferences',
        method: 'preference'
      },
      timestamp: new Date().toISOString(),
      confidence: 80,
    };
  };

  const generateBestCombination = (
    zodiacData: ZodiacResult | null,
    draws: LottoDraw[],
    _lotteryType: LotteryType
  ): GeneratedSet => {
    const numbers: NumberExplanation[] = [];
    const scores = new Map<number, { score: number; reasons: string[] }>();

    for (let num = 1; num <= 49; num++) {
      scores.set(num, { score: 0, reasons: [] });
    }

    if (zodiacData) {
      zodiacData.luckyNumbers.forEach(num => {
        const entry = scores.get(num);
        if (entry) {
          entry.score += 30;
          entry.reasons.push(zodiacData.sign + ' lucky number');
        }
      });

      const isAuspicious = isAuspiciousMonth(zodiacData);
      if (isAuspicious) {
        zodiacData.luckyNumbers.forEach(num => {
          const entry = scores.get(num);
          if (entry) {
            entry.score += 20;
            entry.reasons.push('Auspicious month boost');
          }
        });
      }
    }

    if (draws.length > 0) {
      const hotNumbers = getHotNumbers(draws, 15);
      hotNumbers.forEach(([num, freq], idx) => {
        const entry = scores.get(num);
        if (entry) {
          const freqScore = Math.max(0, 25 - idx * 2);
          entry.score += freqScore;
          entry.reasons.push('High frequency (' + freq + 'x)');
        }
      });

      const currentMonth = new Date().getMonth();
      const lastYearTrends = getLastYearTrends(draws, currentMonth);
      lastYearTrends.forEach(([num, _freq], idx) => {
        const entry = scores.get(num);
        if (entry) {
          const trendScore = Math.max(0, 15 - idx * 1.5);
          entry.score += trendScore;
          entry.reasons.push('Last year trend');
        }
      });
    }

    const currentDate = new Date();
    const dateNumbers = [
      currentDate.getDate(),
      currentDate.getMonth() + 1,
      currentDate.getFullYear() % 100,
    ].filter(n => n <= 49);

    dateNumbers.forEach(num => {
      const entry = scores.get(num);
      if (entry) {
        entry.score += 10;
        entry.reasons.push('Date numerology');
      }
    });

    const sortedScores = Array.from(scores.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 6);

    sortedScores.forEach(([num, data]) => {
      numbers.push({
        number: num,
        reason: data.reasons.length > 0 
          ? data.reasons.join(' + ')
          : 'Balanced selection',
        method: 'best'
      });
    });

    numbers.sort((a, b) => a.number - b.number);

    const availableBonus = Array.from({ length: 49 }, (_, i) => i + 1)
      .filter(n => !numbers.map(ne => ne.number).includes(n));
    const bonusNum = availableBonus[Math.floor(Math.random() * availableBonus.length)];

    return {
      method: 'best',
      title: 'Best Possible Combination',
      description: 'Intelligent blend of all methods: zodiac, auspicious timing, statistics, and trends',
      mainNumbers: numbers,
      bonusNumber: {
        number: bonusNum,
        reason: 'Optimized bonus number',
        method: 'best'
      },
      timestamp: new Date().toISOString(),
      confidence: 90,
    };
  };

  const generateHybridSuggestion = (
    favoriteNumber: number,
    userProfile: UserProfile | null,
    draws: LottoDraw[],
    lotteryType: LotteryType
  ): GeneratedSet => {
    const numbers: NumberExplanation[] = [];
    const { getTopCompanions, analyzeByMonth, getLunarPhaseNumbers } = usePatternAnalysis();
    const { elementNumbers, getCurrentLunarYear, getLunarMonthInsight } = useZodiacYear();

    numbers.push({
      number: favoriteNumber,
      reason: 'Your selected starting number',
      method: 'hybrid'
    });

    const companions = getTopCompanions(favoriteNumber, draws, 10);
    const currentMonth = new Date().getMonth();
    const monthlyFreq = analyzeByMonth(draws, currentMonth);
    const lunarNumbers = getLunarPhaseNumbers();
    const currentYear = getCurrentLunarYear();
    const lunarMonth = getLunarMonthInsight();

    const scoredCompanions: Array<{num: number; score: number; reasons: string[]}> = [];

    companions.forEach(num => {
      if (num === favoriteNumber || num > lotteryType.mainMax) return;

      const reasons: string[] = [];
      let score = 0;

      const coOccurrence = draws.filter(d =>
        d.numbers.includes(favoriteNumber) && d.numbers.includes(num)
      ).length;

      if (coOccurrence >= 3) {
        reasons.push(`Appears with ${favoriteNumber} in ${coOccurrence} draws`);
        score += coOccurrence * 2;
      }

      if (userProfile) {
        if (userProfile.luckyNumbers.includes(num)) {
          reasons.push(`Part of your zodiac lucky numbers`);
          score += 5;
        }

        const userElementNums = elementNumbers[userProfile.element] || [];
        if (userElementNums.includes(num)) {
          reasons.push(`Resonates with your ${userProfile.element} element`);
          score += 4;
        }
      }

      const monthFreq = monthlyFreq.get(num) || 0;
      if (monthFreq >= 3) {
        reasons.push(`High frequency in current month (${monthFreq}×)`);
        score += monthFreq;
      }

      if (lunarNumbers.includes(num)) {
        reasons.push(`Aligned with current lunar phase`);
        score += 3;
      }

      const yearElementNums = elementNumbers[currentYear.element] || [];
      if (yearElementNums.includes(num)) {
        reasons.push(`Matches ${currentYear.zodiac} year (${currentYear.element} element)`);
        score += 3;
      }

      if (reasons.length > 0) {
        scoredCompanions.push({ num, score, reasons });
      }
    });

    scoredCompanions.sort((a, b) => b.score - a.score);

    const neededCount = lotteryType.mainCount - 1;
    const selectedCompanions = scoredCompanions.slice(0, neededCount);

    selectedCompanions.forEach(comp => {
      numbers.push({
        number: comp.num,
        reason: comp.reasons[0] || 'Statistically favorable companion',
        method: 'hybrid'
      });
    });

    while (numbers.length < lotteryType.mainCount) {
      const random = Math.floor(Math.random() * lotteryType.mainMax) + 1;
      if (!numbers.map(n => n.number).includes(random)) {
        numbers.push({
          number: random,
          reason: 'Balanced energy complement',
          method: 'hybrid'
        });
      }
    }

    numbers.sort((a, b) => a.number - b.number);

    let bonusNumber: NumberExplanation | null = null;
    if (lotteryType.bonusCount > 0) {
      const bonusNum = Math.floor(Math.random() * lotteryType.bonusMax) + 1;
      bonusNumber = {
        number: bonusNum,
        reason: 'Hybrid powerball selection',
        method: 'hybrid'
      };
    }

    const yearInfo = userProfile
      ? `${userProfile.zodiac} in ${currentYear.zodiac} year`
      : `Year of the ${currentYear.zodiac}`;

    return {
      method: 'hybrid',
      title: 'Hybrid Symbolic-Statistical Suggestion',
      description: `Starting from ${favoriteNumber}, blending historical co-occurrence with ${yearInfo} and ${lunarMonth} lunar month energy`,
      mainNumbers: numbers,
      bonusNumber: bonusNumber,
      timestamp: new Date().toISOString(),
      confidence: 88,
    };
  };

  const generateElementalRandomSet = (
    userProfile: UserProfile | null,
    draws: LottoDraw[],
    lotteryType: LotteryType
  ): GeneratedSet => {
    const numbers: NumberExplanation[] = [];
    const { elementNumbers } = useZodiacYear();
    const { analyzeByMonth } = usePatternAnalysis();

    if (!userProfile) {
      for (let i = 0; i < lotteryType.mainCount; i++) {
        const num = Math.floor(Math.random() * lotteryType.mainMax) + 1;
        numbers.push({
          number: num,
          reason: 'Random selection',
          method: 'elemental'
        });
      }
    } else {
      const elementNums = (elementNumbers[userProfile.element] || [])
        .filter(n => n <= lotteryType.mainMax);
      const birthMonth = new Date(userProfile.birthdate).getMonth();
      const monthlyFreq = analyzeByMonth(draws, birthMonth);

      elementNums.slice(0, 2).forEach(num => {
        numbers.push({
          number: num,
          reason: `${userProfile.element} element core number`,
          method: 'elemental'
        });
      });

      userProfile.luckyNumbers
        .filter(n => n <= lotteryType.mainMax)
        .slice(0, 2)
        .forEach(num => {
          if (!numbers.map(n => n.number).includes(num)) {
            numbers.push({
              number: num,
              reason: `Lucky number from ${userProfile.zodiac} zodiac`,
              method: 'elemental'
            });
          }
        });

      const hotInBirthMonth = Array.from(monthlyFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([num]) => num);

      hotInBirthMonth.forEach(num => {
        if (numbers.length >= lotteryType.mainCount) return;
        if (!numbers.map(n => n.number).includes(num)) {
          numbers.push({
            number: num,
            reason: `High frequency in your birth month`,
            method: 'elemental'
          });
        }
      });

      while (numbers.length < lotteryType.mainCount) {
        const random = Math.floor(Math.random() * lotteryType.mainMax) + 1;
        if (!numbers.map(n => n.number).includes(random)) {
          numbers.push({
            number: random,
            reason: 'Energy balance number',
            method: 'elemental'
          });
        }
      }
    }

    numbers.sort((a, b) => a.number - b.number);

    let bonusNumber: NumberExplanation | null = null;
    if (lotteryType.bonusCount > 0) {
      const bonusNum = Math.floor(Math.random() * lotteryType.bonusMax) + 1;
      bonusNumber = {
        number: bonusNum,
        reason: 'Elemental powerball',
        method: 'elemental'
      };
    }

    return {
      method: 'elemental',
      title: 'Zodiac + Elemental Random Set',
      description: userProfile
        ? `Blends ${userProfile.zodiac} zodiac, ${userProfile.element} element, numerology, and historical data`
        : 'Elemental and zodiac-based selection',
      mainNumbers: numbers,
      bonusNumber: bonusNumber,
      timestamp: new Date().toISOString(),
      confidence: 78,
    };
  };

  const generateYearAlignmentSet = (
    userProfile: UserProfile | null,
    _draws: LottoDraw[],
    lotteryType: LotteryType
  ): GeneratedSet => {
    const numbers: NumberExplanation[] = [];
    const { generateZodiacYearNumbers } = useZodiacYear();

    if (!userProfile) {
      for (let i = 0; i < lotteryType.mainCount; i++) {
        const num = Math.floor(Math.random() * lotteryType.mainMax) + 1;
        numbers.push({
          number: num,
          reason: 'Year alignment number',
          method: 'year_alignment'
        });
      }
    } else {
      const yearData = generateZodiacYearNumbers(
        userProfile.zodiac,
        userProfile.element,
        lotteryType.mainMax
      );

      yearData.luckyNumbers.slice(0, lotteryType.mainCount).forEach((num, idx) => {
        const insight = yearData.insights[idx % yearData.insights.length];
        numbers.push({
          number: num,
          reason: insight || `${yearData.interactionType} energy number`,
          method: 'year_alignment'
        });
      });

      while (numbers.length < lotteryType.mainCount) {
        const random = Math.floor(Math.random() * lotteryType.mainMax) + 1;
        if (!numbers.map(n => n.number).includes(random)) {
          numbers.push({
            number: random,
            reason: 'Balance number for year energy',
            method: 'year_alignment'
          });
        }
      }
    }

    numbers.sort((a, b) => a.number - b.number);

    let bonusNumber: NumberExplanation | null = null;
    if (lotteryType.bonusCount > 0) {
      const bonusNum = Math.floor(Math.random() * lotteryType.bonusMax) + 1;
      bonusNumber = {
        number: bonusNum,
        reason: 'Year powerball alignment',
        method: 'year_alignment'
      };
    }

    return {
      method: 'year_alignment',
      title: 'Zodiac-Year Alignment Insight Set',
      description: userProfile
        ? `${userProfile.zodiac} in Year of the ${useZodiacYear().getCurrentLunarYear().zodiac} - ${useZodiacYear().getInteractionType(userProfile.zodiac, useZodiacYear().getCurrentLunarYear().zodiac)} energy`
        : 'Current year alignment numbers',
      mainNumbers: numbers,
      bonusNumber: bonusNumber,
      timestamp: new Date().toISOString(),
      confidence: 82,
    };
  };

  const generatePatternAnalysisSet = (
    userProfile: UserProfile | null,
    draws: LottoDraw[],
    lotteryType: LotteryType
  ): GeneratedSet => {
    const { generatePatternBasedSet, getZodiacYearStatistics } = usePatternAnalysis();

    const luckyNumbers = userProfile?.luckyNumbers || [];
    const patternInsights = generatePatternBasedSet(
      draws,
      luckyNumbers,
      lotteryType.mainMax,
      lotteryType.mainCount
    );

    const numbers: NumberExplanation[] = patternInsights.map(insight => ({
      number: insight.number,
      reason: insight.insights[0] || 'Pattern-based selection',
      method: 'pattern'
    }));

    let bonusNumber: NumberExplanation | null = null;
    if (lotteryType.bonusCount > 0) {
      const bonusNum = Math.floor(Math.random() * lotteryType.bonusMax) + 1;
      bonusNumber = {
        number: bonusNum,
        reason: 'Statistical powerball',
        method: 'pattern'
      };
    }

    const zodiacStat = userProfile
      ? getZodiacYearStatistics(draws, userProfile.zodiac)
      : 'Historical pattern analysis';

    return {
      method: 'pattern',
      title: 'Historical & Symbolic Pattern Analysis',
      description: zodiacStat,
      mainNumbers: numbers,
      bonusNumber: bonusNumber,
      timestamp: new Date().toISOString(),
      confidence: 85,
    };
  };

  const generateAllMethods = async (
    zodiacData: ZodiacResult | null,
    draws: LottoDraw[],
    lotteryType?: LotteryType,
    userProfile?: UserProfile | null
  ): Promise<GeneratedSet[]> => {
    isGenerating.value = true;

    const lottery = lotteryType || getSelectedLotteryType();

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sets: GeneratedSet[] = [
        generateZodiacLuckyNumbers(zodiacData, lottery),
        generateElementalRandomSet(userProfile || null, draws, lottery),
        generateYearAlignmentSet(userProfile || null, draws, lottery),
        generateAuspiciousMonthNumbers(zodiacData, draws, lottery),
        generateHistoricalFrequency(draws, lottery),
        generateLastYearTrends(draws, lottery),
        generateUserPreferenceBased(zodiacData, draws, lottery),
        generatePatternAnalysisSet(userProfile || null, draws, lottery),
        generateBestCombination(zodiacData, draws, lottery),
      ];

      allGeneratedSets.value = sets;
      return sets;
    } finally {
      isGenerating.value = false;
    }
  };

  const getUndrawnNumbers = (draws: LottoDraw[], lotteryType: LotteryType): number[] => {
    const drawnNumbers = new Set<number>();

    draws.forEach(draw => {
      draw.numbers.forEach(num => {
        if (num <= lotteryType.mainMax) {
          drawnNumbers.add(num);
        }
      });
    });

    const undrawn: number[] = [];
    for (let i = 1; i <= lotteryType.mainMax; i++) {
      if (!drawnNumbers.has(i)) {
        undrawn.push(i);
      }
    }

    return undrawn.sort((a, b) => a - b);
  };

  return {
    isGenerating,
    allGeneratedSets,
    getUserPreference,
    setUserPreference,
    getSelectedLotteryType,
    setSelectedLotteryType,
    generateAllMethods,
    generateHybridSuggestion,
    generateZodiacLuckyNumbers,
    generateElementalRandomSet,
    generateYearAlignmentSet,
    generatePatternAnalysisSet,
    generateAuspiciousMonthNumbers,
    generateHistoricalFrequency,
    generateLastYearTrends,
    generateUserPreferenceBased,
    generateBestCombination,
    getUndrawnNumbers,
  };
}
