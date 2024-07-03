import Cookies from 'js-cookie'

const Keys = {
  sidebarStatusKey: 'sidebarStatusKey',
  sizeKey: 'sizeKey',
  tokenKey: 'access-token',
  aseKey: 'ase-key',
  id: 'member',
  siteId: 'site',
  siteCode: 'siteCode',
  affiliateLevel: 'affiliateLevel',
  name: 'name',
  realName: 'realName'
}
export const getSidebarStatus = () => Cookies.get(Keys.sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus) => Cookies.set(Keys.sidebarStatusKey, sidebarStatus)

export const getToken = () => Cookies.get(Keys.tokenKey)
export const setToken = (token) => Cookies.set(Keys.tokenKey, token, { secure: true })
export const removeToken = () => Cookies.remove(Keys.tokenKey)

export const getId = () => Cookies.get(Keys.id)
export const setId = (id) => Cookies.set(Keys.id, id, { secure: true })
export const removeId = () => Cookies.remove(Keys.id)

export const getLoginName = () => Cookies.get(Keys.name)
export const setLoginName = (loginName) => Cookies.set(Keys.name, loginName, { secure: true })
export const removeLoginName = () => Cookies.remove(Keys.name)

export const getRealName = () => Cookies.get(Keys.realName)
export const setRealName = (realName) => Cookies.set(Keys.realName, realName, { secure: true })
export const removeRealName = () => Cookies.remove(Keys.realName)

export const getSiteId = () => Cookies.get(Keys.siteId)
export const setSiteId = (siteId) => Cookies.set(Keys.siteId, siteId, { secure: true })
export const removeSiteId = () => Cookies.remove(Keys.siteId)

export const getSiteCode = () => Cookies.get(Keys.siteCode)
export const setSiteCode = (siteCode) => Cookies.set(Keys.siteCode, siteCode, { secure: true })
export const removeSiteCode = () => Cookies.remove(Keys.siteCode)

export const getAffiliateLevel = () => Cookies.get(Keys.affiliateLevel)
export const setAffiliateLevel = (affiliateLevel) => Cookies.set(Keys.affiliateLevel, affiliateLevel, { secure: true })
export const removeAffiliateLevel = () => Cookies.remove(Keys.affiliateLevel)
