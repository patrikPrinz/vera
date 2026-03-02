import { createI18n, type LocaleMessages, type VueMessageType } from 'vue-i18n';
import type { LocaleMetadata } from './i18n.types';

const registeredLocales: LocaleMetadata[] = [{ code: 'cs' }, { code: 'en' }];

async function loadMessages(
  registeredLocales: LocaleMetadata[],
): Promise<Record<string, LocaleMessages<VueMessageType>>> {
  const entries = await Promise.all(
    registeredLocales.map(async (e) => {
      const module = (await import(
        `./locales/${e.code}.json`
      )) as LocaleMessages<VueMessageType>;
      return [e.code, module] as const;
    }),
  );
  const messages = Object.fromEntries(entries);
  return messages;
}

export async function createTranslation() {
  return createI18n({
    legacy: false,
    locale: 'cs',
    fallbackLocale: 'cs',
    messages: await loadMessages(registeredLocales),
  });
}
