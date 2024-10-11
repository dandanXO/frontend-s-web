import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";
import { useStore } from '@/store'

const store = useStore()

export const getPiggyBankSettings = (siteId, promoCode) => {
  return https().request("/piggy-bank/settings", Method.GET, { siteId: siteId, promoCode: promoCode }, ContentType.form);
};

export const updatePiggyBankSettings = (siteId, param, promoCode) => {
  return https().request(`/piggy-bank?_method=PUT`, Method.POST, { siteId: siteId, param: param, promoCode: promoCode }, ContentType.form);
};

export const getPiggyBankRecords = (piggyBank) => {
  return https().request("/piggy-bank", Method.GET, piggyBank, ContentType.form);
};

export const getSiteWithPromo = (promoCode) => {
  return https()
    .request("/piggy-bank/sites", Method.GET, { promoCode: promoCode }, ContentType.form)
    .then(response => {
      const site = response.data

      const updateWithUserStoreSiteId = site.filter(
        e => e.id === store.state.user.siteId
      )
      const mockResponse = {
        code: 0,
        data: updateWithUserStoreSiteId,
      }

      return mockResponse
    })
    .catch(error => {
      console.error('Error fetching site list:', error)
      return {
        code: 1,
        data: [],
      }
    });
}
