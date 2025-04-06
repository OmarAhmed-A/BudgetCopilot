import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Card, TextInput, ProgressBar, Button, Modal, Portal, IconButton, List, Divider, FAB, RadioButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useBudget, SpendingItem } from "@/context/BudgetContext";
import ColorPicker, { Panel1, Preview, Swatches, OpacitySlider, HueSlider } from 'reanimated-color-picker';

// Define TypeScript types for the icons
type IconName = React.ComponentProps<typeof Ionicons>["name"];

// Available icons for category selection
const availableIcons: IconName[] = [
  "home-outline", 
  "car-outline", 
  "cart-outline", 
  "restaurant-outline", 
  "medkit-outline",
  "flash-outline", 
  "film-outline", 
  "airplane-outline", 
  "gift-outline",
  "school-outline", 
  "fitness-outline", 
  "paw-outline",
  "shirt-outline",
  "game-controller-outline",
  "phone-portrait-outline"
];

// Available colors for category selection
const availableColors = [
  "#2F80ED", // primary
  "#5CC9F5", // secondary
  "#FF8C00", // orange
  "#8A2BE2", // purple
  "#FF4500", // red-orange
  "#20B2AA", // light sea green
  "#FF1493", // deep pink
  "#32CD32", // lime green
  "#4682B4", // steel blue
  "#9932CC", // dark orchid
];

