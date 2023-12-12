import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getFeedbacks = (query) => {
  return https().request("/memberFeedback/query", Method.GET, query, ContentType.form);
};

export const readFeedback = (feedback) => {
  return https().request(`/memberFeedback/read/${feedback.id}`, Method.POST, { siteId: feedback.siteId }, ContentType.form);
};

export const replyFeedback = (id, siteId, replyTitle, replyContent) => {
  return https().request(`/memberFeedback/reply`, Method.POST, { id: id, siteId: siteId, title: replyTitle, content: replyContent }, ContentType.form);
};
