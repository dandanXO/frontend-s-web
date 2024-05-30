import { server } from "@/utils/request";

export function loadMailbox(type, pageNum, pageSize) {
  return server.REST.post("auth/mailbox", {
    type,
    pageNum,
    pageSize,
  });
}

export function mailInbox(mailQuery) {
  return server.REST.get("/session/inbox", {
    params: {
      type: mailQuery.type,
      current: mailQuery.current,
      size: mailQuery.size,
      orderBy: mailQuery.orderBy,
    },
  });
}

export function mailOutbox(mailQuery) {
  return server.REST.get("/session/outbox", {
    params: {
      type: mailQuery.type,
      current: mailQuery.current,
      size: mailQuery.size,
      orderBy: mailQuery.orderBy,
    },
  });
}

export function wirteMail(mail) {
  return server.REST.post("/session/writeOutbox", mail);
}
