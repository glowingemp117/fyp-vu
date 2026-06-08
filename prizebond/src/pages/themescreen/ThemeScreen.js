import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors } from "../../utils/assets";
import { SafeAreaView } from "react-native-safe-area-context";

const ThemeScreen = ({ navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState("light");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Theme</Text>
        <TouchableOpacity>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Card */}
        <View style={styles.topCard}>
          <Text style={styles.emoji}>🎨</Text>

          <Text style={styles.title}>Choose Theme</Text>

          <Text style={styles.subtitle}>
            Select how the app should look and feel
          </Text>
        </View>

        {/* Theme Options */}
        <View style={styles.card}>
          {/* Light Theme */}
          <TouchableOpacity
            onPress={() => setSelectedTheme("light")}
            style={styles.item}
            activeOpacity={0.8}
          >
            <Text style={styles.icon}>🌞</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Light Mode</Text>
              <Text style={styles.desc}>Bright and clean interface</Text>
            </View>

            <View style={styles.radio}>
              {selectedTheme === "light" && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          {/* Dark Theme */}
          <TouchableOpacity
            onPress={() => setSelectedTheme("dark")}
            style={styles.item}
            activeOpacity={0.8}
          >
            <Text style={styles.icon}>🌙</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Dark Mode</Text>
              <Text style={styles.desc}>Easy on eyes in low light</Text>
            </View>

            <View style={styles.radio}>
              {selectedTheme === "dark" && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          {/* System Theme */}
          <TouchableOpacity
            onPress={() => setSelectedTheme("system")}
            style={styles.item}
            activeOpacity={0.8}
          >
            <Text style={styles.icon}>⚙️</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>System Default</Text>
              <Text style={styles.desc}>Follow device settings</Text>
            </View>

            <View style={styles.radio}>
              {selectedTheme === "system" && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Theme changes will apply after restart or save.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ThemeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header */
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

  saveBtn: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  /* Top Card */
  topCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  emoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
  },

  /* Card */
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    overflow: "hidden",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  icon: {
    fontSize: 22,
    marginRight: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },

  desc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 12,
    color: colors.textSecondary,
  },
});
