<template>
  <div class="hotgame-section">
    <HomeTitle :title="t('home.hotGames')"></HomeTitle>
    <!-- <HomeTitleV2 title="热门游戏" subtitle="TOP GAMES"/> -->
    <div class="hotgame-container">
      <div class="hotgame-wrapper" v-for="(hotgame, hotgameIndex) in hotgameData" :key="`${hotgame}-${hotgameIndex}`">
        <div class="hotgame-banner-wrapper">
          <div
            :class="`hotgame-banner ${hotgameIndex === currentBannerIndex ? 'highlight' : ''}`"
            @click="onBannerClick(hotgameIndex)"
          >
            <img class="hotgame-icon" :src="hotgameIndex === currentBannerIndex ? hotgame.iconActive : hotgame.icon" />
            <div :class="`hotgame-number ${hotgameIndex === currentBannerIndex ? 'highlight' : ''}`">
              {{ hotgame.number }}
            </div>
            <div class="hotgame-text">
              <div class="title">{{ hotgame.title }}</div>
              <!-- <div class="subtitle">{{ hotgame.subtitle }}</div> -->
            </div>
            <div class="character-wrapper">
              <img :class="`character-${hotgame.subtitle.toLowerCase()}`" :src="hotgame.charImgPath" />
              <!-- <img v-if="
                hotgame.content &&
                hotgame.content[hotgame.currentProvider] &&
                hotgame.content[hotgame.currentProvider].charImgPath
              "
              :class="`character-${hotgame.subtitle.toLowerCase()}`"
              :src="
                require(`../../assets/home/hotgame/content/${hotgame.section}/${
                  hotgame.content[hotgame.currentProvider].charImgPath
                }/character.png`)
              " /> -->
            </div>
          </div>
        </div>
        <div :class="`hotgame-content-wrapper ${hotgame.isShow ? 'show' : ''}`">
          <div class="left-container">
            <div class="title-wrapper">
              <Transition :key="transitionDesc" name="fade" enter>
                <div class="title" v-if="hotgame.currentProvider">
                  {{
                    hotgame.content &&
                    hotgame.content[hotgame.currentProvider.toLowerCase()] &&
                    hotgame.content[hotgame.currentProvider.toLowerCase()].title
                  }}
                </div>
              </Transition>
              <div class="subtitle">
                {{
                  hotgame.content &&
                  hotgame.content[hotgame.currentProvider.toLowerCase()] &&
                  hotgame.content[hotgame.currentProvider.toLowerCase()].subtitle
                }}
              </div>
              <!-- <div class="subtitle">{{ hotgame.content[hotgame.currentProvider.toLowerCase()] }}</div> -->
            </div>
            <div class="description">
              <div class="desc" v-if="languageVal === 'vi'">
                {{
                  hotgame.content &&
                  hotgame.content[hotgame.currentProvider.toLowerCase()] &&
                  hotgame.content[hotgame.currentProvider.toLowerCase()].desc.message
                }}
              </div>
              <div class="desc" v-else>
                {{
                  hotgame.content &&
                  hotgame.content[hotgame.currentProvider.toLowerCase()] &&
                  hotgame.content[hotgame.currentProvider.toLowerCase()].desc.message
                }}
              </div>
              <!-- <div class="desc">还有超多独家创新玩法，足够新颖，极易操作的游戏界面， 更是在您游戏过程中增光添彩！</div> -->
            </div>
            <div v-if="hotgame.content.isShowSportsIcon" :class="`game-icon-wrapper ${hotgame.subtitle.toLowerCase()}`">
              <img
                v-for="(icon, iconIndex) in hotgame.content.isShowSportsIcon"
                :key="`${icon}-${iconIndex}`"
                :src="icon"
              />
            </div>
            <div class="game-provider-wrapper">
              <div
                v-for="(provider, providerIndex) in hotgame.content.providerList"
                :key="`${provider}-${providerIndex}`"
                class="game-provider"
                @click="setCurrentProvider(hotgame, provider)"
              >
                <img
                  :class="`game-provider-img ${hotgame.currentPlat === provider ? 'active' : ''}`"
                  :src="
                    require(`../../assets/${hotgame.section}/${
                      hotgame.section
                    }-logo-${provider.code.toLowerCase()}.png`)
                  "
                />
                <div :class="`game-provider-text ${hotgame.currentPlat === provider ? 'active' : ''}`">
                  {{ provider.alias ?? provider.name }}
                </div>
                <!-- <img :src="provider.icon" /> -->
                <!-- <img
                  :class="`game-provider-img ${hotgame.currentProvider === provider.key ? 'active' : ''}`"
                  :src="provider.icon"
                />
                <div :class="`game-provider-text ${hotgame.currentProvider === provider.key ? 'active' : ''}`">
                  {{ provider.name }}
                </div> -->
              </div>
            </div>
            <template v-if="hotgame.currentPlat?.underMaintenance === true ? 'maintenance' : ''">
              <el-button size="small" class="common-btn game-start-btn btn-maintenance">
                <span class="maintenance-state">
                  <img src="../../assets/svg/maintenance-icon.svg" />
                  维护中
                </span>
              </el-button>
            </template>
            <template v-else>
              <el-button
                size="small"
                class="common-btn game-start-btn"
                @click="onEnterGameClick(hotgame, hotgame.type)"
              >
                {{ hotgame.type !== "slot" ? $t("hotGame.enterGame") : $t("hotGame.enterPlat") }}
              </el-button>
            </template>

            <div style="height: 50px">
              <p
                v-if="
                  hotgame.currentPlat?.underMaintenance === true &&
                  hotgame.currentPlat?.maintenanceStartTime &&
                  hotgame.currentPlat?.maintenanceEndTime
                "
                class="maintenance-p"
              >
                {{ $t("hotgame.maintenanceTime") }}:
                <em>
                  {{ moment(hotgame.currentPlat?.maintenanceStartTime).format("YYYY/MM/DD hh:mm A") }} -
                  {{ moment(hotgame.currentPlat?.maintenanceEndTime).format("YYYY/MM/DD hh:mm A") }}
                </em>
              </p>
              <p class="maintenance-p" v-else>&nbsp;</p>
            </div>
          </div>
          <div class="right-container">
            <Transition :key="transitionKey" appear>
              <img
                v-if="
                  hotgame.content &&
                  hotgame.content[hotgame.currentProvider] &&
                  hotgame.content[hotgame.currentProvider].charImgPath
                "
                :class="`character-${hotgame.subtitle.toLowerCase()}-${hotgame.currentProvider}`"
                :src="
                  require(`../../assets/home/hotgame/content/${hotgame.section}/${
                    hotgame.content[hotgame.currentProvider].charImgPath
                  }/character.png`)
                "
              />
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
  <GameModal ref="platformGame"></GameModal>
