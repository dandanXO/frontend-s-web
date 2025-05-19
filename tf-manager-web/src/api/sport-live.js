import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getTeams = (teams) => {
  return https().request(
    '/live-sport/team',
    Method.GET,
    teams,
    ContentType.form
  )
};

export const getTeamById = (sportId) => {
  return https().request(
    '/live-sport/team/list',
    Method.GET,
    { sportId: sportId },
    ContentType.form
  )
};

export const createSportLiveTeam = (team) => {
  return https().request("/live-sport/team", Method.POST, team, ContentType.form);
};

export const updateSportLiveTeam = (team) => {
  return https().request(`/live-sport/team`, Method.PUT, team, ContentType.json);
};

export const deleteSportLiveTeam = (teamId) => {
  return https().request(`/live-sport/team/${teamId}`, Method.DELETE);
};

export const getStreamers = (request) => {
  return https().request(
    '/live-sport/streamer',
    Method.GET,
    request,
    ContentType.form
  )
};

export const createSportLiveStreamer = (streamer) => {
  return https().request("/live-sport/streamer", Method.POST, streamer, ContentType.form);
};

export const updateSportLiveStreamer = (streamer) => {
  return https().request(`/live-sport/streamer`, Method.PUT, streamer, ContentType.json);
};

export const deleteSportLiveStreamer = (id) => {
  return https().request(`/live-sport/streamer/${id}`, Method.DELETE);
};

export const getEvents = (request) => {
  return https().request(
    '/live-sport/event',
    Method.POST,
    request,
    ContentType.form
  )
};

export const createSportLiveEvent = (event) => {
  return https().request("/live-sport/event/save", Method.POST, event, ContentType.json);
};

export const updateSportLiveEvent = (streamer) => {
  return https().request(`/live-sport/event`, Method.PUT, streamer, ContentType.json);
};

export const deleteSportLiveEvent = (id) => {
  return https().request(`/live-sport/event/${id}`, Method.DELETE);
};

export const createSportLiveSupplierStream = (stream) => {
  return https().request("/live-sport/supplier-stream", Method.POST, stream, ContentType.json);
};

export const updateSupplierStream = (stream) => {
  return https().request(`/live-sport/supplier-stream/status`, Method.PUT, stream, ContentType.json);
};

export const updateSportLiveStream = (stream) => {
  return https().request(`/live-sport/stream`, Method.PUT, stream, ContentType.json);
};

export const createSportLiveStream = (stream) => {
  return https().request("/live-sport/stream", Method.POST, stream, ContentType.json);
};

export const deleteSportLiveStream = (id) => {
  return https().request(`/live-sport/stream/${id}`, Method.DELETE);
};

export const deleteSportLiveSupplierStream = (id) => {
  return https().request(`/live-sport/supplier-stream/${id}`, Method.DELETE);
};

export const getSportLiveSupplierStream = (request) => {
  return https().request(
    '/live-sport/supplier-stream',
    Method.GET,
    request,
    ContentType.form
  )
};

export const getSportLiveStream = (request) => {
  return https().request(
    '/live-sport/stream',
    Method.GET,
    request,
    ContentType.form
  )
};
