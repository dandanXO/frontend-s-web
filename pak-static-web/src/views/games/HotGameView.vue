<template>
  <div class="platform-section">
    <div class="platform-breadcrumb">
      <router-link to="/">{{ $t("hotGameView.breadcrumb.home") }}</router-link>
      <span>{{ $t("hotGameView.breadcrumb.title") }}</span>
    </div>

    <div class="margin-center game-container">
      <div class="all-game-container">
        <div class="plat-games-container">
          <div class="game-list-wrapper hot">
            <div class="game-slot animate__animated animate__fadeInRight" v-for="game in games" :key="game.id">
              <a @click="openGame(game.name, game.platformCode, game.code, game.gameType)">
                <div class="slot-img">
                  <el-image :src="loadGameIcon(game.icon)" lazy>
                    <template #placeholder>
                      <img src="@/assets/images/platform/game/default.png" />
                    </template>
                    <template #error>
                      <div class="image-slot">
                        <img src="@/assets/images/platform/game/default.png" />
                      </div>
                    </template>
                  </el-image>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <GameModal ref="platformGame"></GameModal>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import GameModal from "@/components/modal/GameModal";
import { getPlatformHotGames } from "@/api/platform/platform";

const imgGamesURL = process.env.VUE_APP_IMAGE_CDN + "/game/";

const games = ref([]);
const platformGame = ref(null);

const loadGameIcon = (path) => {
  try {
    return `${imgGamesURL}${path}`;
  } catch (e) {
    return `${require("@/assets/images/platform/game/default.png")}`;
  }
};

const loadGames = () => {
  // getHotGames().then((res) => (games.value = res));
  getPlatformHotGames().then((res) => (games.value = res));
};

const openGame = (gameName, platformCode, gameCode, gameType) => {
  platformGame.value.open(gameName, platformCode, gameCode, gameType);
};

onMounted(() => {
  loadGames();
});
</script>
<style scoped lang="scss" src="@/assets/css/pages/platform.scss"></style>
