import axios from 'axios';
import { useToast } from 'vue-toastification';

let serverAddress = 'VITE_SERVER_ADDRESS';
console.log(import.meta.env);
if (import.meta.env.DEV) {
  serverAddress =
    (import.meta.env.VITE_SERVER_ADDRESS as string) ?? 'localhost';
} else {
  serverAddress = 'VITE_SERVER_ADDRESS';
}

const serverUrl = `${window.location.protocol}//${serverAddress}/api/`;

export const httpClient = axios.create({
  withCredentials: true,
  baseURL: serverUrl,
  timeout: 1000,
  validateStatus: function (status) {
    return (status >= 200 && status < 300) || status == 401; // default
  },
});

httpClient.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },

  function onRejected(error) {
    console.trace(error);
    const toast = useToast();
    toast.error('Server error.');
    return Promise.reject(new Error(JSON.stringify(error)));
  },
);
