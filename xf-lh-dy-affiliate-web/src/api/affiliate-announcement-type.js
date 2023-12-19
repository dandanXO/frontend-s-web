import { Method } from 'axios-mapper'
import https from '../utils/https'

export const getActiveAffAnnouncementType = () => {
  return https().request('/affiliateAnnouncementType/active', Method.GET)
}
