import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.43.95:5000',
  responseType: 'json',
  withCredentials: true,
  headers: {
    'content-type': 'application/json',
  },
});

export default axiosInstance;
