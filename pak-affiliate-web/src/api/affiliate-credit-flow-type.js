import { Method } from 'axios-mapper'
import https from '../utils/https'

export const getCreditFlowType = query => {
  return https().request('/creditFlowType/list', Method.GET, query)
}
