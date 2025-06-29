import { userStore } from "../../stores";
import { api } from "../../boot/axios";

export const getLivestreamList = () => {
  return api.post(`/opt-session/live/list`);
};

// export const getLivestreamDetail = (livestreamId) => {
//   return api.get(`/opt-session/live/${livestreamId}`);
// };

export const getLivestreamDetail = (livestreamId, abortController) => {
  return api.get(`/opt-session/live/${livestreamId}`, { signal: abortController.signal });
};

export const getChatHistory = (payload, current) => {
  const requestOptions = payload;

  api
    .post(`/live/history?current=${current}&sortType=ASC`, requestOptions)
    .then((response) => {
      // return response.json();
      return response;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const sendChat = (payload) => {
  const requestOptions = payload;

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
