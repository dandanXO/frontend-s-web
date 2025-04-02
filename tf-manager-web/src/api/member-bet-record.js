import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getMemberBetRecords = query => {
  return https().request(
    '/memberBetRecord',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getBetMoneyChange = query => {
  return https().request(
    '/memberBetRecord/money-change',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getBetMoneyChangeTidb = query => {
  return https().request(
    '/memberBetRecord/money-change-tidb',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getBetMoneyChangeTotal = query => {
  return https().request(
    '/memberBetRecord/money-change-total',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getBetMoneyChangeTotalTidb = query => {
  return https().request(
    '/memberBetRecord/money-change-total-tidb',
    Method.GET,
    query,
    ContentType.form
  )
}

export const requestBetMoneyChangeExport = query => {
  return https().request(
    '/memberBetRecord/money-change-export',
    Method.GET,
    query,
    ContentType.form
  )
}

export const requestBetMoneyChangeExportTidb = query => {
  return https().request(
    '/memberBetRecord/money-change-export-tidb',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberBetRecordsTotal = query => {
  return https().request(
    '/memberBetRecord/total',
    Method.GET,
    query,
    ContentType.form
  )
}

// export const getMemberBetRecordsTotalRecord = (query) => {
//   return https().request("/memberBetRecord/totalRecord", Method.GET, query, ContentType.form);
// };

// export const getExport = (query) => {
//   return https().request("/memberBetRecord/export", Method.POST, query, ContentType.form);
// };

export const requestExportMemberBetRecord = query => {
  return https().request(
    '/memberBetRecord/export',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberBetRecordList = query => {
  return https().request(
    '/memberBetRecord/list',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberBetRecordListTotal = query => {
  return https().request(
    '/memberBetRecord/list/total',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberBetRecordByPlatformList = query => {
  return https().request(
    '/memberBetRecord/byPlatform',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberBetRecordByPlatformListTotal = query => {
  return https().request(
    '/memberBetRecord/byPlatformTotal',
    Method.GET,
    query,
    ContentType.form
  )
}

export const updateBetStatusType = async (query) => {
  await https().request(
    `/memberBetRecord/money-change/update?_method=PUT`,
    Method.POST,
    query,
    ContentType.form
  )
}

export const updateBetStatusTypeTidb = async (query) => {
  await https().request(
    `/memberBetRecord/money-change-tidb/update?_method=PUT`,
    Method.POST,
    query,
    ContentType.form
  )
}

export const getMemberBetRecordsTiDB = query => {
  return https().request(
    '/memberBetRecord/tidb',
    Method.GET,
    query,
    ContentType.form
  )
}

export const requestExportMemberBetRecordTiDB = query => {
  return https().request(
    '/memberBetRecord/exportTiDB',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberBetRecordByPlatformListTiDB = query => {
  return https().request(
    '/memberBetRecord/byPlatformTiDB',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberBetRecordByPlatformListTotalTiDB = query => {
  return https().request(
    '/memberBetRecord/byPlatformTotalTiDB',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberBetRecordListTiDB = query => {
  return https().request(
    '/memberBetRecord/list-tidb',
    Method.GET,
    query,
    ContentType.form
  )
}
