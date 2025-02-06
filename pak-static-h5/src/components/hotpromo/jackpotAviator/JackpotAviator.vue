<template>
    <template v-if="mode === 'MAIN'">
        <div class="jackpot">
            <div class="jackpot-plate">
                <svg class="jackpot-number" data-v-40789f9c="" xmlns="http://www.w3.org/2000/svg" width="150" height="35" viewBox="0 0 150 35">
                <text data-v-40789f9c="" x="10" y="20">298,360,000</text>
            </svg>
            </div>
                
            <div class="rules-ribbon" @click="mode = 'RULES'">{{ $t('hotPromo.jackpotAviator.rules') }}</div>
            <div class="history-ribbon" @click="isShowHistoryPopup = true">{{ $t('hotPromo.jackpotAviator.history') }}</div>
        </div>

        <div class="receive-btn">
            {{ $t('hotPromo.jackpotAviator.receive') }}
        </div>

        <div class="podium">
            <div class="confetti">
                <div class="confetti-piece" v-for="n in confettiCount" :key="n"></div>
            </div>

            <div class="podium-silver">
                <div class="left-wing" />
                <div class="id-and-prize">
                    <div class="id">{{ history[1].username }}</div>
                    <div class="prize">{{ history[1].betVolume }}</div>
                </div>
                <div class="right-wing" />
            </div>

            <div class="podium-gold">
                <div class="left-wing" />
                <div class="id-and-prize">
                    <div class="id">{{ history[0].username }}</div>
                    <div class="prize">{{ history[0].betVolume }}</div>
                </div>
                <div class="right-wing" />
            </div>

            <div class="podium-bronze">
                <div class="left-wing" />
                <div class="id-and-prize">
                    <div class="id">{{ history[2].username }}</div>
                    <div class="prize">{{ history[2].betVolume }}</div>
                </div>
                <div class="right-wing" />
            </div>
        </div>

        <div class="ranking">
            <div class="item">
                <div>{{ $t('hotPromo.jackpotAviator.ranking') }}</div>
                <div>{{ $t('hotPromo.jackpotAviator.username') }}</div>
                <div>{{ $t('hotPromo.jackpotAviator.betVolume') }}</div>
            </div>

            <div class="item" v-for="historyItem in history" :key="historyItem.rank">
                <div>{{ historyItem.rank }}</div>
                <div>{{ historyItem.username }}</div>
                <div>{{ historyItem.betVolume }}</div>
            </div>
        </div>

        <div class="bottom">
            <div>-No rank</div>
            <div class="column">
                <div class="label">My Bets <span class="value">0</span></div>
                <div class="label">My Reward 0%</div>
            </div>
            <div class="column">
                <div >Ranks Left</div>
                <div>888888</div>
            </div>
        </div>
    </template>
    <template v-else-if="mode === 'RULES'">
        <JackpotAviatorRules :onClickBackBtn="() => mode = 'MAIN'"/>
    </template>

    <q-dialog width="100%" v-model="isShowHistoryPopup">
        <div class="history-container">
            <div class="congrats-highlight">
                <div class="congrats-title">Jackpot</div>
                <div class="congrats-prize">80888PRK</div>
            </div>

            <div class="ranking">
            <div class="item">
                <div>{{ $t('hotPromo.jackpotAviator.rank') }}</div>
                <div>{{ $t('hotPromo.jackpotAviator.dailyOrWeekly') }}</div>
            </div>

            <div class="item" v-for="rnp in ranksAndPercentages" :key="rnp.rank">
                <div class="rank">
                    <img v-if="rnp.rank === '1'" style="width:35px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/1st-place-crown.png" />
                    <img v-else-if="rnp.rank === '2'" style="width:35px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/2nd-place-crown.png" />
                    <img v-else-if="rnp.rank === '3'" style="width:35px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/3rd-place-crown.png" />
                    <span v-else>{{ rnp.rank }}</span>
                </div>
                <div>{{ rnp.percent }}</div>
            </div>
        </div>
        </div>
    </q-dialog>

</template>
<script setup>
import { ref } from 'vue';
import JackpotAviatorRules from './JackpotAviatorRules.vue';

const confettiCount = 20;
const mode = ref('MAIN');
const isShowHistoryPopup = ref(false);
const history = ref([
  { rank: "1", username: "*****21", betVolume: "11111.00" },
  { rank: "2", username: "*****22", betVolume: "222.00" },
  { rank: "3", username: "*****23", betVolume: "33.00" },
  { rank: "4", username: "*****20", betVolume: "88.00" },
  { rank: "5", username: "*****20", betVolume: "777.00" },
  { rank: "6", username: "*****20", betVolume: "666.00" },
  { rank: "7", username: "*****20", betVolume: "555.00" },
  { rank: "8", username: "*****20", betVolume: "444.00" },
  { rank: "9", username: "*****20", betVolume: "333.00" },
  { rank: "10", username: "*****20", betVolume: "222.00" },
  { rank: "11", username: "*****20", betVolume: "111.00" },
  { rank: "12", username: "*****20", betVolume: "3500.00" },
  { rank: "13", username: "*****20", betVolume: "3500.00" }
]);

