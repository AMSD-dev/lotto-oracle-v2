export interface ZodiacYearInteraction {
  currentYear: string;
  currentYearZodiac: string;
  currentYearElement: string;
  userZodiac: string;
  interactionType: 'harmony' | 'clash' | 'neutral';
  energyBalance: string;
  elementalInteraction: string;
  luckyNumbers: number[];
  insights: string[];
}

export function useZodiacYear() {
  const zodiacCycle = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
  ];

  const elementCycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  const clashPairs: Record<string, string> = {
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

  const harmonyGroups: Record<string, string[]> = {
    'Rat': ['Dragon', 'Monkey'],
    'Ox': ['Snake', 'Rooster'],
    'Tiger': ['Horse', 'Dog'],
    'Rabbit': ['Goat', 'Pig'],
    'Dragon': ['Rat', 'Monkey'],
    'Snake': ['Ox', 'Rooster'],
    'Horse': ['Tiger', 'Dog'],
    'Goat': ['Rabbit', 'Pig'],
    'Monkey': ['Rat', 'Dragon'],
    'Rooster': ['Ox', 'Snake'],
    'Dog': ['Tiger', 'Horse'],
    'Pig': ['Rabbit', 'Goat'],
  };

  const elementNumbers: Record<string, number[]> = {
    'Wood': [3, 4, 13, 14, 23, 24, 33, 34, 43, 44],
    'Fire': [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
    'Earth': [5, 8, 15, 18, 25, 28, 35, 38, 45, 48],
    'Metal': [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
    'Water': [9, 10, 19, 20, 29, 30, 39, 40, 49],
  };

  const elementInteractions: Record<string, Record<string, string>> = {
    'Wood': { 'Fire': 'generates', 'Earth': 'dominates', 'Metal': 'weakens', 'Water': 'nourishes', 'Wood': 'neutral' },
    'Fire': { 'Earth': 'generates', 'Metal': 'dominates', 'Water': 'weakens', 'Wood': 'nourishes', 'Fire': 'neutral' },
    'Earth': { 'Metal': 'generates', 'Water': 'dominates', 'Wood': 'weakens', 'Fire': 'nourishes', 'Earth': 'neutral' },
    'Metal': { 'Water': 'generates', 'Wood': 'dominates', 'Earth': 'nourishes', 'Fire': 'weakens', 'Metal': 'neutral' },
    'Water': { 'Wood': 'generates', 'Fire': 'dominates', 'Metal': 'nourishes', 'Earth': 'weakens', 'Water': 'neutral' },
  };

  const getCurrentLunarYear = (): { zodiac: string; element: string; year: number } => {
    const baseYear = 1924;
    const currentYear = new Date().getFullYear();
    const yearsSince = currentYear - baseYear;

    const zodiacIndex = yearsSince % 12;
    const elementIndex = Math.floor((yearsSince % 10) / 2);

    return {
      zodiac: zodiacCycle[zodiacIndex],
      element: elementCycle[elementIndex],
      year: currentYear,
    };
  };

  const getInteractionType = (userZodiac: string, currentZodiac: string): 'harmony' | 'clash' | 'neutral' => {
    if (clashPairs[userZodiac] === currentZodiac) {
      return 'clash';
    }

    if (harmonyGroups[userZodiac]?.includes(currentZodiac)) {
      return 'harmony';
    }

    return 'neutral';
  };

  const generateZodiacYearNumbers = (
    userZodiac: string,
    userElement: string,
    maxNumber: number = 49
  ): ZodiacYearInteraction => {
    const currentYear = getCurrentLunarYear();
    const interactionType = getInteractionType(userZodiac, currentYear.zodiac);
    const elementalRelation = elementInteractions[userElement]?.[currentYear.element] || 'neutral';

    const luckyNumbers: number[] = [];
    const insights: string[] = [];

    const userElementNumbers = elementNumbers[userElement] || [];
    const yearElementNumbers = elementNumbers[currentYear.element] || [];

    if (interactionType === 'harmony') {
      const harmonicNumbers = userElementNumbers
        .filter(n => n <= maxNumber)
        .slice(0, 4);
      luckyNumbers.push(...harmonicNumbers);
      insights.push(`Harmonic alignment with ${currentYear.zodiac} year amplifies your ${userZodiac} energy`);
      insights.push(`Numbers drawn from shared ${userElement} element frequencies`);
    } else if (interactionType === 'clash') {
      const balancingNumbers = yearElementNumbers
        .filter(n => n <= maxNumber && !userElementNumbers.includes(n))
        .slice(0, 3);
      luckyNumbers.push(...balancingNumbers);

      const neutralNumbers = [5, 15, 25, 35].filter(n => n <= maxNumber);
      luckyNumbers.push(...neutralNumbers.slice(0, 2));

      insights.push(`Balancing numbers to harmonize ${userZodiac}-${currentYear.zodiac} clash`);
      insights.push(`Neutralizing energy between ${userElement} and ${currentYear.element}`);
    } else {
      const blendedNumbers = [
        ...userElementNumbers.slice(0, 2),
        ...yearElementNumbers.slice(0, 2)
      ].filter(n => n <= maxNumber);
      luckyNumbers.push(...blendedNumbers);

      insights.push(`Neutral year allows balanced selection from both energies`);
      insights.push(`Blending ${userElement} and ${currentYear.element} elements`);
    }

    while (luckyNumbers.length < 7 && luckyNumbers.length < maxNumber) {
      const random = Math.floor(Math.random() * maxNumber) + 1;
      if (!luckyNumbers.includes(random)) {
        luckyNumbers.push(random);
      }
    }

    return {
      currentYear: currentYear.year.toString(),
      currentYearZodiac: currentYear.zodiac,
      currentYearElement: currentYear.element,
      userZodiac,
      interactionType,
      energyBalance: `${userZodiac} (${userElement}) ${interactionType} ${currentYear.zodiac} (${currentYear.element})`,
      elementalInteraction: `${userElement} ${elementalRelation} ${currentYear.element}`,
      luckyNumbers: luckyNumbers.sort((a, b) => a - b),
      insights,
    };
  };

  const getLunarMonthInsight = (): string => {
    const month = new Date().getMonth();
    const lunarMonths = [
      'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat',
      'Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox'
    ];
    return lunarMonths[month];
  };

  return {
    getCurrentLunarYear,
    getInteractionType,
    generateZodiacYearNumbers,
    getLunarMonthInsight,
    elementNumbers,
    elementInteractions,
  };
}
