import { server } from "@/utils/request";
import { getDevice, getMobileOS } from "@/utils/utils";
import cached from "@/utils/cache";
import { userStore } from "@/store";
import { i18nStore } from '@/store/language'

export function getPlatformList() {
  return cached.get("PLATFORMS", () => server.REST.get("/platform"));
}

export function getPlatformWithTypeList() {
  return cached.get("PLATFORMSTYPES", () => server.REST.get("/platformWithType"));
}

export function getLoggedInPlatformList() {
  return cached.get("LOGGEDINPLATFORMS", () => server.REST.get("/session/loggedInPlatform"));
}

export function getPlatformListDisplay() {
  return cached.get("PLATFORMS", () => server.REST.get("/platform"));
}

export function getPlatformGames(code, gameType) {
  const store = userStore()
  const regDevice = getDevice();
  var way = null;
  if (getDevice() === "MOBILE") {
    way = getMobileOS();
  }
  
  const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;
  const apiUrl = store.hasToken() ? '/session/loggedInPlatformGames': '/platformGames'

    return cached.get(key, () =>
      server.REST.get(apiUrl, {
        params: {
          platformId: code,
          gameType: gameType,
          device: regDevice,
          way: way
        }
      })
    );
}

export function launchSessionGame(platform, { gameCode = null, isMobile = false } = {}) {
  var way = null;
  if (getDevice() === "MOBILE") {
    way = getMobileOS();
  }
  const i18nStoreLanguage = i18nStore()
  const languageVal = i18nStoreLanguage.languageVal

  return server.REST.get(`/session/launch?_time=${new Date().getTime()}`, {
    params: { platform, gameCode, isMobile, way, language: languageVal === 'en' ? 'en' : languageVal === 'zh' ? 'cn' : undefined }
  });
}

export function launchGame(platform, { gameCode = null, isMobile = false } = {}) {
  return server.REST.get("/game/launch", {
    params: { platform, gameCode, isMobile }
  });
}
