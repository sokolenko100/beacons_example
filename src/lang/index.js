import i18n from "i18next";
import { reactI18nextModule } from 'react-i18next';
import en from './en';

i18n.use(reactI18nextModule)
    .init({
        fallbackLng: 'en',
        resources: {
            en,
        },

        // have a common namespace used around the full app
        ns: ['common'],
        defaultNS: 'common',

        debug: true,

        // cache: {
        //   enabled: true
        // },

        interpolation: {
            escapeValue: false, // not needed for react as it does escape per default to prevent xss!
        },
    });

export default i18n;
