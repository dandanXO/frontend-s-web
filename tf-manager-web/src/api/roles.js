import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getRoutes = () => {
  return https().request("/roles/getRoutes", Method.GET, undefined, ContentType.form);
};

export const getRoles = (pageable) => {
  return https().request("/authority/roles", Method.GET, pageable, ContentType.form);
};

export const getSimpleRoles = (siteId) => {
  if (siteId !== undefined && siteId !== null) {
    return https().request(`/authority/roles/simple?siteId=${siteId}`, Method.GET);
  } else {
    return https().request(`/authority/roles/simple`, Method.GET);
  }
};

export const delRoles = (id) => {
  return https().request(`/authority/roles/${id}?_method=DELETE`, Method.POST);
};

export const delBatchRoles = (ids) => {
  return https().request(`/authority/roles?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const updateRole = (role) => {
  return https().request(`/authority/roles/${role.id}?_method=PUT`, Method.POST, role, ContentType.form);
};

export const createRole = async (role) => {
  return https().request("/authority/roles", Method.POST, role, ContentType.form);
};

export const createRoleWithPermission = async (role) => {
  return https().request("/authority/roles/createRoleWithPermission", Method.POST, role, ContentType.form);
};

export const copyRole = async (role) => {
  return https().request("/authority/roles/copyRole", Method.POST, role, ContentType.form);
};

export const updateRolePermission = async (role) => {
  await https().request(`/authority/roles/${role.id}/permission?_method=PUT`, Method.POST, {
    menuIds: role.menuIds.join(",")
  }, ContentType.form);
};

export const getSimpleUsersByRoles = (roleIdArr) => {
  const queryParams = roleIdArr.map(roleId => `roleIdArr=${roleId}`).join('&');
  return https().request(`/authority/roles/get-simple-users?${queryParams}`, Method.GET);
};

export const exportRole = (siteId, roleId) => {
  return https().request(`/authority/roles/export?siteId=${siteId}&roleId=${roleId}`, Method.GET);
};
