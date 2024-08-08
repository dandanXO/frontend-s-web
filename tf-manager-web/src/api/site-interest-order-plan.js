import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getInterestPlanOrderRecords = order => {
  return https().request(
    '/interest-plan-order-record',
    Method.GET,
    order,
    ContentType.form
  )
}

export const updateInterestPlanOrder = async order => {
  await https().request(
    `/interest-plan-order-record/${order.id}?_method=PUT`,
    Method.POST,
    order,
    ContentType.form
  )
}
