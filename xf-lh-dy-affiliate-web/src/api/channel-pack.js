import { ElMessage } from "element-plus";
import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const uploadImage = (formData) => {
  const requestOptions = {
    method: 'POST',
    body: formData
  };

  return fetch(process.env.VUE_APP_BASE_API + '/siteChannelApp/upload', requestOptions)
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

export const createChannelPack = (channelPack) => {
  return https().request(`siteChannelApp/pack`, Method.POST, channelPack, ContentType.form);
}

export const loadChannelPackHistory = query => {
  return https().request('siteChannelApp', Method.GET, query, ContentType.form)
}

export const cancelChannelPack = id => {
  return https().request(`siteChannelApp/cancel/${id}?_method=PUT`, Method.POST)
}

export const getVersion = (channelPack) => {
  return https().request(`siteChannelApp/version`, Method.GET, channelPack, ContentType.form);
}
