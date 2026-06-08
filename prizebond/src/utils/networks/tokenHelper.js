import AsyncStorage from '@react-native-async-storage/async-storage';
import { userConstants } from '../../constants/user';

export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(userConstants.accessToken);
  } catch {
    return null;
  }
};

export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(userConstants.refreshToken);
  } catch {
    return null;
  }
};

export const setTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.multiSet([
      [userConstants.accessToken, accessToken],
      [userConstants.refreshToken, refreshToken],
    ]);
  } catch (error) {
    console.log('Error saving tokens:', error);
  }
};

export const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove([
      userConstants.accessToken,
      userConstants.refreshToken,
    ]);
  } catch (error) {
    console.log('Error clearing tokens:', error);
  }
};
