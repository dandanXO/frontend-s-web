<template>
  <div class="platform-container">
    <div class="platform-container-inner">
      <!-- <template v-for="(item, index) in filteredPlatforms" :key="index"> -->
      <template v-for="(item, index) in platformsListDisplay" :key="index">
        <template v-if="selectedPlat === item.code">
          <div class="platform-item platform-item--img" data-aos="fade-right" data-aos-duration="1000">
            <img
              :src="
                require('../assets/' + platformType + '/' + platformType + '-item-' + item.code.toLowerCase() + '.png')
              "
            />
          </div>

          <div class="platform-item">
            <div class="platform-title-wrap" data-aos="fade-left" data-aos-delay="100">
              <!--              <pre>{{item}}</pre>-->
              <div class="platform-title">{{ item.cnname ?? item.name }}</div>
              <div class="platform-subtitle">{{ platformName }}</div>
            </div>

            <div class="platform-txt-box" data-aos="fade-left" data-aos-delay="200" v-html="item.message"></div>

            <div class="platform-pattern-row" data-aos="fade-left" data-aos-delay="300" v-if="platformPattern">
              <img :src="require('../assets/' + platformType + '/' + platformType + '-pattern.png')" />
            </div>

            <div class="platform-list-box">
              <!-- <span
                class="platform-list-item"
                v-for="(plat, platIndex) in filteredPlatforms"
                :key="platIndex"
                @click="clickPlat(plat)"
                :class="{ active: selectedPlat === plat.code }"
              > -->
              <span
                class="platform-list-item"
                v-for="(plat, platIndex) in platformsListDisplay"
                :key="platIndex"
                @click="clickPlat(plat)"
                :class="{ active: selectedPlat === plat.code }"
              >
                <div class="list-item-btn">
                  <span>
                    <img
                      :src="
                        require('../assets/' +
                          platformType +
                          '/' +
                          platformType +
                          '-logo-' +
                          plat.code.toLowerCase() +
                          '.png')
                      "
                    />
                  </span>
                </div>
                <div class="list-item-txt">{{ plat.alias ?? plat.name }}</div>
              </span>
            </div>

            <!--            data-aos="fade-in"-->
            <!--            data-aos-delay="300"-->
            <!--            data-aos-duration="500"-->
            <div class="platform-play-btn" v-if="platformType !== 'slot'">
              <div class="btn-blue" @click="openGame(item.name, item.code, item.gameCode)">进入游戏</div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>

  <div class="margin-center game-container" v-if="platformExpandable">
    <div class="all-game-container">
      <div class="plat-options-wrapper">
        <div class="plat-options-container">
          <template v-for="(item, index) in platformsListDisplay" :key="index">
            <!-- <div class="plat-option" @click="switchPlat(item)" :class="{ active: selectedPlat === item.code }"> -->
            <div class="plat-option" @click="clickPlat(item)" :class="{ active: selectedPlat === item.code }">
              <img
                :src="
                  require(`../assets/game/plat-logo-${item.code.toLowerCase()}${
                    selectedPlat !== item.code ? '-blue' : ''
                  }.png`)
                "
              />
            </div>
          </template>
        </div>
      </div>

      <div class="plat-games-container">
        <div class="grid-items flex-box flex-align-center search-container web-only-box">
          <el-tabs v-model="gameCat" @tab-click="handleClick" class="game-cat-tabs">
            <el-tab-pane label="全部游戏" name="allGame"></el-tab-pane>
            <el-tab-pane label="热门游戏" name="hotGame"></el-tab-pane>
            <el-tab-pane label="最新游戏" name="newGame"></el-tab-pane>
          </el-tabs>

          <el-input
            class="search-input"
            v-model="gamePage.searchKey"
            @keypress.enter="searchList()"
            placeholder="输入查找游戏名"
          >
            <template #suffix>
              <el-icon :width="15" @click="searchList()">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>

        <div class="game-list-wrapper">
          <div
            class="game-slot animate__animated animate__fadeInRight"
            v-for="game in gamePage.gameList"
            :key="game.id"
          >
            <a @click="openGame(game.name, selectedPlat, game.code)">
              <div class="slot-img">
                <el-image :src="game.icon" lazy>
                  <template #placeholder>
                    <img :src="game.default" />
                  </template>
                  <template #error>
                    <div class="image-slot">
                      <img :src="game.default" />
                    </div>
                  </template>
                </el-image>
              </div>

              <div class="slot-details">
                <div class="slot-name">
                  {{ game.name }}
                </div>

                <div class="slot-fav">
                  <el-icon>
                    <RiHeartLine />
                  </el-icon>
                  <el-icon>
                    <RiHeartFill />
                  </el-icon>
                </div>
              </div>

              <!-- <div class="slot-name">
                <img src="../assets/images/games/play-icon.png" />
                {{ game.name }}

                <div class="slot-fav">
                  <el-icon :width="30">
                    <RiHeartLine />
                    <RiHeartFill />
                  </el-icon>
                </div>
              </div> -->
            </a>
          </div>
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="gamePage.total"
            @current-change="changePage(gamePage.currentPage, gamePage.pageSize)"
            v-model:current-page="gamePage.currentPage"
            v-model:pageSize="gamePage.pageSize"
            default-page-size="30"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- <pre>{{ gamePage.gameList }}</pre> -->

  <GameModal ref="platformGame"></GameModal>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getPlatformListDisplay,
  getLoggedInPlatformList,
  getPlatformGames,
  getPlatformList
} from "@/api/platform/platform";
import { userStore } from "@/store";
import { Search } from "@element-plus/icons-vue";
import { RiHeartLine, RiHeartFill } from "vue-remix-icons";
import GameModal from "@/components/modal/GameModal";

