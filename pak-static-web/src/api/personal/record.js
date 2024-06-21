import { server } from "@/utils/request";

export const getBetRecord = (params) => {
  return server.REST.get("/session/member/cassandraBetRecord", { params });
};
