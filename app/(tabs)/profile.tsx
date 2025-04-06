import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch as RNSwitch, Alert } from "react-native";
import { Card, Avatar, List, Divider, Button, Modal, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { useBudget } from "@/context/BudgetContext";

export default function Profile() {
  const nativeColorScheme = useColorScheme();
  const { theme, toggleTheme, isSystemTheme, setIsSystemTheme } = useThemeContext();
  const { isPremium, setIsPremium, spendingItems } = useBudget();
  const colors = Colors[theme ?? "light"];
  
  const [notifications, setNotifications] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(theme === "dark");
  const [useSystemTheme, setUseSystemTheme] = useState(isSystemTheme);
  const [accountTypeModalVisible, setAccountTypeModalVisible] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState(isPremium ? "premium" : "free");
  
  // Update local state when theme context changes
  useEffect(() => {
    setDarkMode(theme === "dark");
    setUseSystemTheme(isSystemTheme);
  }, [theme, isSystemTheme]);

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    // If we're using system theme, first switch to manual
    if (useSystemTheme) {
      setIsSystemTheme(false);
      setUseSystemTheme(false);
    }
    toggleTheme();
    setDarkMode(!darkMode);
  };

  // Handle system theme toggle
  const handleSystemThemeToggle = (value: boolean) => {
    setUseSystemTheme(value);
    setIsSystemTheme(value);
    if (value) {
      // If switching to system theme, update dark mode toggle to match system
      setDarkMode(nativeColorScheme === 'dark');
    }
  };

  // Handle account type selection
  const handleAccountTypeChange = (type: string) => {
    setSelectedAccountType(type);
  };

  // Save account type changes
  const handleSaveAccountType = () => {
    // Check if trying to downgrade from premium to free with more than 5 spending buckets
    if (selectedAccountType === 'free' && isPremium && spendingItems.length > 5) {
      Alert.alert(
        "Cannot Downgrade",
        "You currently have more than 5 spending buckets. Please reduce to 5 or fewer buckets before downgrading to a free account.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setIsPremium(selectedAccountType === 'premium');
    setAccountTypeModalVisible(false);
  };
  
  const user = {
    name: "Omar Ahmed",
    email: "Omar.Ahmed@example.com",
    accountNumber: "**** **** 4567",
    memberSince: "March 2023",
    photo: null, // In a real app, this would be a URI to the user's photo
  };
  
  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Profile Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <Avatar.Text 
            size={100} 
            label="OA" 
            style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            color="#fff"
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
        </View>
        
        {/* Account Information */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Information</Text>
            
            <List.Item
              title="Account Number"
              description={user.accountNumber}
              left={props => <List.Icon {...props} icon="card-account-details-outline" color={colors.primary} />}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.grey }}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Account Type"
              description={isPremium ? "Premium" : "Free"}
              left={props => <List.Icon {...props} icon="star-outline" color={colors.primary} />}
              right={props => (
                <TouchableOpacity onPress={() => setAccountTypeModalVisible(true)}>
                  <Ionicons name="pencil-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.grey }}
              onPress={() => setAccountTypeModalVisible(true)}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Linked Accounts"
              description="2 accounts linked"
              left={props => <List.Icon {...props} icon="link-variant" color={colors.primary} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={colors.grey} />}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.grey }}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>
        
        {/* Settings */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Push Notifications</Text>
                <Text style={[styles.settingDescription, { color: colors.grey }]}>
                  Receive alerts for transactions and updates
                </Text>
              </View>
              <RNSwitch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={notifications ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Biometric Authentication</Text>
                <Text style={[styles.settingDescription, { color: colors.grey }]}>
                  Use fingerprint or face ID to login
                </Text>
              </View>
              <RNSwitch
                value={biometricAuth}
                onValueChange={setBiometricAuth}
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={biometricAuth ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.settingDescription, { color: colors.grey }]}>
                  Switch between light and dark themes
                </Text>
              </View>
              <RNSwitch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={darkMode ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Use System Theme</Text>
                <Text style={[styles.settingDescription, { color: colors.grey }]}>
                  Automatically switch between light and dark themes based on system settings
                </Text>
              </View>
              <RNSwitch
                value={useSystemTheme}
                onValueChange={handleSystemThemeToggle}
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={useSystemTheme ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </Card.Content>
        </Card>
        
        {/* Security */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
            
            <List.Item
              title="Change Password"
              left={props => <List.Icon {...props} icon="lock-outline" color={colors.primary} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={colors.grey} />}
              titleStyle={{ color: colors.text }}
              onPress={() => {}}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Privacy Settings"
              left={props => <List.Icon {...props} icon="shield-outline" color={colors.primary} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={colors.grey} />}
              titleStyle={{ color: colors.text }}
              onPress={() => {}}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Two-Factor Authentication"
              left={props => <List.Icon {...props} icon="cellphone-key" color={colors.primary} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={colors.grey} />}
              titleStyle={{ color: colors.text }}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>
        
        {/* Support and About */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
            
            <List.Item
              title="Help Center"
              left={props => <List.Icon {...props} icon="help-circle-outline" color={colors.primary} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={colors.grey} />}
              titleStyle={{ color: colors.text }}
              onPress={() => {}}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Contact Support"
              left={props => <List.Icon {...props} icon="message-outline" color={colors.primary} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={colors.grey} />}
              titleStyle={{ color: colors.text }}
              onPress={() => {}}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="About"
              description="Version 1.0.0"
              left={props => <List.Icon {...props} icon="information-outline" color={colors.primary} />}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.grey }}
            />
          </Card.Content>
        </Card>
        
        {/* Logout Button */}
        <Button 
          mode="outlined" 
          onPress={() => {}}
          style={[styles.logoutButton, { borderColor: colors.danger }]}
          textColor={colors.danger}
          icon="logout"
        >
          Log Out
        </Button>
      </ScrollView>

      {/* Account Type Modal */}
      <Portal>
        <Modal
          visible={accountTypeModalVisible}
          onDismiss={() => setAccountTypeModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Select Account Type</Text>
          
          <TouchableOpacity 
            style={[
              styles.accountTypeOption, 
              selectedAccountType === 'free' && [styles.selectedOption, { borderColor: colors.primary }],
              { backgroundColor: colors.background }
            ]}
            onPress={() => handleAccountTypeChange('free')}
          >
            <View style={styles.accountTypeContent}>
              <Ionicons 
                name={selectedAccountType === 'free' ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={selectedAccountType === 'free' ? colors.primary : colors.grey} 
                style={styles.radioIcon}
              />
              <View style={styles.accountTypeDetails}>
                <Text style={[styles.accountTypeTitle, { color: colors.text }]}>Free Account</Text>
                <Text style={[styles.accountTypeDescription, { color: colors.grey }]}>
                  • Up to 5 spending buckets
                </Text>
                <Text style={[styles.accountTypeDescription, { color: colors.grey }]}>
                  • Basic budget features
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.accountTypeOption, 
              selectedAccountType === 'premium' && [styles.selectedOption, { borderColor: colors.primary }],
              { backgroundColor: colors.background }
            ]}
            onPress={() => handleAccountTypeChange('premium')}
          >
            <View style={styles.accountTypeContent}>
              <Ionicons 
                name={selectedAccountType === 'premium' ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={selectedAccountType === 'premium' ? colors.primary : colors.grey} 
                style={styles.radioIcon}
              />
              <View style={styles.accountTypeDetails}>
                <Text style={[styles.accountTypeTitle, { color: colors.text }]}>Premium Account</Text>
                <Text style={[styles.accountTypeDescription, { color: colors.grey }]}>
                  • Unlimited spending buckets
                </Text>
                <Text style={[styles.accountTypeDescription, { color: colors.grey }]}>
                  • Advanced budget analytics
                </Text>
                <Text style={[styles.accountTypeDescription, { color: colors.grey }]}>
                  • Priority customer support
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <Text style={[styles.demoNotice, { color: colors.grey }]}>
            Note: This is a demo app. In a real app, account upgrades would require payment and verification.
          </Text>
          
          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => setAccountTypeModalVisible(false)}
              style={[styles.modalButton, { borderColor: colors.border }]}
              textColor={colors.text}
              theme={{
                colors: {
                  outline: colors.border,
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSaveAccountType}
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              theme={{
                colors: {
                  primary: colors.primary,
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
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  divider: {
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: 8,
    borderWidth: 1.5,
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
  accountTypeOption: {
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderWidth: 2,
  },
  accountTypeContent: {
    flexDirection: "row",
    padding: 16,
  },
  radioIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  accountTypeDetails: {
    flex: 1,
  },
  accountTypeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  accountTypeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  demoNotice: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
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