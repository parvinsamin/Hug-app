import { StackActions, useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, View } from "react-native";

export default function NetworkError() {
    const navigation = useNavigation();

    function retry() {
        navigation.dispatch(StackActions.replace("Boot"));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>No Internet Connection</Text>
            <Text style={styles.subtitle}>
                Please check your connection and try again.
            </Text>

            <Button title="Retry" onPress={retry} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
    },
});
