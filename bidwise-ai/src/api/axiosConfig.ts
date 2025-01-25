import axios from 'axios';

console.log('Axios Base URL:', import.meta.env.VITE_API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Correct usage
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;