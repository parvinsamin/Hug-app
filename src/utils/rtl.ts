import { I18nManager } from "react-native";

export const isRTL = I18nManager.isRTL;

export const row = {
    flexDirection: isRTL ? "row-reverse" : "row",
};

export const textAlign = isRTL ? "right" : "left";
