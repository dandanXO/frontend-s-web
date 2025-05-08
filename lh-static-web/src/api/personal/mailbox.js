import { server } from "@/utils/request";

export function loadMailbox() {
  return server.REST.get("/session/inbox", {});
}

export function mailInbox(mailQuery) {
  return server.REST.get("/session/inbox", {
    params: {
      type: mailQuery.type,
      current: mailQuery.current,
      size: mailQuery.size,
      orderBy: mailQuery.orderBy,
      messageType: mailQuery.messageType
    }
  });
}

export function popupMailBox() {
  return server.REST.get("/session/pm/inbox/popup", {});
}

export function mailOutbox(mailQuery) {
  return server.REST.get("/session/feedback/messages", {
    params: {
      type: mailQuery.type,
      current: mailQuery.current,
      size: mailQuery.size,
      orderBy: mailQuery.orderBy,
      messageType: mailQuery.messageType
    }
  });
}

export function wirteMail(mail) {
  return server.REST.post("/session/writeOutbox", mail);
}

export function getUnreadTotal() {
  return server.REST.get("/session/inbox/getUnreadTotal");
}

export function readAllMail(mailQuery) {
  return server.REST.post("/session/inbox/readAll", {
    type: mailQuery !== null ? mailQuery : undefined
  });
}

export function deleteAllMail(mailQuery) {
  return server.REST.post("/session/inbox/deleteAll", {
    type: mailQuery !== null ? mailQuery : undefined
  });
}

export function readMultipleMail(mailQuery) {
  return server.REST.post("/session/inbox/readMultiple", {
    ids: mailQuery
  });
}

export function deleteMultipleMail(mailQuery) {
  return server.REST.post("/session/inbox/deleteMultiple", {
    ids: mailQuery
  });
}

export function readMail(mailQuery) {
  return server.REST.post("/session/inbox/read", {
    id: mailQuery.id
  });
}

// 意见反馈
export function getFeedbackType() {
  return server.REST.get("/session/feedback/types", {});
}

export function readFeedback(param) {
  const { id } = param;
  return server.REST.get(`/session/feedback/${id}/read`, {});
}

export function submitFeedback(param) {
  const { feedbackType, title, content, photo } = param;
  return server.REST.post("/session/feedback", { feedbackType, title, content, photo });
}
