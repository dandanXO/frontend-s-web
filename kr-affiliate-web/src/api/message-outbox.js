import { Method, ContentType } from 'axios-mapper'
import https from '../utils/https'

export const getMessageOutboxList = query => {
  return https().request(
    '/messageOutbox/list',
    Method.GET,
    query,
    ContentType.form
  )
}

export const replyMessage = query => {
  return https().request(
    '/messageOutbox/reply',
    Method.POST,
    query,
    ContentType.json
  )
}
