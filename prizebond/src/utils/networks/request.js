import axiosInstance from './axios';

export const getRequest = async ({ endpoint, params = {} }) => {
  try {
    const response = await axiosInstance.get(endpoint, { params });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postRequest = async ({ endpoint, payload = {}, config = {} }) => {
  try {
    const response = await axiosInstance.post(endpoint, payload, config);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const putRequest = async ({ endpoint, payload = {}, config = {} }) => {
  try {
    const response = await axiosInstance.put(endpoint, payload, config);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteRequest = async ({ endpoint, config = {} }) => {
  try {
    const response = await axiosInstance.delete(endpoint, config);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};
