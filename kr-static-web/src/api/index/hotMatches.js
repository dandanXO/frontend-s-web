import { server } from "@/utils/request";

export function getHotMatches() {
  return server.REST.get("/platform-competition?type=Football");
}
