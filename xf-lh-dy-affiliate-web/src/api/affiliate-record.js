import { Method } from 'axios-mapper'
import https from '../utils/https'

export const getAffiliateRecord = id => {
  return https().request(`/affiliateRecord/${id}`, Method.GET)
}

export const getAffiliateList = (id) => {
  return https().request(`/affiliateRecord/getAllDownlineByMemberId/${id}`, Method.GET);
}
