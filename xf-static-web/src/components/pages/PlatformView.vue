<template>
  <div class="platform-banner">
    <img :src="require(`./img/banner-${pageType.toLowerCase()}.png`)" />
    <div class="description">
      <span class="enName">{{ enName }}</span>
      <span class="name">{{ name }}</span>
      <span class="desc">{{ description }}</span>
      <div style="margin-top: 10px" v-if="pageType === 'SLOT'">
        <div class="recreation-money" id="numBox">LOADING...</div>
      </div>
    </div>
  </div>
  <div class="platform-title">
    <img :src="require(`./img/pagetitle.png`)" />
    <el-input
      v-if="pageType === 'SLOT'"
      class="search-input"
      v-model="gamePage.searchKey"
      @keypress.enter="searchList()"
      placeholder="输入查找游戏名"
    >
      <template #suffix>
        <el-icon :width="15">
          <Search />
        </el-icon>
      </template>
    </el-input>
  </div>
  <div class="flex-wrapper">
    <div v-if="pageType === 'SLOT'" class="plat-list">
      <div class="decal">场馆分类</div>
      <template v-for="p in sideBarPlatforms" :key="p">
        <div class="plat-item" :class="{ active: p === activePlat }" @click="switchPlat(p)">
          {{ getGameLabel(p.name) }}
        </div>
      </template>
    </div>
    <div class="right-side">
      <div class="platforms-wrapper">
        <div class="platform-list-box" :class="pageType">
          <span
            class="platform-list-item platform"
            :style="{ 'max-width': getMaxWidth() }"
            v-for="(plat, i) in filteredPlatforms"
            :key="i"
            @click="
              pageType === 'SLOT' ? openSlotGame(plat.name, plat.code) : openGame(plat.name, plat.code, plat.gameCode)
            "
            :class="{ active: selectedPlat === plat.code }"
          >
            <template v-if="pageType === 'SLOT'">
              <el-image :src="plat.icon" lazy>
                <template #placeholder>
                  <img :src="plat.default" />
                </template>
                <template #error>
                  <div class="image-slot">
                    <img :src="plat.default" />
                  </div>
                </template>
              </el-image>
              <!-- <img :src="plat.icon" v-image="plat.icon" /> -->
              <div class="bottom slot">
                <div class="txt">
                  <!-- <img src="../assets/images/games/play-icon.png" /> -->
                  {{ plat.name }}
                </div>
                <div class="start-btn">立即开始</div>
              </div>
            </template>
            <template v-else>
              <img
                :src="
                  require(`./img/${pageType.toLowerCase()}/${pageType.toLowerCase()}-img-${plat.code.toLowerCase()}.png`)
                "
              />
              <div class="bottom">
                <div class="txt">
                  <img
                    :src="
                      require(`./img/${pageType.toLowerCase()}/${pageType.toLowerCase()}-logo-${plat.code.toLowerCase()}.png`)
                    "
                  />
                  {{ plat.name }}{{ commonName }}
                </div>
                <div class="start-btn">立即开始</div>
              </div>
            </template>
          </span>
        </div>
      </div>

      <div v-if="pageType === 'SLOT'" class="pagination-wrapper">
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
  <GameModal ref="gamePopup"></GameModal>
