<template>
  <div class="platform-section">
    <div class="platform-breadcrumb">
      <span>Home</span>
      <span>🔥Hot</span>
    </div>

    <div class="margin-center game-container">
      <div class="all-game-container">
        <div class="plat-games-container">
          <div class="game-list-wrapper hot">
            <div class="game-slot animate__animated animate__fadeInRight" v-for="game in games" :key="game.id">
              <a @click="openGame(game, game.platform, game.code)">
                <div class="slot-img">
                  <el-image :src="loadGameIcon(`${game.code.toLowerCase()}.png`)" lazy>
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
import { getHotGames } from "@/api/platform/platform";

const games = ref([]);
const platformGame = ref(null);

const loadGameIcon = (path) => {
  try {
    return require(`@/assets/images/platform/game/hot/${path}`);
  } catch (e) {
    console.log(e);
    return `${require("@/assets/images/platform/game/default.png")}`;
  }
};

const loadGames = () => {
  getHotGames().then((res) => (games.value = res));
};

const openGame = (item, platformCode, gameCode) => {
  const platName = item.alias ?? item.cnname ?? item.name;
  platformGame.value.open(platName, platformCode, gameCode);
};

onMounted(() => {
  loadGames();
});
</script>
<style scoped lang="scss" src="@/assets/css/pages/platform.scss"></style>
