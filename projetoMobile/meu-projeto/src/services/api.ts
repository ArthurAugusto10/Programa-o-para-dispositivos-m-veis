import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  // Se for Android Emulador, usa 10.0.2.2. Se for Web ou iOS, localhost.
  // Se estiver no celular físico, coloque o seu IP real.
  baseURL: Platform.OS === 'android' ? 'http://10.68.55.173:3000/api' : 'http://localhost:3000/api',
});

export default api;