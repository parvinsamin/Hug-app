import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";
import AppText from "./AppText";

export default function Banner() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <AppText style={styles.text}>
                {t("banner.systemMessage")}
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        margin: 16,
        padding: 16,
        borderRadius: 8,
    },
    text: {
        color: "#fff",
    },
});
