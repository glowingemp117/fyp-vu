import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors } from "../../utils/assets";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Privacy Policy</Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top Card */}
        <View style={styles.topCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.emoji}>🔐</Text>
          </View>

          <Text style={styles.title}>Privacy Policy</Text>

          <Text style={styles.subtitle}>
            Your privacy and personal information are important to us.
          </Text>
        </View>

        {/* Content */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Information Collection</Text>

          <Text style={styles.description}>
            We collect information that you provide directly to us when creating
            an account or using our services.
          </Text>

          <Text style={styles.sectionTitle}>Data Usage</Text>

          <Text style={styles.description}>
            Your information is used to improve app functionality and provide a
            better user experience.
          </Text>

          <Text style={styles.sectionTitle}>Security</Text>

          <Text style={styles.description}>
            We implement strong security measures to protect your data from
            unauthorized access.
          </Text>

          <Text style={styles.sectionTitle}>Third-Party Services</Text>

          <Text style={styles.description}>
            Some services may involve trusted third-party providers for
            analytics and notifications.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backBtn: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  topCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  emoji: {
    fontSize: 34,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    marginTop: 14,
  },

  description: {
    fontSize: 14,
    lineHeight: 24,
    color: colors.textSecondary,
  },
});