</template>
<script setup>
import { useScriptTag } from "@vueuse/core";
import { onMounted, ref, reactive, watch } from "vue";
import Search from "@element-plus/icons-vue";
import GameModal from "@/components/modal/GameModal";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "@/store";
import { useLocalStorage } from "@vueuse/core";
import aos from "aos";
import { getPlatformGames, getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { platformsDetails } from "./platforms.js";
const props = defineProps({
  pageType: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  enName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  commonName: {
    type: String,
    required: true
  }
});
const gamePopup = ref(null);
const route = useRoute();
const router = useRouter();
const store = userStore();

const filteredPlatforms = ref([]);
const platformsList = ref([]);
const platformsListDisplay = ref([]);
const sideBarPlatforms = ref([]);
const activePlat = ref(sideBarPlatforms.value[0]);
const gamePage = reactive({
  gameList: [],
  currentPage: 1,
  pageSize: 28,
  searchType: "",
  searchKey: "",
  total: 0
});
const gameListData = ref([]);
const getMaxWidth = () => {
  const length = filteredPlatforms.value.length;
  if (length < 3) return "22%";
  if (length === 3) return "30%";
  if (length === 4) return "22%";
  if (length === 5) return "17%";
  if (length > 5) return "23.5%";
  return "unset"; // Default case if needed
};
const switchPlat = (plat) => {
  router.push({ path: "game", query: { plat: plat.code } });
  activePlat.value = plat;
  gamePage.currentPage = 1;
  loadGameList();
};
const getPlatList = () => {
  if (store.token) {
    getLoggedInPlatformList().then((res) => {
      platformsList.value = res;
      platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes(props.pageType));
      if (props.pageType === "SLOT") {
        setSideBarPlatforms();
      } else {
        setFilteredPlatforms();
      }
    });
  } else {
    getPlatformListDisplay().then((res) => {
      platformsList.value = res;
      platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes(props.pageType));
      console.log(platformsListDisplay.value);
      if (props.pageType === "SLOT") {
        setSideBarPlatforms();
      } else {
        setFilteredPlatforms();
      }
    });
  }
};

const setFilteredPlatforms = () => {
  filteredPlatforms.value = platformsDetails.filter((displayPlatform) =>
    platformsListDisplay.value.some((platform) => platform.code === displayPlatform.code)
  );

  filteredPlatforms.value.forEach((element) => {
    if (element.code === route.query.plat) {
      clickPlat(element);
    }
  });
  setSelectedPlat();
};
const setSideBarPlatforms = () => {
  sideBarPlatforms.value = platformsListDisplay.value;

  sideBarPlatforms.value.forEach((element) => {
    if (!route.query.plat) {
      const firstPlatform = sideBarPlatforms.value.find((pl) => pl.code !== "AG");

      if (firstPlatform) {
        switchPlat(firstPlatform);
      }
    } else {
      if (element.code === route.query.plat) {
        switchPlat(element);
      }
    }
  });
  setSelectedPlat();
};

const selectedPlat = ref(null);
const setSelectedPlat = () => {
  if (filteredPlatforms.value.length > 0) {
    selectedPlat.value = filteredPlatforms.value[0].code;
  } else {
    selectedPlat.value = null;
  }
};

const clickPlat = (plat) => {
  selectedPlat.value = plat.code;
};

const openGame = (gameName, code, gameCode) => {
  gamePopup.value.open(gameName, code, gameCode);
};
const openSlotGame = (gameName, gameCode) => {
  gamePopup.value.open(gameName, activePlat.value.code, gameCode);
};
onMounted(() => {
  aos.refresh();
  getPlatList();
});
watch(
  () => route.query.plat,
  () => {
    if (route.path === "/game") {
      getPlatList();
    }
  }
);
const changePage = (page, pageSize) => {
  console.log(page);
  console.log(pageSize);
  filteredPlatforms.value = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
};
const onShowSizeChange = (current, size) => {
  current = 1;
  gamePage.currentPage = 1;
  changePage(current, size);
};
const getGameLabel = (gameLabel) => {
  if (gameLabel === "BBINDY") {
    return "BBIN 电子";
  } else if (gameLabel === "AMEBA") {
    return "AE 电子";
  } else if (gameLabel === "MGP") {
    return "MG 电子";
  } else if (gameLabel === "AG") {
    return "PA 电子";
  } else if (gameLabel === "PPFP") {
    return "FP 电子";
  } else {
    return gameLabel + " 电子";
  }
};

