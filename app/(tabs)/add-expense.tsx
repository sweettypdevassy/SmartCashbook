import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "expo-router"; // Navigation hook

export default function AddExpenseScreen() {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const router = useRouter(); // Navigation

    const handleAddExpense = async () => {
        if (!description.trim() || !amount.trim()) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert("Error", "Please enter a valid amount.");
            return;
        }

        try {
            await addDoc(collection(db, "expenses"), {
                description: description.trim(),
                amount: numericAmount,
                createdAt: new Date(),
            });

            setTimeout(() => {
                Alert.alert("Success", "Expense added successfully!");
            }, 100);

            setDescription("");
            setAmount("");
            router.back(); // Navigate back to View Expenses
        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            Alert.alert("Error", `Could not add expense: ${errMessage}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Expense</Text>
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
            <Button title="Add Expense" onPress={handleAddExpense} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f5f5f5" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
});

