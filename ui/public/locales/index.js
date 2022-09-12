import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import en from './en/translation.json'
import zh from './zh/translation.json'
import config from '../../pool.config'

i18n.use(initReactI18next).init({
  lng: config.defaultLang || 'en',
  debug: true,
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
  },
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
