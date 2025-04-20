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
    '/affiliate-report/daily-summary',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberSummary = query => {
  return https().request(
    '/affiliate-report/member-summary',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getPlatformSettlement = query => {
  return https().request(
    '/affiliate-report/platform-summary',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getCommissionRecord = query => {
  return https().request(
    '/affiliate-report/rebate-list',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberPointRecordList = query => {
  return https().request(
    '/affiliate-report/point-record-list',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getAffiliateDashboardData = query => {
  return https().request(
    '/affiliate-report/dashboard-data',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getDashboardDataDetail = query => {
  return https().request(
    '/affiliate-report/dashboard-data-detail',
    Method.GET,
    query,
    ContentType.form
  )
}
