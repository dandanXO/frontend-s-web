import { cached } from "boot/cache";

export function claimBonusItem(item) {
    return cached.put(`/bonus/claim/${item}`);
  }
  