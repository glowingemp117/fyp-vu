import { createSlice } from '@reduxjs/toolkit';
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '../../utils/networks/request';
import { API_ENDPOINTS } from '../../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userConstants } from '../../constants/user';

const initialState = {
  isLoading: false,
  user: null,
  timeZone: 'Asia/Karachi',
  fcmToken: '',
  userLang: 'en',
  newNotification: false,
  socialLogin: false,
  themeMode: 'auto',
  onBoardingCompleted: false,
  onBoardingData: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setUserData(state, action) {
      state.user = action.payload;
    },
    setSocialLogin(state, action) {
      state.socialLogin = action.payload;
    },
    setfcmToken(state, action) {
      state.fcmToken = action.payload;
    },
    setThemeMode(state, action) {
      state.themeMode = action.payload;
    },
    setOnBoardingCompleted(state, action) {
      state.onBoardingCompleted = action.payload;
    },
    setOnBoardingData(state, action) {
      state.onBoardingData = action.payload;
    },
    setTimeZone(state, action) {
      state.timeZone = action.payload;
    },
    setUserLang(state, action) {
      state.userLang = action.payload;
    },
    setNewNotification(state, action) {
      state.newNotification = action.payload;
    },
  },
});

export default slice.reducer;
const actions = slice.actions;

export const {
  setLoading,
  setUserData,
  setSocialLogin,
  setfcmToken,
  setThemeMode,
  setOnBoardingCompleted,
  setOnBoardingData,
  setTimeZone,
  setUserLang,
  setNewNotification,
} = actions;

// ─── Thunk Actions ───────────────────────────────────────────────

export const signupUser = (payload) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await postRequest({
      endpoint: API_ENDPOINTS.auth.signup,
      payload,
    });
    const { accessToken, refreshToken, user } = response.data.data;
    await AsyncStorage.setItem(userConstants.accessToken, accessToken);
    await AsyncStorage.setItem(userConstants.refreshToken, refreshToken);
    dispatch(actions.setUserData(user));
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const loginUser = (payload) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await postRequest({
      endpoint: API_ENDPOINTS.auth.login,
      payload,
    });
    const { accessToken, refreshToken, user } = response.data.data;
    await AsyncStorage.setItem(userConstants.accessToken, accessToken);
    await AsyncStorage.setItem(userConstants.refreshToken, refreshToken);
    dispatch(actions.setUserData(user));
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const guestLoginUser = () => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await postRequest({
      endpoint: API_ENDPOINTS.auth.guestLogin,
    });
    const { accessToken, refreshToken, user } = response.data.data;
    await AsyncStorage.setItem(userConstants.accessToken, accessToken);
    await AsyncStorage.setItem(userConstants.refreshToken, refreshToken);
    dispatch(actions.setUserData(user));
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    const refreshToken = await AsyncStorage.getItem(userConstants.refreshToken);
    await postRequest({
      endpoint: API_ENDPOINTS.auth.logout,
      payload: { refreshToken },
    });
  } catch (error) {
    console.log('Logout API error:', error);
  } finally {
    await AsyncStorage.multiRemove([
      userConstants.accessToken,
      userConstants.refreshToken,
    ]);
    dispatch(actions.setUserData(null));
    dispatch(actions.setOnBoardingCompleted(false));
  }
};

export const forgotPassword = (payload) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await postRequest({
      endpoint: API_ENDPOINTS.auth.forgotPassword,
      payload,
    });
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const verifyOtpEmail = (payload) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await postRequest({
      endpoint: API_ENDPOINTS.auth.verifyOtpEmail,
      payload,
    });
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const resetPassword = (payload) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await postRequest({
      endpoint: API_ENDPOINTS.auth.resetPassword,
      payload,
    });
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const changePassword = (payload) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await putRequest({
      endpoint: API_ENDPOINTS.auth.changePassword,
      payload,
    });
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const updateProfile = (payload) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await putRequest({
      endpoint: API_ENDPOINTS.auth.updateProfile,
      payload,
    });
    dispatch(actions.setUserData(response.data.data));
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const getMyProfile = () => async (dispatch) => {
  try {
    const response = await getRequest({
      endpoint: API_ENDPOINTS.auth.me,
    });
    dispatch(actions.setUserData(response.data.data));
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = () => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await deleteRequest({
      endpoint: API_ENDPOINTS.auth.deleteAccount,
    });
    await AsyncStorage.clear();
    dispatch(actions.setUserData(null));
    dispatch(actions.setOnBoardingCompleted(false));
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};
