<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-mb-xs">User Profile</h1>
      <p class="text-body2 text-grey-7">
        Complete your profile for personalized lucky number generation
      </p>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Personal Information</div>

        <q-form @submit="handleSubmit" class="q-gutter-md">
          <q-input
            v-model="formData.name"
            outlined
            label="Full Name *"
            hint="Enter your complete name for numerology calculation"
            lazy-rules
            :rules="[val => !!val || 'Name is required']"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="formData.birthdate"
            outlined
            label="Date of Birth *"
            type="date"
            hint="Required for zodiac and life path calculation"
            lazy-rules
            :rules="[val => !!val || 'Birthdate is required']"
          >
            <template v-slot:prepend>
              <q-icon name="cake" />
            </template>
          </q-input>

          <q-input
            v-model="formData.timeOfBirth"
            outlined
            label="Time of Birth (Optional)"
            hint="For more accurate astrological readings"
            type="time"
          >
            <template v-slot:prepend>
              <q-icon name="schedule" />
            </template>
          </q-input>

          <q-select
            v-model="formData.gender"
            outlined
            :options="genderOptions"
            label="Gender (Optional)"
            hint="Optional for enhanced personalization"
          >
            <template v-slot:prepend>
              <q-icon name="wc" />
            </template>
          </q-select>

          <div class="row q-gutter-sm q-mt-md">
            <q-btn
              unelevated
              color="primary"
              label="Save Profile"
              type="submit"
              icon="save"
              size="lg"
              :loading="isCalculating"
            />

            <q-btn
              v-if="profileStore.hasProfile"
              flat
              color="negative"
              label="Clear Profile"
              icon="delete"
              @click="confirmClear"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <div v-if="profileStore.hasProfile && calculatedProfile">
      <q-card flat bordered class="profile-summary-card q-mb-md">
        <q-card-section class="bg-primary text-white">
          <div class="spiritual-profile-header">
            <div class="text-h5 text-weight-bold">
              <q-icon name="star" size="md" class="q-mr-sm" />
              {{ calculatedProfile.name }}'s Spiritual Profile
            </div>
            <q-btn
              flat
              round
              dense
              icon="info"
              color="white"
              size="md"
              @click="goToZodiac"
            >
              <q-tooltip>View Full Zodiac Insights</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="profile-grid">
            <div class="profile-item">
              <q-icon name="pets" size="40px" color="amber" />
              <div class="profile-label">Chinese Zodiac</div>
              <div class="profile-value">{{ calculatedProfile.zodiac }}</div>
              <div class="profile-subtext">{{ calculatedProfile.element }} Element</div>
              <q-chip dense size="sm" :label="calculatedProfile.yinYang" />
            </div>

            <div class="profile-item">
              <q-icon name="numbers" size="40px" color="blue" />
              <div class="profile-label">Life Path Number</div>
              <div class="profile-value">{{ calculatedProfile.lifePathNumber }}</div>
              <div class="profile-subtext">{{ getLifePathMeaning() }}</div>
            </div>

            <div class="profile-item">
              <q-icon name="psychology" size="40px" color="purple" />
              <div class="profile-label">Expression Number</div>
              <div class="profile-value">{{ calculatedProfile.expressionNumber }}</div>
              <div class="profile-subtext">{{ getExpressionMeaning() }}</div>
            </div>

            <div class="profile-item">
              <q-icon name="favorite" size="40px" color="pink" />
              <div class="profile-label">Trine Family</div>
              <div class="profile-value">{{ calculatedProfile.trine.join(' & ') }}</div>
              <div class="profile-subtext">Compatible signs</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="casino" color="green" size="md" class="q-mr-sm" />
            Your Lucky Numbers
          </div>

          <div class="lucky-numbers-display">
            <div
              v-for="(num, idx) in calculatedProfile.luckyNumbers"
              :key="idx"
              class="lucky-number-ball"
            >
              {{ num }}
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="event_available" color="blue" size="md" class="q-mr-sm" />
            Auspicious Months
          </div>

          <div class="months-display">
            <q-chip
              v-for="month in calculatedProfile.auspiciousMonths"
              :key="month"
              color="blue-2"
              text-color="blue-9"
              icon="event"
            >
              {{ month }}
            </q-chip>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="auto_awesome" color="amber" size="md" class="q-mr-sm" />
            Manifestation Guidance
          </div>

          <q-banner class="bg-amber-1">
            <template v-slot:avatar>
              <q-icon name="lightbulb" color="amber" />
            </template>
            {{ calculatedProfile.manifestationGuidance }}
          </q-banner>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">Key Characteristics</div>

          <div class="characteristics-grid">
            <q-chip
              v-for="trait in calculatedProfile.characteristics"
              :key="trait"
              color="primary"
              text-color="white"
              icon="star"
            >
              {{ trait }}
            </q-chip>
          </div>
        </q-card-section>
      </q-card>

      <div class="text-center q-mt-lg">
        <q-btn
          unelevated
          color="primary"
          label="Generate Lucky Numbers"
          icon="casino"
          size="lg"
          @click="goToGenerator"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useUserProfileStore, type UserProfile } from '../stores/userProfile';
