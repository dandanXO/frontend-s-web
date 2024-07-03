import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const loginRequest = userInfo => {
  return https().request(
    '/auth/affLogin',
    Method.POST,
    userInfo,
    ContentType.form
  )
}
export const registerRequest = userInfo => {
  return https().request(
    '/auth/register',
    Method.POST,
    userInfo,
    ContentType.form
  )
}
export const getVerificationCode = () => {
  return https().request('/auth/verificationCode', Method.GET)
}

export const logoutRequest = () => {
  return https().request('/auth?_method=DELETE', Method.POST)
}

export const userInfoRequest = () => {
  return https().request('/auth', Method.GET)
}

export const loadAuthMenu = () => {
  return https().request('/auth/menu', Method.GET)
}

export const updatePasswordRequest = (id, updateInfo) => {
  return https().request(
    `/auth/${id}/password?_method=PUT`,
    Method.POST,
    updateInfo,
    ContentType.form
  )
}

export const updateWithdrawPasswordRequest = (id, updateInfo) => {
  return https().request(
    `/auth/${id}/withdrawPassword?_method=PUT`,
    Method.POST,
    updateInfo,
    ContentType.form
  )
}

export const getUsers = user => {
  for (const key in user) {
    if (user[key] === null || user[key] === undefined || user[key] === '') {
      delete user[key]
    }
  }
  return https().request('/authority/user', Method.GET, user, ContentType.form)
}

export const createUser = user => {
  for (const key in user) {
    if (user[key] === null || user[key] === undefined || user[key] === '') {
      delete user[key]
    }
  }
  return https().request('/authority/user', Method.POST, user, ContentType.json)
}

export const updateUser = async user => {
  await https().request(
    `/authority/user/${user.id}?_method=PUT`,
    Method.POST,
    {
      roles: user.roles.join(','),
      userType: user.userType,
      siteId: user.siteId,
    },
    ContentType.form
  )
}

export const updateUserPassword = async user => {
  await https().request(
    `/authority/user/${user.id}/password?_method=PUT`,
    Method.POST,
    { password: user.password },
    ContentType.form
  )
}

export const updateUserState = async (id, state) => {
  await https().request(
    `/authority/user/${id}/state?_method=PUT`,
    Method.POST,
    { state: state },
    ContentType.form
  )
}

export const deleteUser = async ids => {
  await https().request(
    `/authority/user?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}

export const verifyGoogleAuthentication = (loginName, siteId, code) => {
  return https().request(
    '/auth/googleAuthentication',
    Method.POST,
    { loginName: loginName, siteId: siteId, code: code },
    ContentType.form
  )
}

export const getSecurityQuestionsList = (loginName, siteId) => {
  return https().request(
    '/auth/getSecurityQuestion',
    Method.GET,
    { loginName: loginName, siteId: siteId },
    ContentType.form
  )
}

export const verifySecurityQuestions = (
  loginName,
  siteId,
  answer,
  questionNumber,
  verificationCode
) => {
  return https().request(
    '/auth/verifySecurityQuestion',
    Method.POST,
    {
      loginName: loginName,
      siteId: siteId,
      answer: answer,
      questionNumber: questionNumber,
      verificationCode: verificationCode,
    },
    ContentType.form
  )
}

export const resetLoginPassword = (
  loginName,
  siteId,
  password,
  verificationCode
) => {
  return https().request(
    '/auth/resetLoginPassword',
    Method.POST,
    {
      loginName: loginName,
      siteId: siteId,
      password: password,
      verificationCode: verificationCode,
    },
    ContentType.form
  )
}

export const resetWithdrawPassword = (
  loginName,
  siteId,
  password,
  verificationCode
) => {
  return https().request(
    '/auth/resetWithdrawPassword',
    Method.POST,
    {
      loginName: loginName,
      siteId: siteId,
      password: password,
      verificationCode: verificationCode,
    },
    ContentType.form
  )
}
