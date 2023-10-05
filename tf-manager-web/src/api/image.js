import { ElMessage } from "element-plus";
import { globals } from "../main";
export const uploadImage = (formData) => {
  const requestOptions = {
    method: 'POST',
    body: formData
  };
  const baseApi = globals.$baseApi;

  return fetch(baseApi + '/image/uploadBanner', requestOptions)
    .then(response => {
      return response.json()
    })
    .catch(error => {
      ElMessage({
        message: error.message,
        type: "error"
      });
      return Promise.reject(error);
    });
};

export const uploadGameImage = (formData) => {
  const requestOptions = {
    method: 'POST',
    body: formData
  };
  return fetch(`${process.env.VUE_APP_IMAGE_UPLOAD}/dir`, requestOptions)
    .then(response => {
      return response.json()
    })
    .catch(error => {
      ElMessage({
        message: error.message,
        type: "error"
      });
      return Promise.reject(error);
    });
};
