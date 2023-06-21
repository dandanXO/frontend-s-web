import { Platform } from "quasar";
import { cached } from "boot/cache";

export const loadGameList = (type) => {
    const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
    const code = selectedPlatId.value;
    const gameType = type;
    const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;

    return cached
            .get(key, () =>
                api
                    .get("/platformGames", {
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
                    element.icon = `${process.env.IMAGE_CDN}/slot/${selectedPlat.value.code}/${element.icon}.png`;
                });

                return res
            });
};