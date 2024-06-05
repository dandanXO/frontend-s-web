import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getUefaTeam = (query) => {
  return https().request("/uefa/team", Method.GET, query, ContentType.form);
};

export const createUefaTeam = (team) => {
  return https().request("/uefa/team", Method.POST, team, ContentType.form);
};

export const updateUefaTeam = (id, team) => {
  return https().request(`/uefa/team/${id}?_method=PUT`, Method.POST, team, ContentType.form);
};

export const updateUefaTeamScore = (id, team) => {
  return https().request(`/uefa/team/score/${id}?_method=PUT`, Method.POST, team, ContentType.form);
};

export const getTeamBySite = (siteId) => {
  return https().request("/uefa/teamBySite", Method.GET, { siteId: siteId }, ContentType.form);
};

export const getUefaTeamRecord = (query) => {
  return https().request("/uefa/team-record", Method.GET, query, ContentType.form);
};

export const getUefaMatch = (query) => {
  return https().request("/uefa/match", Method.GET, query, ContentType.form);
};

export const createUefaMatch = (match) => {
  return https().request("/uefa/match", Method.POST, match, ContentType.form);
};

export const updateUefaMatch = (id, match) => {
  return https().request(`/uefa/match/${id}?_method=PUT`, Method.POST, match, ContentType.form);
};

export const uefaMatchOngoing = (id) => {
  return https().request(`/uefa/matchOngoing/${id}?_method=PUT`, Method.POST);
};

export const endUefaMatch = (id, winner) => {
  return https().request(`/uefa/matchEnd/${id}?_method=PUT`, Method.POST, { winner: winner }, ContentType.form);
};

export const endUefaMatchResettle = (id, winner) => {
  return https().request(`/uefa/matchEndResettle/${id}?_method=PUT`, Method.POST, { winner: winner }, ContentType.form);
};

export const cancelUefaMatch = (id, match) => {
  return https().request(`/uefa/matchCancel/${id}?_method=PUT`, Method.POST, match, ContentType.form);
};

export const getUefaMatchRecord = (query) => {
  return https().request("/uefa/match-record", Method.GET, query, ContentType.form);
};

export const getUefaSettlement = (query) => {
  return https().request("/uefa/settlement", Method.GET, query, ContentType.form);
};

export const settleUefa = (id) => {
  return https().request(`/uefa/settlement/${id}?_method=PUT`, Method.POST);
};

export const cancelUefaSettlement = (id) => {
  return https().request(`/uefa/settlementCancel/${id}?_method=PUT`, Method.POST);
};

export const settleAllPendingUefa = (siteId) => {
  return https().request('/uefa/settlement/all?_method=PUT', Method.POST, { siteId: siteId }, ContentType.form);
};