const platformGame = ref(null);
const route = useRoute();
const router = useRouter();
const store = userStore();

const props = defineProps({
  platforms: Array,
  platformType: String,
  platformGameType: String,
  platformName: String,
  platformPattern: Boolean,
  platformExpandable: Boolean
});

const filteredPlatforms = ref([]);
const platformsList = ref([]);
const platformsListDisplay = ref([]);

const getPlatList = () => {
  const getFn = store.token ? getLoggedInPlatformList : getPlatformListDisplay;
  getFn().then((res) => {
    platformsList.value = res;

    // console.log(platformsList.value);

    platformsListDisplay.value = platformsList.value.filter((element) =>
      element.gameType.split(",").some((type) => type.trim().toUpperCase() === props.platformGameType.toUpperCase())
    );

    console.log("Platform");
    console.log(platformsListDisplay.value);

    platformsListDisplay.value = platformsListDisplay.value.map((item1) => {
      const matchingItem = props.platforms.find((item2) => item1.code === item2.code);
      return { ...matchingItem, ...item1 };
    });

    console.log("THIs");
    console.log(platformsListDisplay.value);

    setFilteredPlatforms();
  });
};

const setFilteredPlatforms = () => {
  filteredPlatforms.value = props.platforms.filter((displayPlatform) =>
    platformsListDisplay.value.some((platform) => platform.code === displayPlatform.code)
  );

  filteredPlatforms.value = filteredPlatforms.value.map((item1) => {
    const matchingItem = props.platforms.find((item2) => item1.code === item2.code);
    return { ...matchingItem, ...item1 };
  });

  console.log("Filter plat");
  console.log(filteredPlatforms.value);
  console.log(platformsListDisplay.value);

  filteredPlatforms.value.forEach((element) => {
    if (element.code === route.query.plat) {
      clickPlat(element);
    }
  });
  setSelectedPlat();
};

const selectedPlat = ref(null);
const setSelectedPlat = () => {
  selectedPlat.value = filteredPlatforms.value.length > 0 ? filteredPlatforms.value[0].code : null;
};

const clickPlat = (plat) => {
  router.push({ path: route.path, query: { plat: plat.code } });
  selectedPlat.value = plat.code;
};

const openGame = (gameName, platformCode, gameCode) => {
  // debugger;
  platformGame.value.open(gameName, platformCode, gameCode);
};

const activePlat = ref("");

const gamePage = reactive({
  gameList: [],
  currentPage: 1,
  pageSize: 15,
  searchType: "",
  searchKey: "",
  total: 0
});
const gameListData = ref([]);

const switchPlat = (plat) => {
  router.push({ path: route.path, query: { plat: plat.code } });
  activePlat.value = plat;
  // selectedPlat.value = plat.code;
  gamePage.currentPage = 1;
  loadGameList();
};

const getPlatGameList = () => {
  if (props.platformGameType === "SLOT") {
    getPlatformList()
      .then((data) => {
        platformsListDisplay.value = data.filter((element) => element.gameType.includes(props.platformGameType));
        platformsListDisplay.value = platformsListDisplay.value.map((item1) => {
          const matchingItem = props.platforms.find((item2) => item1.code === item2.code);
          return { ...matchingItem, ...item1 };
        });

        if (!route.query.plat) {
          switchPlat(platformsListDisplay.value[0]);
        } else {
          platformsListDisplay.value.forEach((element) => {
            if (route.query.plat === element.code) {
              switchPlat(element);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};

const searchList = () => {
  if (gamePage.searchKey) {
    gamePage.gameList = gameListData.value.filter((game) => {
      return game.name.toLowerCase().includes(gamePage.searchKey.toLowerCase());
    });
  }
};
const loadGameList = () => {
  if (props.platformGameType === "SLOT" || props.platformGameType === "FISH") {
    getPlatformGames(activePlat.value.id, props.platformGameType)
      .then((data) => {
        data.forEach((element) => {
          element.default = require("../assets/images/games/aviator/default.png");
          element.icon = `${process.env.VUE_APP_IMAGE_CDN}/game/${element.icon}`;
        });
        gameListData.value = data;
        gamePage.total = data.length;
        changePage(1, gamePage.pageSize);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};

const changePage = (page, pageSize) => {
  console.log(page);
  console.log(pageSize);
  gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
};

// const openGame = (gameName, gameCode) => {
//   slotsGame.value.open(gameName, activePlat.value.code, gameCode);
// };

const gameCat = ref("allGame");

onMounted(() => {
  getPlatList();
  getPlatGameList();
  // activePlat.value = filteredPlatforms.value[0];
});

watch(
  () => route.query.plat,
  () => {
    if (route.path === route.path) {
      platformsListDisplay.value.forEach((element) => {
        if (element.code === route.query.plat) {
          clickPlat(element);
          getPlatGameList();
          loadGameList();
        }
      });
    }
  }
);
</script>

<style scoped lang="scss" src="../scss/pages/platform.scss" />
