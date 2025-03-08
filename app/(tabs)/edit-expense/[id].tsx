import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { db } from "../../../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditExpenseScreen() {
    const { id } = useLocalSearchParams(); 
    const router = useRouter();

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const docRef = doc(db, "expenses", Array.isArray(id) ? id[0] : id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setDescription(data.description);
                    setAmount(data.amount.toString());
                } else {
                    Alert.alert("Error", "Expense not found.");
                    router.back();
                }
            } catch (error) {
                Alert.alert("Error", "Failed to fetch expense. Please try again.");
                console.error("Error fetching expense:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExpense();
    }, [id]);

    const handleUpdateExpense = async () => {
        if (!description.trim() || !amount.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (isNaN(parseFloat(amount))) {
            Alert.alert("Error", "Amount must be a valid number");
            return;
        }

        try {
            await updateDoc(doc(db, "expenses", Array.isArray(id) ? id[0] : id), {
                description,
                amount: parseFloat(amount),
            });
            Alert.alert("Success", "Expense updated successfully!", [{ text: "OK", onPress: () => router.back() }]);
        } catch (error) {
            Alert.alert("Error", "Failed to update expense. Please try again.");
            console.error("Error updating expense:", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Expense</Text>
            <TextInput
                style={styles.input}
                placeholder="Expense Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <Button title="Update Expense" onPress={handleUpdateExpense} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }
});
