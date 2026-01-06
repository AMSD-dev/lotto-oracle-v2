<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-mb-xs">Historical Draw Results</h1>
      <p class="text-body2 text-grey-7">
        View past winning numbers from Lotto 6/49, Lotto Max, and Powerball
      </p>
    </div>

    <q-card flat bordered class="search-card q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-md">
          <q-icon name="search" class="q-mr-sm" />
          Search Your Numbers
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12">
            <q-select v-model="searchGameType" :options="gameOptions" outlined label="Select Game Type for Search"
              option-value="value" option-label="label" emit-value map-options
              @update:model-value="handleSearchGameChange">
              <template v-slot:prepend>
                <q-icon name="casino" />
              </template>
            </q-select>
            <div class="text-caption text-grey-7 q-mt-xs">
              {{ getSearchGameRequirement() }}
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-8">
            <q-input v-model="searchNumbers" outlined
              :label="`Enter ${getRequiredNumberCount()} numbers (comma separated)`" :hint="getSearchHint()"
              :placeholder="getSearchPlaceholder()" :rules="[validateNumberInput]"
              @update:model-value="handleSearchInput">
              <template v-slot:prepend>
                <q-icon name="numbers" />
              </template>
              <template v-slot:append>
                <q-icon v-if="searchNumbers" name="close" @click="clearSearch" class="cursor-pointer" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-4 q-mt-none">
            <q-btn unelevated color="primary" label="Search Draws" icon="search" class="full-width"
              :disable="!isSearchButtonEnabled" @click="handleSearch" />
          </div>
        </div>

        <div v-if="searchedNumbers.length > 0" class="q-mt-md">
          <div class="text-caption text-grey-7 q-mb-xs">Your Numbers:</div>
          <div class="searched-numbers-display">
            <q-chip v-for="num in searchedNumbers" :key="num" color="primary" text-color="white" size="md">
              {{ num }}
            </q-chip>
          </div>
        </div>

        <div v-if="isSearchActive && matchedDraws.length > 0" class="q-mt-md">
          <q-banner dense class="bg-positive text-white">
            <template v-slot:avatar>
              <q-icon name="check_circle" color="white" />
            </template>
            <strong>{{ matchedDraws.length }} matching draw(s) found!</strong>
            Your numbers appeared in {{ matchedDraws.length }} historical {{ matchedDraws.length === 1 ? 'draw' :
              'draws' }}.
          </q-banner>
        </div>

        <div v-if="isSearchActive && matchedDraws.length === 0 && !isLoading" class="q-mt-md">
          <q-banner dense class="bg-warning text-white">
            <template v-slot:avatar>
              <q-icon name="info" color="white" />
            </template>
            No draws found containing your numbers in the current selection.
          </q-banner>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="filter-card q-mb-lg">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-md">
          <q-icon name="filter_list" class="q-mr-sm" />
          Filter Results
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-select v-model="selectedGame" :options="gameOptions" outlined label="Select Lottery Game"
              option-value="value" option-label="label" emit-value map-options @update:model-value="handleGameChange">
              <template v-slot:prepend>
                <q-icon name="casino" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6">
            <q-select v-model="selectedYear" :options="yearOptions" outlined label="Select Year (Optional)"
              option-value="value" option-label="label" emit-value map-options clearable
              @update:model-value="handleYearChange">
              <template v-slot:prepend>
                <q-icon name="calendar_today" />
              </template>
            </q-select>
          </div>
        </div>

        <div v-if="selectedGame" class="q-mt-md">
          <q-banner dense class="bg-blue-1">
            <template v-slot:avatar>
              <q-icon name="info" color="primary" />
            </template>
            <strong>{{ getGameName(selectedGame) }}</strong>
            <span v-if="selectedYear"> - {{ selectedYear }} Results</span>
            <span v-else> - All Years</span>
            <span class="q-ml-sm">({{ filteredDraws.length }} draws)</span>
          </q-banner>
        </div>
      </q-card-section>
    </q-card>

    <div v-if="isLoading" class="text-center q-pa-xl">
      <q-spinner color="primary" size="50px" />
      <p class="text-grey-7 q-mt-md">Loading draw results...</p>
    </div>

    <div v-else-if="error" class="text-center q-pa-xl">
      <q-icon name="error_outline" size="48px" color="negative" />
      <p class="text-negative q-mt-md">{{ error }}</p>
      <q-btn flat color="primary" label="Retry" @click="loadDraws" />
    </div>

    <div v-else-if="stats && filteredDraws.length > 0" class="stats-section q-mb-lg">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="bar_chart" class="q-mr-sm" />
            Statistics
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="stat-card">
                <div class="stat-label">Most Common Numbers</div>
                <div class="number-chips q-mt-sm">
                  <q-chip v-for="[num, freq] in stats.mostCommon.slice(0, 6)" :key="num" color="positive"
                    text-color="white" size="md">
                    {{ num }} ({{ freq }}×)
                  </q-chip>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="stat-card">
                <div class="stat-label">Least Common Numbers</div>
                <div class="number-chips q-mt-sm">
                  <q-chip v-for="[num, freq] in stats.leastCommon.slice(0, 6)" :key="num" color="grey-6"
                    text-color="white" size="md">
                    {{ num }} ({{ freq }}×)
                  </q-chip>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="!isLoading && filteredDraws.length > 0" class="draws-section">
      <q-list bordered separator>
        <q-item v-for="draw in filteredDraws" :key="draw.id" class="draw-item">
          <q-item-section side>
            <q-icon name="event" color="primary" size="md" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold">
              {{ formatDate(draw.date) }}
            </q-item-label>
            <q-item-label caption v-if="draw.jackpot">
              Jackpot: {{ draw.jackpot }}
            </q-item-label>
          </q-item-section>

          <q-item-section>
            <div class="number-balls">
              <div v-for="num in draw.numbers" :key="num"
                :class="['number-ball', { 'highlighted': isNumberMatched(num) }]">
                {{ num }}
              </div>
              <div v-if="draw.bonus" :class="['number-ball', 'bonus', { 'highlighted': isNumberMatched(draw.bonus) }]">
                {{ draw.bonus }}
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="!isLoading && !error && filteredDraws.length === 0 && selectedGame" class="text-center q-pa-xl">
      <q-icon name="search_off" size="64px" color="grey-5" />
      <p class="text-h6 text-grey-7 q-mt-md">No Results Found</p>
      <p class="text-body2 text-grey-6">
        No draw data available for the selected filters.
      </p>
    </div>

    <div v-if="!selectedGame" class="text-center q-pa-xl">
      <q-icon name="casino" size="64px" color="grey-5" />
      <p class="text-h6 text-grey-7 q-mt-md">Select a Lottery Game</p>
      <p class="text-body2 text-grey-6">
        Choose a game from the dropdown above to view draw results
      </p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDraws } from '../composables/useDraws';
