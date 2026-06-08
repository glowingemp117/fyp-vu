import { createSlice } from '@reduxjs/toolkit';
import { getRequest } from '../../utils/networks/request';
import { API_ENDPOINTS } from '../../constants/endpoints';

const initialState = {
  isLoading: false,
  draws: [],
  upcomingDraws: [],
  latestDraws: [],
  selectedDraw: null,
  searchResults: null,
  pagination: null,
};

const slice = createSlice({
  name: 'draws',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setDraws(state, action) {
      state.draws = action.payload;
    },
    setLatestDraws(state, action) {
      state.latestDraws = action.payload;
    },
    setUpcomingDraws(state, action) {
      state.upcomingDraws = action.payload;
    },
    setSelectedDraw(state, action) {
      state.selectedDraw = action.payload;
    },
    setSearchResults(state, action) {
      state.searchResults = action.payload;
    },
    setPagination(state, action) {
      state.pagination = action.payload;
    },
  },
});

export default slice.reducer;
const actions = slice.actions;

export const fetchDraws =
  (params = {}) =>
  async dispatch => {
    dispatch(actions.setLoading(true));
    try {
      const response = await getRequest({
        endpoint: API_ENDPOINTS.draws.list,
        params,
      });
      dispatch(actions.setDraws(response.data.data));
      dispatch(actions.setPagination(response.data.pagination));
      dispatch(actions.setLoading(false));
    } catch (error) {
      dispatch(actions.setLoading(false));
      throw error;
    }
  };

export const fetchLatestDraws = () => async dispatch => {
  try {
    const response = await getRequest({
      endpoint: API_ENDPOINTS.draws.latest,
    });
    dispatch(actions.setLatestDraws(response.data.data));
  } catch (error) {
    throw error;
  }
};

export const fetchUpcomingDraws = () => async dispatch => {
  try {
    const response = await getRequest({
      endpoint: API_ENDPOINTS.draws.upcoming,
    });
    dispatch(actions.setUpcomingDraws(response.data.data));
  } catch (error) {
    throw error;
  }
};

export const fetchDrawById = id => async dispatch => {
  dispatch(actions.setLoading(true));
  try {
    const response = await getRequest({
      endpoint: API_ENDPOINTS.draws.detail(id),
    });
    dispatch(actions.setSelectedDraw(response.data.data));
    dispatch(actions.setLoading(false));
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};

export const searchDrawResults = params => async dispatch => {
  dispatch(actions.setLoading(true));
  try {
    const response = await getRequest({
      endpoint: API_ENDPOINTS.draws.search,
      params,
    });
    dispatch(actions.setSearchResults(response.data.data));
    dispatch(actions.setLoading(false));
  } catch (error) {
    dispatch(actions.setLoading(false));
    throw error;
  }
};
