<template>
  <div class="slots-container">
    <div
      v-if="banner && banner.desktopImageUrl && banner.mobileImageUrl"
      class="banner-container"
    >
      <div
        class="promo-bg isDesktop"
        :style="
          'background-image: url(' + imgURL + banner.desktopImageUrl + ')'
        "
      ></div>
      <div
        class="promo-bg isMobile"
        :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'"
      ></div>
    </div>
    <!-- <div
        class="promo-bg"
        :style="
          'background: url(' +
          imgURL +
          banner.backgroundImageUrl +
          ')no-repeat center center; background-size: cover'
        "
      >
        <img class="promo-img" :src="imgURL + banner.imageUrl" />
        <img
          class="promo-content isDesktop"
          :src="imgURL + banner.desktopImageUrl"
        />
        <img
          class="promo-content isMobile"
          :src="imgURL + banner.mobileImageUrl"
        />
      </div> -->
    <div class="margin-center game-container">
      <div class="bookmarks">
        <div
          class="plat-item"
          v-for="p in platforms"
          :class="{ active: p.id === selectedPlatId }"
          :key="p"
          @click="switchPlat(p)"
        >
          <img
            :src="require('../../assets/images/common/logo/' + p.code + '.png')"
          />
          <!-- <img
            v-if="p.name === 'PG'"
            src="../../assets/images/common/logo/PG.png"
          />
          <img
            v-else-if="p.name === 'AMBSLOT'"
            src="../../assets/images/common/logo/AMBSLOT.png"
          />
          <img
            v-else-if="p.name === 'KAGaming'"
            src="../../assets/images/common/logo/KA.png"
          />
          <img
            v-else-if="p.name === 'YGG'"
            src="../../assets/images/common/logo/YGG.png"
          />
          <img
            v-else-if="p.name === 'JOKER'"
            src="../../assets/images/common/logo/JOKER.png"
          />
          <img
            v-else-if="p.name === 'SP'"
            src="../../assets/images/common/logo/SP.png"
          />
          <img
            v-else-if="p.name === 'SLOTXO'"
            src="../../assets/images/common/logo/SLOTXO.png"
          />
          <img
            v-else-if="p.name === 'Gamatron'"
            src="../../assets/images/common/logo/GMT.png"
          />
          <img
            v-else-if="p.name === 'Live22'"
            src="../../assets/images/common/logo/LIVE22.png"
          />
          <img
            v-else-if="p.name === 'ATA'"
            src="../../assets/images/common/logo/EVOPLAY.png"
          />
          <span v-else>{{ p.name }}</span> -->
        </div>
      </div>
      <div class="hot-game-container">
        <main>
          <div class="search-container">
            <a-input
              class="search-input"
              placeholder="Search"
              v-model:value="gamePage.searchKey"
              @keypress.enter="searchList()"
            >
              <template #suffix>
                <a-tooltip title="search">
                  <SearchOutlined @click="searchList()" />
                </a-tooltip>
              </template>
            </a-input>
          </div>
          <div
            class="game-slot"
            v-for="game in gamePage.gameList"
            :key="game.id"
            @click="openGame(game.name, game.code)"
            :style="
              selectedPlat.code === 'SP'
                ? 'align-items: flex-start'
                : 'align-items: center'
            "
          >
            <div class="slot-img">
              <img :src="game.default" v-image="game.icon" />
            </div>
            <div class="slot-name">
              <span class="slide"> {{ game.name }}</span>
            </div>

            <!-- <a @click="openGame(game.name, game.code)">
              <div class="slot-img">
                <img :src="game.default" v-image="game.icon" />
              </div>
              <div class="slot-name">
                <img src="../../assets/images/games/slots/play-icon.png" />
                {{ game.name }}
              </div>
            </a> -->
          </div>
          <div class="pagination-wrapper">
            <a-pagination
              v-model:current="gamePage.currentPage"
              v-model:pageSize="gamePage.pageSize"
              :total="gamePage.total"
              @change="changePage"
              @showSizeChange="onShowSizeChange"
              :showSizeChanger="true"
            />
          </div>
        </main>
      </div>
    </div>
    <GameModal ref="slotsGame"></GameModal>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { getPlatformGames, getPlatformList } from "@/api/platform/platform";
