import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('languageLocale') || 'zh',
  allowComposition: true,
  messages: {
    zh,
    en,
  },
  globalInjection: true,
})
export default i18n
