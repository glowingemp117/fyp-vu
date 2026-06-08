import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../utils/assets';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsConditionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Terms & Conditions
        </Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top Card */}
        <View style={styles.topCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.emoji}>📄</Text>
          </View>

          <Text style={styles.title}>
            Terms & Conditions
          </Text>

          <Text style={styles.subtitle}>
            Please read our terms and conditions
            carefully before using the app.
          </Text>
        </View>

        {/* Content Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            1. Acceptance of Terms
          </Text>

          <Text style={styles.description}>
            By accessing and using this app, you
            accept and agree to be bound by the
            terms and conditions of this agreement.
          </Text>

          <Text style={styles.sectionTitle}>
            2. User Responsibilities
          </Text>

          <Text style={styles.description}>
            Users are responsible for maintaining
            the confidentiality of their account
            and password and for restricting access
            to their devices.
          </Text>

          <Text style={styles.sectionTitle}>
            3. Privacy
          </Text>

          <Text style={styles.description}>
            Your privacy is important to us. We are
            committed to protecting your personal
            information and data.
          </Text>

          <Text style={styles.sectionTitle}>
            4. Updates
          </Text>

          <Text style={styles.description}>
            We may update these terms from time to
            time. Continued use of the app means
            you agree to the updated terms.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header */
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },

  backBtn: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    alignItems: 'center',
    marginBottom: 20,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  emoji: {
    fontSize: 34,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 20,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,

    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
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