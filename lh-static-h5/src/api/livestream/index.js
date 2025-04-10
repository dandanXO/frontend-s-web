import { userStore } from "../../stores";
import { api } from "../../boot/axios";

export const getLivestreamList = () => {
  return api.post("/live/list?status=1");
};

export const getLivestreamDetail = (livestreamId) => {
  return api.get(`/live/${livestreamId}`);
};

export const getChatHistory = (payload) => {
  const requestOptions =
    // method: "POST",
    payload;
  // headers: {
  //   token: userStore().token,
  //   "Content-Type": "application/json"
  // }
  // let rstUrl = process.env.RST_API.split(",")[0];

  api
    .post("/live/history", requestOptions)
    .then((response) => {
      // return response.json();
      return response;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const sendChat = (payload) => {
  const requestOptions =
    // method: "POST",
    payload;
  // headers: {
  //   token: userStore().token,
  //   "Content-Type": "application/json"
  // }

  // let rstUrl = process.env.RST_API.split(",")[0];

  api
    .post("/session/live/message", requestOptions)
    .then((response) => {
      // return response.json();
      return response;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
