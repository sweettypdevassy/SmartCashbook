import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useRouter } from "expo-router";

export default function AddExpenseScreen() {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter();  // ✅ Added router for navigation

    const handleAddExpense = async () => {
        if (!amount || !description) {
            alert("Please fill all fields");
            return;
        }

        try {
            await addDoc(collection(db, "expenses"), {
                amount: parseFloat(amount),
                description,
                date: new Date().toISOString(),
            });
            alert("Expense added!");
            setAmount("");
            setDescription("");

            // ✅ Navigate to ViewExpensesScreen after adding expense
            router.push("/ViewExpensesScreen");
        } catch (error) {
            alert("Error adding expense: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Amount:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <Text style={styles.label}>Description:</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
            />
            <Button title="Add Expense" onPress={handleAddExpense} />
            <Button title="Go to View Expenses" onPress={() => router.push("/ViewExpensesScreen")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "white" },
    label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
    input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
});
