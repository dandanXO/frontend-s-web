<template>
  <div class="fishing-container">
      <div class="fishing-container-inner">
          <template v-for="(det, idx) in platforms" :key="idx">
            <template v-if="selectedPlat === det.code">
              <div class="fishing-left" data-aos="fade-right" data-aos-duration="4000">
                  <img :src="require('../assets/fishing/title_fish_' + det.image + '.png')" style="margin-bottom: 54px;">
                  <div class="platform-txt-box">
                      <div>
                          <div class="platform-txt-list-content">{{ det.message }}</div>
                      </div>
                  </div>
                  <img src="../assets/fishing/fish_xf_platforms.png" style="margin: 8px 0 68px 50px;"><br>
                  <div class="play-btn" @click="openGame(det.name, det.gameCode)"></div>
              </div>
              <div class="fishing-right" data-aos="fade-left"  data-aos-duration="4000">
                <img v-if="det.name === 'GPS'" class="absolute" src="../assets/fishing/fish_right.png">
                <img v-if="det.name === 'AT'" class="absolute" src="../assets/fishing/fish_right_bg3.png">
                <img v-if="det.name === 'SG'" class="absolute sg" src="../assets/fishing/fish_right_sgover.png">
                <img :class="det.name" class="rgt-img" :src="require('../assets/fishing/fish_right_' + det.image + '.png')">
              </div>
            </template>
        </template>
    </div>
    <div class="platform-list-box">
      <span class="platform-list-item platform" v-for="(plat, i) in platforms" :key="i" @click="clickPlat(plat)" :class="{active: selectedPlat === plat.code}">
        {{plat.code}}捕鱼
      </span>
    </div>
  </div>
  <GameModal ref="fishingGame"></GameModal>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue';
import GameModal from "@/components/modal/GameModal";
import aos from "aos";

export default defineComponent({
  components: {
    GameModal
  },
  setup() {
    const fishingGame = ref(null);
    const platforms = ref([
      {
        gameCode: '7202',
        name: '决战中途岛',
        code: 'GPS',
        image: 'gps',
        message: '决战中途岛是历史上一场经典的战役是太平洋战争的转捩点，进入游戏画面之后爽快的操控自己的飞机然后对着天空中的敌人射击！让你享受子弹最极速画面最丰富翱翔于天际唯我独尊的感受！'
      },
      // {
      //   gameCode: 'cmf0001',
      //   name: '龙珠捕鱼',
      //   code: 'AT',
      //   image: 'at',
      //   message: 'ICONIC GAMING主打的龙珠捕鱼，是一款具有3种精致场景和高赔率的热门射击游戏。 可爱逗趣的海底生物、特殊累积机制、5种随机倍数奖励，丰富的视觉效果带来前所未有的乐趣。'
      // },
      {
        gameCode: '6',
        name: 'AG捕鱼王',
        code: 'AG',
        image: 'ag',
        message: '最受欢迎的AG捕鱼，游戏设计简单但富有变化，更有多种风格做选择，游戏过程有趣令人爱不释手，是游戏娱乐的上佳选择。'
      },
      {
        gameCode: 'F-SF01',
        name: 'SG捕鱼天王',
        code: 'SG',
        image: 'sg',
        message: '全新鱼种与创新玩法，搭配丰富游戏场景， 享受全屏激战，满屏爆金的震撼体验。'
      },
    ])
    const selectedPlat = ref(platforms.value[0].code);
    const clickPlat = (plat) => {
      selectedPlat.value = plat.code
    }

    const openGame = (gameName, gameCode) => {
      fishingGame.value.open(gameName, selectedPlat.value, gameCode);
    };
    onMounted(() => {
      aos.refresh();
    });
    return {
      platforms,
      selectedPlat,
      clickPlat,
      openGame,
      fishingGame
    }
  },
})
</script>

<style scoped lang="scss">
  .fishing-container {
    background-image: url(../assets/fishing/bg_fish_platforms.jpg);
    background-repeat: no-repeat;
    background-position: top center;
    height: 850px;
    width: 100%;
    position: relative;
    overflow: hidden;
    letter-spacing: 0;
    font-size: 14px;
    gap: 15px;
    .fishing-container-inner {
      max-width: $maxwidth;
      width: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: stretch;
      padding-top: 100px;

      height: 675px;
      margin-bottom: 20px;
      gap: 100px;
      .fishing-left {
        text-align: left;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .platform-txt-list-content {
          line-height: 26px;
          letter-spacing: 1px;
          color: #959dab;
        }
        .play-btn {
          cursor: pointer;
          background: url(../assets/common/start-btn.png)no-repeat center center;
          width: 300px;
          height: 100px;
          margin: 0 auto;
          &:hover {
            background-image: url(../assets/common/start-hover-btn.png);
          }
        }
      }
      .fishing-right {
        position: relative;
        .absolute {
          position: absolute;
          top: -80px;
          left: 0;
          right: -150px;
          bottom: 0;
          &.sg {
            top: unset;
            bottom: 0;
            height: unset;
          }
        }
        flex: 2;
        img {
          width: unset;
          height: 55vh;
          &.rgt-img {
            &.AT {
              height: 100%;
            }
            &.AG {
              height: 80%;
            }
            &.GPS {
              height: 100%;
            }
            &.SG {
              height: 50vh;
              margin-top: -50px;
            }
          }
        }
      }
    }
    .platform-list-box {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 40px;
      margin: 5px;
      .platform-list-item {
        cursor: pointer;
    color: #869ebf;
        &::before{
          content: "";
          background: url(../assets/common/xf-grey.png)no-repeat center center;
          padding: 15px;
        }
        &.active {
    color: #32ceed;
          &::before{
            background-image: url(../assets/common/xf.png);
          }
        }
      }
    }
  }
</style>
