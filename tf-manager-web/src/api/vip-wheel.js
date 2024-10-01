import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";
import { useStore } from '@/store'

const store = useStore()

export const getVipWheelParam = (siteId) => {
  return https().request("/vipWheel", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateVipWheelParam = (siteId, param) => {
  return https().request(`/vipWheel?_method=PUT`, Method.POST, { siteId: siteId, param: param }, ContentType.form);
};

export const getVipWheelRecords = (vipWheel) => {
  return https().request("/vipWheel/records", Method.GET, vipWheel, ContentType.form);
};

export const getSiteWithPromo = () => {
  return https()
    .request("/vipWheel/sites", Method.GET)
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