const ranksAndPercentages = ref([
    { rank: "1", percent: "9.50%" },
    { rank: "2", percent: "6.00%" },
    { rank: "3", percent: "4.50%" },
    { rank: "4", percent: "2.97%" },
    { rank: "5", percent: "2.34%" },
    { rank: "6", percent: "1.92%" },
    { rank: "7", percent: "1.62%" },
    { rank: "8", percent: "1.42%" },
    { rank: "9", percent: "1.30%" },
    { rank: "10", percent: "1.23%" },
    { rank: "11", percent: "1.18%" },
    { rank: "12", percent: "1.15%" },
    { rank: "13", percent: "1.12%" },
    { rank: "14", percent: "1.09%" },
    { rank: "15", percent: "1.06%" },
    { rank: "16", percent: "1.03%" },
    { rank: "17", percent: "1.00%" },
    { rank: "18", percent: "0.97%" },
    { rank: "19", percent: "0.94%" },
    { rank: "20", percent: "0.91%" },
    { rank: "21", percent: "0.89%" },
    { rank: "22", percent: "0.87%" },
    { rank: "23", percent: "0.85%" },
    { rank: "24", percent: "0.83%" },
    { rank: "25", percent: "0.81%" },
    { rank: "26", percent: "0.79%" },
    { rank: "27", percent: "0.77%" },
    { rank: "28", percent: "0.75%" },
    { rank: "29", percent: "0.73%" },
    { rank: "30", percent: "0.71%" },
    { rank: "31", percent: "0.69%" },
    { rank: "32", percent: "0.67%" },
    { rank: "33", percent: "0.65%" },
    { rank: "34", percent: "0.63%" },
    { rank: "35", percent: "0.61%" },
    { rank: "36", percent: "0.59%" },
    { rank: "37", percent: "0.57%" },
    { rank: "38", percent: "0.55%" },
    { rank: "39", percent: "0.53%" },
    { rank: "40", percent: "0.51%" },
    { rank: "41", percent: "0.49%" },
    { rank: "42", percent: "0.47%" },
    { rank: "43", percent: "0.45%" },
    { rank: "44", percent: "0.43%" },
    { rank: "45", percent: "0.41%" },
    { rank: "46", percent: "0.39%" },
    { rank: "47", percent: "0.37%" },
    { rank: "48", percent: "0.35%" },
    { rank: "49", percent: "0.33%" },
    { rank: "50", percent: "0.31%" },
    { rank: "51-55", percent: "1.45%" },
    { rank: "56-60", percent: "1.40%" },
    { rank: "61-65", percent: "1.35%" },
    { rank: "66-70", percent: "1.30%" },
    { rank: "71-75", percent: "1.25%" },
    { rank: "76-80", percent: "1.20%" },
    { rank: "81-85", percent: "1.15%" },
    { rank: "86-90", percent: "1.10%" },
    { rank: "91-95", percent: "1.05%" },
    { rank: "96-100", percent: "1.00%" },
    { rank: "101-110", percent: "1.90%" },
    { rank: "111-120", percent: "1.80%" },
    { rank: "121-130", percent: "1.70%" },
    { rank: "131-140", percent: "1.60%" },
    { rank: "141-150", percent: "1.50%" },
    { rank: "151-160", percent: "1.40%" },
    { rank: "161-170", percent: "1.30%" },
    { rank: "171-180", percent: "1.20%" },
    { rank: "181-190", percent: "1.10%" },
    { rank: "191-200", percent: "1.00%" },
    { rank: "201-220", percent: "1.80%" },
    { rank: "221-240", percent: "1.60%" },
    { rank: "241-260", percent: "1.40%" },
    { rank: "261-280", percent: "1.20%" },
    { rank: "281-300", percent: "1.00%" },
    { rank: "301-350", percent: "2.00%" },
    { rank: "351-400", percent: "1.50%" },
    { rank: "401-450", percent: "1.00%" },
    { rank: "451-500", percent: "0.50%" }
]);
</script>
<style lang="scss" scoped>
.jackpot {
    background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/jackpot-bg.png') no-repeat center center;
    aspect-ratio: 375/223;
    background-size: 100% 100%;
    position: relative;

    .jackpot-plate {
        background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/jackpot-plate.png') no-repeat center center;
        aspect-ratio: 381/66;
        background-size: 100% 100%;
        width: 35%;
        position: absolute;
        top: 62%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Poppins';

        .jackpot-number {
            transform: rotateX(45deg);

            text {
                fill: #FFF9FF;
                stroke: #1E826A;
                stroke-width: 1;
                margin: 0;
                font-family: 'Poppins';
                font-size: 22px;
                font-weight: bold;
                letter-spacing: -1px;
            }
        }
    }

    .rules-ribbon {
        background-color: #30AF88;
        position: absolute;
        width: 74px;
        height: 23px;
        top: 150px;
        left: -10px;
        padding-left: 10px;
        gap: 5px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .history-ribbon {
        background-color: #30AF88;
        position: absolute;
        width: 74px;
        height: 26px;
        top: 177px;
        left: -10px;
        padding-left: 10px;
        gap: 5px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .rules-ribbon, .history-ribbon {
        cursor: pointer;
        font-family: 'Poppins';

        &:hover {
            filter: brightness(1.1);
        } 
    }
}


.receive-btn {
    background: linear-gradient(180deg, #61FF00 0%, #006DED 100%);
    padding: 20px;
    border-radius: 17px;
    width: 236px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    font-family: Poppins;
    font-size: 16.9px;
    font-weight: 900;
    line-height: 19.16px;
    text-align: center;

}

.podium {
    background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/podium.png') no-repeat center center;
    aspect-ratio: 1020/416;
    background-size: 100% 100%;
    position: relative;
    font-family: 'Poppins';

    .podium-silver {
        background-size: 100% 100%;
        position: absolute;
        top: 80%;
        left: 19.5%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 5px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/silver-left-wing.png') no-repeat center center;
            aspect-ratio: 66/93;
            background-size: 100% 100%;
            min-height: 35px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/silver-right-wing.png') no-repeat center center;
            aspect-ratio: 66/93;
            background-size: 100% 100%;
            min-height: 35px;
        }
    }

    .podium-gold {
        background-size: 100% 100%;
        position: absolute;
        top: 72%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 5px;
        font-size: 15px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/gold-left-wing.png') no-repeat center center;
            aspect-ratio: 90/141;
            background-size: 100% 100%;
            min-height: 45px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/gold-right-wing.png') no-repeat center center;
            aspect-ratio: 90/141;
            background-size: 100% 100%;
            min-height: 45px;
        }
    }

    .podium-bronze {
        background-size: 100% 100%;
        position: absolute;
        top: 80%;
        left: 80%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 5px;

        .left-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/bronze-left-wing.png') no-repeat center center;
            aspect-ratio: 63/90;
            background-size: 100% 100%;
            min-height: 35px;
        }

        .right-wing {
            background: url('../../../assets/images/promotion/hotpromo/jackpot-aviator/bronze-right-wing.png') no-repeat center center;
            aspect-ratio: 63/90;
            background-size: 100% 100%;
            min-height: 35px;
        }
    }
}

