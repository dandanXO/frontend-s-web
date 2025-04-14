import { Method } from 'axios-mapper'
import https from '../utils/https'

export const getActiveAffAnnouncementType = (siteId) => {
  return https().request('/affiliateAnnouncementType/active?siteId=' + siteId, Method.GET)
}
