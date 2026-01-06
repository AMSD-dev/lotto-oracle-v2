<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-mb-xs">Zodiac Insights</h1>
      <p class="text-body2 text-grey-7">
        Discover your Chinese Zodiac sign, element, and harmonious pairings
      </p>
    </div>

    <q-banner v-if="!hasProfile" class="bg-orange-2 q-mb-md" dense>
      <template v-slot:avatar>
        <q-icon name="info" color="orange-8" />
      </template>
      <div class="text-body2">
        Complete your User Profile to save your zodiac insights permanently
      </div>
      <template v-slot:action>
        <q-btn flat color="orange-8" label="Go to Profile" icon="account_circle" @click="goToProfile" />
      </template>
    </q-banner>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          {{ hasProfile ? 'Your Birth Date' : 'Enter a Birth Date' }}
        </div>

        <div v-if="hasProfile" class="q-mb-md">
          <q-banner class="bg-blue-1" dense>
            <template v-slot:avatar>
              <q-icon name="account_circle" color="primary" />
            </template>
            <div class="text-caption">
              Showing insights from your profile. Change the date below to explore other zodiac signs.
            </div>
          </q-banner>
        </div>

        <div v-if="zodiacData" class="q-mb-md">
          <q-btn unelevated color="primary" icon="casino" label="Generate Lucky Numbers" class="full-width" size="lg"
            @click="goToGenerator" />
        </div>

        <div class="row q-mb-sm">
          <div class="col">
            <q-btn flat dense color="primary" icon="today" label="Today" @click="goToToday" />
          </div>
        </div>

        <q-date v-model="selectedDate" mask="YYYY-MM-DD" :options="dateOptions" class="full-width"
          @update:model-value="handleDateChange" />
      </q-card-section>
    </q-card>

    <div v-if="zodiacData">
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
              Consider playing the lottery today!
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

      <q-card flat bordered class="q-mb-md zodiac-card">
        <q-card-section class="bg-gradient text-white">
          <div class="text-center">
            <q-icon name="star" size="64px" />
            <h2 class="text-h3 text-weight-bold q-mt-md q-mb-sm">
              {{ zodiacData.sign }}
            </h2>
            <div class="text-h6">{{ zodiacData.element }} Element</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h6 q-mb-md">Key Characteristics</div>
          <div class="characteristics-grid">
            <q-chip v-for="trait in zodiacData.characteristics" :key="trait" color="primary" text-color="white"
              icon="star">
              {{ trait }}
            </q-chip>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="favorite" color="pink" size="md" class="q-mr-sm" />
            Trine Family Compatibility
          </div>

          <q-banner class="bg-pink-1 q-mb-md">
            <div class="text-body1 text-weight-medium q-mb-sm">
              Your Harmonious Signs:
              <span class="text-primary text-weight-bold">
                {{ zodiacData.trineFamily.join(' & ') }}
              </span>
            </div>
            <div class="text-body2 text-grey-8">
              {{ zodiacData.compatibility }}
            </div>
          </q-banner>

          <div class="trine-symbols">
            <div class="trine-item">
              <q-avatar size="60px" color="primary" text-color="white" class="q-mb-sm">
                <q-icon name="star" size="32px" />
              </q-avatar>
              <div class="text-weight-bold">{{ zodiacData.sign }}</div>
              <div class="text-caption text-grey-7">Your Sign</div>
            </div>

            <q-icon name="favorite" color="pink" size="24px" class="connector" />

            <div class="trine-item" v-for="compatible in zodiacData.trineFamily" :key="compatible">
              <q-avatar size="60px" color="pink" text-color="white" class="q-mb-sm">
                <q-icon name="pets" size="32px" />
              </q-avatar>
              <div class="text-weight-bold">{{ compatible }}</div>
              <div class="text-caption text-grey-7">Compatible</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="warning" color="red" size="md" class="q-mr-sm" />
            Clashing Sign
          </div>

          <q-banner class="bg-red-1 q-mb-md">
            <div class="text-body1 text-weight-medium q-mb-sm">
              Your Opposite Sign:
              <span class="text-red text-weight-bold">
                {{ zodiacData.clashingSign }}
              </span>
            </div>
            <div class="text-body2 text-grey-8">
              {{ zodiacData.clashDescription }}
            </div>
          </q-banner>

          <div class="clash-symbols">
            <div class="clash-item">
              <q-avatar size="60px" color="primary" text-color="white" class="q-mb-sm">
                <q-icon name="star" size="32px" />
              </q-avatar>
              <div class="text-weight-bold">{{ zodiacData.sign }}</div>
              <div class="text-caption text-grey-7">Your Sign</div>
            </div>

            <q-icon name="close" color="red" size="24px" class="connector" />

            <div class="clash-item">
              <q-avatar size="60px" color="red" text-color="white" class="q-mb-sm">
                <q-icon name="warning" size="32px" />
              </q-avatar>
              <div class="text-weight-bold">{{ zodiacData.clashingSign }}</div>
              <div class="text-caption text-grey-7">Opposite</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="casino" color="amber" size="md" class="q-mr-sm" />
            Lucky Numbers
          </div>

          <div class="lucky-numbers">
            <div v-for="num in zodiacData.luckyNumbers" :key="num" class="lucky-number">
              {{ num }}
            </div>
          </div>

          <q-banner class="bg-amber-1 q-mt-md">
            <template v-slot:avatar>
              <q-icon name="lightbulb" color="amber-8" />
            </template>
            <div class="text-caption">
              Use these lucky numbers when playing the lottery or making important decisions
            </div>
          </q-banner>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="block" color="red" size="md" class="q-mr-sm" />
            {{ zodiacData.clashingSign }}'s Lucky Numbers
          </div>

          <q-banner class="bg-red-1 q-mb-md">
            <template v-slot:avatar>
              <q-icon name="info" color="red-8" />
            </template>
            <div class="text-caption">
              These are the lucky numbers for {{ zodiacData.clashingSign }}, your clashing sign. Some practitioners
              suggest
              being cautious with these numbers or using them strategically to balance opposing energies.
            </div>
          </q-banner>

          <div class="clashing-numbers">
            <div v-for="num in zodiacData.clashingLuckyNumbers" :key="num" class="clashing-number">
              {{ num }}
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="event" color="green" size="md" class="q-mr-sm" />
            Auspicious Months
          </div>

          <div class="months-grid">
            <q-chip v-for="month in zodiacData.auspiciousMonths" :key="month" color="green" text-color="white"
              icon="event" size="md">
              {{ month }}
            </q-chip>
          </div>

          <q-banner class="bg-green-1 q-mt-md">
            <template v-slot:avatar>
              <q-icon name="info" color="green-8" />
            </template>
            <div class="text-caption">
              These months carry especially favorable energy for you
            </div>
          </q-banner>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="home" color="deep-purple" size="md" class="q-mr-sm" />
            Feng Shui Tips
          </div>

          <q-list separator>
            <q-item v-for="(tip, index) in zodiacData.fengShuiTips" :key="index">
              <q-item-section avatar>
                <q-avatar color="deep-purple" text-color="white" size="32px">
                  {{ index + 1 }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ tip }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="manifestation-card">
        <q-card-section class="bg-deep-purple-1">
          <div class="text-h6 q-mb-md">
            <q-icon name="psychology" color="deep-purple" size="md" class="q-mr-sm" />
            Manifestation & Mindset Guidance
          </div>

          <div class="manifestation-content">
            <p class="text-body1 text-center q-px-md">
              {{ zodiacData.manifestationGuidance }}
            </p>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-center">
            <q-btn flat color="deep-purple" icon="share" label="Share Your Insights" @click="shareInsights" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-else class="text-center q-pa-xl">
      <q-icon name="calendar_today" size="64px" color="grey-5" />
      <p class="text-h6 text-grey-7 q-mt-md">
        Select your birth date to see your zodiac insights
      </p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useZodiac } from '../composables/useZodiac';
