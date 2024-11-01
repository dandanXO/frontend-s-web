import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAllConfigurable = () => {
  return https().request("/system-monitor-notification/all-configurable-types", Method.GET);
};

export const getAllSettingBySiteId = (siteId) => {
  return https().request(`/system-monitor-notification/all?siteId=${siteId}`, Method.GET);
};

export const createMonitorSetting = (monitorSetting) => {
  return https().request(`/system-monitor-notification/monitor/new`, Method.POST, monitorSetting, ContentType.json);
};

export const updateMonitorSetting = (monitorSetting) => {
  return https().request(`/system-monitor-notification/monitor`, Method.POST, monitorSetting, ContentType.json);
};

export const createNotificationSetting = (notificationSetting) => {
  return https().request(`/system-monitor-notification/notification/new`, Method.POST, notificationSetting, ContentType.json);
};

export const updateNotificationSetting = (notificationSetting) => {
  return https().request(`/system-monitor-notification/notification`, Method.POST, notificationSetting, ContentType.json);
};
