import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const getRebateRecords = (query) => {
  return https().request('/affiliate-bet-rebate', Method.GET, query, ContentType.form);
}
