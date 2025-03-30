import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Upload a file
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/api/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Trigger the processing pipeline
export const startProcess = async (token) => {
  const response = await axios.post(
    `${API_URL}/api/process`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Retrieve processing results
export const getResults = async (jobId, token) => {
  const response = await axios.get(`${API_URL}/api/results/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Preview uploaded data
export const previewData = async () => {
  const response = await axios.get(`${API_URL}/api/preview`);
  return response.data;
};