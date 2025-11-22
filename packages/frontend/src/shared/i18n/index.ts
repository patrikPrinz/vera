import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  locale: 'cs',
  fallbackLocale: 'cs',
  messages: {
    cs: {
      general: {
        appName: 'Vera',
      },
      ahoy: 'ahoy-hoyys',
      home: 'Domů',
      bible: 'Bible',
    },
  },
});
