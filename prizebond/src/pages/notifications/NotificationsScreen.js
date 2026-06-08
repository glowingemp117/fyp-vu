import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/assets";
import { SafeAreaView } from "react-native-safe-area-context";

const notifications = [
  {
    id: 1,
    title: "💼 New Job Alert",
    message: "A new plumbing job is available near your location.",
    time: "2 min ago",
    emoji: "💼",
  },
  {
    id: 2,
    title: "✅ Application Approved",
    message: "Your application has been approved successfully.",
    time: "1 hour ago",
    emoji: "✅",
  },
  {
    id: 3,
    title: "💬 New Message",
    message: "You received a message from Ahmad Builders.",
    time: "3 hours ago",
    emoji: "💬",
  },
  {
    id: 4,
    title: "💰 Payment Received",
    message: "You received a payment of $120.",
    time: "Yesterday",
    emoji: "💰",
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.headerEmoji}>🔔</Text>
          </View>

          <Text style={styles.userName}>Notifications</Text>

          <Text style={styles.userEmail}>
            Stay updated with latest activities
          </Text>
        </View>

        {/* Notifications List */}
        <View style={styles.menuCard}>
          {notifications.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[
                styles.menuItem,
                index !== notifications.length - 1 && styles.menuDivider,
              ]}
            >
              <View style={styles.iconWrap}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.title}</Text>

                <Text style={styles.messageText}>{item.message}</Text>

                <Text style={styles.timeText}>{item.time}</Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>No more notifications</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.background,
    minHeight: 60,
  },

  backBtn: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
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

  headerEmoji: {
    fontSize: 32,
  },

  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },

  /* Notifications Card */
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

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: {
    fontSize: 20,
  },

  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },

  messageText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },

  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  arrow: {
    fontSize: 22,
    color: colors.textSecondary,
    fontWeight: "600",
  },

  version: {
    textAlign: "center",
    fontSize: 12,
    color: colors.textSecondary,
  },
});
