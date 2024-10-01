import { createI18n } from 'vue-i18n'
import cn from './cn'
import en from './en'

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('languageLocale') || 'cn',
  messages: {
    cn,
    en,
  },
  globalInjection: true,
})
