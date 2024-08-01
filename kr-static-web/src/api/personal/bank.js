import { server } from "@/utils/request";

export const getAllBankCard = () => {
  return server.REST.get("/session/allBankCard");
};