import { useZodiac } from '../composables/useZodiac';
import { useNumerology } from '../composables/useNumerology';

const $q = useQuasar();
const router = useRouter();
const profileStore = useUserProfileStore();
const { calculateZodiacInsights } = useZodiac();
const {
  calculateLifePathNumber,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  getNumerologyLuckyNumbers,
  getNumerologyMeaning,
} = useNumerology();

const formData = ref({
  name: '',
  birthdate: '',
  timeOfBirth: '',
  gender: '',
});

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const isCalculating = ref(false);

const calculatedProfile = computed(() => profileStore.getFullProfile);

const getLifePathMeaning = () => {
  if (!calculatedProfile.value) return '';
  return getNumerologyMeaning(calculatedProfile.value.lifePathNumber);
};

const getExpressionMeaning = () => {
  if (!calculatedProfile.value) return '';
  return getNumerologyMeaning(calculatedProfile.value.expressionNumber);
};

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.birthdate) {
    $q.notify({
      type: 'warning',
      message: 'Please fill in all required fields',
      position: 'top',
    });
    return;
  }

  isCalculating.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const birthDate = new Date(formData.value.birthdate);
    const zodiacData = calculateZodiacInsights(birthDate, false);

    if (!zodiacData) {
      throw new Error('Failed to calculate zodiac data');
    }

    const lifePathNumber = calculateLifePathNumber(formData.value.birthdate);
    const expressionNumber = calculateExpressionNumber(formData.value.name);
    const soulUrgeNumber = calculateSoulUrgeNumber(formData.value.name);

    const numerologyLuckyNumbers = getNumerologyLuckyNumbers(
      lifePathNumber,
      expressionNumber,
      soulUrgeNumber
    );

    const combinedLuckyNumbers = Array.from(
      new Set([...zodiacData.luckyNumbers, ...numerologyLuckyNumbers])
    )
      .sort((a, b) => a - b)
      .slice(0, 15);

    const profile: UserProfile = {
      name: formData.value.name,
      birthdate: formData.value.birthdate,
      timeOfBirth: formData.value.timeOfBirth,
      gender: formData.value.gender,
      zodiac: zodiacData.sign,
      element: zodiacData.element,
      yinYang: getYinYang(zodiacData.sign),
      trine: zodiacData.trineFamily,
      auspiciousMonths: zodiacData.auspiciousMonths,
      characteristics: zodiacData.characteristics,
      lifePathNumber,
      expressionNumber,
      soulUrgeNumber,
      luckyNumbers: combinedLuckyNumbers,
      manifestationGuidance: zodiacData.manifestationGuidance,
      compatibility: zodiacData.compatibility,
    };

    profileStore.setProfile(profile);

    $q.notify({
      type: 'positive',
      message: 'Profile saved successfully!',
      position: 'top',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to save profile',
      position: 'top',
    });
  } finally {
    isCalculating.value = false;
  }
};

const getYinYang = (zodiacSign: string): string => {
  const yangSigns = ['Rat', 'Tiger', 'Dragon', 'Horse', 'Monkey', 'Dog'];
  return yangSigns.includes(zodiacSign) ? 'Yang' : 'Yin';
};

const confirmClear = () => {
  $q.dialog({
    title: 'Clear Profile',
    message: 'Are you sure you want to delete your profile? This cannot be undone.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    profileStore.clearProfile();
    formData.value = {
      name: '',
      birthdate: '',
      timeOfBirth: '',
      gender: '',
    };

    $q.notify({
      type: 'info',
      message: 'Profile cleared',
      position: 'top',
    });
  });
};

const goToGenerator = () => {
  router.push({ name: 'generate' });
};

const goToZodiac = () => {
  router.push({ name: 'zodiac' });
};

onMounted(() => {
  profileStore.loadFromStorage();

  if (profileStore.hasProfile && profileStore.profile) {
    formData.value.name = profileStore.profile.name;
    formData.value.birthdate = profileStore.profile.birthdate;
    formData.value.timeOfBirth = profileStore.profile.timeOfBirth || '';
    formData.value.gender = profileStore.profile.gender || '';
  }
});
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 16px;
}

.profile-summary-card {
  border: 2px solid #1976d2;
}

.spiritual-profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.profile-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.profile-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 4px;
}

.profile-value {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.profile-subtext {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.lucky-numbers-display {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.lucky-number-ball {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.months-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.characteristics-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
