import { userStore } from "@/store";
import { server } from "@/utils/request";

export const getLivestreamList = (page) => {
  return server.REST.post(`/live/list?current=${page}`);
};

export const getLivestreamDetail = (livestreamId, abortController) => {
  return server.REST.get(`/live/${livestreamId}`, { abortController });
};

export const getChatHistory = (payload, current) => {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      token: userStore().token,
      "Content-Type": "application/json",
      Authorization: process.env.VUE_APP_SITE
    }
  };
  let rstUrl = localStorage.getItem("LH_WEB_RST_URL") || process.env.VUE_APP_RST_API.split(",")[0];

  return fetch(rstUrl + `/live/history?current=${current}&sortType=ASC`, requestOptions)
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
      "Content-Type": "application/json",
      Authorization: process.env.VUE_APP_SITE
    }
  };
  let rstUrl = localStorage.getItem("LH_WEB_RST_URL") || process.env.VUE_APP_RST_API.split(",")[0];

  return fetch(rstUrl + "/session/live/message", requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
