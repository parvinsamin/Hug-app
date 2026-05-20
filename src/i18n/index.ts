import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/src/locale/en.json";
import fa from "@/src/locale/fa.json";

i18n.use(initReactI18next).init({
    lng: "fa",
    fallbackLng: "en",
    resources: {
        en: { translation: en },
        fa: { translation: fa },
    },
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;