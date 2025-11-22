import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'http://localhost:3000/api/',
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
