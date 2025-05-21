import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import translationES from '../i18n/es.json';
import translationHE from '../i18n/he.json';
import translationEN from '../i18n/en.json';
import translationPT from '../i18n/pt.json';
import translationFR from '../i18n/fr.json';
import translationIT from '../i18n/it.json';
import translationJA from '../i18n/ja.json';
import translationKO from '../i18n/ko.json';

i18n.init({
  interpolation: { escapeValue: false },
  lng: 'es',
  resources: {
    es: { translation: translationES },
    he: { translation: translationHE },
    en: { translation: translationEN },
    pt: { translation: translationPT },
    fr: { translation: translationFR },
    it: { translation: translationIT },
    ja: { translation: translationJA },
    ko: { translation: translationKO },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
