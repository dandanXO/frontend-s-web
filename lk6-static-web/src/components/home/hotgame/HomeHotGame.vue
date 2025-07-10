<template>
  <div class="hotgame-section">
    <img v-if="languageVal === 'en'" src="../../../assets/home/hotgame/hotgame-section-title-en.svg" width="1100px" style="display:flex;margin:0 auto;" />
    <img v-else src="../../../assets/home/hotgame/hotgame-section-title.svg" width="1100px" style="display:flex;margin:0 auto;" />

    <div class="category-wrapper">
      <template v-for="(hotgame, hotgameIndex) in hotgameData" :key="`${hotgame}-${hotgameIndex}`">
        <div class="category-item" :class="{ active: hotgame.isShow }" v-if="hotgame.type === 'sport' || hotgame.type === 'live' || hotgame.type === 'poker'" @click="onBannerClick(hotgameIndex)">
          <img width="40px" height="40px" src="../../../assets/home/hotgame/soccer-icon.png" v-if="hotgame.type === 'sport'" />
          <img width="40px" height="40px" src="../../../assets/home/hotgame/dice-icon.png" v-if="hotgame.type === 'live'" />
          <img width="40px" height="40px" src="../../../assets/home/hotgame/card-icon.png" v-if="hotgame.type === 'poker'" />
          {{ hotgame.title }}
        </div>
      </template>
    </div>
    
    
    <div class="hotgame-container">
      <SportsView v-if="currentBannerIndex === 0" />
      <LiveCasinoView v-else-if="currentBannerIndex === 1"/>
      <BacarratView v-else-if="currentBannerIndex === 2" :hideBanner="true" />
    </div>
  </div>
  <GameModal ref="platformGame"></GameModal>
</template>

<script setup>
import { onMounted, ref, Transition } from "vue";
import { useRouter } from "vue-router";
import { getPlatformList, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import GameModal from "@/components/modal/GameModal";
import * as _ from "lodash";
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
import {
  eSportsPlatforms,
  fishingPlatforms,
  slotPlatforms,
  liveCasinoPlatforms,
  lotteryPlatforms,
  pokerPlatforms,
  sportsPlatforms
} from "@/shared/platformArray";
import { useDark } from "@vueuse/core";
import SportsView from "@/views/SportsView.vue";
import LiveCasinoView from "@/views/LiveCasinoView.vue";
import BacarratView from "@/views/BacarratView.vue";

const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
const store = userStore();
const router = useRouter();
const platformGame = ref();

const isDark = useDark();

const hotgameData = ref([
  {
    number: "02",
    icon: require("../../../assets/home/hotgame/banner/sports/icon.png"),
    iconActive: require("../../../assets/home/hotgame/banner/sports/icon-active.png"),
    title: "体育",
    subtitle: "SPORTS",
    charImgPath: require("../../../assets/home/hotgame/banner/sports/character.png"),
    isShow: false,
    path: "/sports",
    currentProvider: "im",
    section: "sports",
    type: "sport",
    content: {
      isShowSportsIcon: [
        require("../../../assets/sports/sports-pattern.svg")
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
    title: "真人",
    subtitle: "CASINO",
    charImgPath: require("../../../assets/home/hotgame/banner/casino/character.png"),
    isShow: false,
    path: "/live-casino",
    currentProvider: "ag",
    section: "live",
    type: "live",
    content: {
      isShowSportsIcon: [require("../../../assets/live/live-pattern.svg")],
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
    number: "06",
    icon: require("../../../assets/home/hotgame/banner/board/icon.png"),
    iconActive: require("../../../assets/home/hotgame/banner/board/icon-active.png"),
    title: "百家乐",
    subtitle: "BOARD",
    charImgPath: require("../../../assets/home/hotgame/banner/board/character.png"),
    isShow: false,
    path: "/poker",
    currentProvider: "dat",
    section: "poker",
    type: "poker",
    content: {
      isShowSportsIcon: [require("../../../assets/poker/poker-pattern.svg")],
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
  }
]);

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

const platformsListDisplay = ref([]);

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
    // hot.currentPlat = hot.content.providerList[0];
    // hot.currentProvider = hot.currentPlat.code.toLowerCase();
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
  width: 1300px;
  margin: 0 auto;

  .category-wrapper {
    background: url('../../../assets/home/hotgame/category-bg.png') center center no-repeat;
    background-size: 100% 100%;
    width: 613px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    gap: 10px;
    margin: 0 auto;

    .category-item {
      background: url('../../../assets/home/hotgame/category-item-bg.png') center center no-repeat;
      background-size: 100% 100%;
      width: 190px;
      height: 53px;
      display: flex;
      gap: 15px;
      align-items: center;
      justify-content: center;
      font-family: 'PingFang SC';
      font-weight: 600;
      font-size: 24.84px;
      line-height: 100%;
      letter-spacing: 4.35px;
      text-align: center;
      color: #35648F;
      cursor: pointer;

      &:hover, &.active {
        background: url('../../../assets/home/hotgame/category-item-active-bg.png') center center no-repeat;
        background-size: 100% 100%;
        color: #FFFFFF;
      }
    }
  }

  .hotgame-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
  }
}
</style>
