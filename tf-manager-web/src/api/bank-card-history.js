import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getBankCardHistory = bank => {
  return https().request(
    '/member/bankCardHistory',
    Method.GET,
    bank,
    ContentType.form
  )
}
