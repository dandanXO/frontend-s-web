import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getReferFriend = (query) => {
  return https().request("/refer-friend", Method.GET, query, ContentType.form);
};

export const distribute = (refer) => {
  return https().request("/refer-friend/distribute", Method.POST, refer, ContentType.form);
};
