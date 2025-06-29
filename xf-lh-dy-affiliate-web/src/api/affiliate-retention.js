import { Method, ContentType } from 'axios-mapper'
import https from '../utils/https'

export const getAffiliateRetentionReport = (data) => {
  return https().request("/affiliate-retention-report", Method.GET, data, ContentType.json)
};
