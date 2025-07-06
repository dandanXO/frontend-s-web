import { Platform } from "quasar";
import { cached } from "boot/cache";
import {userStore} from "src/stores";

const store = userStore();
export const loadGameList = (type) => {
    const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
    const code = selectedPlatId.value;
    const gameType = type;
    const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;
    const imgUrl = localStorage.getItem("IMAGE_CDN") || process.env.IMAGE_CDN
    const platformApiUrl = (store.hasToken()) ? '/session/loggedInPlatformGames' : "/platformGames";
    return cached
            .get(key, () =>
                api
                    .get(platformApiUrl, {
                        params: {
                            platformId: code,
                            gameType: gameType,
                            device: regDevice
                        }
                    })
                    .then((response) => {
                        if (response.code === 0) {
                            return response;
                        }
                    })
                    .catch((err) => {})
                )
            .then(res => {
                res.forEach((element) => {
                    element.default = require("../assets/images/games/aviator/default.png");
                    element.icon = `${imgUrl}/slot/${selectedPlat.value.code}/${element.icon}.png`;
                });

                return res
            });
};
