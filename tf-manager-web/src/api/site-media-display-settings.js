import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getSiteMediaDisplaySettingsRecords = settings => {
  return https().request(
    '/site-media-display-settings',
    Method.GET,
    settings,
    ContentType.form
  )
}

export const createSiteMediaDisplaySettings = settings => {
  return https().request(
    '/site-media-display-settings',
    Method.POST,
    settings,
    ContentType.form
  )
}

export const updateSiteMediaDisplaySettings = async settings => {
  await https().request(
    `/site-media-display-settings/${settings.id}?_method=PUT`,
    Method.POST,
    settings,
    ContentType.form
  )
}

export const deleteSiteMediaDisplaySettings = async ids => {
  await https().request(
    `/site-media-display-settings?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}
