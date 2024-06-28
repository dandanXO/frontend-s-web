import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getTeamVotesSettings = (query) => {
  return https().request("/team-votes", Method.GET, query, ContentType.form);
};

export const getTeamVotesAwardsSettings = (siteId) => {
  return https().request("/team-votes/award", Method.GET, { siteId: siteId }, ContentType.form);
};

export const createTeamVotes = (query) => {
  return https().request("/team-votes", Method.POST, query, ContentType.form);
};

export const deleteTeamVotes = (id) => {
  return https().request(`/team-votes/${id}?_method=DELETE`, Method.POST, id, ContentType.form);
};

export const updateVotes = (vote) => {
  return https().request(`/team-votes/${vote.id}/update-votes?_method=PUT`, Method.POST, { virtualVotes: vote.totalVotesVirtual, sequence: vote.sequence }, ContentType.form);
};

export const updateAwards = (vote) => {
  return https().request('/team-votes/update-awards?_method=PUT', Method.POST, vote, ContentType.form);
};

export const getTeamVotesRecord = (query) => {
  return https().request("/team-votes/record", Method.GET, query, ContentType.form);
};

export const cancelTeamVotesRecord = async (id) => {
  await https().request(`/team-votes/record/${id}/cancel?_method=PUT`, Method.POST, id, ContentType.form);
};

export const getTeamListSimple = () => {
  return https().request("/team-votes/simple", Method.GET);
}

export const getTeamVotesRecordForExport = (query) => {
  return https().request("/team-votes/record/export", Method.GET, query, ContentType.form);
};
