import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const getWithdrawRecords = query => {
  return https().request(
    `/affiliateWithdrawRecord`,
    Method.GET,
    query,
    ContentType.form
  )
}
