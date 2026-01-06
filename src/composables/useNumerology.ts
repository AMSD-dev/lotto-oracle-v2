export function useNumerology() {
  const letterValues: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
  };

  const vowels = ['A', 'E', 'I', 'O', 'U'];

  const reduceToSingleDigit = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }

    while (num > 9) {
      num = num
        .toString()
        .split('')
        .reduce((sum, digit) => sum + parseInt(digit), 0);

      if (num === 11 || num === 22 || num === 33) {
        return num;
      }
    }

    return num;
  };

  const calculateLifePathNumber = (birthdate: string): number => {
    const date = new Date(birthdate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const daySum = reduceToSingleDigit(day);
    const monthSum = reduceToSingleDigit(month);
    const yearSum = reduceToSingleDigit(
      year
        .toString()
        .split('')
        .reduce((sum, digit) => sum + parseInt(digit), 0)
    );

    return reduceToSingleDigit(daySum + monthSum + yearSum);
  };

  const calculateExpressionNumber = (fullName: string): number => {
    const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
    const sum = cleanName
      .split('')
      .reduce((total, letter) => total + (letterValues[letter] || 0), 0);

    return reduceToSingleDigit(sum);
  };

  const calculateSoulUrgeNumber = (fullName: string): number => {
    const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
    const sum = cleanName
      .split('')
      .filter((letter) => vowels.includes(letter))
      .reduce((total, letter) => total + (letterValues[letter] || 0), 0);

    return reduceToSingleDigit(sum);
  };

  const getPersonalityNumber = (fullName: string): number => {
    const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
    const sum = cleanName
      .split('')
      .filter((letter) => !vowels.includes(letter))
      .reduce((total, letter) => total + (letterValues[letter] || 0), 0);

    return reduceToSingleDigit(sum);
  };

  const getNumerologyLuckyNumbers = (
    lifePathNumber: number,
    expressionNumber: number,
    soulUrgeNumber: number
  ): number[] => {
    const luckySet = new Set<number>();

    luckySet.add(lifePathNumber);
    luckySet.add(expressionNumber);
    luckySet.add(soulUrgeNumber);

    [lifePathNumber, expressionNumber, soulUrgeNumber].forEach((num) => {
      luckySet.add(num * 2);
      luckySet.add(num * 3);
      luckySet.add(num + 9);
      luckySet.add(num * 4);
      if (num + 11 <= 49) luckySet.add(num + 11);
      if (num + 22 <= 49) luckySet.add(num + 22);
    });

    return Array.from(luckySet)
      .filter((n) => n > 0 && n <= 49)
      .sort((a, b) => a - b)
      .slice(0, 12);
  };

  const getNumerologyMeaning = (number: number): string => {
    const meanings: Record<number, string> = {
      1: 'Leadership, independence, new beginnings',
      2: 'Balance, partnership, diplomacy',
      3: 'Creativity, expression, joy',
      4: 'Stability, hard work, foundation',
      5: 'Freedom, change, adventure',
      6: 'Harmony, responsibility, nurturing',
      7: 'Spirituality, introspection, wisdom',
      8: 'Abundance, power, success',
      9: 'Completion, humanitarianism, enlightenment',
      11: 'Master intuition, spiritual insight',
      22: 'Master builder, turning dreams to reality',
      33: 'Master teacher, compassion and healing',
    };

    return meanings[number] || 'Unique path';
  };

  return {
    calculateLifePathNumber,
    calculateExpressionNumber,
    calculateSoulUrgeNumber,
    getPersonalityNumber,
    getNumerologyLuckyNumbers,
    getNumerologyMeaning,
    reduceToSingleDigit,
  };
}
