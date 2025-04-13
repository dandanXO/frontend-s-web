import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPrivilegeInfo = (privilegeInfo) => {
  return https().request("/privilegeInfo", Method.GET, privilegeInfo, ContentType.form);
};

export const getActivePrivilegeInfo = () => {
  return https().request("/privilegeInfo/list", Method.GET);
};

export const getActivePrivilegeInfoBySiteId = (siteId) => {
  return https().request("/privilegeInfo/priviList", Method.GET, { siteId: siteId }, ContentType.form);
};

export const getActivePrivilegeInfoBySiteIdWithoutRebate = (siteId) => {
  return https().request("/privilegeInfo/priviListWithoutRebate", Method.GET, { siteId: siteId }, ContentType.form);
};

export const getAllPrivilegeInfo = () => {
  return https().request("/privilegeInfo/allList", Method.GET);
};

export const getAllPrivilegeInfoBySiteId = (siteId) => {
  return https().request("/privilegeInfo/allPriviList", Method.GET, { siteId: siteId }, ContentType.form);
};

export const getSimplePrivilegeBySiteId = (siteId) => {
  return https().request("/privilegeInfo/simplePriviList", Method.GET, { siteId: siteId }, ContentType.form);
}

export const getPrivilegeExcelMapping = (siteId) => {
  return https().request("/privilegeInfo/excelMapping", Method.GET, { siteId: siteId }, ContentType.form);
};

export const getPrivilegeExcelMappingWithoutRebate = (siteId) => {
  return https().request("/privilegeInfo/excelMappingWithoutRebate", Method.GET, { siteId: siteId }, ContentType.form);
};

export const createPrivilegeInfo = (privilegeInfo) => {
  return https().request("/privilegeInfo", Method.POST, privilegeInfo, ContentType.form);
};

export const updatePrivilegeInfo = (privilegeInfo) => {
  return https().request(`/privilegeInfo/${privilegeInfo.id}?_method=PUT`, Method.POST, privilegeInfo, ContentType.form);
};

export const deletePrivilegeInfo = (ids) => {
  return https().request(`/privilegeInfo?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const updatePrivilegeInfoState = (id, state) => {
  return https().request(`/privilegeInfo/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};

export const getPrivilegeMatch = (privilegeInfo) => {
  return https().request("/privilegeInfo/queryMatch", Method.GET, privilegeInfo, ContentType.form);
};

export const updatePrivilegeMatch = (privilegeInfo) => {
  return https().request(`/privilegeInfo/match/${privilegeInfo.id}?_method=PUT`, Method.POST, privilegeInfo, ContentType.form);
};