</template>

<script setup>
import { onMounted, ref, Transition } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import HomeTitle from "@/atoms/HomeTitle.vue";
import { getPlatformList, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import GameModal from "@/components/modal/GameModal";
import { i18nStore } from "@/store/language";
import { storeToRefs } from "pinia";
import * as _ from "lodash";
import {
  eSportsPlatforms,
  fishingPlatforms,
  slotPlatforms,
  liveCasinoPlatforms,
  lotteryPlatforms,
  pokerPlatforms,
  sportsPlatforms
} from "@/shared/platformArray";
import moment from "moment";

const i18nStoreLanguage = i18nStore();
const { languageVal } = storeToRefs(i18nStoreLanguage);
const { t } = useI18n();
const store = userStore();
const router = useRouter();
const platformGame = ref();

// const isDark = useDark();

const hotgameData = ref([
  {
    number: "01",
    icon: require("../../assets/home/hotgame/banner/casino/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/casino/icon-active.png"),
    title: "라이브 카지노",
    subtitle: `라이브 
    카지노`,
    charImgPath: require("../../assets/home/hotgame/banner/casino/character.png"),
    isShow: false,
    path: "/live-casino",
    currentProvider: "",
    section: "live",
    type: "live",
    content: {
      // isShowSportsIcon: [require("../../assets/live/live-pattern.png")],
      providerList: []
    }
  },
  {
    number: "02",
    icon: require("../../assets/home/hotgame/banner/slots/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/slots/icon-active.png"),
    title: "슬롯게임",
    subtitle: "슬롯게임",
    charImgPath: require("../../assets/home/hotgame/banner/slots/character.png"),
    isShow: false,
    path: "/slot",
    currentProvider: "",
    section: "slot",
    type: "slot",
    content: {
      // isShowSportsIcon: [require("../../assets/slot/slot-pattern.png")],
      providerList: []
    }
  },
  {
    number: "03",
    icon: require("../../assets/home/hotgame/banner/sports/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/sports/icon-active.png"),
    title: "스포츠",
    subtitle: "스포츠",
    charImgPath: require("../../assets/home/hotgame/banner/sports/character.png"),
    isShow: false,
    path: "/sports",
    currentProvider: "",
    section: "sports",
    type: "sport",
    content: {
      providerList: []
    }
  },
  {
    number: "04",
    icon: require("../../assets/home/hotgame/banner/minigame/minigame.png"),
    iconActive: require("../../assets/home/hotgame/banner/minigame/icon-active.png"),
    title: "미니게임",
    subtitle: "미니게임",
    charImgPath: require("../../assets/home/hotgame/banner/board/character.png"),
    isShow: false,
    path: "/fishing",
    currentProvider: "ag",
    section: "fishing",
    type: "fish",
    content: {
      providerList: []
    }
  },
  {
    number: "05",
    icon: require("../../assets/home/hotgame/banner/board/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/board/icon-active.png"),
    title: "포커",
    subtitle: "POKER",
    charImgPath: require("../../assets/home/hotgame/banner/poker/character.png"),
    isShow: false,
    path: "/poker",
    currentProvider: "dat",
    section: "poker",
    type: "poker",
    content: {
      providerList: []
    }
  }
]);

const transitionKey = ref(0);
const transitionDesc = ref(0);
const setCurrentProvider = (element, value) => {
  element.currentPlat = value;
  element.currentProvider = value.code.toLowerCase();

  transitionKey.value++;
  transitionDesc.value++;
};

let currentBannerIndex = ref(0);
const setBannerPosition = (index) => {
  hotgameData.value.forEach((e, i) => {
    if (i === index) e.isShow = true;
    else e.isShow = false;
  });
};

const onBannerClick = (index) => {
  if (index === currentBannerIndex.value) return;

  setBannerPosition(index);
  currentBannerIndex = index;
};

const onEnterGameClick = (plat, platType) => {
  if (platType === "slot") {
    router.push({ path: plat.path, query: { plat: plat.currentPlat.code } });
  } else {
    const currentPlat = plat.currentPlat;
    if (currentPlat.code === "BBINDY") {
      currentPlat.gameCode = "bblive_lobby_pc";
    } else if (currentPlat.code === "GPS") {
      currentPlat.gameCode = 7202;
    } else if (currentPlat.code === "PP") {
      currentPlat.gameCode = 101;
    }

    const platItem = plat.content[currentPlat.code.toLowerCase()];
    // console.log(platItem);

    const platformName = currentPlat.alias ?? (platItem && platItem.title) ? platItem.title : currentPlat.name;
    platformGame.value.open(platformName, currentPlat.code, currentPlat.gameCode);
  }
};
const platformsListDisplay = ref([]);

const setHotGame = () => {
  if (store.token) {
    getLoggedInPlatformList().then((res) => {
      // esport games show at sport section
      const formattedPlatforms = res.map((resItem) => ({
        ...resItem,
        gameType: resItem.gameType?.replace("ESPORT", "SPORT")
      }));
      platformsListDisplay.value = formattedPlatforms;
      checkPlatforms();
    });
  } else {
    getPlatformList().then((res) => {
      // esport games show at sport section
      const formattedPlatforms = res.map((resItem) => ({
        ...resItem,
        gameType: resItem.gameType?.replace("ESPORT", "SPORT")
      }));

      platformsListDisplay.value = formattedPlatforms;
      checkPlatforms();
    });
  }
};
const checkPlatforms = () => {
  platformsListDisplay.value.forEach((plat) => {
    const gameTypeArray = plat.gameType.split(",").map((type) => type.trim());
    hotgameData.value.forEach((item) => {
      const containingItem = gameTypeArray.some((type) => item.type.toLowerCase() === type.toLowerCase());

      if (containingItem) {
        const additem = _.clone(plat);
        if (item.type === "slot" && additem.code === "AG") {
          additem.name = "XIN";
          additem.alias = "XIN";
        }
        item.content.providerList.push(additem);
      }

      if (gameTypeArray.some((type) => type.toLowerCase() === "esport") && item.type === "esport") {
        updatePlatforms(eSportsPlatforms, item, "");
      }
      if (gameTypeArray.some((type) => type.toLowerCase() === "sport") && item.type === "sport") {
        updatePlatforms(sportsPlatforms, item, "");
      }
      if (gameTypeArray.some((type) => type.toLowerCase() === "live") && item.type === "live") {
        updatePlatforms(liveCasinoPlatforms, item, "");
      }
      if (gameTypeArray.some((type) => type.toLowerCase() === "poker") && item.type === "poker") {
        updatePlatforms(pokerPlatforms, item, "");
      }
      if (gameTypeArray.some((type) => type.toLowerCase() === "lottery") && item.type === "lottery") {
        updatePlatforms(lotteryPlatforms, item, "");
      }
      if (gameTypeArray.some((type) => type.toLowerCase() === "slot") && item.type === "slot") {
        updatePlatforms(slotPlatforms, item, "");
      }
      if (gameTypeArray.some((type) => type.toLowerCase() === "fish") && item.type === "fish") {
        updatePlatforms(fishingPlatforms, item, "");
      }
    });
  });
  hotgameData.value.forEach((hot) => {
    hot.currentPlat = hot.content.providerList[0];
    hot.currentProvider = hot.currentPlat.code.toLowerCase();
  });
};
const updatePlatforms = (platforms, item, keyModifier) => {
  // console.log(item.subtitle)
  platforms.forEach((p, i) => {
    const newObject = {
      title: p.cnname,
      subtitle: item.subtitle,
      desc: p,
      charImgPath: p.image
    };
    item.content[p.code.toLowerCase() + keyModifier] = newObject;
  });
};
onMounted(() => {
  setBannerPosition(currentBannerIndex.value);
  setHotGame();
});
</script>

<style lang="scss">
$transition_timer: 0.5s;

.hotgame-section {
  width: 80%;
  max-width: 1100px;
  margin: 0 auto;

  .hotgame-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    margin: 2.5rem 0 0 0;

    .hotgame-wrapper {
      display: flex;
      align-items: center;
      // overflow: hidden;
      height: 600px;

      .hotgame-banner-wrapper {
        display: flex;

        .hotgame-banner {
          width: 65px;
          height: 36.5rem;
          // height: 28.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 4px;
          border-radius: 2.875rem;
          background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
          // box-shadow: 0px 2px 4.58px 0px #FFA09A inset;
          box-shadow: 0px 1.81px 3.63px 0px #ffffff40 inset;
          box-shadow: 0px 2.72px 5.44px 0px #0047ff40;

          overflow: hidden;
          position: relative;
          z-index: 1;
          transition: $transition_timer;
          cursor: pointer;

          &.highlight {
            color: white;
            // background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
            // box-shadow: 0px -2px 4.58px 0px #93c7ff inset, 0px -1px 3.664px 0px #275ec1 inset;
            // background: linear-gradient(180deg, #FD897E 0%, #FD3126 100%);
            // box-shadow: 0px -2.3px 5.26px 0px #FFA09A inset, 0px -1.15px 4.21px 0px #FF736A inset;

            background: linear-gradient(0deg, #386fff -1.68%, #2be1d6 100%);
            box-shadow: 0px 2px 4.58px 0px #bbdcff inset;
          }

          .hotgame-icon {
            height: 2rem;
            margin: 0 0 1rem 0;
            transform: translate(0px, 1px);
          }

          .hotgame-number {
            text-align: center;
            font-family: Impact;
            font-size: 1.76444rem;
            font-weight: 400;
            line-height: normal;
            letter-spacing: 0.2595rem;
            border-bottom: 0.1rem solid #3981ff;
            margin: 0 0 0.5rem 0;

            &.highlight {
              border-bottom: 0.1rem solid white;

              & ~ .hotgame-text {
                color: #fff;
              }
            }
          }

          .hotgame-text {
            color: #000;
            display: flex;
            gap: 7px;
            margin: 0 0.25rem 3rem 0;
            flex-direction: column;

            .title {
              // width: 1rem;
              // word-break: break-all;
              text-align: center;
              font-family: PingFang SC;
              font-size: 0.756rem;
              font-weight: 600;
              line-height: 1.2rem;
            }

            .subtitle {
              width: 0.2rem;
              // word-break: break-all;
              text-align: center;
              font-family: PingFang SC;
              font-size: 0.578rem;
              font-weight: 500;
              line-height: 0.75rem;
              margin: 0.075rem 0 0 0;
            }
          }

          .character-wrapper {
            .character-casino,
            .character-board,
            .character-fishing {
              position: relative;
              bottom: 1rem;
            }

            //         img {
            // height: 60%;
            // opacity: 0.6;
            // margin-right: 65px;
            //         }
          }
        }
      }

      .hotgame-content-wrapper {
        display: flex;
        align-items: flex-end;
        gap: 1rem;
        width: 0;
        height: 0;
        overflow: hidden;
        background: #edf8fe;
        transition: $transition_timer;

        &.show {
          width: 38.5rem;
          // margin: 0 0 0 0px;
          margin: 0 -10px 0 0px;
          padding-left: 0.75rem;
          height: 500px;
        }

        .left-container {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          position: relative;
          width: 55%;
          height: 90%;

          //&.maintenance {
          //  filter: grayscale(0.8);
          //
          //  .game-start-btn{
          //    pointer-events: none;
          //  }
          //}

          .title-wrapper {
            font-family: "YiHei";
            font-style: normal;
            font-weight: 400;

            line-height: normal;

            .title {
              // font-size: 4.24106rem;
              font-size: 2.7106rem;
              word-break: keep-all;
              background: linear-gradient(180deg, #bc4c4c 0%, #fd574c 100%);

              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-fill-color: transparent;
              filter: drop-shadow(2px 1px #ffa09a);
            }

            .subtitle {
              font-size: 2.70775rem;
              font-weight: bold;
              // background: linear-gradient(180deg, #BC4C4C 0%, #FD574C 100%);
              background: linear-gradient(180deg, #ae92ff 0%, #56c2ff 100%);

              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-fill-color: transparent;
              filter: drop-shadow(2px 1px #ffa09a);
            }
          }

          .description {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-height: 120px;
            justify-content: flex-start;
            overflow: hidden;
          }

          .desc {
            color: #a0bcd6;
            font-family: Microsoft YaHei;
            font-size: 0.83838rem;
            font-weight: 400;
            line-height: 1.46719rem;
            width: 20rem;
          }

          .game-icon-wrapper {
            display: flex;
            gap: 10px;

            &.esports {
              gap: 25px;
            }

            img {
              width: 1.5rem;
              height: 1.5rem;
              width: 100%;
            }

            &.sports,
            &.casino,
            &.lottery,
            &.board,
            &.fishing,
            &.slots {
              img {
                width: auto;
              }
            }

            &.lottery,
            &.fishing,
            &.slots {
              img {
                height: 1.8rem;
              }
            }
          }

          .game-provider-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 12.5px;
            width: 20rem;
            z-index: 2;

            .game-provider {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              width: 3.25rem;

              .game-provider-img {
                width: 2rem;
                height: 2rem;
                padding: 0.25rem;
                border-radius: 0.3145rem;
                // border: 1px solid #FD574C;
                // background: linear-gradient(180deg, #dcebff 0%, #f4f4f4 100%);
                background: linear-gradient(180deg, #c3e8fa 0%, #a1c4fc 100%);

                object-fit: contain;

                &.active {
                  border: 0px;
                  // background: linear-gradient(180deg, #FCFCFC -11.46%, #FD574C 100%);
                  // box-shadow: 0px 3.35448px 3.35448px 0px rgba(0, 0, 0, 0.25);
                  background: linear-gradient(180deg, #2eadee 0%, #a1c4fc 100%);
                }
              }

              .game-provider-text {
                color: #a5c0e4;
                text-align: center;
                font-family: Microsoft YaHei;
                font-size: 0.73363rem;
                font-weight: 400;
                line-height: 1.46719rem;
                white-space: nowrap;

                &.active {
                  color: #0e0100;
                  font-weight: 700;
                }
              }

              &:hover {
                .game-provider-text {
                  color: #0e0100;
                  font-weight: 700;
                }

                .game-provider-img {
                  border: 0px;
                  // background: linear-gradient(180deg, #AE92FF 0%, #56C2FF 100%);
                  // box-shadow: 0px 3.35448px 3.35448px 0px rgba(0, 0, 0, 0.25);

                  background: linear-gradient(180deg, #2eadee 0%, #a1c4fc 100%);
                }
              }
            }
          }

          .maintenance-p {
            margin: 0px 3px 0px;
            font-size: 16px;
            color: $font-1;

            em {
              font-weight: bold;
              font-style: initial;
            }
          }

          .game-start-btn {
            width: 10rem;
            height: 2.5rem;
            border-radius: 1.875rem;
            // background: linear-gradient(180deg, #FD897E 0%, #FD3126 100%);
            // box-shadow: 0px -2.3px 5.26px 0px #FFA09A inset, 0px -1.15px 4.21px 0px #FF736A inset;

            background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
            box-shadow: 0px -2px 4.58px 0px #b1d7ff inset;
            box-shadow: 0px -1px 3.66px 0px #5894ff inset;

            font-family: Microsoft YaHei;
            font-size: 1.15281rem;
            font-weight: 400;
            line-height: 2.5rem;

            &.btn-maintenance {
              background: rgba(0, 0, 0, 0.3);
              pointer-events: none;
              border: none;
              box-shadow: none;

              .maintenance-state {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;

                img {
                  width: 22px;
                }
              }
            }

            &:hover {
              filter: brightness(1.2);
            }

            &:active {
              filter: brightness(1.1);
              transform: translate(0px, 1px);
            }
          }
        }

        .right-container {
          display: flex;
          align-items: flex-end;
          position: relative;
          width: 45%;

          //&.maintenance {
          //  filter: grayscale(0.8);
          //}

          //.maintenance-box {
          //  position: absolute;
          //  top: 10%;
          //  width: 94%;
          //  left: 3%;
          //  right: 3%;
          //  height: 80%;
          //  padding:15px 10px;
          //  color: #ffffff;
          //  font-size: 24px;
          //  font-weight: bold;
          //  z-index: 33;
          //  display: flex;
          //  flex-direction: column;
          //  justify-content: center;
          //  align-items: center;
          //  gap: 15px;
          //
          //  background: rgba(2, 9, 73, 0.4);
          //  border-radius: 30px;
          //
          //  p {
          //    font-size: 30px;
          //    margin-top: 3px;
          //    margin-bottom: 3px;
          //  }
          //
          //  .small-size {
          //    font-size: 16px;
          //  }
          //}

          img {
            position: relative;
            right: 4rem;
            bottom: 0px;
            height: 30rem;

            &.character-fishing-gps {
              right: 9rem;
            }
          }

          //lottery
          .character-lottery-tcg {
            right: 6rem;
          }

          .character-lottery-lh {
            position: relative;
            right: 3rem;
            height: 30rem;
          }

          // poker
          .character-esports-lh {
            position: relative;
            right: 8rem;
            height: 29rem;
          }

          .character-esports-imes {
            position: relative;
            right: 8rem;
            height: 30rem;
          }

          .character-esports-ia {
            position: relative;
            right: 10rem;
            height: 30rem;
          }

          .character-esports-rg {
            position: relative;
            right: 4rem;
            height: 30rem;
          }

          // sports
          .character-sports-im {
            position: relative;
            right: 8rem;
            height: 28rem;
          }

          .character-sports-saba {
            position: relative;
            right: 3rem;
            height: 28rem;
          }

          .character-sports-fb {
            position: relative;
            right: 6rem;
            height: 26rem;
          }

          .character-sports-pinnacle,
          .character-sports-panda {
            position: relative;
            right: 1rem;
            height: 29rem;
          }

          .character-sports-pm {
            position: relative;
            right: 2.5rem;
            height: 28rem;
          }

          .character-sports-cr {
            position: relative;
            right: 1.5rem;
            height: 28rem;
          }

          // casino
          .character-casino-ag {
            position: relative;
            right: 2.5rem;
            height: 31rem;
          }

          .character-casino-pmlive {
            position: relative;
            right: 5rem;
            height: 31rem;
          }

          .character-casino-db {
            position: relative;
            right: 4rem;
            height: 30rem;
          }

          .character-casino-bg {
            position: relative;
            right: 4rem;
            height: 29rem;
          }

          .character-casino-we {
            position: relative;
            right: 4rem;
            height: 30rem;
          }

          .character-casino-ob {
            position: relative;
            right: 3.25rem;
            height: 27rem;
          }

          .character-casino-bbin {
            position: relative;
            right: 3.25rem;
            height: 29rem;
          }

          .character-casino-evo {
            position: relative;
            right: 9.5rem;
            height: 29rem;
          }

          .character-casino-allbet {
            right: 6rem;
          }

          .character-casino-we {
            right: 8rem;
          }

          .character-casino-bbindy {
            right: 6rem;
          }

          // board
          .character-board-dat,
          .character-board-gd {
            position: relative;
            right: 2.25rem;
            height: 30rem;
          }

          .character-board-ky {
            position: relative;
            right: 8rem;
            height: 30rem;
          }

          .character-board-leyou,
          .character-board-leg {
            position: relative;
            right: 7rem;
            height: 30rem;
          }

          .character-board-dt {
            height: 32rem;
            right: 8rem;
          }

          .character-board-gflc {
            right: 6rem;
          }

          // slots
          .character-slots-pg {
            position: relative;
            right: 5.5rem;
            height: 29rem;
          }

          .character-slots-sw {
            position: relative;
            right: 5rem;
            height: 29rem;
          }

          .character-slots-pt {
            position: relative;
            right: 5rem;
            height: 29rem;
          }

          .character-slots-evo {
            position: relative;
            right: 2.75rem;
            height: 29rem;
          }

          .character-slots-ag {
            position: relative;
            right: 7rem;
            height: 29rem;
          }

          // fishing
          .character-fishing-ag {
            position: relative;
            right: 4rem;
            height: 29rem;
          }

          .character-fishing-mw {
            position: relative;
            right: 5.5rem;
            height: 29rem;
          }
        }
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease, transform 0.5s ease-in-out;
  transform: translateY(0px);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(60px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 2s ease, transform 1s ease-in-out;
  transform: translateY(0px);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.dark {
  .hotgame-section {
    .hotgame-container {
      .hotgame-wrapper {
        .hotgame-banner-wrapper {
          .hotgame-banner {
            background: linear-gradient(180deg, #00273d 0%, #02132c 100%);
            box-shadow: 0px -1px 3.66px 0px #11131e inset;
            // color: $font-5-dark;

            &.highlight {
              // background: $active-color-dark-linear;
              box-shadow: 0px -2px 4.58px 0px #ffdcbb inset;
              color: $color-white;
            }

            .hotgame-text {
              color: unset;
            }
          }
        }

        .hotgame-content-wrapper {
          // @include content-block-dark;
          background: linear-gradient(180deg, #1b202d 0%, #00010b 100%);

          .left-container {
            .title-wrapper {
              .title,
              .subtitle {
                background: linear-gradient(180deg, #c2fbfb 0%, #299aad 100%);
                background-clip: text;
              }
            }

            .description {
              .desc {
                color: $font-3;
              }
            }

            .game-provider-wrapper {
              .game-provider {
                .game-provider-img {
                  background: linear-gradient(180deg, #113765 0%, #212428 100%);
                  border-color: #36677c;

                  &.active {
                    background: linear-gradient(180deg, #38d2da 0%, #1b7893 100%);
                    border-color: #52e4ed;
                    box-shadow: 0px 3.35px 3.35px 0px #00000040;
                  }
                }

                .game-provider-text.active {
                  color: $color-white;
                }
              }
            }

            .game-start-btn {
              background: linear-gradient(180deg, #3bdce2 0%, #18708e 100%);
              box-shadow: none;
            }
          }
        }
      }
    }
  }
}
</style>
