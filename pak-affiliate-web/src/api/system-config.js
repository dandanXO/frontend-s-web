import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getConfigs = query => {
  return https().request('/config', Method.GET, query, ContentType.form)
}

export const getConfigListByGroup = (group, siteId) => {
  return https().request("/config/list-by-group", Method.GET, { configGroup: group, siteId: siteId }, ContentType.form);
};
