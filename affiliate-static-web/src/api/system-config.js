import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getConfigs = query => {
  return https().request('/config', Method.GET, query, ContentType.form)
}
