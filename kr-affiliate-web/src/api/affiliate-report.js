import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const getDepositWithdrawRecord = query => {
  return https().request(
    '/affiliate-report/deposit-withdraw-list',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMonthlySettlement = query => {
  return https().request(
    '/affiliate-report//daily-summary',
    Method.GET,
    query,
    ContentType.form
  )
}
