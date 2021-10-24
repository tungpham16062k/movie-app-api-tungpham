const axios = require('axios');

const axiosClient = axios.create({
  baseUrl: 'https://api.themoviedb.org/3',
  headers: {
    'Content-type': ' application/json;charset=utf-8'
  }
});

// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
  config.headers['Authorization'] = `Bearer ${process.env.DB_MOVIE_TOKEN}`;
  // Do something before request is sent
  console.log(config);
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axiosClient.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

module.exports = axiosClient;