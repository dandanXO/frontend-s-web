import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const MenuType = {
  CATALOG: "CATALOG", MENU: "MENU", BUTTON: "BUTTON"
}

export const MenuViewScope = {
  ALL: "ALL", ADMIN_ONLY: "ADMIN_ONLY"
}

const filterNull = (form) => {
  const data = {};
  Object.entries(form).forEach(([key, value]) => {
    if (value !== null && value !== "") {
      data[key] = value;
    }
  });
  return data;
};

export const fetchMenu = (parentId) => {
  return https().request("/authority/menu", Method.GET, { parentId: parentId });
};

export const fetchSimpleMenu = () => {
  return https().request("/authority/menu/simple", Method.GET);
};

export const fetchSimpleChildMenu = (id) => {
  return https().request(`/authority/menu/${id}/simpleChild`, Method.GET);
};

export const fetchMenuName = (parentId) => {
  return https().request(`/authority/menu/${parentId}`, Method.GET);
};

export const createMenu = (menu) => {
  const data = filterNull(menu);
  return https().request(`/authority/menu`, Method.POST, data, ContentType.form);
};

export const updateMenu = (menu) => {
  const data = filterNull(menu);
  return https().request(`/authority/menu/${menu.id}?_method=PUT`, Method.POST, data, ContentType.form);
};

export const deleteMenu = (menuId) => {
  return https().request(`/authority/menu/${menuId}?_method=DELETE`, Method.POST);
};

export const fetchChildren = (menuId) => {
  return https().request(`/authority/menu/${menuId}/child-ids`, Method.GET);
};
