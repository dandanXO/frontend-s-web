<template>
    <img v-if="props?.isLoadingRanking" style="width: 100px;margin: 50px auto;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/podium-loader.gif" />
    <div class="podium" v-else-if="props?.rankingList?.length > 0">
        <div class="confetti">
            <div class="confetti-piece" v-for="n in confettiCount" :key="n"></div>
        </div>

        <div class="podium-silver">
            <div class="left-wing" />
            <div class="id-and-prize">
                <div class="id">{{ rankingList[1].loginName }}</div>
                <div class="prize">{{ rankingList[1].amount }}</div>
            </div>
            <div class="right-wing" />
        </div>

        <div class="podium-gold">
            <div class="left-wing" />
            <div class="id-and-prize">
                <div class="id">{{ rankingList[0].loginName }}</div>
                <div class="prize">{{ rankingList[0].amount }}</div>
            </div>
            <div class="right-wing" />
        </div>

        <div class="podium-bronze">
            <div class="left-wing" />
            <div class="id-and-prize">
                <div class="id">{{ rankingList[2].loginName }}</div>
                <div class="prize">{{ rankingList[2].amount }}</div>
            </div>
            <div class="right-wing" />
        </div>
    </div>
</template>
<script setup>

import { ref, onMounted, watch } from 'vue';
const confettiCount = 20;

const props = defineProps(['rankingList', 'isLoadingRanking']);

</script>
<style lang="scss" scoped>
.podium {
    background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/podium.png') no-repeat center center;
    aspect-ratio: 1020/416;
    background-size: 100% 100%;
    position: relative;
    font-family: 'Poppins';
    letter-spacing: -1px;
    min-height: 152px;

    .podium-silver {
        background-size: 100% 100%;
        position: absolute;
        top: 85%;
        left: 19.5%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/silver-left-wing.png') no-repeat center center;
            aspect-ratio: 66/93;
            background-size: 100% 100%;
            min-height: 30px;
            min-width: 21px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/silver-right-wing.png') no-repeat center center;
            aspect-ratio: 66/93;
            background-size: 100% 100%;
            min-height: 30px;
            min-width: 21px;
        }
    }

    .podium-gold {
        background-size: 100% 100%;
        position: absolute;
        top: 77%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0px;
        font-size: 13px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/gold-left-wing.png') no-repeat center center;
            aspect-ratio: 90/141;
            background-size: 100% 100%;
            min-width: 25px;
            min-height: 40px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/gold-right-wing.png') no-repeat center center;
            aspect-ratio: 90/141;
            background-size: 100% 100%;
            min-width: 25px;
            min-height: 40px;
        }
    }

    .podium-bronze {
        background-size: 100% 100%;
        position: absolute;
        top: 85%;
        left: 80%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/bronze-left-wing.png') no-repeat center center;
            aspect-ratio: 63/90;
            background-size: 100% 100%;
            min-width: 21px;
            min-height: 30px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/bronze-right-wing.png') no-repeat center center;
            aspect-ratio: 63/90;
            background-size: 100% 100%;
            min-width: 21px;
            min-height: 30px;
        }
    }
}

$yellow: #ffd300;
$blue: #17d3ff;
$pink: #ff4e91;

$duration: 3000;

@function randomNum($min, $max) {
  $rand: random();
  $randomNum: $min + floor($rand * (($max - $min) + 1));

  @return $randomNum;
}


.confetti {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  width: 6px;
  height: 12px;
  background: $yellow;
  top: 0;
  opacity: 0;
  
  @for $i from 1 through 13 {
    &:nth-child(#{$i}) {
      left: $i * 7%;
      transform: rotate(#{randomNum(-80, 80)}deg);
      animation: makeItRain $duration * 1ms infinite ease-out;
      animation-delay: #{randomNum(0, $duration * .5)}ms;
      animation-duration: #{randomNum($duration * .7, $duration * 1.2)}ms
    }
  }
  
  &:nth-child(odd) {
    background: $blue;
  }
  
  &:nth-child(even) {
    z-index: 1;
  }
  
  &:nth-child(4n) {
    width: 5px;
    height: 12px;
    animation-duration: $duration * 2ms;
  }
  
  &:nth-child(3n) {
    width: 3px;
    height: 10px;
    animation-duration: $duration * 2.5ms;
    animation-delay: $duration * 1ms;
  }
  
  &:nth-child(4n-7) {
    background: $pink;
  }
}

@keyframes makeItRain {
  from {
    opacity: 0;
  }
  
  50% {
    opacity: 1;
  }
  
  to {
    transform: translateY(200px);
  }
}

@keyframes wiggle {
  0% {transform: rotate(10deg);}
  25% {transform: rotate(-10deg);}
  50% {transform: rotate(20deg);}
  75% {transform: rotate(-5deg);}
  100% {transform: rotate(0deg);}
}

@media (max-width: 400px) {
  .podium {
    .podium-silver, .podium-bronze, .podium-gold {
      font-size: 12px;
      letter-spacing: -1px;
      .left-wing, .right-wing {
        min-height: 30px;
      }
    }
  }
}

@media (max-width: 350px) {
  .podium {
    .podium-silver, .podium-bronze, .podium-gold {
      font-size: 10px;
      letter-spacing: -1px;
      .left-wing, .right-wing {
        min-height: 20px;
      }
    }
  }
}
</style>