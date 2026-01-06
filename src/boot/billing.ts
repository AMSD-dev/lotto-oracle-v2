// src/boot/billing.ts
import { boot } from 'quasar/wrappers';
import { useBilling } from 'src/composables/useBilling';

export default boot(() => {
  const { initBilling } = useBilling();
  initBilling();
});
