import axios from 'axios';
import {BASE_URL} from 'configs/index';

export default function createAxios(
  {authToken, authRefreshToken, cartToken = null} = {
    authToken: '',
    authRefreshToken: '',
    cartToken: '',
  },
) {
  const headers: Record<string, any> = {
    Accept: 'application/json',
    'x-application': 'KOOMI_PROCURE',
    'x-role-department': 'BUYER',
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['x-token'] = authToken;
    headers['x-sign-up-token'] = authToken;
  }
  if (authRefreshToken) {
    headers['x-refresh-token'] = authRefreshToken;
  }
  if (cartToken) {
    headers['x-cart-token'] = cartToken;
  }

  let instance = axios.create({
    baseURL: BASE_URL,
    headers,
  });

  instance.interceptors.request.use(
    async config => {
      if (config.data) {
        const haveFile = Object.values(config.data).some(
          e => e && e.toString() === '[object File]',
        );
        if (haveFile) {
          config.headers['Content-Type'] = 'multipart/form-data';
        }
      }
      return config;
    },
    error => Promise.reject(error),
  );

  instance.interceptors.response.use(
    response => response.data,
    error => {
      if (error.response && error.response.data) {
        return Promise.reject({
          ...error.response.data,
          statusCode: error.response.status,
        });
      } else {
        return Promise.reject({
          success: false,
          message: 'Error Code 100: No response error from server',
          statusCode:
            error && error.request && error.request.status
              ? error.request.status
              : '6666',
        });
      }
    },
  );

  return instance;
}
