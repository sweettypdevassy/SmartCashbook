import { View, Text, StyleSheet } from "react-native";

export default function ExploreScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Explore Features</Text>
            <Text>More features coming soon!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
