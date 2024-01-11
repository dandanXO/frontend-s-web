import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const queryAffiliate = form => {
  return https().request('/affiliate-apk', Method.GET, form, ContentType.form)
}

export const getLatestVersion = siteCode => {
  return https().request(
    '/affiliate-apk/version',
    Method.GET,
    { siteCode },
    ContentType.form
  )
}

export const buildApk = id => {
  return https().request(
    `/affiliate-apk/build/${id}`,
    Method.POST,
    {},
    ContentType.form
  )
}

export const editParam = (id, params) => {
  console.log(params)
  return https().request(
    `/affiliate-apk/update/${id}?_method=PUT`,
    Method.POST,
    { params: params },
    ContentType.form
  )
}

export const cancelBuild = id => {
  return https().request(
    `/affiliate-apk/cancel/${id}?_method=PUT`,
    Method.POST,
    {},
    ContentType.form
  )
}
