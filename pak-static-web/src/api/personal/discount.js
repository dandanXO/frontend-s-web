import { server } from "@/utils/request";

export const getDiscount = (params) => {
  return server.REST.get("/session/member/privilege", params);
};
