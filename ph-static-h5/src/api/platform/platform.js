import { api } from "src/boot/axios";
import { getDevice } from "src/boot/utils";
import { cached } from "src/boot/cache";
import { userStore } from "stores/index";

export function getPlatformList() {
  const store = userStore();
  const platformApiUrl = store.hasToken() ? "/session/loggedInPlatform" : "/platform";
  const platformApiKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";

  return cached.get(platformApiKey, () => api.get(platformApiUrl));
}

export function getPlatformGames(code, gameType) {
  const regDevice = getDevice() === "MOBILE" ? "MOBILE" : "WEB";
  const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;
  return cached.get(key, () =>
    api.get("/platformGames", {
      params: { platformId: code, gameType: gameType, device: regDevice }
    })
  );
}

export function launchSessionGame(platform, { gameCode = null, isMobile = false } = {}) {
  return api.get(`/session/launch?_time=${new Date().getTime()}`, {
    params: { platform, gameCode, isMobile }
  });
}

export function launchGame(platform, { gameCode = null, isMobile = false } = {}) {
  return api.get("/game/launch", {
    params: { platform, gameCode, isMobile }
  });
}

export function getHotPlatformGames() {
  const regDevice = getDevice() === "MOBILE" ? "MOBILE" : "WEB";
  return api.get(`/platformGamesByGameLabel?gameLabel=HOT&device=${regDevice}`);
}

export function getTopPlatformGames() {
  const regDevice = getDevice() === "MOBILE" ? "MOBILE" : "WEB";
  return api.get(`/platformGamesByGameLabel?gameLabel=TOP&device=${regDevice}`);
}

export function getJackpotGames() {
  const regDevice = getDevice() === "MOBILE" ? "MOBILE" : "WEB";
  return api.get(`/platformGamesByGameLabel?gameLabel=JACKPOT&device=${regDevice}`);
}

export function getTopWinners() {
  return api.get("/top-winner");
}
