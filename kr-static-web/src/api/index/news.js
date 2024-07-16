import { server } from "@/utils/request";

export function getNews() {
  return server.REST.get("/news");
}