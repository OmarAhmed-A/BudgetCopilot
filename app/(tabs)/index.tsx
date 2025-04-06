import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Card, TextInput, Button, Modal, Portal, DefaultTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import { useBudget } from "@/context/BudgetContext";

export default function Index() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();
  
  // Create a memoized theme object to avoid re-renders
  const inputTheme = useMemo(() => ({
    colors: {
      text: colors.text,
      placeholder: colors.grey,
      background: colors.background,
      primary: colors.primary,
      onSurfaceVariant: colors.grey,
    }
  }), [colors]);
  
  const { 
    income, 
    setIncome, 
    balance,
    setBalance,
    spendingItems,
    updateSpendingItem 
  } = useBudget();
  
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showSpendModal, setShowSpendModal] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");
  const [addMoneyInput, setAddMoneyInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [tempIncome, setTempIncome] = useState("");
  const [tempAddMoney, setTempAddMoney] = useState("");
  const [tempSpendAmount, setTempSpendAmount] = useState("");
  
  const savingsAmount = 3245.65;
  const investmentReturn = 8.2; // percentage

  // Calculate used budget
  const totalSpent = spendingItems.reduce((sum, item) => sum + item.spent, 0);
  const totalBudget = spendingItems.reduce((sum, item) => sum + item.amount, 0);
  const budgetProgress = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);
  const remainingBudget = Math.max(totalBudget - totalSpent, 0);
  
  // Calculate projected savings (unspent income)
  const unspentIncome = income - totalSpent;
  const projectedSavings = unspentIncome > 0 ? unspentIncome : 0;
  
  // Calculate percentage of balance being spent
  const incomePercentOfBalance = balance > 0 ? (income / balance * 100).toFixed(1) : "0";
  const spentPercentOfBalance = balance > 0 ? (totalSpent / balance * 100).toFixed(1) : "0";

  // Reset input values when opening modals
  useEffect(() => {
    if (showIncomeModal) {
      setTempIncome(income.toString());
      setIncomeInput(income.toString());
    }
  }, [showIncomeModal, income]);

  useEffect(() => {
    if (showAddMoneyModal) {
      setTempAddMoney("");
      setAddMoneyInput("");
    }
  }, [showAddMoneyModal]);

  useEffect(() => {
    if (showSpendModal) {
      setTempSpendAmount("");
      setSpendAmount("");
      setSelectedCategory("");
    }
  }, [showSpendModal]);

  const handleSaveIncome = () => {
    const newIncome = parseFloat(tempIncome);
    if (!isNaN(newIncome) && newIncome > 0) {
      setIncome(newIncome);
      setShowIncomeModal(false);
    }
  };
  
  const handleAddMoney = () => {
    const amount = parseFloat(tempAddMoney);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than 0");
      return;
    }
    
    // Update the balance
    setBalance(balance + amount);
    
    // Show confirmation
    Alert.alert(
      "Funds Added",
      `$${amount.toFixed(2)} has been added to your balance`,
      [{ text: "OK" }]
    );
    
    setShowAddMoneyModal(false);
    setTempAddMoney("");
  };
  
  const handleOpenSpendModal = () => {
    setTempSpendAmount("");
    setSelectedCategory("");
    setShowSpendModal(true);
  };
  
  const handleOpenAddMoneyModal = () => {
    setTempAddMoney("");
    setShowAddMoneyModal(true);
  };
  
  const handleSpend = () => {
    const amount = parseFloat(tempSpendAmount);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than 0");
      return;
    }
    
    if (amount > balance) {
      Alert.alert("Insufficient Balance", "You don't have enough funds to make this transaction");
      return;
    }
    
    if (!selectedCategory) {
      Alert.alert("Select Category", "Please select a spending category");
      return;
    }
    
    // Find the spending item
    const item = spendingItems.find(item => item.category === selectedCategory);
    if (!item) {
      Alert.alert("Error", "Selected category not found");
      return;
    }
    
    // Update the spending item
    updateSpendingItem(item.id, {
      spent: item.spent + amount
    });
    
    // Update the balance
    setBalance(balance - amount);
    
    // Show confirmation
    Alert.alert(
      "Transaction Complete",
      `$${amount.toFixed(2)} spent on ${selectedCategory}`,
      [{ text: "OK" }]
    );
    
    setShowSpendModal(false);
    setTempSpendAmount("");
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
            <View style={styles.featureHeader}>
              <View>
                <Text style={[styles.cardTitle, { color: colors.grey }]}>Total Balance</Text>
                <Text style={[styles.balanceText, { color: colors.text }]}>
                  ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
            
            <View style={styles.balanceInsight}>
              <Text style={[styles.balanceDetail, { color: colors.grey }]}>
                <Text style={{ color: colors.primary }}>{incomePercentOfBalance}%</Text> of balance is monthly Budget
              </Text>
              <Text style={[styles.balanceDetail, { color: colors.grey }]}>
                <Text style={{ color: totalSpent > income ? colors.danger : colors.success }}>
                  {spentPercentOfBalance}%
                </Text> spent this month
              </Text>
            </View>
            
            <View style={styles.accountActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleOpenAddMoneyModal}
              >
                <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleOpenSpendModal}
              >
                <Ionicons name="cart-outline" size={22} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Spend</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setShowIncomeModal(true)}
              >
                <Ionicons name="wallet-outline" size={22} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Budget</Text>
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
                  <Text style={[styles.cardTitle, { color: colors.grey }]}>Monthly Budget</Text>
                  <Text style={[styles.cardValue, { color: colors.text }]}>{budgetProgress}% of budget used</Text>
                </View>
                <Ionicons name="wallet-outline" size={26} color={colors.primary} />
              </View>
              
              <View style={styles.incomeSummary}>
                <Text style={[styles.incomeLabel, { color: colors.grey }]}>
                  Monthly Income:
                </Text>
                <Text style={[styles.incomeValue, { color: colors.text }]}>
                  ${income.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Text>
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
                <View style={styles.budgetInfoRow}>
                  <Text style={[styles.remainingText, { color: colors.grey }]}>
                    ${remainingBudget.toFixed(2)} remaining
                  </Text>
                  <View style={styles.savingsInfo}>
                    <Ionicons name="arrow-forward" size={14} color={colors.success} style={styles.savingsArrow} />
                    <Ionicons name="save-outline" size={14} color={colors.success} style={styles.savingsIcon} />
                    <Text style={[styles.savingsText, { color: colors.success }]}>
                      ${projectedSavings.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
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
            
            <View style={styles.savingsSummary}>
              <Ionicons name="trending-up" size={16} color={colors.success} />
              <Text style={[styles.savingsForecast, { color: colors.text }]}>
                +${projectedSavings.toFixed(2)} going to savings this month
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

      {/* Income/Budget Edit Modal */}
      <Portal>
        <Modal
          visible={showIncomeModal}
          onDismiss={() => setShowIncomeModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Monthly Budget</Text>
          
          <TextInput
            mode="outlined"
            label="Monthly Income"
            defaultValue={income.toString()}
            value={tempIncome}
            onChangeText={setTempIncome}
            keyboardType="numeric"
            left={<TextInput.Affix text="$" />}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            style={styles.modalInput}
            theme={inputTheme}
          />
          
          <Text style={[styles.modalInfo, { color: colors.grey }]}>
            Your monthly income determines your budget allocation for essentials (50%), savings (30%), and discretionary spending (20%).
          </Text>
          
          {totalSpent > 0 && (
            <View style={styles.priorSpendingWarning}>
              <Ionicons name="information-circle-outline" size={20} color={colors.warning} style={styles.warningIcon} />
              <Text style={[styles.warningText, { color: colors.text }]}>
                You've already spent ${totalSpent.toFixed(2)} this month, which is {totalSpent > income ? 'more than' : ''} 
                {Math.round((totalSpent / income) * 100)}% of your current budget.
              </Text>
            </View>
          )}
          
          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => setShowIncomeModal(false)}
              style={[styles.modalButton, { borderColor: colors.border }]}
              textColor={colors.text}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSaveIncome}
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
            >
              Save
            </Button>
          </View>
          
          <Button 
            mode="text" 
            onPress={() => {
              setShowIncomeModal(false);
              router.push("/budget");
            }}
            style={styles.advancedButton}
            textColor={colors.primary}
          >
            Advanced Budget Settings
          </Button>
        </Modal>
      </Portal>
      
      {/* Add Money Modal */}
      <Portal>
        <Modal
          visible={showAddMoneyModal}
          onDismiss={() => setShowAddMoneyModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Add Money</Text>
          
          <TextInput
            mode="outlined"
            label="Amount to Add"
            value={tempAddMoney}
            onChangeText={setTempAddMoney}
            keyboardType="numeric"
            left={<TextInput.Affix text="$" />}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            style={styles.modalInput}
            theme={inputTheme}
          />
          
          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => setShowAddMoneyModal(false)}
              style={[styles.modalButton, { borderColor: colors.border }]}
              textColor={colors.text}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleAddMoney}
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
            >
              Add Funds
            </Button>
          </View>
        </Modal>
      </Portal>
      
      {/* Spend Modal */}
      <Portal>
        <Modal
          visible={showSpendModal}
          onDismiss={() => setShowSpendModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Record Spending</Text>
          
          <TextInput
            mode="outlined"
            label="Amount"
            value={tempSpendAmount}
            onChangeText={setTempSpendAmount}
            keyboardType="numeric"
            left={<TextInput.Affix text="$" />}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            style={styles.modalInput}
            theme={inputTheme}
          />
          
          <Text style={[styles.categoryLabel, { color: colors.text }]}>Select Category:</Text>
          <ScrollView style={styles.categoryScroll}>
            {spendingItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryOption,
                  { 
                    backgroundColor: selectedCategory === item.category ? 
                      `${item.color}30` : 'transparent',
                    borderColor: selectedCategory === item.category ?
                      item.color : colors.border
                  }
                ]}
                onPress={() => setSelectedCategory(item.category)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={18} color="#fff" />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={[styles.categoryName, { color: colors.text }]}>
                    {item.category}
                  </Text>
                  <View style={styles.categoryBudgetRow}>
                    <Text style={[
                      styles.categoryBudget, 
                      { 
                        color: item.spent >= item.amount ? colors.danger : colors.grey 
                      }
                    ]}>
                      ${item.spent.toFixed(2)} / ${item.amount.toFixed(2)}
                    </Text>
                    {item.spent >= item.amount && (
                      <Ionicons name="alert-circle" size={14} color={colors.danger} style={styles.categoryAlert} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => setShowSpendModal(false)}
              style={[styles.modalButton, { borderColor: colors.border }]}
              textColor={colors.text}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSpend}
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
            >
              Confirm
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  incomeLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  incomeValue: {
    fontSize: 14,
    fontWeight: 'bold',
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
  budgetInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsIcon: {
    marginRight: 3,
  },
  savingsArrow: {
    marginRight: 3,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  savingsSummary: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: 6,
  },
  savingsForecast: {
    marginLeft: 8,
    fontSize: 14,
  },
  balanceInsight: {
    marginBottom: 12,
  },
  balanceDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  categoryScroll: {
    maxHeight: 240,
    marginBottom: 16,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryBudget: {
    fontSize: 14,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  modalInfo: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
  },
  advancedButton: {
    marginTop: 16,
  },
  categoryBudgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryAlert: {
    marginLeft: 4,
  },
  priorSpendingWarning: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
