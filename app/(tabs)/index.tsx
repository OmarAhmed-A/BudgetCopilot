import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Card, TextInput, Button, Modal, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";

export default function Index() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();
  
  const { income, setIncome, spendingItems } = useBudget();
  
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomeInput, setIncomeInput] = useState(income.toString());
  
  const accountBalance = 12458.97;
  const savingsAmount = 3245.65;
  const investmentReturn = 8.2; // percentage

  // Calculate used budget
  const totalSpent = spendingItems.reduce((sum, item) => sum + item.spent, 0);
  const totalBudget = spendingItems.reduce((sum, item) => sum + item.amount, 0);
  const budgetProgress = Math.round((totalSpent / totalBudget) * 100);
  const remainingBudget = totalBudget - totalSpent;

  const handleSaveIncome = () => {
    const newIncome = parseFloat(incomeInput);
    if (!isNaN(newIncome) && newIncome > 0) {
      setIncome(newIncome);
      setShowIncomeModal(false);
    }
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.welcome, { color: colors.text }]}>Hello, Omar</Text>
          <Text style={[styles.date, { color: colors.grey }]}>April 6, 2025</Text>
        </View>

        {/* Account Balance */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: colors.grey }]}>Total Balance</Text>
            <Text style={[styles.balanceText, { color: colors.text }]}>
              ${accountBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Text>
            <View style={styles.accountActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="send-outline" size={22} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="swap-horizontal-outline" size={22} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Transfer</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Budget Summary */}
        <TouchableOpacity onPress={() => router.push("/budget")}>
          <Card style={[styles.card, { backgroundColor: colors.card }]}>
            <Card.Content>
              <View style={styles.featureHeader}>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.grey }]}>Budget Manager</Text>
                  <Text style={[styles.cardValue, { color: colors.text }]}>{budgetProgress}% of monthly budget</Text>
                </View>
                <View style={styles.budgetActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => setShowIncomeModal(true)}
                  >
                    <Ionicons name="pencil-outline" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <Ionicons name="wallet-outline" size={26} color={colors.primary} />
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.lightGrey }]}>
                  <View 
                    style={[
                      styles.progress, 
                      { 
                        width: `${budgetProgress}%`, 
                        backgroundColor: budgetProgress > 85 ? colors.warning : colors.success 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.remainingText, { color: colors.grey }]}>
                  ${remainingBudget.toFixed(2)} remaining this month
                </Text>
              </View>
              
              <Text style={[styles.incomeSummary, { color: colors.grey }]}>
                Monthly Income: ${income.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>

        {/* Investment Summary */}
        <Card 
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => router.push("/invest")}
        >
          <Card.Content>
            <View style={styles.featureHeader}>
              <View>
                <Text style={[styles.cardTitle, { color: colors.grey }]}>Investments</Text>
                <Text style={[styles.cardValue, { color: colors.text }]}>
                  ${savingsAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <Ionicons name="trending-up-outline" size={26} color={colors.primary} />
            </View>
            
            <View style={styles.returnInfo}>
              <View style={styles.returnBadge}>
                <Ionicons name="arrow-up" size={16} color={colors.success} />
                <Text style={[styles.returnText, { color: colors.success }]}>
                  {investmentReturn}%
                </Text>
              </View>
              <Text style={[styles.periodText, { color: colors.grey }]}>
                Return this year
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.card }]}>
            <Ionicons name="analytics-outline" size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.card }]}>
            <Ionicons name="card-outline" size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.card }]}>
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.card }]}>
            <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Help</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Income Edit Modal */}
      <Portal>
        <Modal
          visible={showIncomeModal}
          onDismiss={() => setShowIncomeModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Monthly Income</Text>
          
          <TextInput
            mode="outlined"
            label="Monthly Income"
            value={incomeInput}
            onChangeText={setIncomeInput}
            keyboardType="numeric"
            left={<TextInput.Affix text="$" />}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            style={styles.modalInput}
            theme={{
              colors: {
                text: colors.text,
                placeholder: colors.grey,
                background: colors.background,
                onSurfaceVariant: colors.grey
              }
            }}
          />
          
          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => setShowIncomeModal(false)}
              style={[styles.modalButton, { borderColor: colors.border }]}
              textColor={colors.text}
              theme={{
                colors: {
                  outline: colors.border
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSaveIncome}
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              theme={{
                colors: {
                  primary: colors.primary
                }
              }}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  accountActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    alignItems: "center",
    padding: 10,
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
  },
  featureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  budgetActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginRight: 12,
    padding: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progress: {
    height: 8,
    borderRadius: 4,
  },
  remainingText: {
    fontSize: 14,
    marginBottom: 4,
  },
  incomeSummary: {
    fontSize: 14,
    marginTop: 8,
  },
  returnInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  returnBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  returnText: {
    fontWeight: "bold",
    marginLeft: 2,
  },
  periodText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickAction: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
  },
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