export default function BudgetManager() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const screenWidth = Dimensions.get("window").width;
  
  const { 
    income, 
    spendingItems, 
    addSpendingItem, 
    updateSpendingItem, 
    removeSpendingItem,
    isPremium 
  } = useBudget();
  
  // States for bucket editing and modals
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [iconsModalVisible, setIconsModalVisible] = useState(false);
  const [colorsModalVisible, setColorsModalVisible] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  
  const [currentItem, setCurrentItem] = useState<SpendingItem | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryAmount, setCategoryAmount] = useState("");
  const [categorySpent, setCategorySpent] = useState("");
  const [categoryIcon, setCategoryIcon] = useState<IconName>("home-outline");
  const [categoryColor, setCategoryColor] = useState("#2F80ED");
  const [categoryType, setCategoryType] = useState("essentials");
  
  // Budget allocation percentages for the pie chart
  const essentialsPercent = 50;
  const savingsPercent = 30;
  const discretionaryPercent = 20;
  
  // Calculate amounts based on income and percentages
  const essentialsAmount = (income * essentialsPercent / 100).toFixed(2);
  const savingsAmount = (income * savingsPercent / 100).toFixed(2);
  const discretionaryAmount = (income * discretionaryPercent / 100).toFixed(2);
  
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

  const handleEditItem = (item: SpendingItem) => {
    setCurrentItem(item);
    setCategoryName(item.category);
    setCategoryAmount(item.amount.toString());
    setCategorySpent(item.spent.toString());
    setCategoryIcon(item.icon);
    setCategoryColor(item.color);
    setEditModalVisible(true);
  };

  const handleUpdateItem = () => {
    if (!currentItem) return;
    
    const amount = parseFloat(categoryAmount);
    const spent = parseFloat(categorySpent);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than 0");
      return;
    }
    
    if (isNaN(spent) || spent < 0) {
      Alert.alert("Invalid Spent Amount", "Please enter a valid spent amount (0 or greater)");
      return;
    }
    
    if (!categoryName.trim()) {
      Alert.alert("Missing Category Name", "Please enter a category name");
      return;
    }
    
    updateSpendingItem(currentItem.id, {
      category: categoryName,
      amount,
      spent,
      icon: categoryIcon,
      color: categoryColor,
      type: categoryType
    });
    
    setEditModalVisible(false);
  };

  const handleDeleteItem = () => {
    if (!currentItem) return;
    
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete the "${currentItem.category}" category?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeSpendingItem(currentItem.id);
            setEditModalVisible(false);
          }
        }
      ]
    );
  };

  const handleCreateItem = () => {
    const amount = parseFloat(categoryAmount);
    const spent = parseFloat(categorySpent);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than 0");
      return;
    }
    
    if (isNaN(spent) || spent < 0) {
      Alert.alert("Invalid Spent Amount", "Please enter a valid spent amount (0 or greater)");
      return;
    }
    
    if (!categoryName.trim()) {
      Alert.alert("Missing Category Name", "Please enter a category name");
      return;
    }
    
    addSpendingItem({
      category: categoryName,
      amount,
      spent,
      icon: categoryIcon,
      color: categoryColor,
      type: categoryType
    });
    
    // Reset fields
    setCategoryName("");
    setCategoryAmount("");
    setCategorySpent("0");
    setCategoryIcon("home-outline");
    setCategoryColor("#2F80ED");
    setCategoryType("essentials");
    
    setCreateModalVisible(false);
  };

  const openCreateModal = () => {
    // Check if we can add more items (if not premium and already at 5 items)
    if (!isPremium && spendingItems.length >= 5) {
      Alert.alert(
        "Premium Feature",
        "You can only create up to 5 spending buckets with a free account. Upgrade to premium for unlimited buckets.",
        [{ text: "OK" }]
      );
      return;
    }

    setCategoryName("");
    setCategoryAmount("");
    setCategorySpent("0");
    setCategoryIcon("home-outline");
    setCategoryColor("#2F80ED");
    setCreateModalVisible(true);
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Smart Budget Manager</Text>
        <Text style={[styles.description, { color: colors.grey }]}>
          Automatically segments your income of ${income.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </Text>
        
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
            <View style={styles.sectionHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Spending Buckets</Text>
              <Text style={[styles.subtitle, { color: colors.grey }]}>April 2025</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={openCreateModal}
              >
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {spendingItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.spendingItem}
                onPress={() => handleEditItem(item)}
              >
                <View style={styles.spendingHeader}>
                  <View style={styles.categoryContainer}>
                    <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                      <Ionicons name={item.icon} size={18} color="#fff" />
                    </View>
                    <Text style={[styles.categoryLabel, { color: colors.text }]}>{item.category}</Text>
                  </View>
                  <View style={styles.amountContainer}>
                    <Text style={[styles.spentText, { color: colors.text }]}>${item.spent.toFixed(2)}</Text>
                    <Text style={[styles.budgetText, { color: colors.grey }]}>/${item.amount.toFixed(2)}</Text>
                  </View>
                </View>
                <ProgressBar 
                  progress={calculateProgress(item.spent, item.amount)} 
                  color={item.spent > item.amount ? colors.danger : item.color} 
                  style={styles.progressBar}
                />
              </TouchableOpacity>
            ))}

            {spendingItems.length === 0 && (
              <Text style={[styles.emptyText, { color: colors.grey }]}>
                No spending buckets added yet. Tap the + button to create your first bucket.
              </Text>
            )}
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

        {/* Account Upgrade Banner (show only for non-premium) */}
        {!isPremium && (
          <Card style={[styles.card, { backgroundColor: colors.primary }]}>
            <Card.Content>
              <View style={styles.upgradeContent}>
                <Ionicons name="star" size={32} color="#fff" style={styles.upgradeIcon} />
                <View style={styles.upgradeTextContainer}>
                  <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                  <Text style={styles.upgradeDescription}>
                    Create unlimited spending buckets and unlock advanced budget features
                  </Text>
                </View>
              </View>
              <Button 
                mode="contained" 
                onPress={() => {}}
                style={[styles.upgradeButton, { backgroundColor: '#fff' }]}
                textColor={colors.primary}
              >
                Go Premium
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Edit Spending Item Modal */}
      <Portal>
        <Modal
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Edit {categoryName}</Text>
          
          <TextInput
            mode="outlined"
            label="Category Name"
            value={categoryName}
            onChangeText={setCategoryName}
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
          
          <TextInput
            mode="outlined"
            label="Budget Amount"
            value={categoryAmount}
            onChangeText={setCategoryAmount}
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
          
          <TextInput
            mode="outlined"
            label="Spent Amount"
            value={categorySpent}
            onChangeText={setCategorySpent}
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

          {/* Category Type Selection */}
          <Text style={[styles.inputLabel, { color: colors.text }]}>Bucket Type:</Text>
          <RadioButton.Group 
            onValueChange={value => setCategoryType(value)} 
            value={categoryType}
          >
            <View style={styles.radioBtnRow}>
              <RadioButton.Item
                label="Essentials"
                value="essentials"
                labelStyle={{color: colors.text}}
                uncheckedColor={colors.grey}
                color={colors.primary}
              />
              <RadioButton.Item
                label="Savings"
                value="savings"
                labelStyle={{color: colors.text}}
                uncheckedColor={colors.grey}
                color={colors.success}
              />
            </View>
            <View style={styles.radioBtnRow}>
              <RadioButton.Item
                label="Discretionary"
                value="discretionary"
                labelStyle={{color: colors.text}}
                uncheckedColor={colors.grey}
                color={colors.secondary}
              />
              <RadioButton.Item
                label="Other"
                value="other"
                labelStyle={{color: colors.text}}
                uncheckedColor={colors.grey}
                color={colors.warning}
              />
            </View>
          </RadioButton.Group>

          <View style={styles.iconColorSelection}>
            <TouchableOpacity 
              style={[styles.iconSelector, { borderColor: colors.border }]}
              onPress={() => setIconsModalVisible(true)}
            >
              <View style={[styles.selectorPreview, { backgroundColor: categoryColor }]}>
                <Ionicons name={categoryIcon} size={24} color="#fff" />
              </View>
              <Text style={[styles.selectorLabel, { color: colors.text }]}>Change Icon</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.colorSelector, { borderColor: colors.border }]}
              onPress={() => setColorsModalVisible(true)}
            >
              <View style={[styles.selectorPreview, { backgroundColor: categoryColor }]}>
                <View style={styles.colorCircle} />
              </View>
              <Text style={[styles.selectorLabel, { color: colors.text }]}>Change Color</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalButtonRow}>
            <Button 
              mode="outlined" 
              onPress={() => setEditModalVisible(false)}
              style={[styles.modalButton, { borderColor: colors.border }]}
              textColor={colors.text}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleUpdateItem}
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
            >
              Save
            </Button>
          </View>
          
          <Button 
            mode="outlined" 
            onPress={handleDeleteItem}
            style={[styles.deleteButton, { borderColor: colors.danger }]}
            textColor={colors.danger}
            icon="delete"
          >
            Delete This Category
          </Button>
        </Modal>

        {/* Create Spending Item Modal */}
        <Modal
          visible={createModalVisible}
          onDismiss={() => setCreateModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Spending Bucket</Text>
          
          <TextInput
            mode="outlined"
            label="Category Name"
            value={categoryName}
            onChangeText={setCategoryName}
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
          
          <TextInput
            mode="outlined"
            label="Budget Amount"
            value={categoryAmount}
            onChangeText={setCategoryAmount}
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
          
          <TextInput
            mode="outlined"
            label="Spent Amount"
            value={categorySpent}
            onChangeText={setCategorySpent}
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

          {/* Category Type Selection */}
          <Text style={[styles.inputLabel, { color: colors.text }]}>Bucket Type:</Text>
          <RadioButton.Group 
            onValueChange={value => setCategoryType(value)} 
            value={categoryType}
          >
            <View style={styles.radioBtnRow}>
              <RadioButton.Item
                label="Essentials"
                value="essentials"
                labelStyle={{color: colors.text}}
                uncheckedColor={colors.grey}
                color={colors.primary}
              />
              <RadioButton.Item
                label="Savings"
                value="savings"
                labelStyle={{color: colors.text}}
                uncheckedColor={colors.grey}
                color={colors.success}
              />
            </View>
            <View style={styles.radioBtnRow}>
              <RadioButton.Item
                label="Discretionary"
                value="discretionary"
                labelStyle={{color: colors.text}}
                uncheckedColor={colors.grey}
                color={colors.secondary}
              />
              <RadioButton.Item
                label="Other"
                value="other"
                labelStyle={{color: colors.text}}
                uncheckedColor={colors.grey}
                color={colors.warning}
              />
            </View>
          </RadioButton.Group>

          <View style={styles.iconColorSelection}>
            <TouchableOpacity 
              style={[styles.iconSelector, { borderColor: colors.border }]}
              onPress={() => setIconsModalVisible(true)}
            >
              <View style={[styles.selectorPreview, { backgroundColor: categoryColor }]}>
                <Ionicons name={categoryIcon} size={24} color="#fff" />
              </View>
              <Text style={[styles.selectorLabel, { color: colors.text }]}>Change Icon</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.colorSelector, { borderColor: colors.border }]}
              onPress={() => setColorsModalVisible(true)}
            >
              <View style={[styles.selectorPreview, { backgroundColor: categoryColor }]}>
                <View style={styles.colorCircle} />
              </View>
              <Text style={[styles.selectorLabel, { color: colors.text }]}>Change Color</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => setCreateModalVisible(false)}
              style={[styles.modalButton, { borderColor: colors.border }]}
              textColor={colors.text}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleCreateItem}
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
            >
              Create
            </Button>
          </View>
        </Modal>

        {/* Icon Selection Modal */}
        <Modal
          visible={iconsModalVisible}
          onDismiss={() => setIconsModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Select Icon</Text>
          
          <ScrollView style={styles.iconGrid}>
            <View style={styles.iconGridContent}>
              {availableIcons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    { 
                      backgroundColor: icon === categoryIcon ? categoryColor : colors.lightGrey,
                      borderColor: icon === categoryIcon ? categoryColor : 'transparent',
                    }
                  ]}
                  onPress={() => {
                    setCategoryIcon(icon);
                    setIconsModalVisible(false);
                  }}
                >
                  <Ionicons 
                    name={icon} 
                    size={24} 
                    color={icon === categoryIcon ? "#fff" : colors.text} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          <Button 
            mode="outlined" 
            onPress={() => setIconsModalVisible(false)}
            style={{ marginTop: 16 }}
            textColor={colors.text}
          >
            Cancel
          </Button>
        </Modal>

        {/* Color Selection Modal */}
        <Modal
          visible={colorsModalVisible}
          onDismiss={() => setColorsModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Select Color</Text>
          
          <View style={styles.colorGrid}>
            {availableColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { 
                    backgroundColor: color,
                    borderWidth: color === categoryColor ? 3 : 0,
                    borderColor: colors.text,
                  }
                ]}
                onPress={() => {
                  setCategoryColor(color);
                  setColorsModalVisible(false);
                }}
              />
            ))}
          </View>
          
          <Button 
            mode="contained" 
            onPress={() => {
              setColorPickerVisible(true);
              setColorsModalVisible(false);
            }}
            style={{ marginTop: 16, marginBottom: 16, backgroundColor: colors.primary }}
            icon="palette"
          >
            Custom Color
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => setColorsModalVisible(false)}
            style={{ marginTop: 8 }}
            textColor={colors.text}
          >
            Cancel
          </Button>
        </Modal>

        {/* Advanced Color Picker Modal */}
        <Modal
          visible={colorPickerVisible}
          onDismiss={() => setColorPickerVisible(false)}
          contentContainerStyle={[styles.modal, styles.colorPickerModal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Custom Color</Text>
          
          <ColorPicker
            value={categoryColor}
            onComplete={({ hex }) => {
              setCategoryColor(hex);
              setColorPickerVisible(false);
            }}
            style={{ width: '100%' }}
          >
            <Preview />
            <Panel1 />
            <HueSlider />
            <OpacitySlider />
            <Swatches />
          </ColorPicker>
          
          <Button 
            mode="outlined" 
            onPress={() => setColorPickerVisible(false)}
            style={{ marginTop: 16 }}
            textColor={colors.text}
          >
            Cancel
          </Button>
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
    marginBottom: 4,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    marginLeft: "auto",
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
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontStyle: "italic",
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
    backgroundColor: "#2F80ED",
  },
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 16,
  },
  iconColorSelection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  iconSelector: {
    flex: 1,
    height: 70,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelector: {
    flex: 1,
    height: 70,
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorPreview: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  selectorLabel: {
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  deleteButton: {
    borderWidth: 1,
  },
  iconGrid: {
    maxHeight: 260,
  },
  iconGridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  iconOption: {
    width: "18%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  colorOption: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  upgradeContent: {
    flexDirection: "row",
    marginBottom: 16,
  },
  upgradeIcon: {
    marginRight: 12,
  },
  upgradeTextContainer: {
    flex: 1,
  },
  upgradeTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  upgradeDescription: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  upgradeButton: {
    borderRadius: 8,
  },
  colorPickerModal: {
    maxHeight: "90%",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 8,
  },
  radioBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});