import { useLottoAPI, type LottoAPIResult } from '../composables/useLottoAPI';

const { getDrawStats } = useDraws();
const { getCurrentYearResults } = useLottoAPI();

const selectedGame = ref<string>('lotto');
const selectedYear = ref<number | null>(null);
const isLoading = ref(false);
const error = ref<string>('');
const allDraws = ref<LottoAPIResult[]>([]);
const searchNumbers = ref<string>('');
const searchedNumbers = ref<number[]>([]);
const isSearchActive = ref(false);
const searchGameType = ref<string>('lotto');

const gameOptions = [
  { value: 'lotto', label: 'Lotto 6/49' },
  { value: 'max', label: 'Lotto Max' },
  { value: 'power', label: 'Powerball' },
];

const yearOptions = [
  { value: 2025, label: '2025' },
  { value: 2024, label: '2024' },
  { value: 2023, label: '2023' },
  { value: 2022, label: '2022' },
];

const getGameName = (game: string): string => {
  const gameMap: Record<string, string> = {
    lotto: 'Lotto 6/49',
    max: 'Lotto Max',
    power: 'Powerball',
  };
  return gameMap[game] || game;
};

const getRequiredNumberCount = (): number => {
  const countMap: Record<string, number> = {
    lotto: 6,
    max: 7,
    power: 6,
  };
  return countMap[searchGameType.value] || 6;
};

