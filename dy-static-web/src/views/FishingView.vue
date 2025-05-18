<template>
  <div class="platform__wrap">
    <div class="game-container">
      <canvas id="bubbleCanvas" class="bubble-wrapper"></canvas>
      <div class="fish-box fish-box-1">
        <div class="swim-fish swim-fish-1"></div>
      </div>
      <div class="fish-box fish-box-2">
        <div class="swim-fish swim-fish-2"></div>
      </div>
      <div class="fish-box fish-box-3">
        <div class="swim-fish swim-fish-3"></div>
      </div>
      <div class="fish-box fish-box-4">
        <div class="swim-fish swim-fish-4"></div>
      </div>
      <div class="play-box">
        <div class="game-content" data-aos="zoom-in" data-aos-duration="700">
          <div class="fish5"></div>
          <div class="fish1"></div>
          <div class="fish6"></div>
        </div>
        <div class="game-btn" data-aos="zoom-in" data-aos-duration="700">
          <button class="btn fish-begin" @click="openGame('GPS捕鱼', 'GPS', '7202')"></button>
          <button class="btn fish-begin" @click="openGame('AG捕鱼', 'AGF', 'HMPL')"></button>
          <button class="btn fish-begin" @click="openGame('DB多宝捕鱼', 'PMFISH', '')"></button>
        </div>
      </div>
    </div>
  </div>

  <GameModal ref="fishingGame"></GameModal>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import GameModal from "@/components/modal/GameModal";
import aos from "aos";
import { TweenMax } from "gsap";

export default defineComponent({
  components: {
    GameModal
  },
  setup() {
    const swimFish1 = ref(null);
    const swimFish2 = ref(null);
    const swimFish3 = ref(null);
    const swimFish4 = ref(null);

    onMounted(() => {
      swimFish1.value = document.querySelector(".swim-fish-1");
      swimFish2.value = document.querySelector(".swim-fish-2");
      swimFish3.value = document.querySelector(".swim-fish-3");
      swimFish4.value = document.querySelector(".swim-fish-4");

      TweenMax.to(".fish-box-1", 30, {
        x: -(window.innerWidth + 2000),
        repeat: -1,
        repeatDelay: 1,
        yoyo: true,
        onRepeat: function () {
          swimFish1.value.classList.toggle("mirror-rotate");
        }
      });
      TweenMax.to(".fish-box-2", 20, {
        x: window.innerWidth + 500,
        repeat: -1,
        repeatDelay: 1,
        yoyo: true,
        onRepeat: function () {
          swimFish2.value.classList.toggle("mirror-rotate");
        }
      });
      TweenMax.to(".fish-box-3", 35, {
        x: window.innerWidth + 1700,
        repeat: -1,
        repeatDelay: 1,
        yoyo: true,
        onRepeat: function () {
          swimFish3.value.classList.toggle("mirror-rotate");
        }
      });
      TweenMax.to(".fish-box-4", 25, {
        x: -(window.innerWidth + 600),
        repeat: -1,
        repeatDelay: 1,
        yoyo: true,
        onRepeat: function () {
          swimFish4.value.classList.toggle("mirror-rotate");
        }
      });
    });
    const fishingGame = ref(null);
    const platforms = ref([
      {
        gameCode: "7202",
        name: "决战中途岛",
        code: "GPS",
        image: "gps",
        message:
          "决战中途岛是历史上一场经典的战役是太平洋战争的转捩点，进入游戏画面之后爽快的操控自己的飞机然后对着天空中的敌人射击！让你享受子弹最极速画面最丰富翱翔于天际唯我独尊的感受！"
      },
      // {
      //   gameCode: "cmf0001",
      //   name: "龙珠捕鱼",
      //   code: "AT",
      //   image: "at",
      //   message:
      //     "ICONIC GAMING主打的龙珠捕鱼，是一款具有3种精致场景和高赔率的热门射击游戏。 可爱逗趣的海底生物、特殊累积机制、5种随机倍数奖励，丰富的视觉效果带来前所未有的乐趣。"
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
      //   gameCode: "F-SF01",
      //   name: "SG捕鱼天王",
      //   code: "SG",
      //   image: "sg",
      //   message: "全新鱼种与创新玩法，搭配丰富游戏场景， 享受全屏激战，满屏爆金的震撼体验。"
      // }
    ]);
    const selectedPlat = ref(platforms.value[0].code);
    const clickPlat = (plat) => {
      selectedPlat.value = plat.code;
    };

    const openGame = (gameName, code, gameCode) => {
      fishingGame.value.open(gameName, code, gameCode);
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
    };
  }
});
</script>

<style scoped lang="scss">
// dy-fish
.game-container {
  // height: 902px;
  height: 85vh;
  // padding-top: 120px;
  z-index: 2;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-image: url(../assets/fishing/bg.jpg);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  margin-left: auto;
  margin-right: auto;
}

