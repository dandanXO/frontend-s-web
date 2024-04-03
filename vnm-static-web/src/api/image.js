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
  var rstUrl = localStorage.getItem("VNM_WEB_RST_URL");
  if(!rstUrl){
    rstUrl = process.env.VUE_APP_RST_API.split(",")[0];
  }

  return fetch(rstUrl + '/session/image/uploadOrder', requestOptions)
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
