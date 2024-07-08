import { Method, ContentType } from 'axios-mapper'
import https from '../utils/https'

export const getMessageList = query => {
  return https().request(
    '/memberMessage/list',
    Method.GET,
    query,
    ContentType.form
  )
}

export const sendMessage = message => {
  return https().request(
    '/memberMessage/send',
    Method.POST,
    message,
    ContentType.form
  )
}
