import { api } from "src/boot/axios";

export function loadMailbox(type, pageNum, pageSize) {
  return api.post("auth/mailbox", {
    type,
    pageNum,
    pageSize,
  });
}

export function mailInbox(mailQuery) {
  return api.get("/session/inbox", {
    params: {
      type: mailQuery.type,
      current: mailQuery.current,
      size: mailQuery.size,
      orderBy: mailQuery.orderBy,
    },
  });
}

export function mailOutbox(mailQuery) {
  return api.get("/session/outbox", {
    params: {
      type: mailQuery.type,
      current: mailQuery.current,
      size: mailQuery.size,
      orderBy: mailQuery.orderBy,
    },
  });
}

export function wirteMail(mail) {
  return api.post("/session/writeOutbox", mail);
}
