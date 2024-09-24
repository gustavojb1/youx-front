"use client";
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export const apiService = axios.create({
  baseURL: apiUrl, 
  headers: {
    'Content-Type': 'application/json', 
  },
});


apiService.interceptors.request.use(
  (config) => {
    try {
      
      const loginDataString = localStorage.getItem('loginData');

      if (!loginDataString) {
        console.warn('Token não encontrado no localStorage');
        return config;
      }

      const loginData = JSON.parse(loginDataString);

      if (loginData.token) {
        config.headers.authorization = `${loginData.token}`;
      } else {
        console.warn('Token não está presente em loginData:', loginData);
      }
    } catch (error) {
      console.error('Erro ao processar token do localStorage:', error);
    }

    return config;
  },
  (error) => {
    console.error('Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);


apiService.interceptors.response.use(
  (response) => response,
  (error) => {
      const errorMessage = error.response.data?.message || error.response.data;
      if (errorMessage === "Token inválido") {
        console.warn('Token inválido ou expirado. Redirecionando para login.');
        localStorage.removeItem('loginData'); 
        window.location.href = '/login'; 
      }

    return Promise.reject(error);
  }
);

export default apiService;
