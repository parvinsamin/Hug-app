import en from "@/src/assets/i18n/en.json";
import fa from "@/src/assets/i18n/fa.json";
import { useAppStore } from "../store/appStore";

type Dictionary = Record<string, any>;

const languages: Record<string, Dictionary> = {
    fa,
    en,
};

/**
 * Safely reads nested keys like "screens.home.title"
 */
function getNestedValue(obj: Dictionary, path: string): any {
    return path.split(".").reduce((acc, part) => {
        if (acc && acc[part] !== undefined) {
            return acc[part];
        }
        return undefined;
    }, obj);
}

/**
 * Replaces @variables in text
 * Example:
 * "You have @count messages"
 * t("key", { count: 5 })
 */
function replaceParams(text: string, params?: Record<string, any>) {
    if (!params) return text;

    let result = text;

    Object.keys(params).forEach((key) => {
        const value = String(params[key]);
        result = result.replace(new RegExp(`@${key}`, "g"), value);
    });

    return result;
}

/**
 * Main translation function
 */
export function t(
    key: string,
    params?: Record<string, any>
): string {
    const state = useAppStore.getState();
    const lang = state.locale?.language || "en";

    const dictionary = languages[lang] || languages.en;

    let value = getNestedValue(dictionary, key);

    // fallback to English
    if (!value) {
        value = getNestedValue(languages.en, key);
    }

    if (!value) {
        return key; // final fallback
    }

    if (typeof value !== "string") {
        return key;
    }

    return replaceParams(value, params);
}