const ptJackpot = ref();
useScriptTag(
  "https://tickers.playtech.com/jackpots/new_jackpotjs.js",
  // on script tag loaded.
  () => {
    function formatNumberStr(nStr) {
      nStr += "";
      var x = nStr.split(".");
      var x1 = x[0];
      //	x2 = x.length > 1 ? "." + x[1] : "";
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
      }
      //	return x1 + x2;
      return x1;
    }

    function formatNumberWithSpans(number) {
      const numberStr = number.toString();
      let result = ``; // Start with dollar sign

      // Start adding digits and commas
      let firstGroup = true; // Flag to avoid adding comma before the first digit
      let part = "";

      for (let i = 0; i < numberStr.length; i++) {
        if (numberStr[i] === ".") {
          result += "."; // Decimal point without the flip-card class
        } else {
          if (!firstGroup && (numberStr.length - i) % 3 === 0) {
            result += "<span>,</span>"; // Add comma after every 3 digits
          }
          result += `<span class="flip-card">${numberStr[i]}</span>`;
        }
        firstGroup = false;
      }

      return result;
    }

    Ticker.prototype.showJackpot = function () {
      var newvalue = this.getJackpot();

      if (this.type != "count") {
        newvalue = Math.round(newvalue * 100) / 100 + "";
        if (newvalue.match(/^\d+\.\d$/)) {
          newvalue = newvalue + "0";
        }
        if (newvalue.match(/^\d+$/)) {
          newvalue = newvalue + ".00";
        }
      }
      var text = "LOADING...";
      if (newvalue > 0) {
        text =
          this.signpos != 0 ? formatNumberWithSpans(newvalue) + this.sign : this.sign + formatNumberWithSpans(newvalue);
      }
      if (newvalue > 0 && this.type == "count") {
        text = newvalue;
      }

      this.textbox.innerHTML = text;
    };
    // do something
    ptJackpot.value = new Ticker({
      info: 2,
      casino: "drunkenmonkey88",
      currency: "cny"
    });
    ptJackpot.value.SetCurrencyPos(0);
    ptJackpot.value.SetCurrencySign(store.currency.value);
    ptJackpot.value.attachToTextBox("numBox");
    ptJackpot.value.tick();
  }
);
function flipNumber(card, newValue) {
  if (card.textContent !== newValue) {
    card.classList.remove("flip-up", "flip-down"); // Reset any existing animation
    card.textContent = newValue; // Update the number

    const direction = Math.random() > 0.5 ? "flip-up" : "flip-down"; // Random flip direction
    card.classList.add(direction);
  }
}
const searchList = () => {
  if (gamePage.searchKey) {
    filteredPlatforms.value = gameListData.value.filter((game) => {
      return game.name.toLowerCase().includes(gamePage.searchKey.toLowerCase());
    });
  }
};
const loadGameList = () => {
  // if (!store.token) {
  getPlatformGames(activePlat.value.id, "SLOT")
    .then((data) => {
      data.forEach((element) => {
        var imageCdnUrl = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value;
        element.default = `${require("../../assets/images/games/default.png")}`;
        if (element.icon.indexOf("/") > -1) {
          element.icon = `${imageCdnUrl}/game/${element.icon}`;
        } else {
          element.icon = `${imageCdnUrl}/game/${activePlat.value.code.toLowerCase()}/slot/${element.icon}.png`;
        }
      });
      gameListData.value = data;
      gamePage.total = data.length;
      changePage(1, gamePage.pageSize);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
</script>
<style scoped lang="scss">
.platform-banner {
  width: 100%;
  position: relative;
  img {
    display: block;
    width: 100%;
  }
  .description {
    position: absolute;
    top: 60%;
    left: 30%;
    transform: translate(-50%, -50%);
    z-index: 1;
    display: flex;
    flex-direction: column;
    width: 380px;
    gap: 0px;
    justify-content: flex-start;
    align-items: flex-start;
    .enName {
      font-family: HYYakuHei800;
      font-size: 44px;
      font-weight: 900;
      line-height: 44px;
      text-align: center;
      color: #ffffff80;
    }
    .name {
      font-family: HYYakuHei800;
      font-size: 72px;
      font-weight: 800;
      line-height: 98px;
      text-align: center;
      color: #ffffff;
    }
    .desc {
      font-family: PingFang;
      font-size: 14px;
      font-weight: 400;
      line-height: 19.6px;
      text-align: left;
      color: #b8b8b8;
      width: 85%;
    }
  }
}
.platform-title {
  max-width: 1400px;
  margin: 50px auto;
  img {
    width: 100%;
  }
}
.search-input {
  width: 400px;
  float: right;
}
.flex-wrapper {
  display: flex;
  clear: both;
  margin: 30px auto 60px;
  width: 100%;
  max-width: 1400px;
  gap: 30px;
  .decal {
    font-family: PingFang SC;
    font-size: 24px;
    font-weight: 600;
    line-height: 33.6px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 10px auto 30px;
    img {
      width: 100%;
    }
    &::before,
    &:after {
      background: url(img/decal.png) no-repeat center center;
      background-size: contain;
      content: "";
      width: 30px;
      height: 30px;
    }
    &::after {
      transform: rotateY(180deg);
    }
  }
  .plat-list {
    background: #2d2d2e;
    width: 360px;
    flex: 1;
    padding: 20px;
    border-radius: 12px;
    .plat-item {
      cursor: pointer;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      gap: 20px;
      align-items: center;
      position: relative;
      font-weight: bold;
      font-size: 20px;
      &:before {
        content: "";
        width: 12px;
        height: 12px;
        left: 20px;
        background: #32ceed00;
        border-radius: 50%;
        position: absolute;
      }
      &.active {
        background: #1b1b1c;
        color: #32ceed;
        &:before {
          background: #32ceed;
        }
      }
    }
  }
  .right-side {
    flex: 4;
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.platform-list-box {
  padding: 10px;
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  &.SLOT {
    justify-content: flex-start;
  }
  img {
    display: block;
    width: 100%;
  }
  .platform-list-item {
    cursor: pointer;
    max-width: 480px;
    width: 100%;
    .bottom {
      background: #2d2d2e;
      padding: 10px;
      border-radius: 0 0 10px 10px;
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
      font-family: "PingFang SC";
      font-size: 24px;
      font-weight: 600;
      height: 70px;
      &.slot {
        align-items: flex-start;
        line-height: 42.6px;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      img {
        width: 25px;
      }
      .start-btn {
        background: linear-gradient(180deg, #32ceed 0%, #1c7587 100%);
        border-radius: 100px;
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        text-align: center;
        display: none;
        padding: 12px 40px;
      }
      .txt {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .el-image {
      border-radius: 12px 12px 0 0;
      display: block;
      max-height: 150px;
    }
    box-shadow: 0px 0px 24px 0px transparent;
    border: 2px solid transparent;
    &:hover {
      box-shadow: 0px 0px 24px 0px #00d5ff7a;
      border: 2px solid #32ceed;
      border-radius: 12px;
      .txt {
        display: none;
      }
      .start-btn {
        display: flex;
      }
    }
  }
}
</style>
<style lang="scss">
#numBox {
  display: flex;
  gap: 5px;
  font-family: Arial, sans-serif;
  font-size: 60px;
  justify-content: center;
  align-items: center;

  .flip-card {
    width: 60px;
    height: 80px;
    background: url(./img/flipcard.png) no-repeat center center;
    background-size: cover;
    // background: linear-gradient(to bottom, #f2f2f2, #dcdcdc); /* Light gray gradient */
    color: #000;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Add a shadow for depth */
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-align: center;
    transform-style: preserve-3d;
    transition: transform 0.5s ease;
  }

  .flip-card.flip-up {
    transform: rotateX(-180deg);
  }

  .flip-card.flip-don {
    transform: rotateX(180deg);
  }
}
</style>
