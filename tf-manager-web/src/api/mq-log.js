import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getMQLog = systemLog => {
  return https().request('/mqLog/list', Method.GET, systemLog, ContentType.json)
}

export const deleteMqLog = async (topic) => {
  await https().request(`/mqLog?topic=${topic}&_method=DELETE`, Method.POST, null, ContentType.form);
};
