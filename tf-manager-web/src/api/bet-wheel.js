import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";
import { useStore } from '@/store'

const store = useStore()

export const getBetWheelParam = (siteId) => {
  return https().request("/betWheel", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateBetWheelParam = (siteId, param) => {
  return https().request(`/betWheel?_method=PUT`, Method.POST, { siteId: siteId, param: param }, ContentType.form);
};

export const getBetWheelRecords = (betWheel) => {
  return https().request("/betWheel/records", Method.GET, betWheel, ContentType.form);
};

export const getSiteWithPromo = () => {
  return https()
    .request("/betWheel/sites", Method.GET)
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
