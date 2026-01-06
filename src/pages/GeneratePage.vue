<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-mb-xs">Lucky Number Generator</h1>
      <p class="text-body2 text-grey-7">
        Personalized numbers based on your zodiac and preferences
      </p>
    </div>

    <div v-if="!hasZodiacSetup">
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="text-center q-py-xl">
          <q-icon name="account_circle" size="80px" color="grey-5" class="q-mb-md" />
          <h2 class="text-h5 text-weight-bold q-mb-sm">Profile Required</h2>
          <p class="text-body1 text-grey-7 q-mb-md">
            Complete your User Profile to unlock personalized number generation
          </p>
          <q-btn unelevated color="primary" label="Create Profile" icon="account_circle" size="lg"
            @click="goToZodiac" />
        </q-card-section>
      </q-card>
    </div>

    <div v-else-if="zodiacData">
      <q-card flat bordered class="zodiac-summary-card q-mb-md">
        <q-card-section>
          <div class="summary-grid">
            <div class="summary-item">
              <q-icon name="pets" size="32px" color="amber" />
              <div class="summary-label">Zodiac</div>
              <div class="summary-value">{{ zodiacData.zodiac }}</div>
              <div class="summary-subtext">{{ zodiacData.element }} - {{ zodiacData.yinYang }}</div>
            </div>

            <div class="summary-item">
              <q-icon name="numbers" size="32px" color="blue" />
              <div class="summary-label">Numerology</div>
              <div class="summary-value">Life Path {{ zodiacData.lifePathNumber }}</div>
              <div class="summary-subtext">Expression: {{ zodiacData.expressionNumber }}</div>
            </div>

            <div class="summary-item">
              <q-icon name="casino" size="32px" color="green" />
              <div class="summary-label">Lucky Numbers</div>
              <div class="summary-value">{{ zodiacData.luckyNumbers.join(', ') }}</div>
            </div>

            <div class="summary-item">
              <q-icon name="favorite" size="32px" color="pink" />
              <div class="summary-label">Trine Family</div>
              <div class="summary-value">{{ zodiacData.trine.join(' & ') }}</div>
              <div class="summary-subtext">Compatible signs</div>
            </div>

            <div class="summary-item">
              <q-icon name="event_available" size="32px" color="purple" />
              <div class="summary-label">Auspicious Months</div>
              <div class="summary-value">{{ zodiacData.auspiciousMonths.slice(0, 2).join(', ') }}</div>
              <div class="summary-subtext">+ {{ zodiacData.auspiciousMonths.length - 2 }} more</div>
            </div>

            <div class="summary-item clash-item" v-if="zodiacInsights">
              <q-icon name="block" size="32px" color="red" />
              <div class="summary-label">Clashing Sign</div>
              <div class="summary-value">{{ zodiacInsights.clashingSign }}</div>
              <div class="summary-subtext">Opposing energies</div>
              <div class="clash-divider"></div>
              <div class="summary-label">Lucky Numbers</div>
              <div class="summary-value">{{ zodiacInsights.clashingLuckyNumbers.join(', ') }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md" :class="`outlook-card outlook-${todayOutlook.status}`">
        <q-card-section>
          <div class="outlook-header">
            <div class="outlook-icon-container">
              <q-icon :name="todayOutlook.icon" :color="todayOutlook.color" size="48px" />
            </div>
            <div class="outlook-content">
              <div class="text-h6 text-weight-bold q-mb-xs">
                {{ todayOutlook.title }}
              </div>
              <div class="text-caption text-grey-7">
                {{ new Date().toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day:
                    'numeric'
                }) }}
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-body2 outlook-message">
            {{ todayOutlook.message }}
          </div>

          <q-banner v-if="todayOutlook.status === 'favorable'" class="bg-green-1 q-mt-md" dense>
            <template v-slot:avatar>
              <q-icon name="casino" color="green-8" />
            </template>
            <div class="text-caption text-green-9">
              Consider generating your lucky numbers today!
            </div>
          </q-banner>

          <q-banner v-if="todayOutlook.status === 'clash'" class="bg-red-1 q-mt-md" dense>
            <template v-slot:avatar>
              <q-icon name="info" color="red-8" />
            </template>
            <div class="text-caption text-red-9">
              Wait for a more favorable day if making major decisions.
            </div>
          </q-banner>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">Lottery Type</div>

          <div class="row q-gutter-md">
            <div class="col">
              <q-select v-model="selectedLotteryId" :options="lotteryOptions" option-value="id" option-label="name"
                emit-value map-options outlined label="Select Lottery" @update:model-value="handleLotteryChange" />
            </div>
          </div>

          <div v-if="selectedLottery" class="q-mt-sm">
            <q-banner dense class="bg-blue-1">
              <template v-slot:avatar>
                <q-icon name="info" color="primary" />
              </template>
              <strong>{{ selectedLottery.name }}:</strong> {{ selectedLottery.description }}
            </q-banner>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="hybrid-section-card q-mb-md">
        <q-card-section class="bg-gradient-hybrid text-white">
          <div class="text-h5 text-weight-bold">
            <q-icon name="psychology" size="md" class="q-mr-sm" />
            Hybrid Symbolic-Statistical Suggestion
          </div>
          <div class="text-subtitle2 q-mt-xs">
            Enter your favorite number to generate statistically and symbolically aligned companions
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md items-end">
            <div class="col-12 col-sm-6">
              <q-input v-model.number="favoriteNumber" outlined type="number" label="Your Favorite Number"
                hint="Enter a number to find optimal companions" :min="1" :max="selectedLottery?.mainMax || 49" :rules="[
                  val => !!val || 'Number is required',
                  val => val >= 1 || 'Must be at least 1',
                  val => val <= (selectedLottery?.mainMax || 49) || `Must be max ${selectedLottery?.mainMax || 49}`
                ]">
                <template v-slot:prepend>
                  <q-icon name="star" color="amber" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6">
              <q-btn unelevated color="primary" label="Generate Companions" icon="auto_awesome" size="md"
                class="full-width"
                :disable="!favoriteNumber || favoriteNumber < 1 || favoriteNumber > (selectedLottery?.mainMax || 49)"
                @click="handleGenerateHybrid" />
            </div>
          </div>

          <div v-if="hybridSet" class="q-mt-lg">
            <q-separator class="q-mb-md" />

            <div class="text-subtitle1 text-weight-bold q-mb-sm">
              {{ hybridSet.title }}
            </div>
            <p class="text-body2 text-grey-7 q-mb-md">
              {{ hybridSet.description }}
            </p>

            <div class="numbers-horizontal q-mb-md">
              <div v-for="(numObj, idx) in hybridSet.mainNumbers" :key="idx" class="number-with-explanation">
                <div class="number-ball method-hybrid">
                  {{ numObj.number }}
                </div>
                <div class="number-explanation">
                  {{ numObj.reason }}
                </div>
              </div>
            </div>

            <div v-if="hybridSet.bonusNumber" class="bonus-section">
              <div class="text-caption text-grey-7 q-mb-xs text-center">Bonus Number</div>
              <div class="bonus-number-container">
                <div class="number-ball bonus-ball">
                  {{ hybridSet.bonusNumber.number }}
                </div>
                <div class="number-explanation text-center">
                  {{ hybridSet.bonusNumber.reason }}
                </div>
              </div>
            </div>

            <div class="q-mt-md row q-gutter-sm">
              <q-btn flat dense color="primary" icon="content_copy" label="Copy" @click="copyHybridSet" />
              <q-btn flat dense color="primary" icon="share" label="Share" @click="shareHybridSet" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <q-btn unelevated no-caps color="primary" icon="stars" label="Generate All Number Sets" size="lg"
            :loading="isGenerating" @click="handleGenerateAll" class="full-width" />
        </q-card-section>
      </q-card>

      <div v-if="generatedSets.length > 0" class="generated-sets">
        <q-card v-for="(set, index) in generatedSets" :key="index" flat bordered class="q-mb-md method-card">
          <q-card-section class="method-header" :class="getMethodClass(set.method)">
            <div class="row items-center">
              <div class="col">
                <div class="text-h6 text-white text-weight-bold">
                  <q-icon :name="getMethodIcon(set.method)" size="md" class="q-mr-sm" />
                  {{ set.title }}
                </div>
                <div class="text-caption text-white">{{ set.description }}</div>
              </div>
              <div class="col-auto">
                <q-badge :label="set.confidence + '%'" color="white" text-color="black" />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Numbers</div>
            <div class="numbers-horizontal q-mb-md">
              <div v-for="(numExp, idx) in set.mainNumbers" :key="idx" class="number-card">
                <div class="number-ball" :class="getMethodClass(set.method)">
                  {{ numExp.number }}
                </div>
                <div class="number-reason text-caption text-grey-7">
                  {{ numExp.reason }}
                </div>
              </div>
            </div>

            <div v-if="set.bonusNumber" class="bonus-section">
              <div class="text-subtitle2 q-mb-sm text-center">Bonus Number</div>
              <div class="bonus-container">
                <div class="number-card">
                  <div class="number-ball bonus">
                    {{ set.bonusNumber.number }}
                  </div>
                  <div class="number-reason text-caption text-grey-7">
                    {{ set.bonusNumber.reason }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="q-pa-md">
            <q-btn flat no-caps color="primary" icon="content_copy" label="Copy" @click="copySet(set)" size="sm" />
            <q-btn flat no-caps color="primary" icon="share" label="Share" @click="shareSet(set)" size="sm" />
          </q-card-actions>
        </q-card>
      </div>

      <q-card v-if="generatedSets.length > 0" flat bordered class="undrawn-card q-mt-lg">
        <q-card-section class="bg-grey-9 text-white">
          <div class="text-h6 text-weight-bold">
            <q-icon name="visibility_off" size="md" class="q-mr-sm" />
            Never Drawn Numbers
          </div>
          <div class="text-caption">
            Numbers from 1 to {{ selectedLottery?.mainMax }} that have never appeared in historical draws
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div v-if="undrawnNumbers.length === 0" class="text-center q-py-md text-grey-7">
            All numbers have been drawn at least once!
          </div>
          <div v-else>
            <div class="text-subtitle2 q-mb-sm">
              {{ undrawnNumbers.length }} number{{ undrawnNumbers.length !== 1 ? 's' : '' }} never drawn
            </div>
            <div class="undrawn-numbers-grid">
              <div v-for="num in undrawnNumbers" :key="num" class="undrawn-number">
                {{ num }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/app';
import { useUserProfileStore } from '../stores/userProfile';
import { useGenerator, LOTTERY_TYPES, type GeneratedSet } from '../composables/useGenerator';
import { useAdvancedAlgorithms } from '../composables/useAdvancedAlgorithms';
import { useZodiac } from '../composables/useZodiac';

const $q = useQuasar();
const router = useRouter();
const appStore = useAppStore();
const profileStore = useUserProfileStore();
const { zodiacResult, getTodayOutlook, calculateZodiacInsights } = useZodiac();
const {
  isGenerating,
  allGeneratedSets,
  getSelectedLotteryType,
  setSelectedLotteryType,
  generateAllMethods,
  generateHybridSuggestion,
  getUndrawnNumbers,
} = useGenerator();

const {
  generateMandelMethodSet,
  generateChaosTheorySet,
  generateFanoPlaneSet,
} = useAdvancedAlgorithms();

const generatedSets = ref<GeneratedSet[]>([]);
const selectedLotteryId = ref(getSelectedLotteryType().id);
const favoriteNumber = ref<number | null>(null);
const hybridSet = ref<GeneratedSet | null>(null);
const undrawnNumbers = ref<number[]>([]);

const lotteryOptions = LOTTERY_TYPES;

const hasZodiacSetup = computed(() => profileStore.hasProfile);

const zodiacData = computed(() => profileStore.getFullProfile);

const zodiacInsights = computed(() => {
  if (zodiacData.value?.birthdate) {
    return calculateZodiacInsights(new Date(zodiacData.value.birthdate), false);
  }
  return zodiacResult.value;
});

const todayOutlook = computed(() => {
  return getTodayOutlook(zodiacInsights.value);
});

const selectedLottery = computed(() => {
  return LOTTERY_TYPES.find(lt => lt.id === selectedLotteryId.value);
});

const goToZodiac = () => {
  router.push({ name: 'profile' });
};

const handleLotteryChange = (lotteryId: string) => {
  setSelectedLotteryType(lotteryId);
  hybridSet.value = null;
};

const handleGenerateHybrid = () => {
  if (!favoriteNumber.value) {
    $q.notify({
      type: 'warning',
      message: 'Please enter your favorite number',
      position: 'top',
    });
    return;
  }

  const lottery = selectedLottery.value;
  if (!lottery) return;

  try {
    const set = generateHybridSuggestion(
      favoriteNumber.value,
      zodiacData.value,
      appStore.draws,
      lottery
    );
    hybridSet.value = set;

    $q.notify({
      type: 'positive',
      message: `Generated companion numbers for ${favoriteNumber.value}!`,
      position: 'top',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to generate companions',
      position: 'top',
    });
  }
};

const copyHybridSet = () => {
  if (hybridSet.value) {
    copySet(hybridSet.value);
  }
};

const shareHybridSet = () => {
  if (hybridSet.value) {
    shareSet(hybridSet.value);
  }
};

const handleGenerateAll = async () => {
  if (!zodiacData.value) {
    $q.notify({
      type: 'warning',
      message: 'Please complete your profile first',
      position: 'top',
    });
    goToZodiac();
    return;
  }

  try {
    const lottery = selectedLottery.value;

    if (!lottery) {
      $q.notify({
        type: 'warning',
        message: 'Please select a lottery type',
        position: 'top',
      });
      return;
    }

    const zodiacForGenerator = {
      sign: zodiacData.value.zodiac,
      element: zodiacData.value.element,
      luckyNumbers: zodiacData.value.luckyNumbers,
      auspiciousMonths: zodiacData.value.auspiciousMonths,
      fengShuiTips: [],
      manifestationGuidance: zodiacData.value.manifestationGuidance,
      trineFamily: zodiacData.value.trine,
      characteristics: zodiacData.value.characteristics,
      compatibility: zodiacData.value.compatibility,
      clashingSign: '',
      clashingLuckyNumbers: [],
      clashDescription: '',
    };

    const sets = await generateAllMethods(zodiacForGenerator, appStore.draws, lottery, zodiacData.value);

    const mandelSet = generateMandelMethodSet(appStore.draws, lottery);
    const chaosSet = generateChaosTheorySet(appStore.draws, lottery);
    const fanoSet = generateFanoPlaneSet(appStore.draws, lottery);

    generatedSets.value = [mandelSet, chaosSet, fanoSet, ...sets];

    undrawnNumbers.value = getUndrawnNumbers(appStore.draws, lottery);

    $q.notify({
      type: 'positive',
      message: 'Generated ' + generatedSets.value.length + ' personalized number sets!',
      position: 'top',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to generate numbers',
      position: 'top',
    });
  }
};

const getMethodIcon = (method: string): string => {
  const icons: Record<string, string> = {
    mandel: 'functions',
    chaos: 'scatter_plot',
    fano: 'hexagon',
    hybrid: 'psychology',
    zodiac: 'star',
    elemental: 'local_fire_department',
    year_alignment: 'calendar_today',
    pattern: 'analytics',
    auspicious: 'event_available',
    frequency: 'trending_up',
    last_year: 'history',
    preference: 'tune',
    best: 'emoji_events',
  };
  return icons[method] || 'help';
};

const getMethodClass = (method: string): string => {
  const classes: Record<string, string> = {
    mandel: 'method-mandel',
    chaos: 'method-chaos',
    fano: 'method-fano',
    hybrid: 'method-hybrid',
    zodiac: 'method-zodiac',
    elemental: 'method-elemental',
    year_alignment: 'method-year-alignment',
    pattern: 'method-pattern',
    auspicious: 'method-auspicious',
    frequency: 'method-frequency',
    last_year: 'method-last-year',
    preference: 'method-preference',
    best: 'method-best',
  };
  return classes[method] || '';
};

const copySet = (set: GeneratedSet) => {
  const numbers = set.mainNumbers.map(n => n.number).join(', ');
  const bonus = set.bonusNumber ? ' + ' + set.bonusNumber.number : '';
  const text = set.title + ': ' + numbers + bonus;

  navigator.clipboard.writeText(text).then(() => {
    $q.notify({
      type: 'positive',
      message: 'Numbers copied to clipboard!',
      position: 'top',
    });
  });
};

const shareSet = (set: GeneratedSet) => {
  const numbers = set.mainNumbers.map(n => n.number).join(', ');
  const bonus = set.bonusNumber ? ' + ' + set.bonusNumber.number : '';
  const text = 'Lotto Oracle - ' + set.title + '\\n' +
    numbers + bonus + '\\n' +
    set.description;

  if (navigator.share) {
    navigator.share({
      title: set.title,
      text: text,
    }).catch(() => {
      copySet(set);
    });
  } else {
    copySet(set);
  }
};

onMounted(() => {
  profileStore.loadFromStorage();

  if (allGeneratedSets.value.length > 0) {
    generatedSets.value = allGeneratedSets.value;
  }
});
</script>
<style scoped>
.page-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 16px;
}

.zodiac-summary-card {
  border: 2px solid #667eea;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.summary-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.summary-subtext {
  font-size: 10px;
  color: #666;
  margin-top: 2px;
}

.clash-item {
  position: relative;
}

.clash-divider {
  width: 60%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(244, 67, 54, 0.3), transparent);
  margin: 12px auto;
}

