import { boot } from "quasar/wrappers";
import axios from "axios";

const strapi = axios.create({
  baseURL: "https://satisfying-candy-9f05ad4f47.strapiapp.com/",
  timeout: 10000,
});

strapi.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

strapi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error("Response error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$strapi = strapi;
});

export { strapi };
