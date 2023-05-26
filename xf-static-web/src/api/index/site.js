import { server } from "@/utils/request";

export function getSiteParamFromServer() {
  return server.REST.get("/menu");
}


