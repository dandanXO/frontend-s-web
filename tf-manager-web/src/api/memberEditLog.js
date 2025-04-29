import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getMemberEditLogList = memberEditLog => {
  return https().request(
    '/member-edit-log',
    Method.GET,
    memberEditLog,
    ContentType.form
  )
}

export const getMemberEditLogSensitiveList = memberEditLog => {
  return https().request(
    '/member-edit-log/sensitive',
    Method.GET,
    memberEditLog,
    ContentType.form
  )
}

export const preCheckForCreate = memberMainInfo => {
  return https().request(
    '/member-edit-log/check',
    Method.POST,
    memberMainInfo,
    ContentType.json
  )
}

export const createMemberEditLog = memberEditLog => {
  return https().request(
    '/member-edit-log/create',
    Method.POST,
    memberEditLog,
    ContentType.json
  )
}

export const check = (record, siteId) => {
  return https().request(
    '/member-edit-log/checked',
    Method.POST,
    {
      siteId: siteId,
      createTime: record.createTime,
      memberId: record.memberId,
      afterInfo: record.afterInfo,
    },
    ContentType.json
  )
}

export const fail = (record, siteId) => {
  return https().request(
    '/member-edit-log/failed',
    Method.POST,
    {
      siteId: siteId,
      createTime: record.createTime,
      memberId: record.memberId,
      afterInfo: record.afterInfo,
    },
    ContentType.json
  )
}
