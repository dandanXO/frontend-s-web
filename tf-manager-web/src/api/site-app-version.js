import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'
import { ElMessage } from 'element-plus'
import { globals } from '../main'

export const getSiteAppVersion = query => {
  return https().request('/siteAppVersion/list', Method.GET, query)
}

export const getSiteList = () => {
  return https().request('/site/systemSiteList', Method.GET)
}

export const createSiteAppVersion = data => {
  return https().request(
    `/siteAppVersion/create`,
    Method.POST,
    data,
    ContentType.form
  )
}

export const updateSiteAppVersion = data => {
  return https().request(
    `/siteAppVersion/update`,
    Method.POST,
    data,
    ContentType.form
  )
}

export const deleteSiteAppVersion = async ids => {
  await https().request(
    `/siteAppVersion/delete?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}

export const uploadApp = async (formData, fileType) => {
  const allowedFileTypes = ['ipa', 'apk']

  const baseApi = globals.$baseApi

  if (!allowedFileTypes.includes(fileType)) {
    ElMessage({
      message: 'Invalid file type. Supported types are IPA and APK.',
      type: 'error',
    })
  }

  const requestOptions = {
    method: 'POST',
    body: formData,
    ContentType: 'multipart/form-data',
    boundary: '—-WebKitFormBoundaryfgtsKTYLsT7PNUVD',
  }

  return fetch(baseApi + '/siteAppVersion/uploadApp', requestOptions)
    .then(response => {
      return response.json() // Corrected: Call response.json() as a function
    })
    .catch(error => {
      ElMessage({
        message: error.message,
        type: 'error',
      })
      return Promise.reject(error)
    })
}

export const uploadLogo = async (formData, fileType) => {
  const allowedFileTypes = ['image/png', 'png']

  const baseApi = globals.$baseApi

  console.log("filetype", fileType)

  if (!allowedFileTypes.includes(fileType)) {
    ElMessage({
      message: 'Invalid file type. Supported types is .png.',
      type: 'error',
    })
  }

  const requestOptions = {
    method: 'POST',
    body: formData,
    ContentType: 'multipart/form-data',
    boundary: '—-WebKitFormBoundaryfgtsKTYLsT7PNUVD',
  }

  return fetch(baseApi + '/siteAppVersion/uploadLogo', requestOptions)
    .then(response => {
      return response.json() // Corrected: Call response.json() as a function
    })
    .catch(error => {
      ElMessage({
        message: error.message,
        type: 'error',
      })
      return Promise.reject(error)
    })
}

export const updateAppVersionState = async (id, state) => {
  await https().request(
    `/siteAppVersion/${id}/state?_method=PUT`,
    Method.POST,
    { state: state },
    ContentType.form
  )
}
