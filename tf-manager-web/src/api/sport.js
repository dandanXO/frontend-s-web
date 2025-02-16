import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSportTypes = () => {
  return https().request("/sport/sport-types", Method.GET, ContentType.form);
};

export const getCompetitions = (query) => {
  return https().request("/sport/competition", Method.GET, query, ContentType.form);
};

export const updateCompetitionLanguageName = (competitionId, request) => {
  return https().request(
    `/sport/competition/${competitionId}/language-name`,
    Method.PUT,
    request,
    ContentType.json
  );
}

export const getTeams = (query) => {
  return https().request("/sport/team", Method.GET, query, ContentType.form);
};

export const updateTeamLanguageName = (teamId, request) => {
  return https().request(
    `/sport/team/${teamId}/language-name`,
    Method.PUT,
    request,
    ContentType.json
  );
}

export const updateCompetitionPendingDuration = (competitionId) => {
  return https().request(`/sport/competition/${competitionId}/pending-duration`, Method.PUT, ContentType.form);
};