.ranking {
    display: flex;
    flex-direction: column;
    margin: 0 10px;
    border-radius: 5px;
    overflow: hidden;
    padding-bottom: 0px;

    .item {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        justify-content: center;
        align-items: center;
        text-align: center;
        height: 40px;

        &:first-child {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 600;
            line-height: 21px;
            text-align: center;

        }

        &:not(:first-child) {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 600;
            line-height: 21px;
            text-align: center;
            color: #FFFFFF80;
        }

        &:nth-child(odd) {
            background-color: #032503;
        }

        &:nth-child(even) {
            background-color: #113810;
        }
    }
}

.bottom {
    background: linear-gradient(180deg, #0D5819 0%, #082A23 100%);
    border: 1px solid #258838;
    color: #FFFFFF;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    height: 77px;
    align-items: center;
    padding: 20px;
    position: fixed;
    bottom: 90px;
    width: 100%;
    font-family: 'Poppins';

    .column {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .label {
        color: #7EC24A;
    }

    .value {
        color: #F1FF55;
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
  height: 200px;
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

.history-container {
    background-color: #113413;
    border: 1px solid #55C253;
    border-radius: 5px;
    width: 90%;

    .congrats-highlight {
        color: #fff96f;
        font-size: 16px;
        text-align: center;
        background-image: url(../../../assets/images/index/modal/congrats-highlight-bg.png);
        padding: 8px 12px;
        background-repeat: no-repeat;
        background-size: 70% 100%;
        background-position: center;
        margin-top: 16px;

        .congrats-title {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 500;
            line-height: 21px;
            text-align: center;
            color: #FFFDC9;
        }

        .congrats-prize {
            font-family: Poppins;
            font-size: 21.03px;
            font-weight: 900;
            line-height: 31.54px;
            text-align: center;
            color: #FFF96F;
        }
    }

    .ranking {
        display: flex;
        flex-direction: column;

        .item {
            display: grid;
            grid-template-columns: 1fr 1fr;
            justify-content: center;
            align-items: center;
            text-align: center;
            height: 40px;

            .rank {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            &:first-child {
                font-family: Manrope;
                font-size: 12px;
                font-weight: 700;
                line-height: 18px;
                text-align: center;
                background: linear-gradient(180deg, #70BC62 0%, #33562D 100%);
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }

            &:last-child {
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }

            &:not(:first-child) {
                font-family: Manrope;
                font-size: 14px;
                font-weight: 700;
                line-height: 14px;
                text-align: center;
            }

            &:nth-child(odd) {
                background-color: #032503;
            }

            &:nth-child(even) {
                background-color: #113810;
            }
        }
    }
}
</style>