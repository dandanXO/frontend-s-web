import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getTeamVotesSettings = (query) => {
  return https().request("/team-votes", Method.GET, query, ContentType.form);
};

export const createTeamVotes = (query) => {
  return https().request("/team-votes", Method.POST, query, ContentType.form);
};

export const deleteTeamVotes = (id) => {
  return https().request(`/team-votes/${id}`, Method.DELETE, id, ContentType.form);
};

export const updateVotes = (vote) => {
  return https().request(`/team-votes/${vote.id}/update-votes?virtualVotes=${vote.totalVotesVirtual}`, Method.PUT, {}, ContentType.form);
};

export const getTeamVotesRecord = (query) => {
  return https().request("/team-votes/record", Method.GET, query, ContentType.form);
};

export const cancelTeamVotesRecord = async (id) => {
  await https().request(`/team-votes/record/${id}/cancel`, Method.PUT, id, ContentType.form);
};

export const getTeamListSimple = () => {
  return https().request("/team-votes/simple", Method.GET);
}