.game-container .play-box {
  // position: absolute;
  // left: 10%;
  z-index: 3;
  margin: auto;
}

.game-content {
  padding: 131px 25px 0px;
  width: 1215px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
  z-index: 1;
  margin-left: auto;
  margin-right: auto;
}

.fish1 {
  background-image: url(../assets/fishing/fish-1.png);
  width: 281px;
  height: 327px;
  background-repeat: no-repeat;
  background-position: center top;
}

.fish2 {
  background-image: url(../assets/fishing/fish-2.png);
  width: 295px;
  height: 293px;
  background-repeat: no-repeat;
  background-position: center top;
}

.fish3 {
  background-image: url(../assets/fishing/fish-3.png);
  width: 265px;
  height: 273px;
  background-repeat: no-repeat;
  background-position: center top;
}

.fish4 {
  background-image: url(../assets/fishing/fish-4.png);
  width: 277px;
  height: 261px;
  background-repeat: no-repeat;
  background-position: center top;
}

.fish5 {
  background-image: url(../assets/fishing/fish-5.png);
  width: 295px;
  height: 293px;
  background-repeat: no-repeat;
  background-position: center top;
}

.fish6 {
  background-image: url(../assets/fishing/fish-6.png);
  width: 281px;
  height: 327px;
  background-repeat: no-repeat;
  background-position: center top;
}

.icg-fish-lz {
  background-image: url(../assets/fishing/icg_fish_lz.png);
  width: 295px;
  height: 293px;
  background-repeat: no-repeat;
  background-position: center top;
}

.at-fish-lz {
  background-image: url(../assets/fishing/at_fish_lz.png);
  width: 295px;
  height: 293px;
  background-repeat: no-repeat;
  background-position: center top;
}

.icg-fish-ms {
  background-image: url(../assets/fishing/icg_fish_ms.png);
  width: 295px;
  height: 293px;
  background-repeat: no-repeat;
  background-position: center top;
}

.fish-begin {
  background-image: url(../assets/fishing/begin.png);
  width: 204px;
  height: 115px;
  background-repeat: no-repeat;
  background-position: bottom;
  border: 0;
  background-color: transparent;
  cursor: pointer;
}

.fish-begin:hover {
  background-image: url(../assets/fishing/begin-hover.png);
}

.game-btn {
  padding-left: 12px;
  padding-right: 25px;
  position: relative;
  top: -8px;
  width: 1245px;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;

  margin-left: auto;
  margin-right: auto;
}

.bubble-wrapper {
  position: absolute;
  left: 0;
  top: 120px;
  width: 100%;
  height: 100%;
}

.game-container .fish-box {
  position: absolute;
  height: 146px;
}

.game-container .swim-fish {
  height: 100%;
  -webkit-animation: fish-swim 1.33s steps(1) 0s infinite both;
  animation: fish-swim 1.33s steps(1) 0s infinite both;
}

.game-container .fish-box-1 {
  width: 205px;
  top: 320px;
  right: -1500px;
}

.game-container .swim-fish-1 {
  background: url(../assets/fishing/fish1.png);
}

.game-container .fish-box-2 {
  width: 226px;
  top: 520px;
  left: -300px;
}

.game-container .swim-fish-2 {
  background: url(../assets/fishing/fish2.png);
}

.game-container .fish-box-3 {
  width: 180px;
  top: 170px;
  left: -1300px;
}

.game-container .swim-fish-3 {
  background: url(../assets/fishing/fish3.png);
}

.game-container .fish-box-4 {
  width: 226px;
  top: 720px;
  right: -300px;
}

.game-container .swim-fish-4 {
  background: url(../assets/fishing/fish4.png);
}

@keyframes fish-swim {
  0% {
    background-position: 0 0;
  }
  6.25% {
    background-position: -100% 0;
  }
  12.5% {
    background-position: -200% 0;
  }
  18.75% {
    background-position: -300% 0;
  }
  25% {
    background-position: -400% 0;
  }
  31.25% {
    background-position: -500% 0;
  }
  37.5% {
    background-position: -600% 0;
  }
  43.75% {
    background-position: -700% 0;
  }
  50% {
    background-position: 0 -100%;
  }
  56.25% {
    background-position: -100% -100%;
  }
  62.5% {
    background-position: -200% -100%;
  }
  68.75% {
    background-position: -300% -100%;
  }
  75% {
    background-position: -400% -100%;
  }
  81.25% {
    background-position: -500% -100%;
  }
  87.5% {
    background-position: -600% -100%;
  }
  93.75% {
    background-position: -700% -100%;
  }
  100% {
    background-position: 0 0;
  }
}

.mirror-rotate {
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
}
</style>
