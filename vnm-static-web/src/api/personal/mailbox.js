import { server } from "@/utils/request";

export function loadMailbox(type, pageNum, pageSize) {
  return server.REST.post("auth/mailbox", {
    type,
    pageNum,
    pageSize
  });
}

export function popupMailBox() {
  return server.REST.get("/session/pm/inbox/popup", {});
}

export function mailInbox(mailQuery) {
  return server.REST.get("/session/pm/inbox", {
    params: {
      type: mailQuery.type,
      current: mailQuery.current,
      size: mailQuery.size,
      orderBy: mailQuery.orderBy,
      messageType: mailQuery.messageType
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

export function getUnreadTotal() {
  return server.REST.get("/session/pm/inbox/getUnreadTotal");
}

export function readAllMail(mailQuery) {
  return server.REST.post("/session/pm/inbox/readAll", {
    type: mailQuery !== null ? mailQuery : undefined
  });
}

export function deleteAllMail(mailQuery) {
  return server.REST.post("/session/pm/inbox/deleteAll", {
    type: mailQuery !== null ? mailQuery : undefined
  });
}

export function readMultipleMail(mailQuery) {
  return server.REST.post("/session/pm/inbox/readMultiple", {
    ids: mailQuery
  });
}

export function deleteMultipleMail(mailQuery) {
  return server.REST.post("/session/pm/inbox/deleteMultiple", {
    ids: mailQuery
  });
}

export function readMail(mailQuery) {
  return server.REST.post("/session/pm/inbox/read", {
    id: mailQuery.id
  });
}
