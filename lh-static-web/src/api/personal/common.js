import { server } from "@/utils/request";
import { userStore } from "@/store";
import { uiStore } from "@/store/ui";

export function getParamKey(key) {
  return server.CASHIER.get(`/param/key/${key}`);
}

export function getAnnouncement() {
  return server.REST.get(`/announcement`);
}

export const uploadImage = (formData) => {
  const ui = uiStore()
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

  return fetch(rstUrl + '/session/profile-photo/upload', requestOptions)
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

export function saveImage(imageUuid) {
  console.log(imageUuid)
  return server.REST.post('/session/profile-photo/save', { imageUuid })
}