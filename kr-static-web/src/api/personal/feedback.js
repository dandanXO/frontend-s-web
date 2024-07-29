import { server } from "@/utils/request";

export const getSysReply = () => {
  return server.REST.get("/session/feedback/sysReply");
};
