import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function AddExpenseScreen() {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleAddExpense = async () => {
        if (!amount || !description) {
            Alert.alert("Error", "Please enter all details");
            return;
        }
        try {
            await addDoc(collection(db, "expenses"), {
                amount: parseFloat(amount),
                description,
                date: new Date().toISOString(),
            });
            Alert.alert("Success", "Expense added successfully!");
            setAmount("");
            setDescription("");
        } catch (error) {
            Alert.alert("Error", "Could not add expense");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <Button title="Add Expense" onPress={handleAddExpense} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center" },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});