const getSearchGameRequirement = (): string => {
  const requirements: Record<string, string> = {
    lotto: 'Lotto 6/49 requires exactly 6 numbers (1-49)',
    max: 'Lotto Max requires exactly 7 numbers (1-50)',
    power: 'Powerball requires exactly 6 numbers (1-69)',
  };
  return requirements[searchGameType.value] || '';
};

const getSearchHint = (): string => {
  const hints: Record<string, string> = {
    lotto: 'Example: 7, 14, 23, 31, 42, 45',
    max: 'Example: 7, 14, 23, 31, 42, 45, 50',
    power: 'Example: 12, 24, 35, 47, 58, 15',
  };
  return hints[searchGameType.value] || '';
};

const getSearchPlaceholder = (): string => {
  const placeholders: Record<string, string> = {
    lotto: '7, 14, 23, 31, 42, 45',
    max: '7, 14, 23, 31, 42, 45, 50',
    power: '12, 24, 35, 47, 58, 15',
  };
  return placeholders[searchGameType.value] || '';
};

const isSearchButtonEnabled = computed(() => {
  if (!searchNumbers.value || searchNumbers.value.trim() === '') {
    return false;
  }

  const numbers = parseNumbers(searchNumbers.value);
  const requiredCount = getRequiredNumberCount();

  if (numbers.length !== requiredCount) {
    return false;
  }

  const maxNumber = searchGameType.value === 'lotto' ? 49 : searchGameType.value === 'max' ? 50 : 69;
  const invalidNumbers = numbers.filter(n => n > maxNumber || n < 1);

  return invalidNumbers.length === 0;
});

const matchedDraws = computed(() => {
  if (!isSearchActive.value || searchedNumbers.value.length === 0) {
    return [];
  }

  return allDraws.value.filter(draw => {
    const allNumbers = [...draw.numbers, draw.bonus].filter(Boolean);
    return searchedNumbers.value.some(searchNum => allNumbers.includes(searchNum));
  });
});


const filteredDraws = computed(() => {
  if (!selectedYear.value) {
    return allDraws.value;
  }

  return allDraws.value.filter(draw => {
    const drawYear = new Date(draw.date).getFullYear();
    return drawYear === selectedYear.value;
  });
});

const stats = computed(() => {
  if (filteredDraws.value.length === 0) return null;
  return getDrawStats(filteredDraws.value);
});

