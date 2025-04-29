import { Method } from 'axios-mapper'
import https from '../utils/https'

export const getCreditFlow = query => {
  return https().request('/creditFlow/list', Method.GET, query)
}
