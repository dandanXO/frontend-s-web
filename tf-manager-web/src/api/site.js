import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'
import { useStore } from '@/store'

const store = useStore()

export const getSites = site => {
  return https().request('/site', Method.GET, site, ContentType.form)
}

export const createSite = site => {
  return https().request('/site', Method.POST, site, ContentType.form)
}

export const updateSite = async site => {
  await https().request(
    `/site/${site.id}?_method=PUT`,
    Method.POST,
    site,
    ContentType.form
  )
}

export const updateSiteState = async (id, state) => {
  await https().request(
    `/site/${id}/state?_method=PUT`,
    Method.POST,
    { state: state },
    ContentType.form
  )
}

export const updateSiteMenu = async (id, param) => {
  await https().request(
    `/site/${id}/param?_method=PUT`,
    Method.POST,
    { param: param },
    ContentType.form
  )
}

export const getSiteListSimpleOri = () => {
  return https().request('/site/systemSiteList', Method.GET)
}

export const getSiteListSimple = () => {
  return https()
    .request('/site/systemSiteList', Method.GET)
    .then(response => {
      // if (store.state.user.userType === 'MANAGER') {
      const site = response.data

      const updateWithUserStoreSiteId = site.filter(
        e => e.id === store.state.user.siteId
      )
      const mockResponse = {
        code: 0,
        data: updateWithUserStoreSiteId,
      }

      return mockResponse
      // } else {
      //   return response
      // }
    })
    .catch(error => {
      console.error('Error fetching site list:', error)
      return {
        code: 1,
        data: [],
      }
    })
}

export const getSiteListSimpleNoParenId = () => {
  return https().request('/site/systemSiteListNoParenId', Method.GET)
}

export const getSiteExcelMapping = () => {
  return https().request('/site/excelMapping', Method.GET)
}

export const getSiteIdByName = name => {
  return https().request(
    '/site/getIdByName',
    Method.GET,
    { name: name },
    ContentType.form
  )
}

export const getSiteTimeZoneById = id => {
  return https().request('/site/getTimeZoneById', Method.GET, { id: id })
}

export const getSupportedCurrencyBySiteId = id => {
  return https().request('/site/getSupportedCurrencyBySite', Method.GET, {
    siteId: id,
  })
}
