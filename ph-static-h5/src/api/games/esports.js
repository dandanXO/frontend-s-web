import { api } from "src/boot/axios";
import cached, { TIME_EXPIRED } from "src/boot/cache";

export function getTabMatches(gameType, limit = 4) {
  const key = `HOT_EVENT_${gameType}_${limit}`;
  return cached.get(key, () =>
    api.get(
      "/hot-event",
      { params: { gameType, limit } },
      { TIME_EXPIRED: TIME_EXPIRED, expired_value: 60 * 60 }
    )
  );
}
