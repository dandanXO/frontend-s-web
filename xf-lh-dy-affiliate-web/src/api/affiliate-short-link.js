import https from '@/utils/https'
import { Method } from 'axios-mapper'

export const getShortLink = body => {
  return https().request('/shortLink/create', Method.POST, body)
}
