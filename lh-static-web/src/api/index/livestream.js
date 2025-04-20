import { userStore } from "@/store";
import { server } from "@/utils/request";

export const getLivestreamList = () => {
  return server.REST.post("/live/list");
};

export const getLivestreamDetail = (livestreamId, abortController) => {
  return server.REST.get(`/live/${livestreamId}`, { abortController });
};

export const getChatHistory = (payload) => {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      token: userStore().token,
      "Content-Type": "application/json"
    }
  };
  let rstUrl = process.env.VUE_APP_RST_API.split(",")[0];

  return fetch(rstUrl + "/live/history", requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const sendChat = (payload) => {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      token: userStore().token,
      "Content-Type": "application/json"
    }
  };
  let rstUrl = process.env.VUE_APP_RST_API.split(",")[0];

  return fetch(rstUrl + "/session/live/message", requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
