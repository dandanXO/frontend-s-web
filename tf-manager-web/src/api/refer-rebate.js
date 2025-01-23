import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";
import { useStore } from '@/store'

const store = useStore()

export const getSiteWithPromo = () => {
  return https()
    .request("/refer-bonus-rebate/sites", Method.GET)
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

export const getEligibilitySettings = (siteId) => {
  return https().request("/refer-bonus-rebate/eligibility-settings", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateEligibilitySettings = (siteId, param) => {
  return https().request(`/refer-bonus-rebate/eligibility-settings?_method=PUT`, Method.POST, { siteId: siteId, param: param }, ContentType.form);
};

export const updateSettingStatus = (siteId, status, setting) => {
  return https().request(`/refer-bonus-rebate/setting-status?_method=PUT`, Method.POST, { siteId: siteId, status: status, setting: setting }, ContentType.form);
};
export const getDepositRebateSettings = (siteId) => {
  return https().request("/refer-bonus-rebate/deposit-rebate-settings", Method.GET, { siteId: siteId }, ContentType.form);
}

export const createDepositRebateSettings = (siteId, setting) => {
  return https().request(`/refer-bonus-rebate/deposit-rebate-settings/${siteId}`, Method.POST, setting, ContentType.form);
}

export const updateDepositRebateSettings = (setting) => {
  return https().request(`/refer-bonus-rebate/deposit-rebate-settings?_method=PUT`, Method.POST, setting, ContentType.form);
};

export const getOneTimeBonusSetting = (siteId) => {
  return https().request("/refer-bonus-rebate/one-time-bonus-settings", Method.GET, { siteId: siteId }, ContentType.form);
}

export const createOneTimeBonusSetting = (siteId, setting) => {
  return https().request(`/refer-bonus-rebate/one-time-bonus-settings/${siteId}`, Method.POST, setting, ContentType.form);
}

export const updateOneTimeBonusSetting = (setting) => {
  return https().request(`/refer-bonus-rebate/one-time-bonus-settings?_method=PUT`, Method.POST, setting, ContentType.form);
};

export const getBetRebateSetting = (siteId) => {
  return https().request("/refer-bonus-rebate/bet-rebate-settings", Method.GET, { siteId: siteId }, ContentType.form);
}

export const createBetRebateSetting = (siteId, setting) => {
  return https().request(`/refer-bonus-rebate/bet-rebate-settings/${siteId}`, Method.POST, setting, ContentType.form);
}

export const updateBetRebateSetting = (setting) => {
  return https().request(`/refer-bonus-rebate/bet-rebate-settings?_method=PUT`, Method.POST, setting, ContentType.form);
};
