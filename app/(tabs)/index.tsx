import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const accountBalance = 12458.97;
  const savingsAmount = 3245.65;
  const budgetProgress = 68; // percentage
  const investmentReturn = 8.2; // percentage

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.welcome, { color: colors.text }]}>Hello, Omar</Text>
        <Text style={[styles.date, { color: colors.grey }]}>April 3, 2025</Text>
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
      <Card 
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => router.push("/budget")}
      >
        <Card.Content>
          <View style={styles.featureHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: colors.grey }]}>Budget Manager</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>{budgetProgress}% of monthly budget</Text>
            </View>
            <Ionicons name="wallet-outline" size={26} color={colors.primary} />
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
              $1,205 remaining this month
            </Text>
          </View>
        </Card.Content>
      </Card>

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
});
