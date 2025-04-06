import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define TypeScript types for the icons to avoid type errors
type IconName = React.ComponentProps<typeof Ionicons>["name"];

export interface SpendingItem {
  id: string;
  category: string;
  amount: number;
  spent: number;
  icon: IconName;
  color: string;
  type?: string; // New property for categorization (essentials, savings, discretionary)
}

interface BudgetContextType {
  income: number;
  setIncome: (income: number) => void;
  spendingItems: SpendingItem[];
  addSpendingItem: (item: Omit<SpendingItem, 'id'>) => void;
  updateSpendingItem: (id: string, item: Partial<SpendingItem>) => void;
  removeSpendingItem: (id: string) => void;
  isPremium: boolean;
  setIsPremium: (isPremium: boolean) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const defaultSpendingItems: SpendingItem[] = [
  {
    id: '1',
    category: "Housing",
    amount: 1200,
    spent: 1200,
    icon: "home-outline",
    color: "#2F80ED", // primary
    type: "essentials"
  },
  {
    id: '2',
    category: "Groceries",
    amount: 500,
    spent: 320,
    icon: "cart-outline",
    color: "#5CC9F5", // secondary
    type: "essentials"
  },
  {
    id: '3',
    category: "Utilities",
    amount: 300,
    spent: 220,
    icon: "flash-outline",
    color: "#FF8C00",
    type: "essentials"
  },
  {
    id: '4',
    category: "Transportation",
    amount: 200,
    spent: 180,
    icon: "car-outline",
    color: "#8A2BE2",
    type: "essentials"
  },
  {
    id: '5',
    category: "Dining",
    amount: 400,
    spent: 350,
    icon: "restaurant-outline",
    color: "#FF4500",
    type: "discretionary"
  }
];

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [income, setIncomeState] = useState(5000);
  const [spendingItems, setSpendingItems] = useState<SpendingItem[]>(defaultSpendingItems);
  const [isPremium, setIsPremium] = useState(false);

  // Load saved budget data
  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        const savedIncome = await AsyncStorage.getItem('income');
        const savedSpendingItems = await AsyncStorage.getItem('spendingItems');
        const savedIsPremium = await AsyncStorage.getItem('isPremium');
        
        if (savedIncome) {
          setIncomeState(parseFloat(savedIncome));
        }
        
        if (savedSpendingItems) {
          setSpendingItems(JSON.parse(savedSpendingItems));
        }

        if (savedIsPremium) {
          setIsPremium(savedIsPremium === 'true');
        }
      } catch (e) {
        console.error('Error loading budget data', e);
      }
    };
    
    loadBudgetData();
  }, []);

  const saveIncome = async (value: number) => {
    try {
      await AsyncStorage.setItem('income', value.toString());
      setIncomeState(value);
    } catch (e) {
      console.error('Error saving income', e);
    }
  };

  const saveSpendingItems = async (items: SpendingItem[]) => {
    try {
      await AsyncStorage.setItem('spendingItems', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving spending items', e);
    }
  };

  const savePremiumStatus = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('isPremium', value.toString());
      setIsPremium(value);
    } catch (e) {
      console.error('Error saving premium status', e);
    }
  };

  const addSpendingItem = (item: Omit<SpendingItem, 'id'>) => {
    // Check if we can add more spending items (limit to 5 for non-premium users)
    if (!isPremium && spendingItems.length >= 5) {
      return;
    }
    
    const newItem = {
      ...item,
      id: Date.now().toString(),
    };
    
    const updatedItems = [...spendingItems, newItem];
    setSpendingItems(updatedItems);
    saveSpendingItems(updatedItems);
  };

  const updateSpendingItem = (id: string, updates: Partial<SpendingItem>) => {
    const updatedItems = spendingItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    setSpendingItems(updatedItems);
    saveSpendingItems(updatedItems);
  };

  const removeSpendingItem = (id: string) => {
    const updatedItems = spendingItems.filter(item => item.id !== id);
    setSpendingItems(updatedItems);
    saveSpendingItems(updatedItems);
  };

  return (
    <BudgetContext.Provider 
      value={{ 
        income,
        setIncome: saveIncome,
        spendingItems,
        addSpendingItem,
        updateSpendingItem,
        removeSpendingItem,
        isPremium,
        setIsPremium: savePremiumStatus
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};