import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getEvents = (events) => {
  return https().request(
    '/sport/event',
    Method.POST,
    events,
    ContentType.form
  )
}
