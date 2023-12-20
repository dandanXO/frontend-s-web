import { Method } from 'axios-mapper'
import https from '../utils/https'

export const getAffiliateRecord = id => {
  return https().request(`/affiliateRecord/${id}`, Method.GET)
}
