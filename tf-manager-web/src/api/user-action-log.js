import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getUserActionLog = systemLog => {
  return https().request(
    '/user-action-log',
    Method.GET,
    systemLog,
    ContentType.json
  )
}

export const getAffiliateActionLog = systemLog => {
  return https().request(
    '/user-action-log/affiliate',
    Method.GET,
    systemLog,
    ContentType.json
  )
}
