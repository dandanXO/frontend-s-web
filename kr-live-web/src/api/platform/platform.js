import { server } from "@/utils/request";
import { getDevice } from "@/utils/utils";
import cached from "@/utils/cache";

export function getPlatformList() {
  return cached.get("PLATFORMS", () => server.REST.get("/platform"));
}

export function getPlatformGames(code, gameType) {
  const regDevice = getDevice() === "MOBILE" ? "MOBILE" : "WEB";
  const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;
  return cached.get(key, () =>
    server.REST.get("/platformGames", {
      params: { platformId: code, gameType: gameType, device: regDevice },
    })
  );
}

export function launchSessionGame(
  platform,
  { gameCode = null, isMobile = false } = {}
) {
  return server.REST.get(`/session/launch?_time=${new Date().getTime()}`, {
    params: { platform, gameCode, isMobile },
  });
}

export function launchGame(
  platform,
  { gameCode = null, isMobile = false } = {}
) {
  return server.REST.get("/game/launch", {
    params: { platform, gameCode, isMobile },
  });
}
