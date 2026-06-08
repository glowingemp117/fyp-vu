import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { colors } from '../../utils/assets';
import CustomInput from '../../components/common/CustomInput';
import Toast from 'react-native-toast-message';

const editProfileSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),

  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),

  phone: Yup.string()
    .matches(/^03\d{9}$/, 'Enter valid Pakistani number (03XXXXXXXXX)')
    .required('Phone number is required'),

  bio: Yup.string()
    .max(150, 'Bio cannot exceed 150 characters'),
});

const EditProfileScreen = ({ navigation }) => {
  const isLoading = false;

  const handleUpdateProfile = async values => {
    try {
      console.log('Updated Values:', values);

      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully!',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update profile',
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
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Profile</Text>

          <View style={{ width: 60 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri: 'https://i.pravatar.cc/300',
              }}
              style={styles.avatar}
            />

            <TouchableOpacity style={styles.cameraBtn}>
              <Text style={styles.cameraEmoji}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>Muhammad Ahmad</Text>

          <Text style={styles.userEmail}>
            ahmad@example.com
          </Text>
        </View>

        {/* Form */}
        <Formik
          initialValues={{
            name: 'Muhammad Ahmad',
            email: 'ahmad@example.com',
            phone: '03123456789',
            bio: 'Professional electrician with 5 years experience.',
          }}
          validationSchema={editProfileSchema}
          onSubmit={handleUpdateProfile}
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
                label="Full Name"
                placeholder="Enter your full name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={errors.name}
                touched={touched.name}
              />

              <CustomInput
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email}
                touched={touched.email}
              />

              <CustomInput
                label="Phone Number"
                placeholder="03XXXXXXXXX"
                keyboardType="phone-pad"
                maxLength={11}
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                error={errors.phone}
                touched={touched.phone}
              />

              <CustomInput
                label="Bio"
                placeholder="Tell us about yourself"
                value={values.bio}
                onChangeText={handleChange('bio')}
                onBlur={handleBlur('bio')}
                error={errors.bio}
                touched={touched.bio}
                multiline
                numberOfLines={4}
              />

              {/* Save Button */}
              <TouchableOpacity
                style={[
                  styles.updateBtn,
                  isLoading && styles.disabledBtn,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.updateBtnText}>
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  backBtn: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
  },

  avatarWrap: {
    position: 'relative',
    marginBottom: 14,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  cameraBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00000090',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraEmoji: {
    fontSize: 16,
  },

  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },

  /* Form */
  form: {
    gap: 14,
  },

  updateBtn: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  disabledBtn: {
    opacity: 0.6,
  },

  updateBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});