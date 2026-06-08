import { createSlice } from '@reduxjs/toolkit';
import { getRequest, postRequest, deleteRequest } from '../../utils/networks/request';
import { API_ENDPOINTS } from '../../constants/endpoints';

const initialState = {
  isLoading: false,
  bonds: [],
  stats: null,
  checkResult: null,
  pagination: null,
};

const slice = createSlice({
  name: 'bonds',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setBonds(state, action) {
      state.bonds = action.payload;
    },
    addBond(state, action) {
      state.bonds.unshift(action.payload);
    },
    removeBond(state, action) {
      state.bonds = state.bonds.filter((b) => b._id !== action.payload);
    },
    setStats(state, action) {
      state.stats = action.payload;
    },
    setCheckResult(state, action) {
      state.checkResult = action.payload;
    },
    setPagination(state, action) {
      state.pagination = action.payload;
    },
    clearCheckResult(state) {
      state.checkResult = null;
    },
  },
});

export default slice.reducer;
const actions = slice.actions;
export const { clearCheckResult } = actions;

export const fetchMyBonds = (params = {}) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await getRequest({
      endpoint: API_ENDPOINTS.bonds.list,
      params,
    });
    dispatch(actions.setBonds(response.data.data));
    dispatch(actions.setPagination(response.data.pagination));
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const addNewBond = (payload) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await postRequest({
      endpoint: API_ENDPOINTS.bonds.add,
      payload,
    });
    dispatch(actions.addBond(response.data.data));
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const checkBondNumber = (payload) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await postRequest({
      endpoint: API_ENDPOINTS.bonds.check,
      payload,
    });
    dispatch(actions.setCheckResult(response.data.data));
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const autoCheckAllBonds = () => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await postRequest({
      endpoint: API_ENDPOINTS.bonds.autoCheck,
    });
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const fetchBondStats = () => async (dispatch) => {
  try {
    const response = await getRequest({
      endpoint: API_ENDPOINTS.bonds.stats,
    });
    dispatch(actions.setStats(response.data.data));
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteBond = (id) => async (dispatch) => {
  try {
    await deleteRequest({
      endpoint: API_ENDPOINTS.bonds.delete(id),
    });
    dispatch(actions.removeBond(id));
  } catch (error) {
    throw error;
  }
};
