import axios from 'axios';

const api = axios.create({
  baseURL: 'https://badcatfor-api.onrender.com',
});

export default api;
