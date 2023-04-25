import Cookies from 'js-cookie'

const Keys = {
  sidebarStatusKey: 'sidebarStatusKey',
  sizeKey: 'sizeKey',
  tokenKey: 'access-token',
  aseKey: 'ase-key'
}
export const getSidebarStatus = () => Cookies.get(Keys.sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus) => Cookies.set(Keys.sidebarStatusKey, sidebarStatus)

export const getToken = () => Cookies.get(Keys.tokenKey)
export const setToken = (token) => Cookies.set(Keys.tokenKey, token, { secure: true })
export const removeToken = () => Cookies.remove(Keys.tokenKey)
