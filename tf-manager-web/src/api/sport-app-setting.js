import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getSportAppSetting = () => {
  return https().request(
    "/sport-config/all",
    Method.GET,
    ContentType.json
  );
};

export const updateSportAppSetting = (data) => {
  console.log('data', data);
  const formData = {
    id: data.id,
    supplierId: data.supplierId,
    setting: data.setting,
  }
  return https().request(
    "/sport-config",
    Method.POST,
    formData,
    ContentType.json
  )
};
