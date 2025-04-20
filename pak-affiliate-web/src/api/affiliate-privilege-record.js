import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const getMemberPrivilegeRecords = (id, query) => {
  return https().request(
    `/affiliatePrivilegeRecord/${id}/member`,
    Method.GET,
    query,
    ContentType.form
  )
}
