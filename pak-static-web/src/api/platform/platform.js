import { server } from "@/utils/request";
import { getDevice, getMobileOS } from "@/utils/utils";
import cached from "@/utils/cache";
import { userStore } from "@/store";

export function getPlatformList() {
  const store = userStore();
  const platformApiUrl = store.token ? "/session/loggedInPlatform" : "/platform";
  const platformApiKey = store.token ? "LOGGEDPLATFORMS" : "PLATFORMS";

  return cached.get(platformApiKey, () => server.REST.get(platformApiUrl));
}

export function getLoggedInPlatformList() {
  return cached.get("LOGGEDINPLATFORMS", () => server.REST.get("/session/loggedInPlatform"));
}

export function getPlatformListDisplay() {
  return cached.get("PLATFORMS", () => server.REST.get("/platform"));
}

export function getPlatformGames(code, gameType) {
  const regDevice = getDevice();
  var way = null;
  if (getDevice() === "MOBILE") {
    way = getMobileOS();
  }
  const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;

  // sessionStorage.removeItem(key);

  return cached.get(key, async () => {
    const requestBody = {
      params: {
        platformId: code,
        gameType: gameType,
        device: regDevice,
        way: way
      }
    };

    let respond = await server.REST.get("/platformGames", requestBody);

    return respond;
  });
}

export function launchSessionGame(platform, { gameCode = null, isMobile = false } = {}) {
  var way = null;
  if (getDevice() === "MOBILE") {
    way = getMobileOS();
  }
  return server.REST.get(`/session/launch?_time=${new Date().getTime()}`, {
    params: { platform, gameCode, isMobile, way }
  });
}

export function launchGame(platform, { gameCode = null, isMobile = false } = {}) {
  return server.REST.get("/game/launch", {
    params: { platform, gameCode, isMobile }
  });
}
export function hotGame(gameLabel) {
  const regDevice = getDevice();
  var way = null;
  if (getDevice() === "MOBILE") {
    way = getMobileOS();
  }

  const key = `HOT_PLATFORM_GAMES_${regDevice}`;

  // sessionStorage.removeItem(key);

  return cached.get(key, async () => {
    const requestBody = {
      params: {
        gameLabel: gameLabel,
        device: regDevice
      }
    };

    let respond = await server.REST.get("member/hot?device=WEB");

    return respond;
  });
}

export function jackpotGames() {
  const regDevice = getDevice();
  var way = null;
  if (getDevice() === "MOBILE") {
    way = getMobileOS();
  }

  const key = `JACKPOT_PLATFORM_GAMES_${regDevice}`;

  // sessionStorage.removeItem(key);

  return cached.get(key, async () => {
    const requestBody = {
      params: {
        gameLabel: "JACKPOT",
        device: regDevice
      }
    };

    let respond = await server.REST.get("/platformGamesByGameLabel", requestBody);

    return respond;
  });
}

export function topWin() {
  return server.REST.get("/top-winner");
}

export function getHotGames() {
  const regDevice = getDevice();
  var way = null;
  if (getDevice() === "MOBILE") {
    way = getMobileOS();
  }
  const key = `MEMBER_HOT_${regDevice}`;

  // sessionStorage.removeItem(key);

  return cached.get(key, async () => {
    const requestBody = {
      params: {
        device: regDevice
      }
    };

    let respond = await server.REST.get("/member/hot", requestBody);

    return respond;
  });
}