.clash-symbols {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px 0;
}

.clash-detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.connector {
  flex-shrink: 0;
}

.clashing-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 16px 0;
}

.clashing-number {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f44336 0%, #c62828 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.outlook-card {
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.outlook-card.outlook-favorable {
  border-left-color: #4caf50;
  background: linear-gradient(to right, rgba(76, 175, 80, 0.05), transparent);
}

.outlook-card.outlook-neutral {
  border-left-color: #607d8b;
  background: linear-gradient(to right, rgba(96, 125, 139, 0.05), transparent);
}

.outlook-card.outlook-clash {
  border-left-color: #f44336;
  background: linear-gradient(to right, rgba(244, 67, 54, 0.05), transparent);
}

.outlook-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.outlook-icon-container {
  flex-shrink: 0;
}

.outlook-content {
  flex: 1;
}

.outlook-message {
  line-height: 1.6;
  color: #424242;
}

.method-card {
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.method-header {
  padding: 16px;
}

.method-hybrid {
  background: linear-gradient(135deg, #f953c6 0%, #b91d73 100%);
}

.method-zodiac {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.method-auspicious {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.method-frequency {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.method-last-year {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.method-preference {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.method-best {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
}

.method-elemental {
  background: linear-gradient(135deg, #ff6a00 0%, #ee0979 100%);
}

.method-year-alignment {
  background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%);
}

.method-pattern {
  background: linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%);
}

.method-mandel {
  background: linear-gradient(135deg, #ff7b00 0%, #d62828 100%);
}

.method-chaos {
  background: linear-gradient(135deg, #3a0ca3 0%, #7209b7 100%);
}

.method-fano {
  background: linear-gradient(135deg, #06ffa5 0%, #009e60 100%);
}

.numbers-horizontal {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.number-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 120px;
}

.number-ball {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  color: white;
  margin-bottom: 8px;
}

.number-ball.bonus {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  border: 3px solid #fff;
}

.number-reason {
  font-size: 10px;
  line-height: 1.2;
  max-width: 120px;
}

.hybrid-section-card {
  border: 3px solid #f953c6;
  box-shadow: 0 4px 20px rgba(249, 83, 198, 0.15);
}

.bg-gradient-hybrid {
  background: linear-gradient(135deg, #f953c6 0%, #b91d73 100%);
}

.number-with-explanation {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.number-explanation {
  font-size: 11px;
  color: #666;
  text-align: center;
  margin-top: 8px;
  max-width: 140px;
  line-height: 1.3;
}

.bonus-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px dashed #ddd;
}

.bonus-number-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bonus-ball {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  border: 3px solid #fff;
}

.bonus-section {
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  margin-top: 8px;
}

.bonus-container {
  display: flex;
  justify-content: center;
}

.undrawn-card {
  border: 2px solid #424242;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.undrawn-numbers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 8px;
  padding: 8px 0;
}

.undrawn-number {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  background: linear-gradient(135deg, #757575 0%, #424242 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.undrawn-number:hover {
  transform: scale(1.1);
}

@media (max-width: 600px) {
  .outlook-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
