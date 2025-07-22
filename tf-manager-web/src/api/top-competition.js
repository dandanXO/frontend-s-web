import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getTopCompetitionSettings = (query) => {
  return https().request(
    '/top-competition',
    Method.GET,
    query,
    ContentType.form
  );
};

export const deleteTopCompetitionSetting = (id) => {
  return https().request(
    `/top-competition/${id}`,
    Method.DELETE
  );
};

export const getSportTypes = () => {
  return https().request('/sport/sport-types', Method.GET, ContentType.form);
};

export const getCompetitionList = (params) => {
  return https().request('/top-competition/list', Method.GET, params, ContentType.form);
};

export const createTopCompetitionGroup = (body) => {
  return https().request('/top-competition', Method.POST, body, ContentType.json);
};
