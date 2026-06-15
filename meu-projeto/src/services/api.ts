import axios from 'axios';
import { Platform } from 'react-native';

// Definimos a URL correta baseada na plataforma primeiro
const urlAmbiente = Platform.OS === 'web' 
  ? 'http://localhost:3000/api' 
  : 'http://10.68.55.178:3000/api';

const api = axios.create({
  baseURL: urlAmbiente, // 👈 Agora a propriedade recebe a string certinha!
});

export default api;