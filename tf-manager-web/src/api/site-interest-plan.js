import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getSiteInterestPlan = plan => {
  return https().request(
    '/site-interest-plan',
    Method.GET,
    plan,
    ContentType.form
  )
}

export const createSiteInterestPlan = plan => {
  return https().request(
    '/site-interest-plan',
    Method.POST,
    plan,
    ContentType.form
  )
}

export const updateSiteInterestPlan = async plan => {
  await https().request(
    `/site-interest-plan/${plan.id}?_method=PUT`,
    Method.POST,
    plan,
    ContentType.form
  )
}

export const deleteSiteInterestPlan = async ids => {
  await https().request(
    `/site-interest-plan?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}
