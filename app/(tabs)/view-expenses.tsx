import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

// Define TypeScript type for an expense item
type Expense = {
    id: string;
    description: string;
    amount: number;
};

export default function ViewExpensesScreen() {
    // Define useState with correct type
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "expenses"));
                const expensesList: Expense[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
                    const data = doc.data() as Omit<Expense, "id">; // Exclude 'id' from Firestore data
                    return { id: doc.id, ...data }; // Manually add 'id'
                });

                setExpenses(expensesList);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };

        fetchExpenses();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Expenses</Text>
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.expenseItem}>
                        <Text style={styles.text}>{item.description}</Text>
                        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No expenses found.</Text>}
            />
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
    },
    text: {
        fontSize: 16,
    },
    amount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#e63946",
    },
    empty: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#6c757d",
    },
});

