import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtpEmail } from '../../store/slices/user';
import { colors } from '../../utils/assets';
import Toast from 'react-native-toast-message';

const VerifyOtpScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.user);
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Please enter the complete 6-digit OTP',
      });
      return;
    }

    try {
      await dispatch(verifyOtpEmail({ email, otp }));
      Toast.show({
        type: 'success',
        text1: 'OTP verified successfully!',
      });
      navigation.navigate('ResetPassword', { email });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.message || 'OTP verification failed',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backBtn}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {email}
        </Text>
      </View>

      <OtpInput
        numberOfDigits={6}
        onTextChange={setOtp}
        focusColor={colors.primary}
        theme={{
          containerStyle: styles.otpContainer,
          pinCodeContainerStyle: styles.otpBox,
          pinCodeTextStyle: styles.otpText,
          focusedPinCodeContainerStyle: styles.otpBoxFocused,
        }}
      />

      <TouchableOpacity
        style={[styles.verifyBtn, isLoading && styles.disabledBtn]}
        onPress={handleVerify}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.verifyBtnText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backBtn: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
  },
  header: { marginBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  otpContainer: { marginBottom: 32 },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  otpBoxFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  otpText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  verifyBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: { opacity: 0.6 },
  verifyBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default VerifyOtpScreen;
