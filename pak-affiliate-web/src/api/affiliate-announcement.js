import { Method } from 'axios-mapper'
import https from '../utils/https'

export const getAffAnnouncement = (memberId, query) => {
  return https().request(
    `/affiliateAnnouncement/list/${memberId}`,
    Method.GET,
    query
  )
}

export const readAffAnnouncementDetails = (memberId, annoucementId) => {
  return https().request(
    `/affiliateAnnouncement/details/${memberId}/${annoucementId}`,
    Method.GET
  )
}

export const deleteAffAnnouncement = (memberId, annoucementId) => {
  return https().request(
    `/affiliateAnnouncement/delete/${memberId}/${annoucementId}`,
    Method.GET
  )
}

export const getUnreadAnnouncementCount = (memberId, query) => {
  return https().request(
    `/affiliateAnnouncement/unread-count/${memberId}`,
    Method.GET,
    query
  )
}

export const getAffAnnouncementPopupList = (memberId, query) => {
  return https().request(
    `/affiliateAnnouncement/popUp/${memberId}`,
    Method.GET,
    query
  )
}