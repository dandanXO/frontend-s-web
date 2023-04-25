import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getFinanceFeedback = data => {
  return https().request(
    '/member/financeFeedbackRecord/list',
    Method.GET,
    data,
    ContentType.form
  )
}

export const updateFinanceFeedback = (id, remark) => {
  return https().request(`/member/${id}/update?_method=PUT`, Method.POST, { remark: remark }, ContentType.form);
};
