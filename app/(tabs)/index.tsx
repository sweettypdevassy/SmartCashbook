import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";

export default function HomeScreen() {
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [remainingBalance, setRemainingBalance] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);

                const q = query(
                    collection(db, "expenses"),
                    where("date", ">=", Timestamp.fromDate(startOfMonth)) // Filter for current month
                );
                const querySnapshot = await getDocs(q);

                let totalExp = 0;
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    totalExp += data.amount || 0;
                });

                // Fetch the total budget (assuming it's stored in a "budget" collection)
                const budgetSnapshot = await getDocs(collection(db, "budget"));
                let budget = 0;
                budgetSnapshot.forEach((doc) => {
                    budget += doc.data().amount || 0; 
                });

                setTotalBudget(budget);
                setTotalExpenses(totalExp);
                setRemainingBalance(budget - totalExp);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Hero Section */}
            <View style={styles.hero}>
                <FontAwesome name="money" size={60} color="green" />
                <Text style={styles.heading}>Welcome to SmartCashbook</Text>
                <Text style={styles.subheading}>Manage your monthly budget efficiently.</Text>
            </View>

            {/* Financial Summary */}
            <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>💰 Total Budget: ${totalBudget.toFixed(2)}</Text>
                <Text style={styles.summaryText}>💸 Total Expenses: ${totalExpenses.toFixed(2)}</Text>
                <Text style={[styles.summaryText, { color: remainingBalance < 0 ? "red" : "green" }]}>
                    🏦 Remaining Balance: ${remainingBalance.toFixed(2)}
                </Text>
            </View>
        </View>
    );
}

// Define styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
    },
    hero: {
        alignItems: "center",
        marginBottom: 20,
    },
    heading: {
        fontSize: 26,
        fontWeight: "bold",
        marginTop: 10,
    },
    subheading: {
        fontSize: 16,
        color: "#6c757d",
        textAlign: "center",
        marginTop: 5,
        paddingHorizontal: 20,
    },
    summaryBox: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: "100%",
        alignItems: "center",
    },
    summaryText: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 5,
    },
});
