import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const queryDailySummary = form => {
  return https().request(
    '/affiliate-daily-summary',
    Method.GET,
    form,
    ContentType.form
  )
}

export const queryDailySummaryByType = form => {
  return https().request(
    '/affiliate-daily-summary/type',
    Method.GET,
    form,
    ContentType.form
  )
}

export const queryDailySummaryTotal = form => {
  return https().request(
    '/affiliate-daily-summary/getTotal',
    Method.GET,
    form,
    ContentType.form
  )
}
