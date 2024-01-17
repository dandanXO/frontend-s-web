import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const memberDailyPlatformSummary = query => {
  return https().request(
    `/memberDailySummary/platformList`,
    Method.GET,
    query,
    ContentType.form
  )
}
