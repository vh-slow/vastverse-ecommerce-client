import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import adminVi from './locales/vi/admin.json';
import clientVi from './locales/vi/client.json';
import adminEn from './locales/en/admin.json';
import clientEn from './locales/en/client.json';

const resources = {
    vi: {
        admin: adminVi,
        client: clientVi,
    },
    en: {
        admin: adminEn,
        client: clientEn,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'vi',
    fallbackLng: 'vi',
    ns: ['admin', 'client'],
    defaultNS: 'client',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
