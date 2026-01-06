import { ref } from 'vue';
import { useStorage } from './useStorage';

export interface NotificationSettings {
  enabled: boolean;
  luckyDays: boolean;
  drawReminders: boolean;
  manifestationTips: boolean;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  message: string;
  scheduledTime: string;
  type: 'lucky_day' | 'draw_reminder' | 'manifestation';
}

const SETTINGS_KEY = 'lotto_oracle_notifications';
const NOTIFICATIONS_KEY = 'lotto_oracle_scheduled_notifications';

export function useNotifications() {
  const storage = useStorage();
  const isSupported = ref(false);

  const defaultSettings: NotificationSettings = {
    enabled: false,
    luckyDays: true,
    drawReminders: true,
    manifestationTips: true,
  };

  const checkSupport = (): boolean => {
    isSupported.value = 'Notification' in window;
    return isSupported.value;
  };

  const getSettings = (): NotificationSettings => {
    return storage.get<NotificationSettings>(SETTINGS_KEY, defaultSettings);
  };

  const updateSettings = (settings: Partial<NotificationSettings>): void => {
    const current = getSettings();
    const updated = { ...current, ...settings };
    storage.set(SETTINGS_KEY, updated);
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!checkSupport()) return false;

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  };

  const scheduleNotification = (notification: ScheduledNotification): void => {
    const scheduled = storage.get<ScheduledNotification[]>(NOTIFICATIONS_KEY, []);
    scheduled.push(notification);
    storage.set(NOTIFICATIONS_KEY, scheduled);
  };

  const getScheduledNotifications = (): ScheduledNotification[] => {
    return storage.get<ScheduledNotification[]>(NOTIFICATIONS_KEY, []);
  };

  const clearScheduledNotifications = (): void => {
    storage.set(NOTIFICATIONS_KEY, []);
  };

  const sendNotification = (title: string, message: string, icon?: string): void => {
    const settings = getSettings();
    if (!settings.enabled) return;
    if (!checkSupport()) return;

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: icon || '/vite.svg',
        badge: '/vite.svg',
      });
    }
  };

  const scheduleLuckyDayNotification = (zodiacSign: string, month: string): void => {
    const settings = getSettings();
    if (!settings.enabled || !settings.luckyDays) return;

    const notifId = 'lucky_' + Date.now();
    const notification: ScheduledNotification = {
      id: notifId,
      title: 'Lucky ' + month + ' for ' + zodiacSign,
      message: 'This month carries favorable energy for you. Consider playing the lottery!',
      scheduledTime: new Date().toISOString(),
      type: 'lucky_day',
    };

    scheduleNotification(notification);
    sendNotification(notification.title, notification.message);
  };

  const scheduleDrawReminder = (drawDate: string): void => {
    const settings = getSettings();
    if (!settings.enabled || !settings.drawReminders) return;

    const notifId = 'draw_' + Date.now();
    const notification: ScheduledNotification = {
      id: notifId,
      title: 'Upcoming Lottery Draw',
      message: 'Draw scheduled for ' + drawDate + '. Generate your lucky numbers now!',
      scheduledTime: new Date().toISOString(),
      type: 'draw_reminder',
    };

    scheduleNotification(notification);
    sendNotification(notification.title, notification.message);
  };

  const sendManifestationTip = (tip: string): void => {
    const settings = getSettings();
    if (!settings.enabled || !settings.manifestationTips) return;

    const notifId = 'manifest_' + Date.now();
    const notification: ScheduledNotification = {
      id: notifId,
      title: 'Daily Manifestation',
      message: tip,
      scheduledTime: new Date().toISOString(),
      type: 'manifestation',
    };

    scheduleNotification(notification);
    sendNotification(notification.title, notification.message);
  };

  const sendWelcomeNotification = (): void => {
    sendNotification(
      'Welcome to Lotto Oracle!',
      'Your personalized lottery insights are ready. Check your lucky numbers today!'
    );
  };

  return {
    isSupported,
    checkSupport,
    getSettings,
    updateSettings,
    requestPermission,
    scheduleNotification,
    getScheduledNotifications,
    clearScheduledNotifications,
    sendNotification,
    scheduleLuckyDayNotification,
    scheduleDrawReminder,
    sendManifestationTip,
    sendWelcomeNotification,
  };
}
