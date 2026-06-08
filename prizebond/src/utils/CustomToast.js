import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

// Assets
// import SuccessIcon from '../../assets/icons/toast/success.svg';
// import ErrorIcon from '../../assets/icons/toast/error.svg';

const CustomToast = ({ text1, type }) => {
  return (
    <View
      style={[
        styles.container,
        type === 'success'
          ? styles.success
          : type === 'info'
          ? styles.info
          : styles.error,
      ]}
    >
      <View style={styles.iconContainer}>
        {/* {type === 'success' ? (
          <SuccessIcon width={20} height={20} />
        ) : (
          <ErrorIcon width={20} height={20} />
        )} */}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text} numberOfLines={2}>
          {text1}
        </Text>
      </View>
    </View>
  );
};

const toastConfig = {
  success: ({ text1 }) => <CustomToast text1={text1} type="success" />,
  error: ({ text1 }) => <CustomToast text1={text1} type="error" />,
  info: ({ text1 }) => <CustomToast text1={text1} type="info" />,
};

export { toastConfig };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 60,
    alignSelf: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.border,
  },
  success: {
    borderColor: COLORS.success,
    shadowColor: COLORS.success,
  },
  error: {
    borderColor: COLORS.error,
    shadowColor: COLORS.error,
  },
  info: {
    borderColor: COLORS.info,
    shadowColor: COLORS.info,
  },
  iconContainer: {
    padding: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: 'System',
    color: COLORS.text,
  },
});
