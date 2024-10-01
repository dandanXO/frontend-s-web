import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";
import { useStore } from '@/store'

const store = useStore()

export const getFishRedPacketParam = (siteId) => {
  return https().request("/fish-red-packet", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateFishRedPacketParam = (siteId, param) => {
  return https().request(`/fish-red-packet?_method=PUT`, Method.POST, { siteId: siteId, param: param }, ContentType.form);
};

export const getSiteWithPromo = () => {
  return https()
    .request("/fish-red-packet/sites", Method.GET)
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
