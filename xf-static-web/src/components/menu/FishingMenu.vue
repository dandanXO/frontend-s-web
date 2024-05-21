<template>
  <div>
    <div class="platform-menu fish">
      <div
        class="platform-box"
        v-for="nav in navigations"
        :key="nav.code"
        @click="$emit('loadModal', nav.name, nav.code, nav.gameCode)"
      >
        <img :src="require('../../assets/fishing/header_fish_' + nav.image + '.png')" style="height: 40px" />
        <p class="platform-title">{{ nav.code === "AGF" ? "AG" : nav.code }}捕鱼</p>
        <div class="platform-img" :class="'fish-' + nav.image"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
export default defineComponent({
  setup() {
    const navigations = ref([
      {
        gameCode: "7202",
        name: "决战中途岛",
        code: "GPS",
        image: "gps",
        message:
          "决战中途岛是历史上一场经典的战役是太平洋战争的转捩点，进入游戏画面之后爽快的操控自己的飞机然后对着天空中的敌人射击！让你享受子弹最极速画面最丰富翱翔于天际唯我独尊的感受！"
      },
      {
        gameCode: "6",
        name: "AG捕鱼王",
        code: "AGF",
        image: "ag",
        message:
          "最受欢迎的AG捕鱼，游戏设计简单但富有变化，更有多种风格做选择，游戏过程有趣令人爱不释手，是游戏娱乐的上佳选择。"
      },
      {
        gameCode: "F-SF01",
        name: "SG捕鱼天王",
        code: "SG",
        image: "sg",
        message: "全新鱼种与创新玩法，搭配丰富游戏场景， 享受全屏激战，满屏爆金的震撼体验。"
      }
    ]);
    const store = userStore();
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((data) => {
          let fishlists = data.filter((element) => element.gameType.includes("FISH") || element.name === "SG");

          for (let i = navigations.value.length - 1; i >= 0; i--) {
            const hasNameX = fishlists.some((obj) => obj.name === navigations.value[i].code);
            console.log(hasNameX);
            if (!hasNameX) {
              navigations.value.splice(i, 1);
            }
          }
          console.log(navigations.value);
        });
      } else {
        getPlatformListDisplay().then((data) => {
          let fishlists = data.filter((element) => element.gameType.includes("FISH") || element.name === "SG");

          for (let i = navigations.value.length - 1; i >= 0; i--) {
            const hasNameX = fishlists.some((obj) => obj.name === navigations.value[i].code);
            console.log(hasNameX);
            if (!hasNameX) {
              navigations.value.splice(i, 1);
            }
          }
          console.log(navigations.value);
        });
      }
    };

    onMounted(() => {
      getPlatList();
    });

    return {
      navigations
    };
  }
});
</script>
