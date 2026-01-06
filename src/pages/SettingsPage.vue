<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <h1 class="text-h4 text-weight-bold">Settings</h1>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Subscription</div>

        <div v-if="appStore.isSubscribed" class="subscription-info">
          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" color="positive" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Active Subscription</q-item-label>
              <q-item-label caption>
                {{ appStore.daysRemaining }} days remaining
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <div class="subscription-details q-px-md">
            <div class="detail-row">
              <span class="detail-label">Purchase Date:</span>
              <span class="detail-value">{{ formatDate(appStore.subscription.purchaseDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Expiry Date:</span>
              <span class="detail-value">{{ formatDate(appStore.subscription.expiryDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Transaction ID:</span>
              <span class="detail-value mono">{{ appStore.subscription.transactionId }}</span>
            </div>
          </div>
        </div>

        <div v-else class="text-center q-pa-md">
          <q-icon name="info" size="48px" color="grey-5" />
          <p class="text-grey-7 q-mt-md">No active subscription</p>
        </div>
      </q-card-section>

      <!-- <q-separator />

      <q-card-actions class="q-pa-md">
        <q-btn flat no-caps color="primary" icon="restore" label="Restore Purchase" :loading="isRestoring"
          @click="handleRestore" class="full-width" />
      </q-card-actions> -->
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Draw Data</div>

        <q-item>
          <q-item-section avatar>
            <q-icon name="dataset" color="blue" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">
              {{ appStore.draws.length }} draws loaded
            </q-item-label>
            <q-item-label caption v-if="lastUpdate">
              Last updated: {{ formatDate(lastUpdate) }}
            </q-item-label>
            <q-item-label caption v-else>
              Updated December 12, 2025
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <!--   <q-separator />

    <q-card-actions class="q-pa-md">
        <q-btn
          flat
          no-caps
          color="primary"
          icon="sync"
          label="Update Draw Data"
          :loading="isUpdating"
          :disable="!appStore.isSubscribed"
          @click="handleUpdate"
          class="full-width"
        />
      </q-card-actions> -->

      <q-card-section v-if="!appStore.isSubscribed" class="q-pt-none">
        <q-banner dense class="bg-warning text-white">
          <template v-slot:avatar>
            <q-icon name="lock" />
          </template>
          Subscribe to update draw data
        </q-banner>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="notifications" color="orange" size="md" class="q-mr-sm" />
          Notifications
        </div>

        <q-toggle v-model="notificationSettings.enabled" label="Enable Notifications for next draw dates"
          color="primary" @update:model-value="handleNotificationToggle" class="q-mb-md" />

        <div v-if="notificationSettings.enabled" class="notification-options">
          <q-toggle v-model="notificationSettings.luckyDays" label="Lucky Days Reminders" color="primary"
            @update:model-value="saveNotificationSettings" class="q-mb-sm" />

          <q-toggle v-model="notificationSettings.drawReminders" label="Draw Reminders" color="primary"
            @update:model-value="saveNotificationSettings" class="q-mb-sm" />

          <q-toggle v-model="notificationSettings.manifestationTips" label="Manifestation Tips" color="primary"
            @update:model-value="saveNotificationSettings" />
        </div>

        <q-banner v-if="!notificationSupported" class="bg-warning text-white q-mt-md">
          <template v-slot:avatar>
            <q-icon name="warning" />
          </template>
          Notifications are not supported on this device
        </q-banner>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">About</div>

        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>Version</q-item-label>
              <q-item-label caption>1.0.0</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>App Name</q-item-label>
              <q-item-label caption>Lotto Oracle</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Storage</q-item-label>
              <q-item-label caption>100% Offline</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAppStore } from '../stores/app';
import { usePayment } from '../composables/usePayment';
import { useDraws } from '../composables/useDraws';
import { useNotifications } from '../composables/useNotifications';

const $q = useQuasar();
const appStore = useAppStore();
const { restorePurchases } = usePayment();
const { updateDrawData, getLastUpdateTime } = useDraws();
const { checkSupport, getSettings, updateSettings, requestPermission } = useNotifications();

const isRestoring = ref(false);
const isUpdating = ref(false);
const notificationSupported = ref(false);
const notificationSettings = ref(getSettings());

const lastUpdate = computed(() => getLastUpdateTime());

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A';

  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const handleRestore = async () => {
  isRestoring.value = true;

  try {
    const success = await restorePurchases();

    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Purchase restored successfully!',
        position: 'top',
      });

      appStore.refreshSubscriptionStatus();
      await appStore.initializeApp();
    } else {
      $q.notify({
        type: 'warning',
        message: 'No previous purchases found.',
        position: 'top',
      });
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'An error occurred during restore.',
      position: 'top',
    });
  } finally {
    isRestoring.value = false;
  }
};

const handleUpdate = async () => {
  isUpdating.value = true;

  try {
    const success = await updateDrawData();

    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Draw data updated successfully!',
        position: 'top',
      });

      appStore.refreshDraws();
    } else {
      $q.notify({
        type: 'negative',
        message: 'Failed to update draw data. Using cached data.',
        position: 'top',
      });
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'An error occurred during update.',
      position: 'top',
    });
  } finally {
    isUpdating.value = false;
  }
};

const handleNotificationToggle = async (enabled: boolean) => {
  if (enabled) {
    const granted = await requestPermission();
    if (!granted) {
      notificationSettings.value.enabled = false;
      $q.notify({
        type: 'warning',
        message: 'Notification permission denied',
        position: 'top',
      });
      return;
    }
  }

  saveNotificationSettings();

  $q.notify({
    type: 'info',
    message: enabled ? 'Notifications enabled' : 'Notifications disabled',
    position: 'top',
  });
};

const saveNotificationSettings = () => {
  updateSettings(notificationSettings.value);
};

onMounted(() => {
  notificationSupported.value = checkSupport();
  notificationSettings.value = getSettings();
});
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 16px;
}

.subscription-details {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.detail-row:not(:last-child) {
  border-bottom: 1px solid #e0e0e0;
}

.detail-label {
  font-weight: 500;
  color: #666;
}

.detail-value {
  font-weight: 600;
  color: #333;
}

.mono {
  font-family: monospace;
  font-size: 12px;
}
</style>
