<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-mb-xs">Draw Statistics</h1>
      <p class="text-body2 text-grey-7">
        Analyze patterns and trends in lottery history
      </p>
    </div>

    <!-- Filter Controls -->
    <div class="filter-controls row q-col-gutter-md q-mb-lg items-center">
      <div class="col-12 col-sm-6">
        <q-select v-model="selectedGame" :options="gameOptions" label="Select Game" outlined dense emit-value
          map-options @update:model-value="handleGameChange" />
      </div>

      <div class="col-12 col-sm-6">
        <q-select v-model="selectedYear" :options="yearOptions" label="Select Year" outlined dense emit-value
          map-options @update:model-value="handleYearChange" />
      </div>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="analytics" color="primary" size="md" class="q-mr-sm" />
          Overview
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <q-icon name="dataset" size="32px" color="blue" />
            <div class="stat-value">{{ totalDraws }}</div>
            <div class="stat-label">Total Draws</div>
          </div>

          <div class="stat-item">
            <q-icon name="whatshot" size="32px" color="red" />
            <div class="stat-value">{{ hotNumbers.length }}</div>
            <div class="stat-label">Hot Numbers</div>
          </div>

          <div class="stat-item">
            <q-icon name="ac_unit" size="32px" color="blue" />
            <div class="stat-value">{{ coldNumbers.length }}</div>
            <div class="stat-label">Cold Numbers</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="bar_chart" color="primary" size="md" class="q-mr-sm" />
          Number Frequency
        </div>

        <div class="chart-container">
          <Bar :data="frequencyChartData" :options="chartOptions" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="whatshot" color="red" size="md" class="q-mr-sm" />
          Hot Numbers
        </div>

        <p class="text-body2 text-grey-7 q-mb-md">
          Numbers drawn most frequently in recent draws
        </p>

        <div class="numbers-grid">
          <div v-for="[num, freq] in hotNumbers" :key="num" class="stat-number hot">
            <div class="number">{{ num }}</div>
            <div class="frequency">{{ freq }}x</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="ac_unit" color="blue" size="md" class="q-mr-sm" />
          Cold Numbers
        </div>

        <p class="text-body2 text-grey-7 q-mb-md">
          Numbers drawn least frequently - due for appearance?
        </p>

        <div class="numbers-grid">
          <div v-for="[num, freq] in coldNumbers" :key="num" class="stat-number cold">
            <div class="number">{{ num }}</div>
            <div class="frequency">{{ freq }}x</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="show_chart" color="purple" size="md" class="q-mr-sm" />
          Draw Trends
        </div>

        <div class="chart-container">
          <Line :data="trendChartData" :options="trendChartOptions" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="info" color="blue" size="md" class="q-mr-sm" />
          Statistical Insights
        </div>

        <q-list separator>
          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Most Common Range</q-item-label>
              <q-item-label caption>
                Numbers between {{ commonRange.min }} and {{ commonRange.max }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="stars" color="amber" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Average Sum</q-item-label>
              <q-item-label caption>
                Draw sums average {{ averageSum.toFixed(1) }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="balance" color="deep-purple" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Even/Odd Balance</q-item-label>
              <q-item-label caption>
                {{ evenOddRatio }}% even numbers on average
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAppStore } from '../stores/app';
import { useDraws } from '../composables/useDraws';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const appStore = useAppStore();
const { getDrawStats } = useDraws();

const gameOptions = [
  { label: 'Lotto 6/49', value: 'lotto' },
  { label: 'Lotto Max', value: 'max' },
  { label: 'Powerball', value: 'power' },
];

const yearOptions = [
  { label: 'All Years', value: 'all' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
  { label: '2022', value: '2022' },
];

const selectedGame = ref<'lotto' | 'max' | 'power'>(appStore.selectedGame);
const selectedYear = ref<string | 'all'>(String(appStore.selectedYear));

watch(selectedGame, async (newGame) => {
  await appStore.changeGame(newGame);
});

const totalDraws = computed(() => filteredDraws.value.length);



onMounted(async () => {
  if (!appStore.isInitialized) {
    await appStore.initializeApp();
  }
});

const handleGameChange = async (game: 'lotto' | 'max' | 'power') => {
  selectedGame.value = game;
  await appStore.changeGame(game);
};

const handleYearChange = (year: string | 'all') => {
  selectedYear.value = year;
  appStore.changeYear(year === 'all' ? 'all' : Number(year));
};

const filteredDraws = computed(() => {
  const yearValue = selectedYear.value === 'all' ? null : Number(selectedYear.value);
  return appStore.draws.filter(draw => {
    if (!draw?.date) return false;
    if (yearValue === null) return true;
    return new Date(draw.date).getFullYear() === yearValue;
  });
});

const stats = computed(() => {
  if (!filteredDraws.value.length) return null;
  return getDrawStats(filteredDraws.value);
});

const hotNumbers = computed(() => {
  if (!stats.value) return [];
  return stats.value.mostCommon.slice(0, 10);
});

const coldNumbers = computed(() => {
  if (!stats.value) return [];
  return stats.value.leastCommon.slice(0, 10);
});

const frequencyChartData = computed(() => {
  if (!hotNumbers.value.length) {
    return { labels: [], datasets: [] };
  }

  return {
    labels: hotNumbers.value.map(([num]) => num.toString()),
    datasets: [
      {
        label: 'Frequency',
        data: hotNumbers.value.map(([, freq]) => freq),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
      },
    ],
  };
});

const trendChartData = computed(() => {
  if (!filteredDraws.value.length) return { labels: [], datasets: [] };

  const recentDraws = filteredDraws.value.slice(0, 10).reverse();

  return {
    labels: recentDraws.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Draw Sum',
        data: recentDraws.map(d => d.numbers.reduce((a, b) => a + b, 0)),
        borderColor: 'rgba(118, 75, 162, 1)',
        backgroundColor: 'rgba(118, 75, 162, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}));

const trendChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
  },
}));

const commonRange = computed(() => {
  if (!hotNumbers.value.length) return { min: 0, max: 0 };
  const nums = hotNumbers.value.map(([num]) => num);
  return {
    min: Math.min(...nums),
    max: Math.max(...nums),
  };
});

const averageSum = computed(() => {
  if (!filteredDraws.value.length) return 0;
  const sums = filteredDraws.value.map(d => d.numbers.reduce((a, b) => a + b, 0));
  return sums.reduce((a, b) => a + b, 0) / sums.length;
});

const evenOddRatio = computed(() => {
  if (!filteredDraws.value.length) return 0;
  let evenCount = 0;
  let totalNumbers = 0;

  filteredDraws.value.forEach(draw => {
    draw.numbers.forEach(num => {
      if (num % 2 === 0) evenCount++;
      totalNumbers++;
    });
  });

  return totalNumbers > 0 ? ((evenCount / totalNumbers) * 100).toFixed(1) : 0;
});
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 8px 0 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-container {
  height: 300px;
  position: relative;
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.stat-number {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.stat-number.hot {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  color: white;
}

.stat-number.cold {
  background: linear-gradient(135deg, #4dabf7 0%, #74c0fc 100%);
  color: white;
}

.stat-number .number {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-number .frequency {
  font-size: 12px;
  opacity: 0.9;
}
</style>
