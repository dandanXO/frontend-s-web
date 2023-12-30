import { server } from "@/utils/request";

export function getPriviVipCanRedeem(pCode) {
  return server.EVENT.get("/privi/vip/canRedeem", {
    params: {
      promoCode: pCode
    }
  });
}
