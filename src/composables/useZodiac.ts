import { ref, computed } from 'vue';
import { useStorage } from './useStorage';

export interface ZodiacSign {
  animal: string;
  element: string;
  years: number[];
  luckyNumbers: number[];
  auspiciousMonths: string[];
  fengShuiTips: string[];
  manifestationGuidance: string;
  trineFamily: string[];
  characteristics: string[];
}

export interface ZodiacResult {
  sign: string;
  element: string;
  luckyNumbers: number[];
  auspiciousMonths: string[];
  fengShuiTips: string[];
  manifestationGuidance: string;
  trineFamily: string[];
  characteristics: string[];
  compatibility: string;
  clashingSign: string;
  clashingLuckyNumbers: number[];
  clashDescription: string;
}

const zodiacSigns: ZodiacSign[] = [
  {
    animal: 'Rat',
    element: 'Water',
    years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020],
    luckyNumbers: [2, 3, 6, 8, 11, 18, 26, 33],
    auspiciousMonths: ['February', 'May', 'August', 'November'],
    fengShuiTips: [
      'Place water features in the north sector',
      'Use colors: blue, gold, green',
      'Keep bedroom clutter-free for clarity',
      'Display wealth symbols in office',
    ],
    manifestationGuidance: 'Focus on adaptability and resourcefulness. Your quick thinking attracts opportunities.',
    trineFamily: ['Dragon', 'Monkey'],
    characteristics: ['Intelligent', 'Adaptable', 'Quick-witted', 'Charming'],
  },
  {
    animal: 'Ox',
    element: 'Earth',
    years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021],
    luckyNumbers: [1, 4, 9, 12, 13, 19, 21, 37],
    auspiciousMonths: ['March', 'June', 'September', 'December'],
    fengShuiTips: [
      'Incorporate earth tones: yellow, brown, beige',
      'Place crystals in the northeast',
      'Strengthen center of home with earth elements',
      'Use square shapes for stability',
    ],
    manifestationGuidance: 'Patience and persistence bring rewards. Trust your methodical approach to success.',
    trineFamily: ['Snake', 'Rooster'],
    characteristics: ['Diligent', 'Dependable', 'Strong', 'Determined'],
  },
  {
    animal: 'Tiger',
    element: 'Wood',
    years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022],
    luckyNumbers: [1, 3, 4, 7, 16, 24, 31, 46],
    auspiciousMonths: ['January', 'April', 'July', 'October'],
    fengShuiTips: [
      'Add plants in the east for growth',
      'Use colors: green, orange, gold',
      'Display tiger imagery for courage',
      'Keep spaces open for free energy flow',
    ],
    manifestationGuidance: 'Channel your natural courage. Take bold action toward your dreams with confidence.',
    trineFamily: ['Horse', 'Dog'],
    characteristics: ['Brave', 'Confident', 'Competitive', 'Charismatic'],
  },
  {
    animal: 'Rabbit',
    element: 'Wood',
    years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023],
    luckyNumbers: [3, 4, 6, 9, 15, 22, 28, 34],
    auspiciousMonths: ['February', 'May', 'August', 'November'],
    fengShuiTips: [
      'Create peaceful spaces with soft textiles',
      'Use colors: pink, purple, blue',
      'Place plants in east for harmony',
      'Avoid sharp corners in living areas',
    ],
    manifestationGuidance: 'Gentle persistence wins. Trust your intuition and nurture your goals with care.',
    trineFamily: ['Goat', 'Pig'],
    characteristics: ['Elegant', 'Kind', 'Responsible', 'Cautious'],
  },
  {
    animal: 'Dragon',
    element: 'Earth',
    years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024],
    luckyNumbers: [1, 6, 7, 9, 14, 21, 36, 49],
    auspiciousMonths: ['March', 'April', 'July', 'October'],
    fengShuiTips: [
      'Display dragon symbols in east',
      'Use colors: gold, silver, white',
      'Keep home entrance grand and welcoming',
      'Incorporate water and earth elements',
    ],
    manifestationGuidance: 'Your charisma attracts abundance. Think big and pursue ambitious goals fearlessly.',
    trineFamily: ['Rat', 'Monkey'],
    characteristics: ['Confident', 'Intelligent', 'Enthusiastic', 'Charismatic'],
  },
  {
    animal: 'Snake',
    element: 'Fire',
    years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025],
    luckyNumbers: [1, 2, 4, 6, 8, 9, 13, 23],
    auspiciousMonths: ['January', 'June', 'August', 'November'],
    fengShuiTips: [
      'Use warm lighting for transformation',
      'Colors: red, pink, orange, yellow',
      'Create meditation space in south',
      'Display wisdom symbols',
    ],
    manifestationGuidance: 'Wisdom and intuition guide you. Trust your inner knowing and strategic thinking.',
    trineFamily: ['Ox', 'Rooster'],
    characteristics: ['Wise', 'Enigmatic', 'Intuitive', 'Graceful'],
  },
  {
    animal: 'Horse',
    element: 'Fire',
    years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026],
    luckyNumbers: [2, 3, 7, 8, 15, 23, 29, 42],
    auspiciousMonths: ['February', 'May', 'September', 'December'],
    fengShuiTips: [
      'Enhance south area with fire elements',
      'Use colors: red, yellow, purple',
      'Keep spaces energetic and bright',
      'Display movement and action symbols',
    ],
    manifestationGuidance: 'Your energy attracts success. Stay active and pursue freedom with enthusiasm.',
    trineFamily: ['Tiger', 'Dog'],
    characteristics: ['Energetic', 'Independent', 'Warm-hearted', 'Optimistic'],
  },
  {
    animal: 'Goat',
    element: 'Earth',
    years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027],
    luckyNumbers: [2, 7, 8, 9, 16, 25, 34, 41],
    auspiciousMonths: ['March', 'June', 'September', 'December'],
    fengShuiTips: [
      'Create artistic, comfortable spaces',
      'Use colors: green, red, purple',
      'Place art in southwest for creativity',
      'Incorporate soft, natural materials',
    ],
    manifestationGuidance: 'Creative visualization brings dreams to life. Express yourself authentically.',
    trineFamily: ['Rabbit', 'Pig'],
    characteristics: ['Creative', 'Gentle', 'Compassionate', 'Artistic'],
  },
  {
    animal: 'Monkey',
    element: 'Metal',
    years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028],
    luckyNumbers: [1, 4, 7, 8, 13, 22, 37, 46],
    auspiciousMonths: ['January', 'April', 'August', 'November'],
    fengShuiTips: [
      'Add metal elements in west',
      'Use colors: white, gold, silver',
      'Keep spaces organized and innovative',
      'Display intelligence-enhancing symbols',
    ],
    manifestationGuidance: 'Clever solutions lead to success. Stay playful and adaptable in your approach.',
    trineFamily: ['Rat', 'Dragon'],
    characteristics: ['Clever', 'Curious', 'Innovative', 'Mischievous'],
  },
  {
    animal: 'Rooster',
    element: 'Metal',
    years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029],
    luckyNumbers: [5, 7, 8, 9, 15, 19, 24, 26],
    auspiciousMonths: ['February', 'May', 'September', 'November'],
    fengShuiTips: [
      'Enhance west with metal elements',
      'Use colors: gold, brown, yellow',
      'Display rooster symbols for confidence',
      'Keep home bright and organized',
    ],
    manifestationGuidance: 'Confidence and precision attract opportunities. Speak your truth boldly.',
    trineFamily: ['Ox', 'Snake'],
    characteristics: ['Observant', 'Hardworking', 'Courageous', 'Confident'],
  },
  {
    animal: 'Dog',
    element: 'Earth',
    years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030],
    luckyNumbers: [3, 4, 9, 11, 14, 22, 28, 37],
    auspiciousMonths: ['March', 'June', 'October', 'December'],
    fengShuiTips: [
      'Create loyal, stable home environment',
      'Use colors: red, green, purple',
      'Place protection symbols at entrance',
      'Keep northwest area harmonious',
    ],
    manifestationGuidance: 'Loyalty and honesty bring rewards. Trust your moral compass to guide success.',
    trineFamily: ['Tiger', 'Horse'],
    characteristics: ['Loyal', 'Honest', 'Friendly', 'Protective'],
  },
  {
    animal: 'Pig',
    element: 'Water',
    years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031],
    luckyNumbers: [2, 5, 8, 9, 16, 18, 23, 29],
    auspiciousMonths: ['January', 'February', 'September', 'November'],
    fengShuiTips: [
      'Place water features in north',
      'Use colors: yellow, gray, brown, gold',
      'Create abundance altar in wealth corner',
      'Keep spaces welcoming and generous',
    ],
    manifestationGuidance: 'Generosity attracts abundance. Trust in the flow of prosperity with optimism.',
    trineFamily: ['Rabbit', 'Goat'],
    characteristics: ['Generous', 'Compassionate', 'Diligent', 'Sociable'],
  },
];

