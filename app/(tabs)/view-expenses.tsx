import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert, ActivityIndicator } from "react-native";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";

// Define TypeScript type for an expense item
type Expense = {
    id: string;
    description: string;
    amount: number;
};

export default function ViewExpensesScreen() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "expenses"));
                const expensesList: Expense[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
                    const data = doc.data() as Omit<Expense, "id">;
                    return { id: doc.id, ...data };
                });

                setExpenses(expensesList);
            } catch (error) {
                Alert.alert("Error", "Failed to fetch expenses. Please try again.");
                console.error("Error fetching expenses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const handleDeleteExpense = async (id: string) => {
        Alert.alert("Delete Expense", "Are you sure you want to delete this expense?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteDoc(doc(db, "expenses", id));
                        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
                        Alert.alert("Success", "Expense deleted successfully!");
                    } catch (error) {
                        Alert.alert("Error", "Failed to delete expense. Please try again.");
                        console.error("Error deleting expense:", error);
                    }
                },
            },
        ]);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Expenses</Text>
            {expenses.length === 0 ? (
                <Text style={styles.empty}>No expenses recorded.</Text>
            ) : (
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.expenseItem}>
                            <View>
                                <Text style={styles.text}>{item.description}</Text>
                                <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button title="Edit" onPress={() => router.push(`/edit-expense/${item.id}`)} />
                                <Button title="Delete" color="red" onPress={() => handleDeleteExpense(item.id)} />
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

// Define styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    expenseItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        fontSize: 16,
    },
    amount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#e63946",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
    },
    empty: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#6c757d",
    },
});
