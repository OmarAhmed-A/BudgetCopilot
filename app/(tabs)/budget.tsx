import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Card, TextInput, ProgressBar, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

// Define TypeScript types for the icons to avoid type errors
type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface SpendingItem {
  category: string;
  amount: number;
  spent: number;
  icon: IconName;
  color: string;
}

export default function BudgetManager() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const screenWidth = Dimensions.get("window").width;
  
  const [income, setIncome] = useState("5000");
  const [showDistribution, setShowDistribution] = useState(false);
  
  // Budget allocation percentages
  const essentialsPercent = 50;
  const savingsPercent = 30;
  const discretionaryPercent = 20;
  
  // Calculate amounts based on income and percentages
  const incomeValue = parseFloat(income) || 0;
  const essentialsAmount = (incomeValue * essentialsPercent / 100).toFixed(2);
  const savingsAmount = (incomeValue * savingsPercent / 100).toFixed(2);
  const discretionaryAmount = (incomeValue * discretionaryPercent / 100).toFixed(2);
  
  // Spending data for the current month
  const spendingData: SpendingItem[] = [
    {
      category: "Housing",
      amount: 1200,
      spent: 1200,
      icon: "home-outline",
      color: colors.primary,
    },
    {
      category: "Groceries",
      amount: 500,
      spent: 320,
      icon: "cart-outline",
      color: colors.secondary,
    },
    {
      category: "Utilities",
      amount: 300,
      spent: 220,
      icon: "flash-outline",
      color: "#FF8C00",
    },
    {
      category: "Transportation",
      amount: 200,
      spent: 180,
      icon: "car-outline",
      color: "#8A2BE2",
    },
    {
      category: "Dining",
      amount: 400,
      spent: 350,
      icon: "restaurant-outline",
      color: "#FF4500",
    },
    {
      category: "Entertainment",
      amount: 300,
      spent: 150,
      icon: "film-outline",
      color: "#20B2AA",
    },
  ];

  // Pie chart data
  const chartData = [
    {
      name: "Essentials",
      population: essentialsPercent,
      color: colors.primary,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: "Savings",
      population: savingsPercent,
      color: colors.success,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: "Discretionary",
      population: discretionaryPercent,
      color: colors.secondary,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  const calculateProgress = (spent: number, total: number): number => {
    return Math.min(spent / total, 1);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Smart Budget Manager</Text>
      <Text style={[styles.description, { color: colors.grey }]}>
        Automatically segments your income into predefined buckets
      </Text>
      
      {/* Income Input */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Monthly Income</Text>
          <TextInput
            mode="outlined"
            label="Enter your income"
            value={income}
            onChangeText={setIncome}
            keyboardType="numeric"
            left={<TextInput.Affix text="$" />}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            style={styles.input}
          />
          <Button 
            mode="contained" 
            onPress={() => setShowDistribution(true)}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            Calculate Budget
          </Button>
        </Card.Content>
      </Card>
      
      {showDistribution && (
        <>
          {/* Budget Distribution Chart */}
          <Card style={[styles.card, { backgroundColor: colors.card }]}>
            <Card.Content>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Budget Distribution</Text>
              <View style={styles.chartContainer}>
                <PieChart
                  data={chartData}
                  width={screenWidth - 64}
                  height={180}
                  chartConfig={chartConfig}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"10"}
                  center={[10, 0]}
                  absolute
                />
              </View>
            </Card.Content>
          </Card>

          {/* Budget Breakdown */}
          <Card style={[styles.card, { backgroundColor: colors.card }]}>
            <Card.Content>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Budget Breakdown</Text>
              
              <View style={styles.budgetItem}>
                <View style={styles.budgetHeader}>
                  <View style={styles.categoryContainer}>
                    <View style={[styles.categoryIcon, { backgroundColor: colors.primary }]}>
                      <Ionicons name="home-outline" size={18} color="#fff" />
                    </View>
                    <Text style={[styles.categoryLabel, { color: colors.text }]}>Essentials</Text>
                  </View>
                  <Text style={[styles.amountText, { color: colors.text }]}>${essentialsAmount}</Text>
                </View>
                <Text style={[styles.description, { color: colors.grey }]}>
                  Housing, groceries, utilities, and other necessities
                </Text>
              </View>
              
              <View style={styles.budgetItem}>
                <View style={styles.budgetHeader}>
                  <View style={styles.categoryContainer}>
                    <View style={[styles.categoryIcon, { backgroundColor: colors.success }]}>
                      <Ionicons name="save-outline" size={18} color="#fff" />
                    </View>
                    <Text style={[styles.categoryLabel, { color: colors.text }]}>Savings</Text>
                  </View>
                  <Text style={[styles.amountText, { color: colors.text }]}>${savingsAmount}</Text>
                </View>
                <Text style={[styles.description, { color: colors.grey }]}>
                  Emergency fund, retirement, and future goals
                </Text>
              </View>
              
              <View style={styles.budgetItem}>
                <View style={styles.budgetHeader}>
                  <View style={styles.categoryContainer}>
                    <View style={[styles.categoryIcon, { backgroundColor: colors.secondary }]}>
                      <Ionicons name="cafe-outline" size={18} color="#fff" />
                    </View>
                    <Text style={[styles.categoryLabel, { color: colors.text }]}>Discretionary</Text>
                  </View>
                  <Text style={[styles.amountText, { color: colors.text }]}>${discretionaryAmount}</Text>
                </View>
                <Text style={[styles.description, { color: colors.grey }]}>
                  Entertainment, dining out, shopping, and other wants
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Spending Tracker */}
          <Card style={[styles.card, { backgroundColor: colors.card }]}>
            <Card.Content>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Spending Tracker</Text>
              <Text style={[styles.subtitle, { color: colors.grey }]}>April 2025</Text>
              
              {spendingData.map((item, index) => (
                <View key={index} style={styles.spendingItem}>
                  <View style={styles.spendingHeader}>
                    <View style={styles.categoryContainer}>
                      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                        <Ionicons name={item.icon} size={18} color="#fff" />
                      </View>
                      <Text style={[styles.categoryLabel, { color: colors.text }]}>{item.category}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                      <Text style={[styles.spentText, { color: colors.text }]}>${item.spent}</Text>
                      <Text style={[styles.budgetText, { color: colors.grey }]}>/${item.amount}</Text>
                    </View>
                  </View>
                  <ProgressBar 
                    progress={calculateProgress(item.spent, item.amount)} 
                    color={item.spent > item.amount ? colors.danger : item.color} 
                    style={styles.progressBar}
                  />
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Tips Section */}
          <Card style={[styles.card, { backgroundColor: colors.card }]}>
            <Card.Content>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Smart Tips</Text>
              <View style={styles.tipContainer}>
                <Ionicons name="bulb-outline" size={24} color={colors.warning} style={styles.tipIcon} />
                <Text style={[styles.tipText, { color: colors.text }]}>
                  Cut down on dining expenses to boost your savings by 15% this month.
                </Text>
              </View>
              <View style={styles.tipContainer}>
                <Ionicons name="trending-up-outline" size={24} color={colors.success} style={styles.tipIcon} />
                <Text style={[styles.tipText, { color: colors.text }]}>
                  You're under budget on entertainment! Consider moving the extra to your savings.
                </Text>
              </View>
            </Card.Content>
          </Card>
        </>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => {/* Add expense tracking functionality */}}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  chartContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  budgetItem: {
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  spendingItem: {
    marginBottom: 16,
  },
  spendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: "row",
  },
  spentText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  budgetText: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  tipContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});