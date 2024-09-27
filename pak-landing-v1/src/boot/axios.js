import { boot } from "quasar/wrappers";
import axios from "axios";

const strapi = axios.create({
  baseURL: "https://satisfying-candy-9f05ad4f47.strapiapp.com/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${process.env.VUE_APP_API_TOKEN}`,
    Authorization: "Bearer xxx",
  },
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$strapi = strapi;
});

export { strapi };
