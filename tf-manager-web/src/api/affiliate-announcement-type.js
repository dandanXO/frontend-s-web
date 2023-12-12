import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getTest = announcementType => {
  return https().request(
    '/affiliate/test',
    Method.GET,
    announcementType,
    ContentType.form
  )
}

export const getAffAnnouncementType = announcementType => {
  return https().request(
    '/affiliateAnnouncementType',
    Method.GET,
    announcementType,
    ContentType.form
  )
}

export const getActiveAffAnnouncementType = () => {
  return https().request('/affiliateAnnouncementType/active', Method.GET)
}

export const createAffAnnouncementType = announcementType => {
  return https().request(
    '/affiliateAnnouncementType',
    Method.POST,
    announcementType,
    ContentType.form
  )
}

export const updateAffAnnouncementType = announcementType => {
  return https().request(
    `/affiliateAnnouncementType/${announcementType.id}?_method=PUT`,
    Method.POST,
    announcementType,
    ContentType.form
  )
}

export const updateAffAnnouncementTypeState = (id, state) => {
  return https().request(
    `/affiliateAnnouncementType/${id}/state?_method=PUT`,
    Method.POST,
    { state: state },
    ContentType.form
  )
}

export const deleteAffAnnouncementType = ids => {
  return https().request(
    `/affiliateAnnouncementType?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}
