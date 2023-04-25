import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPlatformAccount = (sitePlatform) => {
  return https().request("/system-platform-account", Method.GET, sitePlatform, ContentType.form);
};

export const createPlatformAccount = (sitePlatform) => {
  return https().request("/system-platform-account", Method.POST, sitePlatform, ContentType.form);
};

export const updatePlatformAccount = async (sitePlatform) => {
  await https().request(`/system-platform-account/${sitePlatform.id}?_method=PUT`, Method.POST, sitePlatform, ContentType.form);
};

export const deletePlatformAccount = async (ids) => {
  await https().request(`/system-platform-account?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const updateAccountNeedRegister = async (id, needRegister) => {
  await https().request(`/system-platform-account/${id}/needRegister?_method=PUT`, Method.POST, { needRegister: needRegister }, ContentType.form);
};

export const getPlatformAccountList = () => {
  return https().request("/system-platform-account/platformAccList", Method.GET, ContentType.form);
};
