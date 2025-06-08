import { server } from "@/utils/request";
import cached from "@/utils/cache";

const SESSION_STORAGE_PREFIX_KEY = `MAILINBOX`;

export function loadMailbox(type, pageNum, pageSize) {
  return server.REST.post("auth/mailbox", {
    type,
    pageNum,
    pageSize
  });
}

// if read or delete function is called, clear existing cache to retrieve lastest data
export function clearMailInboxCache() {
  for (var key in sessionStorage) {
    if (key.startsWith(SESSION_STORAGE_PREFIX_KEY)) {
      sessionStorage.removeItem(key);
    }
  }
}

export function mailInbox(mailQuery) {
  const key = `${SESSION_STORAGE_PREFIX_KEY}_${mailQuery.current}_${mailQuery.size}_${mailQuery.orderBy}_${mailQuery.messageType}`;

  return cached.get(key, () =>
    server.REST.get("/session/inbox", {
      params: {
        type: mailQuery.type,
        current: mailQuery.current,
        size: mailQuery.size,
        orderBy: mailQuery.orderBy,
        messageType: mailQuery.messageType
      }
    })
  );
}

export function getUnreadMailTotal() {
  return server.REST.get("/session/inbox/getUnreadTotal");
}

export function readMail(mailQuery) {
  return server.REST.post("/session/inbox/read", {
    id: mailQuery.id
  });
}

export function readMultipleMail(mailQuery) {
  return server.REST.post("/session/inbox/readMultiple", {
    ids: mailQuery
  });
}

export function readAllMail(mailQuery) {
  return server.REST.post("/session/inbox/readAll", {
    type: mailQuery !== null ? mailQuery : undefined
  });
}

export function deleteMail(mailQuery) {
  return server.REST.post("/session/inbox/delete", {
    id: mailQuery.id
  });
}

export function deleteMultipleMail(mailQuery) {
  return server.REST.post("/session/inbox/deleteMultiple", {
    ids: mailQuery
  });
}

export function deleteAllMail(mailQuery) {
  return server.REST.post("/session/inbox/deleteAll", {
    type: mailQuery !== null ? mailQuery : undefined
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

export function getFeedbackReplies(mailQuery) {
  return server.REST.get("/session/feedback/messages", {
    params: {
      type: mailQuery.type,
      current: mailQuery.current,
      size: mailQuery.size,
      orderBy: mailQuery.orderBy
    }
  });
}

export function readFeedback(param) {
  const { id } = param;
  return server.REST.get(`/session/feedback/${id}/read`, {});
}

export function deleteFeedback(param) {
  const { ids } = param;
  return server.REST.post(`/session/feedback/delete?ids=${ids}`);
}

// POST /session/feedback?feedbackType={type}&title={title}&content={content}
export function submitFeedback(param) {
  const { feedbackType, title, content, photo } = param;
  return server.REST.post("/session/feedback", { feedbackType, title, content, photo });
}
