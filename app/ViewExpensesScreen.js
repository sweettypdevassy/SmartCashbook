import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useRouter } from "expo-router";

export default function ViewExpensesScreen() {
    const [expenses, setExpenses] = useState([]);
    const router = useRouter(); // ✅ Added router for navigation

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "expenses"));
                const expensesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setExpenses(expensesList);
            } catch (error) {
                console.error("Error fetching expenses: ", error);
            }
        };

        fetchExpenses();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Expense List</Text>
            
            {expenses.length === 0 ? (
                <Text style={styles.noExpenses}>No expenses found.</Text>
            ) : (
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.expenseItem}>
                            <Text style={styles.amount}>₹{item.amount}</Text>
                            <Text>{item.description}</Text>
                            <Text>{new Date(item.date).toLocaleString()}</Text>
                        </View>
                    )}
                />
            )}

            {/* ✅ Button to navigate to AddExpenseScreen */}
            <Button title="Add Expense" onPress={() => router.push("/AddExpenseScreen")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "white" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    noExpenses: { textAlign: "center", fontSize: 16, color: "gray", marginVertical: 20 },
    expenseItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    amount: { fontSize: 18, fontWeight: "bold" },
});
