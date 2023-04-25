<template>
  <div class="poker-container">
      <div class="poker-container-inner">
          <template v-for="(det, idx) in platforms" :key="idx">
            <template v-if="selectedPlat === det.code">
              <div class="poker-left" data-aos="fade-right" data-aos-duration="4000">
                  <img :src="require('../assets/poker/title_poker_' + det.image + '.png')" style="margin-bottom: 54px;">
                  <div class="platform-txt-box">
                      <div>
                          <div class="platform-txt-list-content">{{ det.message }}</div>
                      </div>
                  </div>
                  <img src="../assets/poker/poker_tx_platforms.png" style="margin: 8px 0 68px 50px;"><br>
                  <div class="play-btn" @click="openGame(det.name, det.code)"></div>
              </div>
              <div class="poker-right" data-aos="fade-left"  data-aos-duration="4000">
                <img class="absolute" src="../assets/poker/poker_right.png">
                <img :src="require('../assets/poker/poker_right_' + det.image + '.png')">
              </div>
            </template>
        </template>
    </div>
    <div class="platform-list-box">
      <span class="platform-list-item platform" v-for="(plat, i) in platforms" :key="i" @click="clickPlat(plat)" :class="{active: selectedPlat === plat.code}">
        {{plat.name}}棋牌
      </span>
    </div>
  </div>
  <GameModal ref="pokerGame"></GameModal>
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
    const pokerGame = ref(null);
    const platforms = ref([
      {
        code: 'TX',
        name: '大唐',
        image: 'tx',
        message: '全球首创6张牌先发、VIP包桌、咪牌百家乐、智控模式百家乐及竞咪互动百家乐等游戏，多终端兼容，让您享受不停。'
      },
      {
        code: 'KY',
        name: '开元',
        image: 'ky',
        message: '双人PK、百人大战、牛牛牌九炸金花、扑克玩法全覆盖。更有街机玩法人机大战，竞技休闲两不误。'
      },
    ])
    const selectedPlat = ref(platforms.value[0].code);
    const clickPlat = (plat) => {
      selectedPlat.value = plat.code
    }

    const openGame = (gameName, gameCode) => {
      pokerGame.value.open(gameName, "onlyPlatform", gameCode);
    };
    onMounted(() => {
      aos.refresh();
    });
    return {
      platforms,
      selectedPlat,
      clickPlat,
      openGame,
      pokerGame
    }
  },
})
</script>

<style scoped lang="scss">
  .poker-container {
    background-image: url(../assets/poker/bg_poker_platforms.jpg);
    background-repeat: no-repeat;
    background-position: top center;
    height: 850px;
    width: 100%;
    position: relative;
    overflow: hidden;
    letter-spacing: 0;
    font-size: 14px;
    gap: 15px;
    .poker-container-inner {
      max-width: $maxwidth;
      width: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;

      height: 775px;
      margin-bottom: 20px;
      gap: 100px;
      .poker-left {
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
      .poker-right {
        position: relative;
        .absolute {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: unset;
          height: 95%;
        }
        flex: 2;
        img {
          width: unset;
          height: 75vh;
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
