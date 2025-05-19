import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getChatVipStatus = (request) => {
  return https().request(
    '/live-sport/chat',
    Method.GET,
    request,
    ContentType.form
  )
};

export const updateChatVipStatus = (request) => {
  return https().request(
    '/live-sport/chat',
    Method.PUT,
    request,
    ContentType.json
  );
};

export const getBlockList = (queryString) => {
  return https().request(`/live-sport/chat-block${queryString}`, Method.GET);
};

export const blockUserApi = (request) => {
  return https().request(
    '/live-sport/chat-block',
    Method.PUT,
    request,
    ContentType.json
  )
};

export const unblockUserApi = (request) => {
  return https().request(
    '/live-sport/chat-block/unblock',
    Method.PUT,
    request,
    ContentType.json
  )
};

export const getStreamList = (request) => {
  return https().request(
    '/live-sport/stream/list',
    Method.GET,
    request,
    ContentType.form
  )
};

export const getChatHistory = (query, body) => {
  return https().request(`/live-sport/chat/history${query}`, Method.POST, body, ContentType.json);
};
