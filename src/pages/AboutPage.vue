<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <h1 class="text-h4 text-weight-bold">About Lotto Oracle</h1>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Full Description</div>
        <p class="text-body1 q-mb-md">
          Generate fully random numbers with a clean, simple interface.
          This app does not predict lottery results and is not affiliated with any lottery corporation.
          It simply provides random number combinations for entertainment and personal use.
        </p>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Features</div>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Quickly generate random numbers for any range</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Save your favorite picks locally on your device</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Generate multiple sets at once</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Clean, ad-free, easy to use</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Optional notifications for locally stored reminders</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>No accounts, no tracking, no online data collection</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Privacy First</div>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="verified_user" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>No personal data collected</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="verified_user" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>No accounts required</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="verified_user" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>No internet communication</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="verified_user" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>All data stays on your device</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="verified_user" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Notification permission is optional and only used for reminders you create</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Important Note</div>
        <q-banner class="bg-warning text-white">
          <template v-slot:avatar>
            <q-icon name="warning" />
          </template>
          This app does not guarantee winning results. Lottery outcomes are random and unpredictable.
        </q-banner>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h5 q-mb-md text-weight-bold">Privacy Policy for Lotto Oracle</div>
        <p class="text-caption q-mb-lg">Last updated: January 4, 2026</p>

        <div class="policy-section">
          <h6 class="text-h6 q-mb-sm">1. Introduction</h6>
          <p class="text-body2 q-mb-md">
            Lotto Oracle is a simple random number generator designed for entertainment.
            We respect your privacy and do not collect or share any personal information.
          </p>
        </div>

        <div class="policy-section">
          <h6 class="text-h6 q-mb-sm">2. Data Collection</h6>
          <p class="text-body2 q-mb-sm">
            We do not collect, store, transmit, or share any personal data.
          </p>
          <p class="text-body2 q-mb-sm">Specific details:</p>
          <ul class="q-pl-md q-mb-md">
            <li>We do not collect names, emails, identifiers, or device information.</li>
            <li>We do not use analytics tools.</li>
            <li>We do not use third-party advertising.</li>
            <li>We do not transmit any data off your device.</li>
          </ul>
        </div>

        <div class="policy-section">
          <h6 class="text-h6 q-mb-sm">3. Local Storage</h6>
          <p class="text-body2 q-mb-md">
            All user-created data (saved number sets, preferences, reminders) is stored locally on your device only.
            We have no access to it.
          </p>
        </div>

        <div class="policy-section">
          <h6 class="text-h6 q-mb-sm">4. Permissions</h6>
          <p class="text-body2 q-mb-sm">
            The app may request the following optional permission:
          </p>
          <p class="text-body2 q-mb-sm text-weight-bold">POST_NOTIFICATIONS (Optional)</p>
          <ul class="q-pl-md q-mb-md">
            <li>Used only to send local notifications that remind you of number sets or features you saved on your
              device.
            </li>
            <li>No data is sent to any server.</li>
          </ul>
        </div>

        <div class="policy-section">
          <h6 class="text-h6 q-mb-sm">5. No External Connections</h6>
          <p class="text-body2 q-mb-md">
            The app does not access the internet or transmit any data.
            All functionality is fully offline.
          </p>
        </div>

        <div class="policy-section">
          <h6 class="text-h6 q-mb-sm">6. Children's Privacy</h6>
          <p class="text-body2 q-mb-md">
            This app is intended for users 18 years and older due to its lotto-themed content.
          </p>
        </div>

        <div class="policy-section">
          <h6 class="text-h6 q-mb-sm">7. Changes to This Policy</h6>
          <p class="text-body2 q-mb-md">
            We may update this policy if needed. The latest version will always be available in the app and on the store
            listing.
          </p>
        </div>

        <div class="policy-section">
          <h6 class="text-h6 q-mb-sm">8. Contact</h6>
          <p class="text-body2 q-mb-md">
            If you have questions, contact:<br />
            <a href="mailto:amsd.software@gmail.com" class="text-primary">amsd.software@gmail.com</a>
          </p>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 16px;
}

.policy-section {
  margin-bottom: 24px;
}

.policy-section ul {
  list-style-type: disc;
}

.policy-section ul li {
  margin-bottom: 8px;
  line-height: 1.5;
}
</style>
