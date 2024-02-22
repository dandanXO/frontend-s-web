import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getUserLoginLog = systemLog => {
  return https().request(
    '/user-login-log',
    Method.GET,
    systemLog,
    ContentType.json
  )
}
