import axios from 'axios';

const serverPort = (import.meta.env.SERVER_PORT || '3000') as string;
const serverAddress = (import.meta.env.SERVER_ADDRESS ||
  window.location.hostname) as string;
const serverUrl = `${window.location.protocol}//${serverAddress}:${serverPort}/api/`;

export const httpClient = axios.create({
  baseURL: serverUrl,
  timeout: 1000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
});

httpClient.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },

  function onRejected(error) {
    console.trace(error);
    alert('Načítání dat selhalo.');
    return Promise.reject(new Error(JSON.stringify(error)));
  },
);
