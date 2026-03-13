import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://arvindercode.in/api/v1',
  withCredentials: true
});
export default apiClient;
