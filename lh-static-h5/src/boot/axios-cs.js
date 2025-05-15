import { boot } from "quasar/wrappers";
import axios from "axios";

// debugger;
let apiUrl = getParameterByName("url");
let localUrl = window.sessionStorage.getItem("API_URL");
if (apiUrl && apiUrl.indexOf("http") > -1) {
  window.sessionStorage.setItem("API_URL", apiUrl);
}

let API_URL = "";
console.log("API_URL", process.env.API_URL);
const apiUrls = Object.values(process.env.API_URL).map((url) => url.trim());
let isInitializingApiUrl = true;
const pendingApiQueue = [];

const apiCs = axios.create();

const getValidEnvApiUrl = async () => {
  for (const url of apiUrls) {
    try {
      const response = await axios.get(url);
      if (response.data.code === 0) {
        console.log(`Successful response from: ${url}`);
        return url;
      }
    } catch (error) {
      console.error(`Error accessing ${url}: ${error.message}`);
    }
  }
  throw new Error("No valid API URLs found.");
};

const initializeApiUrl = async () => {
  try {
    API_URL = apiUrl ? apiUrl : localUrl ? localUrl : await getValidEnvApiUrl();
    window.sessionStorage.setItem("API_URL", API_URL);

    // Process queued API calls once the valid URL is set
    while (pendingApiQueue.length) {
      const request = pendingApiQueue.shift();
      request(API_URL);
    }
    apiCs.defaults.baseURL = API_URL;
  } catch (error) {
    console.error("Error initializing API URL:", error.message);
    process.exit(1); // Exit if no valid URL is found
  } finally {
    isInitializingApiUrl = false;
  }
};

initializeApiUrl();

apiCs.interceptors.request.use(async (config) => {
  if (isInitializingApiUrl) {
    const baseUrl = await new Promise((resolve) => {
      pendingApiQueue.push((url) => resolve(url));
    });
    config.baseURL = baseUrl;
  }
  return config;
});

apiCs.interceptors.response.use(function (response) {
  const code = response.data?.code ?? -1;

  response.data.code = code;
  response.data.success = code === 0;

  return response;
});

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[[]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$apiCs

  // app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$apiCs = apiCs;
  // ^ ^ ^ this will allow you to use this.$apiCs (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { apiCs };
