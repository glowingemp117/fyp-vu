import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { colors } from "../../utils/assets";

const languages = [
  {
    id: 1,
    name: "English",
    code: "EN",
    emoji: "🇺🇸",
  },
  {
    id: 2,
    name: "Urdu",
    code: "UR",
    emoji: "🇵🇰",
  },
  {
    id: 3,
    name: "Arabic",
    code: "AR",
    emoji: "🇸🇦",
  },
  {
    id: 4,
    name: "French",
    code: "FR",
    emoji: "🇫🇷",
  },
  {
    id: 5,
    name: "German",
    code: "DE",
    emoji: "🇩🇪",
  },
  {
    id: 6,
    name: "Chinese",
    code: "CN",
    emoji: "🇨🇳",
  },
];

const LanguageScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Language</Text>

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
          <View style={styles.languageCircle}>
            <Text style={styles.languageEmoji}>🌐</Text>
          </View>

          <Text style={styles.title}>Choose Your Language</Text>

          <Text style={styles.subtitle}>
            Select the language you want to use in the app
          </Text>
        </View>

        {/* Language List */}
        <View style={styles.card}>
          {languages.map((item, index) => {
            const isSelected = selectedLanguage === item.name;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => handleSelectLanguage(item.name)}
                style={[
                  styles.languageItem,
                  index !== languages.length - 1 && styles.divider,
                ]}
              >
                <View style={styles.leftRow}>
                  <Text style={styles.flag}>{item.emoji}</Text>

                  <View>
                    <Text style={styles.languageName}>{item.name}</Text>

                    <Text style={styles.languageCode}>{item.code}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterActive,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.bottomText}>
          Your selected language will be applied across the app.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LanguageScreen;

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
    backgroundColor: colors.background,
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

  saveBtn: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },

  /* Content */
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

  languageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  languageEmoji: {
    fontSize: 36,
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

  /* Card */
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    overflow: "hidden",

    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  flag: {
    fontSize: 28,
    marginRight: 14,
  },

  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },

  languageCode: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  /* Radio */
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  radioOuterActive: {
    borderColor: colors.primary,
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },

  bottomText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
