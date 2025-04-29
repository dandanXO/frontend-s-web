import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getShortLink = body => {
  return https().request(
    '/shortLink/create',
    Method.POST,
    body,
    ContentType.form
  )
}
