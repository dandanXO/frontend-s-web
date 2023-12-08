import { server } from "@/utils/request";

export function loadMailbox(type, pageNum, pageSize) {
  return server.REST.post("auth/mailbox", {
    type,
    pageNum,
    pageSize
  });
}

export function mailInbox(mailQuery) {
  return server.REST.get("/session/inbox", {
    params: {
      type: mailQuery.type,
      current: mailQuery.current,
      size: mailQuery.size,
      orderBy: mailQuery.orderBy
    }
  });
}

export function mailOutbox(mailQuery) {
  return server.REST.get("/session/outbox", {
    params: {
      type: mailQuery.type,
      current: mailQuery.current,
      size: mailQuery.size,
      orderBy: mailQuery.orderBy
    }
  });
}

export function wirteMail(mail) {
  return server.REST.post("/session/writeOutbox", mail);
}

export function getFeedbackType() {
  return server.REST.get("/session/feedback/types", {});
}

export function getFeedbackReplies() {
  return server.REST.get("/session/feedback/replies", {});
}

export function readFeedback(param) {
  const { id } = param;
  return server.REST.get(`/session/feedback/${id}/read`, {});
}

export function deleteFeedback(param) {
  const { ids } = param;
  return server.REST.delete(`/session/feedback/delete?ids=${ids}`);
}

// POST /session/feedback?feedbackType={type}&title={title}&content={content}
export function submitFeedback(param) {
  const { feedbackType, title, content } = param;
  return server.REST.post("/session/feedback", { feedbackType, title, content });
}