const BIRTHDATE_KEY = 'lotto_oracle_birthdate';
const ZODIAC_DATA_KEY = 'lotto_oracle_zodiac_data';

export function useZodiac() {
  const storage = useStorage();
  const birthDate = ref<Date | null>(null);
  const error = ref<string | null>(null);

  const loadSavedBirthDate = (): Date | null => {
    const saved = storage.get<string | null>(BIRTHDATE_KEY, null);
    if (saved) {
      return new Date(saved);
    }
    return null;
  };

  const saveBirthDate = (date: Date): void => {
    storage.set(BIRTHDATE_KEY, date.toISOString());
  };

  const loadSavedZodiacData = (): ZodiacResult | null => {
    return storage.get<ZodiacResult | null>(ZODIAC_DATA_KEY, null);
  };

  const saveZodiacData = (data: ZodiacResult): void => {
    storage.set(ZODIAC_DATA_KEY, data);
  };

  const clearZodiacData = (): void => {
    storage.remove(BIRTHDATE_KEY);
    storage.remove(ZODIAC_DATA_KEY);
    birthDate.value = null;
  };

  birthDate.value = loadSavedBirthDate();

  const getChineseZodiacSign = (year: number): ZodiacSign | null => {
    for (const sign of zodiacSigns) {
      if (sign.years.includes(year)) {
        return sign;
      }
      
      const baseYear = sign.years[0];
      const yearDiff = year - baseYear;
      if (yearDiff >= 0 && yearDiff % 12 === 0) {
        return sign;
      }
    }
    return null;
  };

  const getElementForYear = (year: number): string => {
    const yearMod = year % 10;

    if (yearMod === 0 || yearMod === 1) return 'Metal';
    if (yearMod === 2 || yearMod === 3) return 'Water';
    if (yearMod === 4 || yearMod === 5) return 'Wood';
    if (yearMod === 6 || yearMod === 7) return 'Fire';
    return 'Earth';
  };

  const getTrineFamily = (sign: string): string[] => {
    const zodiac = zodiacSigns.find(z => z.animal === sign);
    return zodiac ? zodiac.trineFamily : [];
  };

  const getCompatibilityDescription = (sign: string, trineFamily: string[]): string => {
    return `${sign} forms a harmonious Trine with ${trineFamily.join(' and ')}. These signs share similar values and energy, creating natural compatibility in relationships, business partnerships, and timing decisions. When these signs align, success flows more easily.`;
  };

  const getClashingSign = (sign: string): string => {
    const clashMap: Record<string, string> = {
      'Rat': 'Horse',
      'Ox': 'Goat',
      'Tiger': 'Monkey',
      'Rabbit': 'Rooster',
      'Dragon': 'Dog',
      'Snake': 'Pig',
      'Horse': 'Rat',
      'Goat': 'Ox',
      'Monkey': 'Tiger',
      'Rooster': 'Rabbit',
      'Dog': 'Dragon',
      'Pig': 'Snake',
    };
    return clashMap[sign] || '';
  };

  const getClashDescription = (sign: string, clashingSign: string): string => {
    return `${sign} and ${clashingSign} are opposite signs in the zodiac wheel, creating natural tension. While this doesn't mean incompatibility, it suggests different approaches and perspectives. Be mindful during ${clashingSign} years or when interacting with ${clashingSign} individuals, as extra effort may be needed for harmony.`;
  };

  const getTodayOutlook = (zodiacResult: ZodiacResult | null): {
    status: 'favorable' | 'neutral' | 'clash';
    icon: string;
    color: string;
    title: string;
    message: string;
  } => {
    if (!zodiacResult) {
      return {
        status: 'neutral',
        icon: 'help_outline',
        color: 'grey',
        title: 'Unknown',
        message: 'Please set your birth date to see today\'s outlook.',
      };
    }

    const today = new Date();
    const dayNumber = today.getDate();
    const monthName = today.toLocaleString('en-US', { month: 'long' });

    const luckyNumberMatch = zodiacResult.luckyNumbers.includes(dayNumber);
    const auspiciousMonth = zodiacResult.auspiciousMonths.includes(monthName);
    const clashingNumberMatch = zodiacResult.clashingLuckyNumbers.includes(dayNumber);

    if (luckyNumberMatch && auspiciousMonth) {
      return {
        status: 'favorable',
        icon: 'star',
        color: 'green',
        title: 'Highly Favorable Day',
        message: `Today is highly auspicious! The day number ${dayNumber} aligns with your lucky numbers, and ${monthName} is one of your auspicious months. This is an excellent day to play the lottery or make important decisions. Your zodiac energies are strongly aligned.`,
      };
    }

    if (luckyNumberMatch) {
      return {
        status: 'favorable',
        icon: 'thumb_up',
        color: 'light-green',
        title: 'Favorable Day',
        message: `Today looks promising! The day number ${dayNumber} is one of your lucky numbers. While ${monthName} isn't your most auspicious month, the numeric alignment suggests good fortune. It's a recommended day to try your luck.`,
      };
    }

    if (auspiciousMonth) {
      return {
        status: 'favorable',
        icon: 'wb_sunny',
        color: 'light-green',
        title: 'Favorable Period',
        message: `You're in a favorable period! ${monthName} is one of your auspicious months. While today's date number (${dayNumber}) doesn't directly match your lucky numbers, the monthly energy supports positive outcomes.`,
      };
    }

    if (clashingNumberMatch) {
      return {
        status: 'clash',
        icon: 'warning',
        color: 'red',
        title: 'Challenging Day',
        message: `Exercise caution today. The day number ${dayNumber} aligns with your clashing sign's lucky numbers, which may create opposing energies. While not necessarily unlucky, this day requires more mindful decision-making. Consider waiting for a more aligned day if possible.`,
      };
    }

    return {
      status: 'neutral',
      icon: 'remove_circle_outline',
      color: 'blue-grey',
      title: 'Neutral Day',
      message: `Today is a neutral day. The day number ${dayNumber} doesn't strongly align with either your lucky numbers or clashing energies. You can proceed with normal activities, but consider combining with other favorable factors for important decisions.`,
    };
  };

  const calculateZodiacInsights = (date: Date, persist: boolean = true): ZodiacResult | null => {
    try {
      error.value = null;
      const year = date.getFullYear();

      const zodiac = getChineseZodiacSign(year);
      if (!zodiac) {
        error.value = 'Unable to determine zodiac sign';
        return null;
      }

      const element = getElementForYear(year);
      const trineFamily = getTrineFamily(zodiac.animal);
      const compatibility = getCompatibilityDescription(zodiac.animal, trineFamily);
      const clashingSign = getClashingSign(zodiac.animal);
      const clashingZodiac = zodiacSigns.find(z => z.animal === clashingSign);
      const clashingLuckyNumbers = clashingZodiac ? clashingZodiac.luckyNumbers : [];
      const clashDescription = getClashDescription(zodiac.animal, clashingSign);

      const result: ZodiacResult = {
        sign: zodiac.animal,
        element: element,
        luckyNumbers: zodiac.luckyNumbers,
        auspiciousMonths: zodiac.auspiciousMonths,
        fengShuiTips: zodiac.fengShuiTips,
        manifestationGuidance: zodiac.manifestationGuidance,
        trineFamily: trineFamily,
        characteristics: zodiac.characteristics,
        compatibility: compatibility,
        clashingSign: clashingSign,
        clashingLuckyNumbers: clashingLuckyNumbers,
        clashDescription: clashDescription,
      };

      if (persist) {
        saveBirthDate(date);
        saveZodiacData(result);
        birthDate.value = date;
      }

      return result;
    } catch (err) {
      error.value = 'Error calculating zodiac insights';
      return null;
    }
  };

  const zodiacResult = computed(() => {
    if (!birthDate.value) {
      return loadSavedZodiacData();
    }
    return calculateZodiacInsights(birthDate.value, false);
  });

  const hasZodiacData = computed(() => {
    return loadSavedZodiacData() !== null;
  });

  return {
    birthDate,
    error,
    zodiacResult,
    hasZodiacData,
    calculateZodiacInsights,
    getTrineFamily,
    getChineseZodiacSign,
    loadSavedZodiacData,
    saveBirthDate,
    saveZodiacData,
    clearZodiacData,
    getTodayOutlook,
  };
}
