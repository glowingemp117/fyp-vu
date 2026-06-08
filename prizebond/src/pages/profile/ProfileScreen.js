import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, deleteAccount } from "../../store/slices/user";
import { colors } from "../../utils/assets";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await dispatch(logoutUser());
            Toast.show({
              type: "success",
            text1: "Logged out successfully!",
            });
          } catch (error) {
            Toast.show({
              type: "error",
              text1: error?.message || "Logout failed. Please try again.",
            });
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteAccount());

              Toast.show({
                type: "success",
                text1: "Account deleted successfully!",
              });
            } catch (error) {
              Toast.show({
                type: "error",
                text1: error?.message || "Failed to delete account",
              });
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: "👤",
      label: "Edit Profile",
      onPress: () => navigation.navigate("EditProfileScreen"),
    },
    {
      icon: "🔒",
      label: "Change Password",
      onPress: () => navigation.navigate("ChangePasswordScreen"),
    },
    {
      icon: "🔔",
      label: "Notifications",
      onPress: () => navigation.navigate("Notifications"),
    },
    { icon: "🎨", label: "Theme", onPress: () => navigation.navigate('ThemeScreen') },
    { icon: "🌐", label: "Language", onPress: () => navigation.navigate("LanguageScreen") },
    { icon: "📄", label: "Terms & Conditions", onPress: () => {navigation.navigate("TermsConditionsScreen")} },
    { icon: "🔐", label: "Privacy Policy", onPress: () => {navigation.navigate("PrivacyPolicyScreen")} },
    { icon: "ℹ️", label: "About", onPress: () => {navigation.navigate("AboutScreen")} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.name?.[0]?.toUpperCase() || "G"}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
          <Text style={styles.userEmail}>
            {user?.email || "testuser@gmail.com"}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuDivider,
              ]}
              onPress={item.onPress}
            >
              <Text style={{ fontSize: 18 }}>{item.icon || "👤"} </Text>
              <Text style={styles.menuLabel}>
                {item.label || "this is a label"}
              </Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>🗑️ Delete Account</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Prize Bond App v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  profileCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: { fontSize: 14, color: "rgba(255,255,255,0.7)" },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "500", color: colors.text },
  menuArrow: { fontSize: 22, color: colors.textSecondary },
  logoutBtn: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: colors.text },
  deleteBtn: {
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  deleteText: { fontSize: 14, fontWeight: "600", color: colors.error },
  version: { textAlign: "center", fontSize: 12, color: colors.textSecondary },
});

export default ProfileScreen;
