import { userStore } from "@/store";
import { ElMessage } from "element-plus";
export const uploadImage = (formData) => {
  const requestOptions = {
    method: 'POST',
    body: formData,
    headers: {
        token: `${userStore().token}`
    },
  };
  return fetch(process.env.VUE_APP_RST_API + '/session/image/uploadOrder', requestOptions)
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