import { useUserProfileStore } from '../stores/userProfile';

const $q = useQuasar();
const router = useRouter();
const profileStore = useUserProfileStore();
const { birthDate, zodiacResult, getTodayOutlook } = useZodiac();

const selectedDate = ref('');

const hasProfile = computed(() => profileStore.hasProfile);
const userProfile = computed(() => profileStore.getFullProfile);

const dateOptions = (date: string) => {
  const year = parseInt(date.split('/')[0]);
  return year >= 1900 && year <= 2031;
};

const handleDateChange = (value: string) => {
  if (value) {
    const date = new Date(value);
    birthDate.value = date;
  }
};

const zodiacData = computed(() => {
  return zodiacResult.value;
});

const todayOutlook = computed(() => {
  return getTodayOutlook(zodiacData.value);
});

const shareInsights = () => {
  if (!zodiacData.value) return;

  const text = `My Chinese Zodiac: ${zodiacData.value.sign} (${zodiacData.value.element} Element)
Compatible with: ${zodiacData.value.trineFamily.join(' & ')}
Lucky Numbers: ${zodiacData.value.luckyNumbers.join(', ')}

${zodiacData.value.manifestationGuidance}`;

  if (navigator.share) {
    navigator.share({
      title: 'My Zodiac Insights',
      text: text,
    }).catch(() => {
      copyToClipboard(text);
    });
  } else {
    copyToClipboard(text);
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    $q.notify({
      type: 'positive',
      message: 'Insights copied to clipboard!',
      position: 'top',
    });
  });
};

const goToGenerator = () => {
  router.push({ name: 'generate' });
};

const goToProfile = () => {
  router.push({ name: 'profile' });
};

const goToToday = () => {
  const today = new Date();
  selectedDate.value = today.toISOString().split('T')[0];
  birthDate.value = today;
};

onMounted(() => {
  profileStore.loadFromStorage();

  if (hasProfile.value && userProfile.value) {
    const profileBirthdate = userProfile.value.birthdate;
    if (profileBirthdate) {
      const date = new Date(profileBirthdate);
      selectedDate.value = date.toISOString().split('T')[0];
      birthDate.value = date;
    }
  }
});
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 16px;
}

.zodiac-card {
  overflow: hidden;
}

.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.characteristics-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trine-symbols {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px 0;
}

.trine-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.connector {
  margin: 0 8px;
}

.clash-symbols {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px 0;
}

.clash-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.lucky-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 16px 0;
}

.lucky-number {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(255, 170, 0, 0.3);
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

.months-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.manifestation-content {
  position: relative;
  padding: 32px 16px;
}

.quote-icon {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.3;
}

.manifestation-card {
  border: 2px solid #673ab7;
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

@media (max-width: 600px) {
  .trine-symbols {
    flex-direction: column;
  }

  .clash-symbols {
    flex-direction: column;
  }

  .connector {
    transform: rotate(90deg);
    margin: 8px 0;
  }

  .outlook-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