import GameModal from "@/components/modal/GameModal";
import { useRoute, useRouter } from 'vue-router';
// import { message } from "ant-design-vue";
import { loadPromoBanner } from "@/api/index/promo";
const imgURL = process.env.VUE_APP_IMAGE_CDN + '/'

export default defineComponent({
  components: {
    SearchOutlined, GameModal
  },
  setup() {
    const banner = ref([]);
    const route = useRoute();
    const router = useRouter();
    const slotsGame = ref(null);
    const jpNumber = "123,456,789.88";
    const platforms = ref([]);
    const selectedPlatId = ref();
    const selectedPlat = ref(platforms.value[0]);
    const gamePage = reactive({
      gameList: [],
      currentPage: 1,
      pageSize: 40,
      searchType: "",
      searchKey: "",
      total: 0
    });
    const gameListData = ref([]);

    const switchPlat = (plat) => {
      router.push({ path: 'slot', query: { plat: plat.code }})
      selectedPlat.value = plat
      selectedPlatId.value = plat.id;
      gamePage.currentPage = 1;
      loadGameList();
    };
    const getPlatList = () => {
      getPlatformList().then((data) => {
        platforms.value = data.filter(element => element.gameType.includes("SLOT"));
        if (!route.query.plat) {
          switchPlat(platforms.value[0]);
        } else {
          platforms.value.forEach(element => {
            if (route.query.plat === element.code) {
              switchPlat(element)
            }
          });
        }
      }).catch((err) => {
        console.log(err.message);
        // message.error(
        //   err.message,
        //   4
        // );
      });
    };
    const searchList = () => {
      if (gamePage.searchKey) {
        gamePage.gameList = gameListData.value.filter((game) => {
          return (((game.name).toLowerCase()).includes((gamePage.searchKey).toLowerCase()));
        });
      } else {
        changePage(1, gamePage.pageSize);
      }
    };
    const loadBanner = () => {
      loadPromoBanner("SLOT").then((res) => {
        if (res.code === 0) {
            banner.value = res.data[0]
        }
      })
    }
    const loadGameList = () => {
      getPlatformGames(selectedPlatId.value, "SLOT").then((data) => {
        data.forEach(element => {
          element.default = require("../../assets/images/games/aviator/default.png");
          element.icon = `${process.env.VUE_APP_IMAGE_CDN}/slot/${selectedPlat.value.code}/${element.icon}.png`;
        });
        gameListData.value = data;
        gamePage.total = data.length;
        changePage(1, gamePage.pageSize);
      }).catch((err) => {
          console.log(err.message);
        // message.error(
        //   err.message,
        //   4
        // );
      });
    };

    const changePage = (page, pageSize) => {
      gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
    };
    const onShowSizeChange = (current, size) => {
      current = 1;
      gamePage.currentPage = 1;
      changePage(current, size);
    };

    const openGame = (gameName, gameCode) => {
      slotsGame.value.open(gameName, selectedPlat.value.code, gameCode, selectedPlat.value.status);
    };

    onMounted(() => {
      getPlatList();
      loadBanner();
    });
    watch(
      () => route.query.plat,
      () => {
        if (route.path === '/slot') {
          getPlatList();
        }
      }
    );
    return {
      jpNumber,
      platforms,
      selectedPlatId,
      selectedPlat,
      switchPlat,
      gamePage,
      openGame,
      loadGameList,
      changePage,
      searchList,
      gameListData,
      onShowSizeChange,
      slotsGame,
      banner,
      imgURL
    };
  }
});
</script>
<style scoped lang="scss">
@-webkit-keyframes scale {
  100% {
    -webkit-transform: scale(1, 1);
  }
}

@keyframes scale {
  100% {
    transform: scale(1, 1);
  }
}

@-webkit-keyframes playzoom {
  0% {
    -webkit-transform: scale(1, 1);
  }
  100% {
    -webkit-transform: scale(1.04, 1.04);
  }
}