const loadDraws = async () => {
  if (!selectedGame.value) return;

  isLoading.value = true;
  error.value = '';

  try {
    const currentYear = new Date().getFullYear();
    const isCurrentYear = selectedYear.value === currentYear || selectedYear.value === currentYear + 1;

    if (isCurrentYear) {
      const apiResults = await getCurrentYearResults(selectedGame.value as 'lotto' | 'max' | 'power');

      if (apiResults.length > 0) {
        allDraws.value = apiResults;
      } else {
        const localData = await loadLocalData(selectedGame.value, selectedYear.value || currentYear);
        allDraws.value = localData;
      }
    } else {
      if (selectedYear.value) {
        const yearData = await loadLocalData(selectedGame.value, selectedYear.value);
        allDraws.value = yearData;
      } else {
        const allYearData = await loadAllYears(selectedGame.value);
        allDraws.value = allYearData;
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load draw data';
    console.error('Error loading draws:', err);
  } finally {
    isLoading.value = false;
  }
};

const loadLocalData = async (game: string, year: number): Promise<LottoAPIResult[]> => {
  try {
    const data = await import(`../assets/data/${game}_${year}.json`);
    return data.default || [];
  } catch (err) {
    console.warn(`No local data for ${game} ${year}`);
    return [];
  }
};

const loadAllYears = async (game: string): Promise<LottoAPIResult[]> => {
  const years = [2022, 2023, 2024];
  const allData: LottoAPIResult[] = [];

  for (const year of years) {
    const yearData = await loadLocalData(game, year);
    allData.push(...yearData);
  }

  const currentYear = new Date().getFullYear();
  const apiResults = await getCurrentYearResults(game as 'lotto' | 'max' | 'power');
  if (apiResults.length > 0) {
    allData.push(...apiResults);
  } else {
    const currentYearLocal = await loadLocalData(game, currentYear);
    allData.push(...currentYearLocal);
  }

  allData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allData;
};

const parseNumbers = (input: string): number[] => {
  if (!input || input.trim() === '') return [];

  const numbers = input
    .split(',')
    .map(n => n.trim())
    .filter(n => n !== '')
    .map(n => parseInt(n, 10))
    .filter(n => !isNaN(n) && n > 0);

  return [...new Set(numbers)];
};

const validateNumberInput = (val: string): boolean | string => {
  if (!val || val.trim() === '') {
    return 'Please enter numbers';
  }

  const numbers = parseNumbers(val);
  const requiredCount = getRequiredNumberCount();

  if (numbers.length === 0) {
    return 'Please enter valid numbers separated by commas';
  }

  if (numbers.length < requiredCount) {
    return `Need ${requiredCount} numbers, you have ${numbers.length}`;
  }

  if (numbers.length > requiredCount) {
    return `Only ${requiredCount} numbers allowed, you have ${numbers.length}`;
  }

  const maxNumber = searchGameType.value === 'lotto' ? 49 : searchGameType.value === 'max' ? 50 : 69;

  const invalidNumbers = numbers.filter(n => n > maxNumber || n < 1);
  if (invalidNumbers.length > 0) {
    return `Numbers must be between 1 and ${maxNumber} for ${getGameName(searchGameType.value)}`;
  }

  return true;
};

const handleSearchInput = () => {
  const numbers = parseNumbers(searchNumbers.value);
  searchedNumbers.value = numbers.sort((a, b) => a - b);
};

const handleSearchGameChange = () => {
  searchNumbers.value = '';
  searchedNumbers.value = [];
  isSearchActive.value = false;
};

const handleSearch = () => {
  const numbers = parseNumbers(searchNumbers.value);
  const requiredCount = getRequiredNumberCount();

  if (numbers.length !== requiredCount) {
    return;
  }

  searchedNumbers.value = numbers.sort((a, b) => a - b);
  isSearchActive.value = true;
};

const clearSearch = () => {
  searchNumbers.value = '';
  searchedNumbers.value = [];
  isSearchActive.value = false;
};

const isNumberMatched = (num: number): boolean => {
  return isSearchActive.value && searchedNumbers.value.includes(num);
};

const handleGameChange = () => {
  loadDraws();
};

const handleYearChange = () => {
  loadDraws();
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

onMounted(() => {
  loadDraws();
});
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 16px;
}

.filter-card {
  border: 2px solid #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.stat-label {
  font-weight: 600;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.number-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.draw-item {
  padding: 16px;
  transition: background-color 0.2s;
}

.draw-item:hover {
  background-color: #f5f5f5;
}

.number-balls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.number-ball {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #136df3 0%, #0F52BA 100%);

  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.number-ball.bonus {
  background: linear-gradient(135deg, #327c4b 0%, #50C878 100%);
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.number-ball.highlighted {
  border: 3px solid #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.3);
  animation: pulse 1.5s ease-in-out infinite;
  transform: scale(1.1);
}

.number-ball.bonus.highlighted {
  border: 3px solid #ffd700;
}

@keyframes pulse {

  0%,
  100% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  50% {
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.4);
  }
}
</style>
