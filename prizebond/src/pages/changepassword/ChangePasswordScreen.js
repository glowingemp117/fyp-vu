import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors } from "../../utils/assets";
import CustomInput from "../../components/common/CustomInput";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Current password is required"),

  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePasswordScreen = ({ navigation }) => {
  const isLoading = false;

  const handleChangePassword = async (values) => {
    try {
      console.log("Password Values:", values);

      Toast.show({
        type: "success",
        text1: "Password changed successfully!",
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to change password",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bottomOffset={50}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Change Password</Text>

          <View style={{ width: 60 }} />
        </View>

        {/* Top Card */}
        <View style={styles.profileCard}>
          <View style={styles.lockCircle}>
            <Text style={styles.lockEmoji}>🔒</Text>
          </View>

          <Text style={styles.userName}>Security Settings</Text>

          <Text style={styles.userEmail}>
            Update your password to keep your account secure
          </Text>
        </View>

        {/* Form */}
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={changePasswordSchema}
          onSubmit={handleChangePassword}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.form}>
              <CustomInput
                label="Current Password"
                placeholder="Enter current password"
                secureTextEntry
                value={values.currentPassword}
                onChangeText={handleChange("currentPassword")}
                onBlur={handleBlur("currentPassword")}
                error={errors.currentPassword}
                touched={touched.currentPassword}
              />

              <CustomInput
                label="New Password"
                placeholder="Enter new password"
                secureTextEntry
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                error={errors.newPassword}
                touched={touched.newPassword}
              />

              <CustomInput
                label="Confirm Password"
                placeholder="Confirm new password"
                secureTextEntry
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
              />

              {/* Update Button */}
              <TouchableOpacity
                style={[styles.updateBtn, isLoading && styles.disabledBtn]}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.updateBtnText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    height: 60,
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

  /* Top Card */
  profileCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 24,
  },

  lockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  lockEmoji: {
    fontSize: 34,
  },

  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 20,
  },

  /* Form */
  form: {
    gap: 14,
  },

  updateBtn: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  disabledBtn: {
    opacity: 0.6,
  },

  updateBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
