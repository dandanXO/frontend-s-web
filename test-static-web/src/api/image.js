import { userStore } from "@/store";
import { uiStore } from "@/store/ui";

export const uploadImage = (formData) => {
  const ui = uiStore();
  const requestOptions = {
    method: 'POST',
    body: formData,
    headers: {
        token: `${userStore().token}`
    },
  };
  var rstUrl = localStorage.getItem("LH_WEB_RST_URL");
  if(!rstUrl){
    rstUrl = process.env.VUE_APP_RST_API.split(",")[0];
  }

  return fetch(rstUrl + '/session/image/uploadOrder', requestOptions)
    .then(response => {
      return response.json()
    })
    .catch(error => {
      ui.notify({
        message: error.message,
        type: "error"
      });
      return Promise.reject(error);
    });
};
