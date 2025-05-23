import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getRegisterBlacklist = blacklist => {
  return https().request(
    '/register-blacklist',
    Method.GET,
    blacklist,
    ContentType.form
  )
}

export const createRegisterBlacklist = blacklist => {
  return https().request(
    '/register-blacklist',
    Method.POST,
    blacklist,
    ContentType.form
  )
}

export const updateRegisterBlacklist = async blacklist => {
  await https().request(
    `/register-blacklist/${blacklist.id}?_method=PUT`,
    Method.POST,
    blacklist,
    ContentType.form
  )
}

export const deleteRegisterBlacklist = async id => {
  await https().request(
    `/register-blacklist/${id}?_method=DELETE`,
    Method.POST
  )
}

export const updateRegisterBlacklistState = (id, state) => {
  return https().request(`/register-blacklist/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};
