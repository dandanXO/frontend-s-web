<template>
  <img v-show="props.categoryType === 'live'" src="../../assets/images/index/live/item-game-maintenance.png" />
  <img v-show="props.categoryType === 'sport'" src="../../assets/images/index/sport/item-game-maintenance.png" />

  <div :class="`category--${props.categoryType}`">
    <div :class="computedCategoryPlatform">
      <div class="game--bg" :style="{ backgroundImage: backgroundImageUrl }"></div>
    </div>

    <div v-if="isBurningHot" class="burning-hot">
      <img src="../../assets/images/index/hot.png" />
    </div>

    <div class="platform-game-title">{{ props.gameTitle }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["categoryType", "gameTitle", "gameIcon", "gamePlatform", "gameCode", "gameName"]);

const imgURL = process.env.IMAGE_CDN;
const imgURLGame = imgURL + "/game/";

// Differentiate game category
const computedCategoryPlatform = computed(() => {
  switch (props.categoryType) {
    case "live":
      return "platform-game-img__live";
    case "sport":
      return "platform-game-img__sport";
    default:
      return "platform-game-img";
  }
});

// Get background image
const backgroundImageUrl = computed(() => {
  try {
    return `url(${getGamePlatformImage(props.categoryType, props.gamePlatform, props.gameCode)})`;
  } catch (e) {
    try {
      return `url(${imgURLGame}${props.gameIcon})`;
    } catch (e) {
      return `url(${imgURLGame}${props.categoryType}/item-game-${props.gameName.toLowerCase()}.png)`;
    }
  }
});

// Include hot fire for certain games
const hotLiveGames = ["Evo", "WCEvo", "PT", "WCPT"];
const hotSlotGames = ["JOKER", "PG"];

const isBurningHot = computed(() => {
  return (
    (props.categoryType === "live" && hotLiveGames.includes(props.gameName)) ||
    (props.categoryType === "slot" && hotSlotGames.includes(props.gameName))
  );
});

// Get images from local path
const getGamePlatformImage = (categoryType, gamePlatform, gameCode) => {
  if (categoryType === "hot") {
    return `${require(`../../assets/images/games/${categoryType}-games-${gameCode.toLowerCase()}.png`)}`;
  } else if (categoryType === "fish") {
    return `${require(`../../assets/images/games/${categoryType}/${gamePlatform}-${gameCode.toLowerCase()}.png`)}`;
  } else {
    return `${require(`../../assets/images/index/${categoryType}/item-game-${gameCode.toLowerCase()}.png`)}`;
  }
};
</script>

<style scoped lang="scss">
.platform-game-img {
  width: 100%;
  aspect-ratio: 1/1.2;
  background-size: cover;
  background-position: center center;
  position: relative;
  background-image: url("../../assets/images/index/mini-game-bg.png");
  border-radius: 8px;

  .game--bg {
    background-size: 100% 100%;
    background-position: center center;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    background-repeat: no-repeat;
  }
}

.platform-game-img__sport {
  width: 100%;
  height: 100%;
  background-size: 100% auto;
  background-position: center center;
  position: absolute;
  border-radius: 8px;
  top: 0;
  left: 0;

  .game--bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: 100% auto;
    background-position: center center;
  }
}

.platform-game-img__live {
  width: 100%;
  height: 100%;
  background-size: 100% auto;
  background-position: center center;
  position: absolute;
  border-radius: 8px;
  top: 0;
  left: 0;

  .game--bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: 100% auto;
    background-position: center center;
  }
}

.platform-game-item {
  position: relative;

  &--img {
    background-size: cover;
    background-position: center center;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .platform-game-title {
    text-align: left;
    margin-top: 6px;
    color: #ffffff;
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }

  img {
    display: block;
    width: 100%;
  }
}

.category--sport,
.category--live {
  .platform-game-title {
    display: none;
  }
}
</style>
