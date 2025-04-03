import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch as RNSwitch } from "react-native";
import { Card, Avatar, List, Divider, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  
  const [notifications, setNotifications] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === "dark");
  
  const user = {
    name: "Omar Johnson",
    email: "Omar.johnson@example.com",
    accountNumber: "**** **** 4567",
    memberSince: "March 2023",
    photo: null, // In a real app, this would be a URI to the user's photo
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Avatar.Text 
          size={100} 
          label="AJ" 
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
            description="Premium"
            left={props => <List.Icon {...props} icon="star-outline" color={colors.primary} />}
            titleStyle={{ color: colors.text }}
            descriptionStyle={{ color: colors.grey }}
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
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={darkMode ? "#f4f3f4" : "#f4f3f4"}
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
});