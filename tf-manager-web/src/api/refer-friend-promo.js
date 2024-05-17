import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getReferFriendPromo = (query) => {
  return https().request("/refer-friend-promo", Method.GET, query, ContentType.form);
};

export const distribute = (refer) => {
  return https().request("/refer-friend-promo", Method.POST, refer, ContentType.form);
};
