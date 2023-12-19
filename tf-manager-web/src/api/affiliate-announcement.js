import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const getAffAnnouncement = announcement => {
  return https().request(
    '/affiliateAnnouncement/list',
    Method.GET,
    announcement,
    ContentType.form
  )
}

export const createAffAnnouncement = announcement => {
  return https().request(
    '/affiliateAnnouncement',
    Method.POST,
    announcement,
    ContentType.form
  )
}

export const updateAffAnnouncement = announcement => {
  return https().request(
    `/affiliateAnnouncement/${announcement.id}?_method=PUT`,
    Method.POST,
    announcement,
    ContentType.form
  )
}

export const updateAffAnnouncementState = (id, state) => {
  return https().request(
    `/affiliateAnnouncement/${id}/state?_method=PUT`,
    Method.POST,
    { state: state },
    ContentType.form
  )
}

export const deleteAffAnnouncement = ids => {
  return https().request(
    `/affiliateAnnouncement?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}
