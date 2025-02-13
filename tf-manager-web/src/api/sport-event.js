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

export const getBetTypeSettings = (query) => {
  return https().request(
    '/sport/bet/setting',
    Method.GET,
    query,
    ContentType.form
  )
}

export function updateBetTypeStatus(query) {
  return https().request(
    '/sport/bet/setting',
    Method.POST,
    query,
    ContentType.form
  )
}

export const getSportTypes = () => {
  return https().request("/sport/sport-types", Method.GET, ContentType.form);
};