@keyframes playzoom {
  0% {
    -webkit-transform: scale(1, 1);
  }
  100% {
    -webkit-transform: scale(1.04, 1.04);
  }
}
.slots-container {
  background: linear-gradient(to bottom, #23263c, #190f25);
  .banner-container {
    @keyframes fadein {
      100% {
        opacity: 1;
      }
    }
    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      &.isDesktop {
        display: block;
        height: 430px;
      }
      &.isMobile {
        display: none;
        height: 220px;
      }
    }
  }
}
.bookmarks {
  cursor: pointer;
  display: flex;
  grid-gap: 20px;
  max-width: 1400px;
  margin: 30px auto 60px;
  padding: 20px 15px;
  justify-content: flex-start;
  overflow: unset;
  flex-wrap: wrap;
  .plat-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #23263c;
    // min-width: 120px;
    img {
      max-height: 30px;
      filter: grayscale(1);
    }
    span {
      color: rgba(200, 200, 200, 0.5);
      font-size: 20px;
      font-weight: bold;
    }
    &.active,
    &:hover {
      background: #2b2b4b;
      box-shadow: 0 0 5px #ffffff;
      img {
        filter: grayscale(0);
      }
      span {
        color: #ffffff;
      }
    }
  }
  div {
    padding: 10px 20px;
    text-align: center;
    background: #2b2b4b;
    border-radius: 20px;
    box-shadow: rgb(0 0 0 / 24%) 0px 6px 12px 0px;
    &:hover {
      transform: scale(1.01274) translate(0px, -4px);
    }
  }
}

