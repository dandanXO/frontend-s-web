<template>
  <div class="hotgame-section">
    <!-- <HomeTitle title="热门游戏" subtitle="TOP GAMES"></HomeTitle> -->
    <HomeTitleV2 title="热门游戏" subtitle="TOP GAMES" />
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
              <div class="subtitle">{{ hotgame.subtitle }}</div>
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
                require(`../../../assets/home/hotgame/content/${hotgame.section}/${
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
              <div class="desc">
                {{
                  hotgame.content &&
                  hotgame.content[hotgame.currentProvider.toLowerCase()] &&
                  hotgame.content[hotgame.currentProvider.toLowerCase()].desc
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
                    require(`../../../assets/${hotgame.section}/${
                      hotgame.section
                    }-logo-${provider.code.toLowerCase()}.png`)
                  "
                />
                <div :class="`game-provider-text ${hotgame.currentPlat === provider ? 'active' : ''}`">
                  {{ getAliasName(provider, hotgame.section) }}
                </div>
              </div>
            </div>
            <template v-if="hotgame.currentPlat?.underMaintenance === true ? 'maintenance' : ''">
              <el-button size="small" class="common-btn game-start-btn btn-maintenance">
                <span class="maintenance-state">
                  <img src="../../../assets/svg/maintenance-icon.svg" />
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
                {{ hotgame.type !== "slot" ? `进入游戏` : `进入场馆` }}
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
                维护时间:
                <em>
                  {{ moment(hotgame.currentPlat?.maintenanceStartTime).format("YYYY/MM/DD hh:mm A") }} -
                  {{ moment(hotgame.currentPlat?.maintenanceEndTime).format("YYYY/MM/DD hh:mm A") }}
                </em>
              </p>
              <p class="maintenance-p" v-else>&nbsp;</p>
            </div>
          </div>
          <div class="right-container oo">
            <!-- <div>
                {{ hotgame.section }}{{hotgame.content[hotgame.currentProvider]}}
            </div> -->
            <Transition :key="transitionKey" appear>
              <img
                v-if="
                  hotgame.content &&
                  hotgame.content[hotgame.currentProvider] &&
                  hotgame.content[hotgame.currentProvider].charImgPath
                "
                :style="[`${hotgame.section === 'esports' ? 'right:12rem;' : ''}`]"
                :class="`character-${hotgame.subtitle.toLowerCase()}-${hotgame.currentProvider}`"
                :src="
                  require(`../../../assets/home/hotgame/content/${hotgame.section}/${
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
import { useRouter } from "vue-router";
import HomeTitle from "@/atoms/HomeTitle.vue";
import HomeTitleV2 from "@/atoms/HomeTitleV2.vue";
import { getPlatformList, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import GameModal from "@/components/modal/GameModal";
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
import { useDark } from "@vueuse/core";

const store = userStore();
const router = useRouter();
const platformGame = ref();

const isDark = useDark();

const hotgameData = ref([
  {
    number: "01",
    icon: require("../../../assets/home/hotgame/banner/esports/icon.png"),
    iconActive: require("../../../assets/home/hotgame/banner/esports/icon-active.png"),
    title: "电子竞技",
    subtitle: "ESPORTS",
    charImgPath: require("../../../assets/home/hotgame/banner/esports/character.png"),
    isShow: false,
    path: "/eSports",
    currentProvider: "lh",
    section: "esports",
    type: "esport",
    content: {
      isShowSportsIcon: [
        require("../../../assets/home/hotgame/content/esports/icon_cs.png"),
        require("../../../assets/home/hotgame/content/esports/icon_dota2.png"),
        require("../../../assets/home/hotgame/content/esports/icon_lol.png"),
        require("../../../assets/home/hotgame/content/esports/icon_pubg.png"),
        require("../../../assets/home/hotgame/content/esports/icon_valorant.png"),
        require("../../../assets/home/hotgame/content/esports/icon_sc2.png")
      ],
      providerList: [
        // {
        //   key: "lh",
        //   name: "雷火电竞",
        //   icon: require("../../../assets/home/hotgame/content/esports/provider_lh.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "im",
        //   name: "IM电竞",
        //   icon: require("../../../assets/home/hotgame/content/esports/provider_im.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "ia",
        //   name: "IA电竞",
        //   icon: require("../../../assets/home/hotgame/content/esports/provider_ia.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "rg",
        //   name: "RG电竞",
        //   icon: require("../../../assets/home/hotgame/content/esports/provider_rg.png"),
        //   providerInfo: {}
        // }
      ]
      // lh: {
      //   title: "雷火电竞",
      //   subtitle: "ESPORTS",
      //   charImgPath: require("../../../assets/home/hotgame/content/esports/lh/character.png")
      // },
      // im: {
      //   title: "IM电竞",
      //   subtitle: "ESPORTS",
      //   charImgPath: require("../../../assets/home/hotgame/content/esports/im/character.png")
      // },
      // ia: {
      //   title: "IA电竞",
      //   subtitle: "ESPORTS",
      //   charImgPath: require("../../../assets/home/hotgame/content/esports/ia/character.png")
      // },
      // rg: {
      //   title: "RG电竞",
      //   subtitle: "ESPORTS",
      //   charImgPath: require("../../../assets/home/hotgame/content/esports/rg/character.png")
      // }
    }
  },
  {
    number: "02",
    icon: require("../../../assets/home/hotgame/banner/sports/icon.png"),
    iconActive: require("../../../assets/home/hotgame/banner/sports/icon-active.png"),
    title: "体育赛事",
    subtitle: "SPORTS",
    charImgPath: require("../../../assets/home/hotgame/banner/sports/character.png"),
    isShow: false,
    path: "/sports",
    currentProvider: "im",
    section: "sports",
    type: "sport",
    content: {
      isShowSportsIcon: [
        require("../../../assets/sports/sports-pattern.png")
        // require("../../../assets/home/hotgame/content/sports/icon_basketball.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_football.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_volleyball.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_tennis.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_union.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_american_footerball.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_shuttlecock.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_badminton.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_table_tennis.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_hockey.png")
      ],
      providerList: [
        // {
        //   key: "im",
        //   name: "IM体育",
        //   icon: require("../../../assets/home/hotgame/content/sports/provider_im.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "saba",
        //   name: "沙巴体育",
        //   icon: require("../../../assets/home/hotgame/content/sports/provider_saba.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "pinnacle",
        //   name: "AP体育",
        //   icon: require("../../../assets/home/hotgame/content/sports/provider_pinnacle.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "panda",
        //   name: "熊猫体育",
        //   icon: require("../../../assets/home/hotgame/content/sports/provider_panda.png"),
        //   providerInfo: {}
        // }
        // {
        //   key: "cr",
        //   name: "CR体育",
        //   icon: require("../../../assets/home/hotgame/content/sports/provider_cr.png"),
        //   providerInfo: {}
        // }
      ]
      // im: {
      //   title: "IM体育",
      //   subtitle: "SPORTS",
      //   charImgPath: require("../../../assets/home/hotgame/content/sports/im/character.png")
      // },
      // saba: {
      //   title: "沙巴体育",
      //   subtitle: "SPORTS",
      //   charImgPath: require("../../../assets/home/hotgame/content/sports/saba/character.png")
      // },
      // pinnacle: {
      //   title: "AP体育",
      //   subtitle: "SPORTS",
      //   charImgPath: require("../../../assets/home/hotgame/content/sports/pinnacle/character.png")
      // },
      // panda: {
      //   title: "熊猫体育",
      //   subtitle: "SPORTS",
      //   charImgPath: require("../../../assets/home/hotgame/content/sports/panda/character.png")
      // },
      // cr: {
      //   title: "CR体育",
      //   subtitle: "SPORTS",
      //   charImgPath: require("../../../assets/home/hotgame/content/sports/cr/character.png")
      // }
    }
  },
  {
    number: "03",
    icon: require("../../../assets/home/hotgame/banner/casino/icon.png"),
    iconActive: require("../../../assets/home/hotgame/banner/casino/icon-active.png"),
    title: "真人娱乐",
    subtitle: "CASINO",
    charImgPath: require("../../../assets/home/hotgame/banner/casino/character.png"),
    isShow: false,
    path: "/live-casino",
    currentProvider: "ag",
    section: "live",
    type: "live",
    content: {
      isShowSportsIcon: [require("../../../assets/live/live-pattern.png")],
      providerList: [
        // {
        //   key: "ag",
        //   name: "AG真人",
        //   icon: require("../../../assets/home/hotgame/content/casino/provider_ag.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "db",
        //   name: "DB真人",
        //   icon: require("../../../assets/home/hotgame/content/casino/provider_db.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "bg",
        //   name: "BG真人",
        //   icon: require("../../../assets/home/hotgame/content/casino/provider_bg.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "we",
        //   name: "WE真人",
        //   icon: require("../../../assets/home/hotgame/content/casino/provider_we.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "ob",
        //   name: "欧博真人",
        //   icon: require("../../../assets/home/hotgame/content/casino/provider_ob.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "bbin",
        //   name: "BBIN真人",
        //   icon: require("../../../assets/home/hotgame/content/casino/provider_bbin.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "evo",
        //   name: "EVO真人",
        //   icon: require("../../../assets/home/hotgame/content/casino/provider_evo.png"),
        //   providerInfo: {}
        // }
      ]
      // ag: {
      //   title: "AG真人",
      //   subtitle: "CASINO",
      //   charImgPath: require("../../../assets/home/hotgame/content/casino/ag/character.png")
      // },
      // db: {
      //   title: "DB真人",
      //   subtitle: "CASINO",
      //   charImgPath: require("../../../assets/home/hotgame/content/casino/db/character.png")
      // },
      // bg: {
      //   title: "BG真人",
      //   subtitle: "CASINO",
      //   charImgPath: require("../../../assets/home/hotgame/content/casino/bg/character.png")
      // },
      // we: {
      //   title: "WE真人",
      //   subtitle: "CASINO",
      //   charImgPath: require("../../../assets/home/hotgame/content/casino/we/character.png")
      // },
      // ob: {
      //   title: "欧博真人",
      //   subtitle: "CASINO",
      //   charImgPath: require("../../../assets/home/hotgame/content/casino/ob/character.png")
      // },
      // bbin: {
      //   title: "BBIN真人",
      //   subtitle: "CASINO",
      //   charImgPath: require("../../../assets/home/hotgame/content/casino/bbin/character.png")
      // },
      // evo: {
      //   title: "EVO真人",
      //   subtitle: "CASINO",
      //   charImgPath: require("../../../assets/home/hotgame/content/casino/evo/character.png")
      // }
    }
  },
  {
    number: "04",
    icon: require("../../../assets/home/hotgame/banner/lottery/icon.png"),
    iconActive: require("../../../assets/home/hotgame/banner/lottery/icon-active.png"),
    title: "彩票投注",
    subtitle: "LOTTERY",
    charImgPath: require("../../../assets/home/hotgame/banner/lottery/character.png"),

    isShow: false,
    path: "/lottery",
    currentProvider: "lh",
    section: "lottery",
    type: "lottery",
    content: {
      isShowSportsIcon: [
        require("../../../assets/lottery/lottery-pattern.png")
        // require("../../../assets/home/hotgame/content/sports/icon_basketball.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_football.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_volleyball.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_tennis.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_union.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_american_footerball.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_shuttlecock.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_badminton.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_table_tennis.png"),
        // require("../../../assets/home/hotgame/content/sports/icon_hockey.png")
      ],
      providerList: [
        // {
        //   key: "lh",
        //   name: "雷火彩票",
        //   icon: require("../../../assets/home/hotgame/content/lottery/provider_lh.png"),
        //   providerInfo: {}
        // }
      ]
      // lh: {
      //   title: "雷火彩票",
      //   subtitle: "LOTTERY",
      //   charImgPath: require("../../../assets/home/hotgame/content/lottery/lh/character.png")
      // }
    }
  },
  {
    number: "05",
    icon: require("../../../assets/home/hotgame/banner/slots/icon.png"),
    iconActive: require("../../../assets/home/hotgame/banner/slots/icon-active.png"),
    title: "电子游艺",
    subtitle: "SLOTS",
    charImgPath: require("../../../assets/home/hotgame/banner/slots/character.png"),
    isShow: false,
    path: "/slot",
    currentProvider: "pg",
    section: "slot",
    type: "slot",
    content: {
      isShowSportsIcon: [require("../../../assets/slot/slot-pattern.png")],
      providerList: [
        // {
        //   key: "pg",
        //   name: "PG电子",
        //   icon: require("../../../assets/home/hotgame/content/slot/provider_pg.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "sw",
        //   name: "SW电子",
        //   icon: require("../../../assets/home/hotgame/content/slot/provider_sw.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "pt",
        //   name: "PT电子",
        //   icon: require("../../../assets/home/hotgame/content/slot/provider_pt.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "evo",
        //   name: "EVO电子",
        //   icon: require("../../../assets/home/hotgame/content/slot/provider_evo.png"),
        //   providerInfo: {}
        // }
      ]
      // pg: {
      //   title: "PG电子",
      //   subtitle: "SLOT",
      //   charImgPath: require("../../../assets/home/hotgame/content/slot/pg/character.png")
      // },
      // sw: {
      //   title: "SW电子",
      //   subtitle: "SLOT",
      //   charImgPath: require("../../../assets/home/hotgame/content/slot/sw/character.png")
      // },
      // pt: {
      //   title: "PT电子",
      //   subtitle: "SLOT",
      //   charImgPath: require("../../../assets/home/hotgame/content/slot/pt/character.png")
      // },
      // evo: {
      //   title: "EVO电子",
      //   subtitle: "SLOT",
      //   charImgPath: require("../../../assets/home/hotgame/content/slot/evo/character.png")
      // }
    }
  },
  {
    number: "06",
    icon: require("../../../assets/home/hotgame/banner/board/icon.png"),
    iconActive: require("../../../assets/home/hotgame/banner/board/icon-active.png"),
    title: "棋牌游戏",
    subtitle: "BOARD",
    charImgPath: require("../../../assets/home/hotgame/banner/board/character.png"),
    isShow: false,
    path: "/poker",
    currentProvider: "dat",
    section: "poker",
    type: "poker",
    content: {
      isShowSportsIcon: [require("../../../assets/poker/poker-pattern.png")],
      providerList: [
        // {
        //   key: "dat",
        //   name: "大唐棋牌",
        //   icon: require("../../../assets/home/hotgame/content/board/provider_dat.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "gd",
        //   name: "高登棋牌",
        //   icon: require("../../../assets/home/hotgame/content/board/provider_gd.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "ky",
        //   name: "开元棋牌",
        //   icon: require("../../../assets/home/hotgame/content/board/provider_ky.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "leyou",
        //   name: "乐游棋牌",
        //   icon: require("../../../assets/home/hotgame/content/board/provider_leyou.png"),
        //   providerInfo: {}
        // }
      ]
      // dat: {
      //   title: "大唐棋牌",
      //   subtitle: "BOARD",
      //   charImgPath: require("../../../assets/home/hotgame/content/board/dat/character.png")
      // },
      // gd: {
      //   title: "高登棋牌",
      //   subtitle: "BOARD",
      //   charImgPath: require("../../../assets/home/hotgame/content/board/gd/character.png")
      // },
      // ky: {
      //   title: "开元棋牌",
      //   subtitle: "BOARD",
      //   charImgPath: require("../../../assets/home/hotgame/content/board/ky/character.png")
      // },
      // leyou: {
      //   title: "乐游棋牌",
      //   subtitle: "BOARD",
      //   charImgPath: require("../../../assets/home/hotgame/content/board/leyou/character.png")
      // }
    }
  },
  {
    number: "07",
    icon: require("../../../assets/home/hotgame/banner/fishing/icon.png"),
    iconActive: require("../../../assets/home/hotgame/banner/fishing/icon-active.png"),
    title: "捕鱼游戏",
    subtitle: "FISHING",
    charImgPath: require("../../../assets/home/hotgame/banner/fishing/character.png"),
    isShow: false,
    path: "/fishing",
    currentProvider: "ag",
    section: "fishing",
    type: "fish",
    content: {
      isShowSportsIcon: [require("../../../assets/fishing/fishing-pattern.png")],
      providerList: [
        // {
        //   key: "ag",
        //   name: "AG捕鱼",
        //   icon: require("../../../assets/home/hotgame/content/fishing/provider_ag.png"),
        //   providerInfo: {}
        // },
        // {
        //   key: "mw",
        //   name: "决战中途岛",
        //   icon: require("../../../assets/home/hotgame/content/fishing/provider_mw.png"),
        //   providerInfo: {}
        // }
      ]
      // ag: {
      //   title: "AG捕鱼",
      //   subtitle: "FISHING",
      //   charImgPath: require("../../../assets/home/hotgame/content/fishing/ag/character.png")
      // },
      // mw: {
      //   title: "决战中途岛",
      //   subtitle: "FISHING",
      //   charImgPath: require("../../../assets/home/hotgame/content/fishing/mw/character.png")
      // }
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
    } else if (currentPlat.code === "GFLC") {
      currentPlat.gameCode = "lobby";
    }

    const platItem = plat.content[currentPlat.code.toLowerCase()];
    // console.log(platItem);

    const platformName = currentPlat.alias ?? (platItem && platItem.title) ? platItem.title : currentPlat.name;
    platformGame.value.open(platformName, currentPlat.code, currentPlat.gameCode);
  }
};
const platformsListDisplay = ref([]);

const getAliasName = (plat, platformType) => {
  // console.log(plat);
  if (plat.alias) {
    // console.log(plat);
    if (plat.alias.includes("、")) {
      const aliass = plat.alias.split("、");
      const gameTypes = plat.gameType.split(",");
      const itemIndex = gameTypes.indexOf(platformType.toUpperCase());
      return itemIndex && aliass[itemIndex] ? aliass[itemIndex] : aliass[0];
    }
    return plat.alias;
  } else {
    return plat.name;
  }
};

const setHotGame = () => {
  if (store.token) {
    getLoggedInPlatformList().then((res) => {
      platformsListDisplay.value = res;
      checkPlatforms();
    });
  } else {
    getPlatformList().then((res) => {
      platformsListDisplay.value = res;
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
          additem.alias = "PA电子";
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
  console.log(hotgameData.value);
};
const updatePlatforms = (platforms, item, keyModifier) => {
  // console.log(item.subtitle)
  platforms.forEach((p, i) => {
    const newObject = {
      title: p.cnname,
      subtitle: item.subtitle,
      desc: p.message,
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

<style lang="scss" scoped>
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
          padding: 1rem;
          border-radius: 2.875rem;
          background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
          box-shadow: 0px 2px 4.58px 0px #bbdcff inset;
          overflow: hidden;
          position: relative;
          z-index: 1;
          transition: $transition_timer;
          cursor: pointer;

          &.highlight {
            color: white;
            background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
            box-shadow: 0px -2px 4.58px 0px #93c7ff inset, 0px -1px 3.664px 0px #275ec1 inset;
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

            .title {
              width: 1rem;
              word-break: break-all;
              text-align: center;
              font-family: PingFang SC;
              font-size: 1.156rem;
              font-weight: 600;
              line-height: 1.5rem;
            }

            .subtitle {
              width: 0.2rem;
              word-break: break-all;
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
              background: linear-gradient(180deg, #ae92ff 0%, #56c2ff 100%);

              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-fill-color: transparent;
              filter: drop-shadow(2px 1px #5799e3);
            }

            .subtitle {
              font-size: 2.70775rem;
              background: linear-gradient(180deg, #ae92ff 0%, #56c2ff 100%);

              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-fill-color: transparent;
              filter: drop-shadow(2px 1px #5799e3);
            }
          }

          .description {
            min-height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .desc {
            color: #3063ab;
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
                border: 1px solid #0e7dff;
                background: linear-gradient(180deg, #dcebff 0%, #f4f4f4 100%);
                object-fit: contain;

                &.active {
                  border: 0px;
                  background: linear-gradient(180deg, #7ed5ff 0%, #0e7dff 100%);
                  box-shadow: 0px 3.35448px 3.35448px 0px rgba(0, 0, 0, 0.25);
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
                  color: #3063ab;
                  font-weight: 700;
                }
              }

              &:hover {
                .game-provider-text {
                  color: #3063ab;
                  font-weight: 700;
                }
                .game-provider-img {
                  border: 0px;
                  background: linear-gradient(180deg, #7ed5ff 0%, #0e7dff 100%);
                  box-shadow: 0px 3.35448px 3.35448px 0px rgba(0, 0, 0, 0.25);
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
            background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
            box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
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

          // esports
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

          .character-casino-fblive {
            position: relative;
            right: 4.5rem;
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
            color: $font-5-dark;

            &.highlight {
              background: $active-color-dark-linear;
              box-shadow: 0px -2px 4.58px 0px #ffdcbb inset;
              color: $color-white;
            }

            .hotgame-text {
              color: unset;
            }
          }
        }

        .hotgame-content-wrapper {
          @include content-block-dark;
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
                color: $font-3-dark;
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
