import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addNewBond } from '../../store/slices/bonds';
import { colors } from '../../utils/assets';
import { DENOMINATIONS, DENOMINATION_LABELS } from '../../constants/network';
import CustomInput from '../../components/common/CustomInput';
import Toast from 'react-native-toast-message';

const addBondSchema = Yup.object().shape({
  bondNumber: Yup.string()
    .matches(/^\d{6}$/, 'Bond number must be exactly 6 digits')
    .required('Bond number is required'),
  denomination: Yup.number()
    .oneOf(DENOMINATIONS, 'Select a valid denomination')
    .required('Denomination is required'),
  nickname: Yup.string()
    .max(30, 'Nickname cannot exceed 30 characters')
    .nullable(),
});

const AddBondScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.bonds);

  const handleAdd = async values => {
    try {
      await dispatch(addNewBond(values));

      Toast.show({
        type: 'success',
        text1: 'Bond added successfully!',
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Failed to add bond',
      });
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bottomOffset={50}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Add New Bond</Text>

        <Formik
          initialValues={{ bondNumber: '', denomination: '', nickname: '' }}
          validationSchema={addBondSchema}
          onSubmit={handleAdd}
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

              <View>
                <Text style={styles.denomLabel}>Select Denomination</Text>
                <View style={styles.denomGrid}>
                  {DENOMINATIONS.map(denom => (
                    <TouchableOpacity
                      key={denom}
                      style={[
                        styles.denomBtn,
                        values.denomination === denom && styles.denomBtnActive,
                      ]}
                      onPress={() => setFieldValue('denomination', denom)}
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

              <CustomInput
                label="Nickname (optional)"
                placeholder="e.g., Lucky Bond"
                value={values.nickname}
                onChangeText={handleChange('nickname')}
                onBlur={handleBlur('nickname')}
                error={errors.nickname}
                touched={touched.nickname}
              />

              <TouchableOpacity
                style={[styles.submitBtn, isLoading && styles.disabledBtn]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>Save Bond</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  backBtn: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
  },
  form: { gap: 16 },
  denomLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  denomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
  errorText: { fontSize: 12, color: colors.error, marginTop: 4 },
  submitBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  disabledBtn: { opacity: 0.6 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default AddBondScreen;
