import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { checkBondNumber, clearCheckResult } from '../../store/slices/bonds';
import { colors } from '../../utils/assets';
import { DENOMINATIONS, DENOMINATION_LABELS } from '../../constants/network';
import CustomInput from '../../components/common/CustomInput';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

// Uncomment when using VisionCamera
// import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

const scanSchema = Yup.object().shape({
  bondNumber: Yup.string()
    .matches(/^\d{6}$/, 'Bond number must be exactly 6 digits')
    .required('Bond number is required'),
  denomination: Yup.number()
    .oneOf(DENOMINATIONS, 'Select a valid denomination')
    .required('Denomination is required'),
});

const ScanBondScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading, checkResult } = useSelector(state => state.bonds);
  const [mode, setMode] = useState('manual'); // 'camera' | 'manual'
  const [selectedDenom, setSelectedDenom] = useState(null);

  const handleCheck = async values => {
    try {
      const result = await dispatch(
        checkBondNumber({
          bondNumber: values.bondNumber,
          denomination: values.denomination,
        }),
      );
      if (result?.data?.data?.isWinner) {
        Toast.show({
          type: 'success',
          text1: 'Congratulations! Your bond is a winner!',
        });
      } else {
        Toast.show({
          type: 'info',
          text1: 'No win found for this bond number',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Failed to check bond',
      });
    }
  };

  // Camera scanner handler (placeholder for VisionCamera integration)
  const handleScannedCode = useCallback(codes => {
    if (codes.length > 0) {
      const scannedValue = codes[0].value;
      // Extract 6-digit number from scanned text
      const match = scannedValue?.match(/\d{6}/);
      if (match) {
        setMode('manual');
        Toast.show({
          type: 'success',
          text1: `Scanned bond number: ${match[0]}`,
        });
        // Optionally, you can auto-fill the form with the scanned bond number
        // setFieldValue('bondNumber', match[0]);
      } else {
        Toast.show({
          type: 'error',
          text1: 'No valid bond number found in scan',
        });
      }
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bottomOffset={50}
      >
        <Text style={styles.title}>Check Bond</Text>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'manual' && styles.modeBtnActive]}
            onPress={() => setMode('manual')}
          >
            <Text
              style={[
                styles.modeBtnText,
                mode === 'manual' && styles.modeBtnTextActive,
              ]}
            >
              ✏️ Manual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'camera' && styles.modeBtnActive]}
            onPress={() => {
              setMode('camera');
              Toast.show({
                type: 'info',
                text1:
                  'Camera scanning requires VisionCamera setup on a physical device',
              });
            }}
          >
            <Text
              style={[
                styles.modeBtnText,
                mode === 'camera' && styles.modeBtnTextActive,
              ]}
            >
              📷 Scanner
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'camera' ? (
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.cameraText}>
              Camera scanning requires {'\n'}VisionCamera on a physical device
            </Text>
            <Text style={styles.cameraHint}>
              Align the bond number inside the frame
            </Text>
          </View>
        ) : (
          <Formik
            initialValues={{ bondNumber: '', denomination: '' }}
            validationSchema={scanSchema}
            onSubmit={handleCheck}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.form}>
                <CustomInput
                  label="Bond Number"
                  placeholder="Enter 6-digit number"
                  keyboardType="numeric"
                  maxLength={6}
                  value={values.bondNumber}
                  onChangeText={text =>
                    setFieldValue('bondNumber', text.replace(/\D/g, ''))
                  }
                  onBlur={handleBlur('bondNumber')}
                  error={errors.bondNumber}
                  touched={touched.bondNumber}
                />

                {/* Denomination Grid */}
                <View>
                  <Text style={styles.denomLabel}>Select Denomination</Text>
                  <View style={styles.denomGrid}>
                    {DENOMINATIONS.map(denom => (
                      <TouchableOpacity
                        key={denom}
                        style={[
                          styles.denomBtn,
                          values.denomination === denom &&
                            styles.denomBtnActive,
                        ]}
                        onPress={() => {
                          setFieldValue('denomination', denom);
                          setSelectedDenom(denom);
                        }}
                      >
                        <Text
                          style={[
                            styles.denomText,
                            values.denomination === denom &&
                              styles.denomTextActive,
                          ]}
                        >
                          {DENOMINATION_LABELS[denom]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {touched.denomination && errors.denomination ? (
                    <Text style={styles.errorText}>{errors.denomination}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={[styles.checkBtn, isLoading && styles.disabledBtn]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.checkBtnText}>Check Bond Number</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        )}

        {/* Result Display */}
        {checkResult && (
          <View
            style={[
              styles.resultCard,
              checkResult.isWinner ? styles.resultWin : styles.resultLose,
            ]}
          >
            <Text style={styles.resultTitle}>
              {checkResult.isWinner ? '🎉 Winner!' : '😔 Not a Winner'}
            </Text>
            <Text style={styles.resultBond}>
              Bond: {checkResult.bondNumber} | Rs.{' '}
              {checkResult.denomination?.toLocaleString()}
            </Text>
            {checkResult.isWinner &&
              checkResult.results?.map((r, i) => (
                <View key={i} style={styles.resultDetail}>
                  <Text style={styles.resultPrize}>
                    {r.prizeCategory?.toUpperCase()} Prize - Rs.{' '}
                    {r.amount?.toLocaleString()}
                  </Text>
                  <Text style={styles.resultDraw}>
                    Draw #{r.drawNumber} | {r.city}
                  </Text>
                </View>
              ))}
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: colors.primary },
  modeBtnText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  modeBtnTextActive: { color: '#FFFFFF' },
  cameraPlaceholder: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    aspectRatio: 3 / 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraIcon: { fontSize: 60, marginBottom: 16 },
  cameraText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  cameraHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 12,
  },
  form: { gap: 16 },
  denomLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  denomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  denomBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  denomBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  denomText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  denomTextActive: { color: colors.primary },
  errorText: { fontSize: 12, color: colors.error, marginTop: 4, marginLeft: 4 },
  checkBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  disabledBtn: { opacity: 0.6 },
  checkBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  resultWin: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#059669',
  },
  resultLose: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  resultBond: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  resultDetail: { marginTop: 8 },
  resultPrize: { fontSize: 15, fontWeight: '700', color: '#059669' },
  resultDraw: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});

export default ScanBondScreen;
