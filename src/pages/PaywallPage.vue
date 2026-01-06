<template>
  <q-page class="flex flex-center bg-gradient">
    <div class="paywall-container">
      <div class="text-center q-mb-xl">
        <q-icon name="stars" size="80px" color="amber" />
        <h1 class="text-h3 text-weight-bold q-mt-md q-mb-sm">Lotto Oracle</h1>
        <p class="text-subtitle1 text-grey-7">Unlock lottery insights and analysis</p>
      </div>

      <q-card class="subscription-card">
        <q-card-section>
          <div class="text-center">
            <div class="price-tag">
              <span class="currency">CAD</span>
              <span class="amount">1.49</span>
              <span class="period">/year</span>
            </div>
            <p class="text-body2 text-grey-7 q-mt-sm">Billed annually</p>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-list>
            <q-item v-for="(feature, index) in features" :key="index">
              <q-item-section avatar>
                <q-icon name="check_circle" color="positive" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ feature }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions class="q-pa-md">
          <q-btn unelevated rounded no-caps class="full-width subscribe-btn" color="primary" label="Subscribe Now"
            size="lg" :loading="isProcessing" @click="handlePurchase" />
        </q-card-actions>
      </q-card>

      <div class="text-center q-mt-md">
        <p class="text-caption text-grey-6">
          Payment will be charged through your App Store or Google Play account.
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useBilling } from '../composables/useBilling';

const $q = useQuasar();

const { subscribe } = useBilling();

const isProcessing = ref(false);

const features = [
  'Full access to lottery draw history',
  'Real-time draw updates',
  'Statistical analysis and insights',
  'Number frequency tracking',
  'Offline access to all features',
  'Ad-free experience',
];

const handlePurchase = async () => {
  if (isProcessing.value) return;

  isProcessing.value = true;

  try {
    await subscribe();


    $q.notify({
      type: 'positive',
      message: 'Subscription activated successfully!',
      position: 'top',
    });


  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Purchase error. Please try again.',
      position: 'top',
    });
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.paywall-container {
  max-width: 500px;
  width: 100%;
  padding: 24px;
}

.subscription-card {
  border-radius: 16px;
}

.price-tag {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 16px 0;
}

.currency {
  font-size: 32px;
  font-weight: 600;
  margin-top: 8px;
}

.amount {
  font-size: 72px;
  font-weight: 700;
  line-height: 1;
}

.period {
  font-size: 18px;
  color: #666;
  margin-top: 16px;
  margin-left: 4px;
}

.subscribe-btn {
  font-weight: 600;
  padding: 12px 0;
}
</style>