.hot-game-container {
  margin: 0 auto;
  padding: 20px 0 80px;
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  :deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
    border-color: #de4845;
  }
  :deep(.ant-select-selector:focus) {
    border-color: #de4845;
  }

  :deep(.ant-select:not(.ant-select-disabled):visited .ant-select-selector) {
    border-color: #de4845;
  }
  :deep(.ant-pagination-next:hover .ant-pagination-item-link) {
    border-color: #de4845;
    color: #de4845;
  }
  :deep(.ant-pagination-next:focus .ant-pagination-item-link) {
    border-color: #de4845;
    color: #de4845;
  }
  :deep(.ant-pagination-prev:hover .ant-pagination-item-link) {
    border-color: #de4845;
    color: #de4845;
  }
  :deep(.ant-pagination-prev:focus .ant-pagination-item-link) {
    border-color: #de4845;
    color: #de4845;
  }

  main {
    &:after {
      display: none;
    }
    width: 100%;
    padding-bottom: 50px;
    text-align: center;
    .pagination-wrapper {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
    }
    .search-container :deep(.ant-input-affix-wrapper) {
      padding-top: 0;
      padding-bottom: 0;
      background-color: #23263c;
      border: solid 1px #919191;
      svg {
        fill: #ffffff;
      }
    }
    :deep(.ant-input-affix-wrapper > input.ant-input) {
      padding: 10px;

      background: #23263c;
      color: #ffffff;
      border: #23263c;
    }
    .search-container {
      position: absolute;
      right: 0;
      top: -60px;
    }
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(8, 100px);

    grid-gap: 20px;
    grid-auto-flow: row;
    grid-template-areas:
      ". . ip0 ip0 ip0 ip2 ip2 ip3 ip3 ip4 ip4 ."
      "imp imp ip0 ip0 ip0 ip2 ip2 ip3 ip3 ip4 ip4 ."
      "imp imp ip0 ip0 ip0 ip1 ip1 ip1 . ip5 ip5 ."
      ". . . . . ip1 ip1 ip1 . ip5 ip5 ."
      ". ip6 ip6 ip7 ip7 ip1 ip1 ip1 . ip8 ip8 ."
      ". ip6 ip6 ip7 ip7 . . . . ip8 ip8 ." ". . . . . . . . . . . ."
      ". . . . . . . ip9 ip9 . . ." "ip10 ip10 . . . . . ip9 ip9 . . ." "ip10 ip10 ip11 ip11 . . . . . . . ."
      ". . ip11 ip11 . . . . . . . ."
      ". . . . . . ip12 ip12 . . . ."
      ". . . . . . ip12 ip12 . . . ."
      ". ip13 ip13 . . . . . . . . ." ". ip13 ip13 . . . . . . ip14 ip14 ." ". . . . . . . . . ip14 ip14 .";
    .game-slot {
      box-shadow: rgb(0 0 0 / 24%) 0px 6px 12px 0px;

      border-radius: 20px;
      color: white;
      font-family: sans-serif;
      font-size: 120%;
      font-weight: bold;
      overflow: hidden;
      display: flex;
      justify-content: center;

      -webkit-animation: scale 0.5s;
      animation: scale 0.5s;
      -webkit-transform: scale(0, 0);
      transform: scale(0, 0);
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
      .slot-img {
        display: flex;
        justify-content: center;
        transition: all 0.3s ease;
        height: 120%;
        align-items: flex-start;
        img {
          display: block;
          // height: 100%;
          height: 100%;
          min-height: 100%;
        }
      }
      &:hover {
        .slot-img {
          -webkit-transform: scale(1.2, 1.2);
          transform: scale(1.2, 1.2);
        }
      }
      &:nth-child(1) {
        grid-area: imp;
      }
      &:nth-child(2) {
        grid-area: ip0;
      }
      &:nth-child(3) {
        grid-area: ip1 / ip1 / ip1 / ip1;
      }
      &:nth-child(4) {
        grid-area: ip2;
      }
      &:nth-child(5) {
        grid-area: ip3;
      }
      &:nth-child(6) {
        grid-area: ip4;
      }
      &:nth-child(7) {
        grid-area: ip5;
      }
      &:nth-child(8) {
        grid-area: ip6;
      }
      &:nth-child(9) {
        grid-area: ip7;
      }
      &:nth-child(10) {
        grid-area: ip8;
      }

      transition: all 0.3s ease-in;
      cursor: pointer;
      position: relative;
      .slot-name {
        position: absolute;
        opacity: 0;
        font-size: 15px;
        line-height: 15px;

        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.3) 10%,
          transparent
        );
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        transform: translate(0, 50px);

        .slide {
          padding: 10px;
          word-break: break-word;
          display: block;
        }
      }
      &:before {
        position: absolute;
        top: 0;
        left: -85%;
        z-index: 2;
        display: block;
        content: "";
        width: 50%;
        height: 100%;
        background: -webkit-linear-gradient(
          left,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.3) 100%
        );
        background: linear-gradient(
          to right,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.3) 100%
        );
        -webkit-transform: skewX(-25deg);
        transform: skewX(-25deg);
      }

      @-webkit-keyframes scale {
        100% {
          -webkit-transform: scale(1, 1);
        }
      }

      @keyframes scale {
        100% {
          transform: scale(1, 1);
        }
      }

      @-webkit-keyframes shine {
        100% {
          left: 125%;
        }
      }
      @keyframes shine {
        100% {
          left: 125%;
        }
      }

      &:hover {
        &:before {
          -webkit-animation: shine 2s;
          animation: shine 2s;
        }

        .slot-name {
          opacity: 1;
          transform: translate(0px, 0px);
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .slots-container {
    margin: 0 auto;
    .banner-container {
      .promo-bg {
        &.isDesktop {
          display: none;
        }
        &.isMobile {
          display: block;
        }
      }
    }
    .game-container {
      width: 100%;
      min-height: 100vh;
    }
    .bookmarks {
      // overflow: auto;
      // padding: 20px 20px 40px;
      // flex-wrap: nowrap;
      img {
        max-height: 20px;
      }
    }

    .hot-game-container {
      width: 90%;
      main {
        .search-container {
          width: 100%;
        }
        display: grid;
        grid-gap: 30px;
        grid-template-columns: repeat(2, 1fr);
        grid-area: unset;
        grid-template-rows: none;
        grid-template-areas: none;
        .game-slot {
          display: flex;
          max-height: 25vw;
          align-items: center;
          .slot-img {
            min-height: unset;
            height: unset;
          }
          img {
            width: 108%;
            opacity: 0.8;
            margin-left: -4%;
          }
          &:nth-child(n) {
            grid-area: unset;
          }
          .slot-name {
            opacity: 1;
            transform: translate(0px, 0px);
          }
        }
        &:after {
          display: none;
        }
      }
    }
  }
}
</style>
