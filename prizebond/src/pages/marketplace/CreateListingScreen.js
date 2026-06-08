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
import { createListing } from '../../store/slices/marketplace';
import { colors } from '../../utils/assets';
import {
  DENOMINATIONS,
  DENOMINATION_LABELS,
  CITIES,
} from '../../constants/network';
import CustomInput from '../../components/common/CustomInput';
import Toast from 'react-native-toast-message';

const listingSchema = Yup.object().shape({
  denomination: Yup.number()
    .oneOf(DENOMINATIONS, 'Select a valid denomination')
    .required('Denomination is required'),
  quantity: Yup.number()
    .min(1, 'Minimum 1 bond')
    .max(1000, 'Maximum 1000 bonds')
    .required('Quantity is required'),
  pricePerBond: Yup.number()
    .min(1, 'Price must be positive')
    .required('Price is required'),
  contactNumber: Yup.string()
    .matches(/^03\d{9}$/, 'Enter valid number (03XXXXXXXXX)')
    .required('Contact number is required'),
  city: Yup.string().required('City is required'),
  description: Yup.string().max(500, 'Max 500 characters'),
});

const CreateListingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.marketplace);

  const handleCreate = async values => {
    try {
      await dispatch(createListing(values));
      Toast.show({
        type: 'success',
        text1: 'Listing created successfully!',
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Failed to create listing',
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
        <Text style={styles.title}>Sell Prize Bonds</Text>

        <Formik
          initialValues={{
            denomination: '',
            quantity: '',
            pricePerBond: '',
            contactNumber: '',
            city: '',
            description: '',
          }}
          validationSchema={listingSchema}
          onSubmit={handleCreate}
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
              <View>
                <Text style={styles.label}>Denomination</Text>
                <View style={styles.denomGrid}>
                  {DENOMINATIONS.map(d => (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.denomBtn,
                        values.denomination === d && styles.denomActive,
                      ]}
                      onPress={() => setFieldValue('denomination', d)}
                    >
                      <Text
                        style={[
                          styles.denomText,
                          values.denomination === d && styles.denomTextActive,
                        ]}
                      >
                        {DENOMINATION_LABELS[d]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.denomination && errors.denomination && (
                  <Text style={styles.error}>{errors.denomination}</Text>
                )}
              </View>

              <CustomInput
                label="Quantity"
                placeholder="Number of bonds"
                keyboardType="numeric"
                value={values.quantity?.toString()}
                onChangeText={t =>
                  setFieldValue('quantity', Number(t.replace(/\D/g, '')))
                }
                onBlur={handleBlur('quantity')}
                error={errors.quantity}
                touched={touched.quantity}
              />

              <CustomInput
                label="Price Per Bond (Rs.)"
                placeholder="Enter price"
                keyboardType="numeric"
                value={values.pricePerBond?.toString()}
                onChangeText={t =>
                  setFieldValue('pricePerBond', Number(t.replace(/\D/g, '')))
                }
                onBlur={handleBlur('pricePerBond')}
                error={errors.pricePerBond}
                touched={touched.pricePerBond}
              />

              <CustomInput
                label="Contact Number"
                placeholder="03XXXXXXXXX"
                keyboardType="phone-pad"
                maxLength={11}
                value={values.contactNumber}
                onChangeText={handleChange('contactNumber')}
                onBlur={handleBlur('contactNumber')}
                error={errors.contactNumber}
                touched={touched.contactNumber}
              />

              <View>
                <Text style={styles.label}>City</Text>
                <View style={styles.cityGrid}>
                  {CITIES.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.cityBtn,
                        values.city === c && styles.cityActive,
                      ]}
                      onPress={() => setFieldValue('city', c)}
                    >
                      <Text
                        style={[
                          styles.cityText,
                          values.city === c && styles.cityTextActive,
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.city && errors.city && (
                  <Text style={styles.error}>{errors.city}</Text>
                )}
              </View>

              <CustomInput
                label="Description (optional)"
                placeholder="Add details about your bonds..."
                multiline
                numberOfLines={3}
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                error={errors.description}
                touched={touched.description}
              />

              <TouchableOpacity
                style={[styles.submitBtn, isLoading && styles.disabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.submitText}>Post Listing</Text>
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
  label: {
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
  denomActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  denomText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  denomTextActive: { color: colors.primary },
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cityBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  cityActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  cityText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  cityTextActive: { color: colors.primary },
  error: { fontSize: 12, color: colors.error, marginTop: 4 },
  submitBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  disabled: { opacity: 0.6 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default CreateListingScreen;
