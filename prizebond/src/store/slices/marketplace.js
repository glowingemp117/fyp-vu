import { createSlice } from '@reduxjs/toolkit';
import { getRequest, postRequest, putRequest, deleteRequest } from '../../utils/networks/request';
import { API_ENDPOINTS } from '../../constants/endpoints';

const initialState = {
  isLoading: false,
  listings: [],
  myListings: [],
  selectedListing: null,
  pagination: null,
};

const slice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setLoading(state, action) { state.isLoading = action.payload; },
    setListings(state, action) { state.listings = action.payload; },
    setMyListings(state, action) { state.myListings = action.payload; },
    setSelectedListing(state, action) { state.selectedListing = action.payload; },
    addListing(state, action) { state.myListings.unshift(action.payload); },
    removeListing(state, action) {
      state.myListings = state.myListings.filter((l) => l._id !== action.payload);
      state.listings = state.listings.filter((l) => l._id !== action.payload);
    },
    setPagination(state, action) { state.pagination = action.payload; },
  },
});

export default slice.reducer;
const actions = slice.actions;

export const fetchListings = (params = {}) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await getRequest({ endpoint: API_ENDPOINTS.marketplace.list, params });
    dispatch(actions.setListings(response.data.data));
    dispatch(actions.setPagination(response.data.pagination));
    dispatch(actions.setLoading(false));
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const fetchMyListings = () => async (dispatch) => {
  try {
    const response = await getRequest({ endpoint: API_ENDPOINTS.marketplace.myListings });
    dispatch(actions.setMyListings(response.data.data));
  } catch (error) {
    throw error;
  }
};

export const createListing = (payload) => async (dispatch) => {
  dispatch(actions.setLoading(true));
  try {
    const response = await postRequest({ endpoint: API_ENDPOINTS.marketplace.create, payload });
    dispatch(actions.addListing(response.data.data));
    dispatch(actions.setLoading(false));
    return response;
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const deleteListing = (id) => async (dispatch) => {
  try {
    await deleteRequest({ endpoint: API_ENDPOINTS.marketplace.delete(id) });
    dispatch(actions.removeListing(id));
  } catch (error) {
    throw error;
  }
};
