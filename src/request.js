const axios = require("axios");

const token = process.env.TOKEN || "NO TOKEN!";
console.log("Using token: ", token)


axios.interceptors.request.use(function (config) {
  config.headers["X-Authorization"] = token;

  return config;
});

axios.interceptors.request.use(function (config) {
  console.log("Request: ", config.url);
  return config;
});

module.exports = axios;
