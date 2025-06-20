import { globals } from '../main'
import { useSessionStorage } from '@vueuse/core'

export const uploadImage = (formData) => {
  const requestOptions = {
    method: 'POST',
    body: formData,
  }
  const baseApi = globals.$baseApi

  return fetch(baseApi + '/image/uploadBanner', requestOptions)
    .then((response) => {
      return response.json()
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

export const uploadGameImage = (formData) => {
  const requestOptions = {
    method: 'POST',
    body: formData,
  }
  const imageUrl = useSessionStorage('IMAGE_CDN', process.env.VUE_APP_IMAGE).value
  return fetch(`${imageUrl}/dir`, requestOptions)
    .then((response) => {
      return response.json()
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}
