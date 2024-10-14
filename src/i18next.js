import i18n, { use } from 'i18next'
import Backend from 'i18next-http-backend'
import LnaguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from 'react-i18next'

i18n.use(Backend).use(LnaguageDetector).use(initReactI18next).init({
    fallbackLng: 'en',
    degug: true,
    detection: {
        order: ['queryString', 'cookie'],
        cache: ['cookie']
    },
    interpolation: {
        escapeValue: false
    }
})

export default i18n