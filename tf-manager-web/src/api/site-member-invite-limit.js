import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getSiteMemberInviteLimitRecords = inviteLimit => {
  return https().request(
    '/site-member-invite-limit',
    Method.GET,
    inviteLimit,
    ContentType.form
  )
}

export const createMemberInviteLimit = inviteLimit => {
  return https().request(
    '/site-member-invite-limit',
    Method.POST,
    inviteLimit,
    ContentType.form
  )
}

export const updateMemberInviteLimit = async inviteLimit => {
  await https().request(
    `/site-member-invite-limit/${inviteLimit.id}?_method=PUT`,
    Method.POST,
    inviteLimit,
    ContentType.form
  )
}

export const checkMemberInviteLimit = loginName => {
  return https().request(
    `/site-member-invite-limit/getMemberSubLimit`,
    Method.GET,
    loginName,
    ContentType.form
  )
}

export const deleteMemberInviteLimit = async ids => {
  await https().request(
    `/site-member-invite-limit?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}
