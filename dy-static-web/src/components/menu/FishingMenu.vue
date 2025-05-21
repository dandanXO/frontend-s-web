<template>
  <div>
    <div class="platform-menu fish">
      <div
        class="platform-box"
        v-for="nav in filteredNavigations"
        :key="nav.code"
        @click="$emit('loadModal', nav.name, nav.code, nav.gameCode)"
        :class="nav.underMaintenance === true ? 'maintenance' : ''"
      >
        <div class="maintenance-box" v-if="nav.underMaintenance === true">
          <p>维护中</p>
          <p v-if="nav.maintenanceStartTime && nav.maintenanceEndTime" class="small-size">
            维护时间:
            <span>
              {{ moment(nav.maintenanceStartTime).format("YYYY/MM/DD HH:mm:ss A") }}
              <br />
              ~
              <br />
              {{ moment(nav.maintenanceEndTime).format("YYYY/MM/DD HH:mm:ss A") }}
            </span>
          </p>
        </div>
        <img :src="require('../../assets/fishing/header_fish_' + nav.image + '.png')" style="height: 40px" />
        <!-- <p v-if="nav.code === 'AGF'" class="platform-title">PA捕鱼</p>
        <p v-else-if="nav.code === 'PMFISH'" class="platform-title">DB捕鱼</p>
        <p v-else class="platform-title">{{ nav.code }}捕鱼</p> -->
        <p class="platform-title">{{ getAliasName(nav, 'FISH') }}</p>
        <div class="platform-img" :class="'fish-' + nav.image"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import moment from "moment/moment";

export default defineComponent({
  setup() {
    const navigations = [
      {
        gameCode: "7202",
        name: "决战中途岛",
        code: "GPS",
        image: "gps",
        message:
          "决战中途岛是历史上一场经典的战役是太平洋战争的转捩点，进入游戏画面之后爽快的操控自己的飞机然后对着天空中的敌人射击！让你享受子弹最极速画面最丰富翱翔于天际唯我独尊的感受！"
      },
      // {
      //     gameCode: 'cmf0001',
      //     name: '龙珠捕鱼',
      //     code: 'AT',
      //     image: 'at',
      //     message: 'ICONIC GAMING主打的龙珠捕鱼，是一款具有3种精致场景和高赔率的热门射击游戏。 可爱逗趣的海底生物、特殊累积机制、5种随机倍数奖励，丰富的视觉效果带来前所未有的乐趣。'
      // },
      {
        gameCode: "HMPL",
        name: "PA捕鱼王",
        code: "AGF",
        image: "ag",
        message:
          "最受欢迎的PA捕鱼，游戏设计简单但富有变化，更有多种风格做选择，游戏过程有趣令人爱不释手，是游戏娱乐的上佳选择。"
      },
      {
        gameCode: "",
        name: "DB多宝捕鱼",
        code: "PMFISH",
        image: "db",
        message:
          "最受欢迎的DB多宝捕鱼，游戏设计简单但富有变化，更有多种风格做选择，游戏过程有趣令人爱不释手，是游戏娱乐的上佳选择。"
      }
      // {
      //     gameCode: 'F-SF01',
      //     name: 'SG捕鱼天王',
      //     code: 'SG',
      //     image: 'sg',
      //     message: '全新鱼种与创新玩法，搭配丰富游戏场景， 享受全屏激战，满屏爆金的震撼体验。'
      // }
    ];

    const store = userStore();
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("FISH"));
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("FISH"));
        });
      }
    };
    const filteredNavigations = computed(() => {
      return navigations
        .filter((nav) => platformsListDisplay.value.some((platform) => platform.code === nav.code))
        .map((nav) => ({
          ...nav,
          ...platformsListDisplay.value.find((platform) => platform.code === nav.code)
        }));
    });


    const getAliasName = (plat, platformType) => {
      // console.log(plat);
      if (plat.alias?.includes("、")) {
        const aliass = plat.alias.split("、");
        const gameTypes = plat.gameType.split(",");
        const itemIndex = gameTypes.indexOf(platformType);
        // console.log(platformType);
        // console.log(aliass);
        // console.log(aliass[itemIndex]);

        return itemIndex && aliass[itemIndex] ? aliass[itemIndex] : aliass[0];
      }
      return plat.alias;
    };
    onMounted(() => {
      getPlatList();
    });
    return {
      filteredNavigations,
      getPlatList,
      moment,
      getAliasName
    };
  }
});
</script>
