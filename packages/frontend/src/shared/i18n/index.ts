import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  locale: 'cs',
  fallbackLocale: 'cs',
  messages: {
    cs: {
      general: {
        appName: 'Vera',
        serverError: 'Načítání dat ze serveru selhalo.',
        email: 'E-mail',
        password: 'Heslo',
        passwordConfirm: 'Heslo znovu',
        send: 'Odeslat',
      },
      login: {
        register: 'Zaregistrovat se',
        login: 'Přihlásit se',
        missingCredentials: 'Vyplňte prosím jméno a heslo.',
        incorrectCredentials: 'Chybné jméno, nebo heslo.',
        duplicateRegisterMethod: 'Uživatel již je zaregistrovám.',
        wrongPasswordCheck: 'Hesla se neshodují',
      },
      ahoy: 'ahoy-hoy',
      home: 'Domů',
      bible: 'Bible',
    },
    en: {
      general: {
        send: 'send',
        email: 'E-mail',
        password: 'Password',
        passwordConfirm: 'Password confirm',
        appName: 'Vera',
        serverError: 'Failed loading data from server.',
      },
      login: {
        register: 'Register',
        login: 'Log in',
        missingCredentials: 'Fill out the username and password fields.',
        incorrectCredentials: 'Incorrect credentials.',
        duplicateRegisterMethod: 'User is already registered,',
        wrongPasswordCheck: 'Passwords do not match',
      },
    },
  },
});
