import { server } from "@/utils/request";
import cached, { TIME_EXPIRED } from "@/utils/cache";

export function getTabMatches(gameType, limit = 4) {
  const key = `HOT_EVENT_${gameType}_${limit}`;
  return cached.get(key, () =>
    server.REST.get(
      "/hot-event",
      { params: { gameType, limit } },
      { TIME_EXPIRED: TIME_EXPIRED, expired_value: 60 * 60 }
    )
  );
}
