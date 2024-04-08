import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getNotifications = query => {
  return https().request(
    '/redirect-notification',
    Method.GET,
    query,
    ContentType.form
  )
}

export const createNotification = notification => {
  return https().request(
    '/redirect-notification',
    Method.POST,
    notification,
    ContentType.form
  )
}

export const updateNotification = async notification => {
  await https().request(
    `/redirect-notification?_method=PUT`,
    Method.POST,
    notification,
    ContentType.form
  )
}

export const deleteNotification = async ids => {
  await https().request(
    `/redirect-notification?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}
