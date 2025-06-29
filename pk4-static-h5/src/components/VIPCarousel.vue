<template>
  <div class="valid-bet-div">
    {{ $t("vip.currentValidBets") }}: {{ store.currency.value }}&nbsp;
    <span>{{ store.getCurrentValidBet() }}</span>
  </div>

  <Carousel
    ref="vipCarouselRef"
    :items-to-show="1"
    :wrap-around="false"
    :snapAlign="'start'"
    v-model="vipCarouselIndex"
  >
    <Slide v-for="(vip, vipIndex) in filteredVipItems" :key="vipIndex">
      <div class="carousel__item">
        <div :class="`vipitem vipitem${vip.vipLevel}`">
          <div class="vip-level-header">
            <img :src="require(`../assets/images/vip/badge/viplvl-${vip.vipLevel}.png`)" />
          </div>
          <div v-if="vip.vipLevel !== 12">
            <div class="vip-contents" :style="vip.upgrade === 'Successful deposit' ? 'padding-top: 120px;' : ''">
              <div class="upgrade-requirements" v-if="vipIndex !== vipItems.length - 1">
                {{ $t("vip.accumulateDeposit") }}
                {{ props.onlyShowCurrentLevel ? vipItems[vip.vipLevel + 1].ugprade : vipItems[vipIndex + 1].ugprade }}
                <!-- {{ convertToCommaAmount(store.levelUpDeposit, null, 0) }} -->
              </div>

              <div class="progress-bar-container">
                <div class="progress-bar-outer-bar" v-if="vipIndex !== vipItems.length - 1">
                  <!-- <span class="progress-bar-label">{{ currentVipLevelStats.progressBarText }}</span> -->

                  <div class="progress-bar-inner-bar" :style="{ width: currentVipLevelStats.levelUpPercentage + '%' }">
                    <div class="progress-bar-inner-bar-endpoint-circle">
                      <div class="progress-bar-inner-bar-endpoint-circle__outer">
                        <div class="progress-bar-inner-bar-endpoint-circle__inner"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="progress-bar-endpoint-label">
                  {{ `VIP${+vip.vipLevel}` }}
                </div>

                <div class="progress-bar-endpoint-label">
                  <template v-if="vipItems.length - 1 !== vip.vipLevel">
                    {{ `VIP${vip.vipLevel + 1}` }}
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>
    <template #addons>
      <Navigation />
    </template>
  </Carousel>
</template>
<script setup>
import { defineModel, watch, onMounted, ref, computed, nextTick } from "vue";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { convertToCommaAmount } from "src/boot/utils";

const props = defineProps({
  onlyShowCurrentLevel: {
    type: Boolean,
    default: false // Set default value to false
  }
});

// Use `defineModel` to make `vipCarouselIndex` reactive
const vipCarouselIndex = defineModel("vipCarouselIndex", { type: Number });

// Filter the items based on the current level
const filteredVipItems = computed(() => {
  if (props.onlyShowCurrentLevel) {
    return vipItems.filter((vip) => vip.vipLevel === vipLevel.value);
  }
  return vipItems;
});
const store = userStore();
const { t } = useI18n();
const $q = useQuasar();
const vipCarouselRef = ref();
const vipLevel = ref("");
const currentVipLevelStats = ref({
  levelUpPercentage: null,
  progressBarText: "",
  levelUpgrade: null,
  monthlyReward: null,
  dailyWithdrawalLimit: null,
  rewardUnlocked: false
});
const rows = [
  {
    name: "VIP 0",
    ugprade: "0",
    reward: "3",
    flow: "0",
    invitee: 0,
    extrareward: 0
  },
  {
    name: "VIP 1",
    ugprade: "15,000",
    reward: "3",
    flow: "38",
    invitee: 3,
    extrareward: 100
  },
  {
    name: "VIP 2",
    ugprade: "30,000",
    reward: "3",
    flow: "88",
    invitee: 5,
    extrareward: 200
  },
  {
    name: "VIP 3",
    ugprade: "60,000",
    reward: "3",
    flow: "188",
    invitee: 10,
    extrareward: 300
  },
  {
    name: "VIP 4",
    ugprade: "150,000",
    reward: "4",
    flow: "388",
    invitee: 20,
    extrareward: 400
  },
  {
    name: "VIP 5",
    ugprade: "300,000",
    reward: "5",
    flow: "588",
    invitee: 30,
    extrareward: 500
  },
  {
    name: "VIP 6",
    ugprade: "600,000",
    reward: "6",
    flow: "888",
    invitee: 40,
    extrareward: 600
  },
  {
    name: "VIP 7",
    ugprade: "1,500,000",
    reward: "7",
    flow: "1,888",
    invitee: 50,
    extrareward: 700
  },
  {
    name: "VIP 8",
    ugprade: "3,000,000",
    reward: "8",
    flow: "3,888",
    invitee: 60,
    extrareward: 800
  },
  {
    name: "VIP 9",
    ugprade: "6,000,000",
    reward: "9",
    flow: "8,888",
    invitee: 70,
    extrareward: 900
  },
  {
    name: "VIP 10",
    ugprade: "15,000,000",
    reward: "10",
    flow: "28,888",
    invitee: 80,
    extrareward: 1000
  },
  {
    name: "VIP 11",
    ugprade: "30,000,000",
    reward: t("vip.unlimited"),
    flow: "58,888",
    invitee: 90,
    extrareward: "1,188"
  },
  {
    name: "VIP 12",
    ugprade: "60,000,000",
    reward: t("vip.unlimited"),
    flow: "88,888",
    invitee: 100,
    extrareward: "2,888"
  }
];
// row3 : Level Up Bonus.
const rows3 = [
  {
    name: "VIP 1",
    ugprade: "20",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "25",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "50",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "100",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "200",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "300",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "1,000",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "2,000",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "3,000",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "10,000",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "20,000",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "30,000",
    flow: "x10"
  }
];

const columns4 = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "ugprade", label: "Monthly Cumulative Deposit An Upgrade Vip Level", field: "ugprade", align: "right" }
];
//row4 : Monthly Reward.
const rows4 = [
  {
    name: "VIP 1",
    ugprade: "38",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "88",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "188",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "388",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "588",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "888",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "1,888",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "3,888",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "8,888",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "28,888",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "58,888",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "88,888",
    flow: "x10"
  }
];

const { vipItems, lastVipLevel } = rows.reduce(
  (acc, { name: vipName, ugprade: upgradeRequirement }) => {
    const vipLevelStr = vipName.replace("VIP ", "");
    const vipLevelNum = Number(vipLevelStr);

    return {
      ...acc,
      vipItems: [
        ...acc.vipItems,
        {
          vipLevel: vipLevelNum,
          ugprade: upgradeRequirement
        }
      ],
      lastVipLevel: vipLevelNum
    };
  },
  {
    lastVipLevel: "",
    vipItems: []
  }
);
watch(
  () => vipCarouselIndex.value || props.isShowCurrentLevel,
  async () => {
    await nextTick();
    if (vipCarouselIndex.value === 12) {
      return;
    }
    const carouselVipLevel =
      vipCarouselIndex.value === vipCarouselRef.value && vipCarouselRef.value.data.maxSlide.value
        ? 12
        : Math.round(vipCarouselIndex.value || 0) + 1;
    console.log(carouselVipLevel);
    const levelUpgrade = rows3.find(({ name }) => name === `VIP ${carouselVipLevel}`).ugprade;
    const monthlyReward = rows4.find(({ name }) => name === `VIP ${carouselVipLevel}`).ugprade;
    const dailyWithdrawalLimit = rows.find(({ name }) => name === `VIP ${carouselVipLevel}`).ugprade;

    const vipInfo = vipItems.find(({ vipLevel }) => vipLevel === carouselVipLevel);
    const vipLevel = Number(store.vip.replace("VIP", ""));
    const currentDeposit = Number(store.getCurrentDeposit());
    const currentValidBet = Number(store.getCurrentValidBet());
    const upgradeStatus = vipInfo.ugprade;
    const levelUpDeposit = +upgradeStatus.replace(/,/g, "");

    const levelUpPercentage = (() => {
      // if (vipLevel === 0) {
      //   return 0;
      // }
      if (vipLevel + 1 > +vipInfo.vipLevel) {
        return 100;
      }

      const percentage = (currentDeposit / levelUpDeposit) * 100;
      if (percentage >= 100) return 100;
      return percentage;
    })();

    // alert(vipLevel);
    // alert(vipCarouselIndex.value);
    let progressBarText = `${currentDeposit} / ${levelUpDeposit}`;
    if (vipLevel + 1 > +vipInfo.vipLevel) {
      progressBarText = ` ${levelUpDeposit} /  ${levelUpDeposit}`;
    }
    currentVipLevelStats.value = {
      levelUpgrade,
      monthlyReward,
      dailyWithdrawalLimit,
      levelUpPercentage,
      progressBarText: progressBarText,
      rewardUnlocked: vipLevel > vipCarouselIndex.value
    };
  },
  { immediate: true }
);

onMounted(() => {
  store.getMemberInfo().then(() => {
    const vipLevelNum = Number(store.vip.replace("VIP", ""));
    vipLevel.value = vipLevelNum;

    // if vip0, show vip1 slide
    if (vipLevelNum === 0) {
      vipCarouselIndex.value = vipLevelNum;
    }
    // if vip level higher than existing info available, show last vip level slide
    else if (vipLevelNum > lastVipLevel) {
      // carousel index starts from 0, thus any vip level will require minus 1 for slide index to show correctly
      vipCarouselIndex.value = lastVipLevel - 1;
    }
    // show vip slide correspond to current vip level
    else {
      // carousel index starts from 0, thus any vip level will require minus 1 for slide index to show correctly
      vipCarouselIndex.value = vipLevelNum;
    }

    vipCarouselRef.value.data.currentSlide.value = vipCarouselIndex.value;
  });
});
</script>

<style lang="scss" scoped>
$colors: (
  #072569,
  #523014,
  #780f70,
  #be2526,
  #076b0a,
  #172266,
  #5a0c3a,
  #4b6b7a,
  #230e6b,
  #6e191a,
  #0a1d5c,
  #2a161b,
  #523014
);
@for $i from 0 through length($colors) - 1 {
  .vipitem#{$i} {
    .progress-bar-container {
      color: nth($colors, $i + 1);
    }
    .upgrade-requirements {
      color: rgba(nth($colors, $i + 1), 0.6);
    }
  }
}

$gradients: (
  linear-gradient(90deg, #9ec2fa 0%, #4077de 100%),
  linear-gradient(90deg, #e5b888 0%, #b08240 100%),
  linear-gradient(90deg, #e268d9 0%, #780f70 100%),
  linear-gradient(90deg, #ff5f60 0%, #ae0536 100%),
  linear-gradient(90deg, #35a042 0%, #7ee98b 100%),
  linear-gradient(90deg, #121f55 0%, #6e91f6 100%),
  linear-gradient(90deg, #f534a5 0%, #ffa2d9 100%),
  linear-gradient(90deg, #4b6b7a 0%, #c5ddff 100%),
  linear-gradient(90deg, #f330d7 0%, #8448ff 100%),
  linear-gradient(90deg, #fa5540 0%, #ffa397 100%),
  linear-gradient(90deg, #0a1d5c 0%, #8c52d5 100%),
  linear-gradient(90deg, #ad95b5 0%, #2a161b 100%),
  linear-gradient(90deg, #0e9bef 0%, #977fb2 100%)
);

@for $i from 0 through length($gradients) - 1 {
  .vipitem#{$i} {
    .progress-bar-inner-bar {
      background: nth($gradients, $i + 1);
    }
  }
}

.valid-bet-div {
  text-align: left;
  width: 100%;
  margin: 8px 20px 0px;
  color: #fff;
  background-color: #56616396;
  width: fit-content;
  padding: 2px 10px;
  border-radius: 10px;

  span {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }
}

.vip-rewards {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 5px;

  .vip-reward-item {
    width: 120px;
    height: 182px;
    background: url("../assets/images/vip/vip-reward-unlock-bg.png") no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
    .reward-desc {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .bold {
        font-weight: 800;
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100px;
        height: 35px;
        width: 35px;
      }

      .title {
        color: #fff;
        font-size: 11px;
        height: 35px;
        line-height: 18px;
      }

      .reward-amt-wrapper {
        background: #ffffff1a;
        padding: 5px 15px;
        max-width: 100px;
        border-radius: 4px;
        font-family: sans-serif;
        font-size: 12px;

        .reward-amt {
          line-height: 12px;
          word-wrap: break-word;
          color: #fff;
        }
      }
    }

    .unlock-status {
      display: flex;
      justify-content: center;
      padding: 10px;

      img {
        max-width: 20px;
      }
    }
  }
}
.vip-contents {
  // color: #ffffff;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .title {
    font-size: 18px;
    line-height: 36px;
  }

  .progress-bar-container {
    display: flex;
    align-items: center;
    gap: 6px;
    position: absolute;
    bottom: 12%;
    left: 6%;
    right: 6%;
    flex-wrap: wrap;
    width: 82%;
    font-weight: bolder;
    font-size: 0.6rem;

    .progress-bar-endpoint-label {
      &:last-child {
        margin-left: auto;
      }
    }

    .progress-bar-outer-bar {
      // border: 1px solid #fff;
      border-radius: 16px;
      background: #282d2e;
      width: 100%;
      // overflow: hidden;
      position: relative;
      height: 8px;

      .progress-bar-label {
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
        color: #fff;
        font-size: 10px;
        margin-top: -2px;
        z-index: 999;
      }
    }
    .progress-bar-inner-bar {
      color: #fff;
      border-radius: 16px;
      // background: linear-gradient(356.25deg, #00430B -0.21%, #00AE00 93.65%);
      height: 8px;
      position: relative;
      // background: #6D96C6;
      // min-width: 12px;
      .progress-bar-inner-bar-endpoint-circle {
        width: 36px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        // background: #6D96C629;
        padding: 12px;
        position: absolute;
        right: -12px;
        top: -12px;
        z-index: 1;
        border-radius: 50%;
        .progress-bar-inner-bar-endpoint-circle__outer {
          // background: #6D96C640;
          width: 100%;
          height: 100%;
          padding: 12px;
          border-radius: 50%;
        }
        .progress-bar-inner-bar-endpoint-circle__inner {
          // background: #6D96C6;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
  }

  .upgrade-requirements {
    position: absolute;
    margin: 10px 0px;
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    font-size: 12px;
    left: 6%;
    bottom: 25%;
    font-size: 0.85rem;
    font-weight: bolder;
    // color: #fff;

    // span {
    //   color: #fff;
    // }
  }
}
.vipitem {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  background-image: url("../assets/images/vip/badge/banner-0.png");
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: 100% 100%;
  // max-width: 346px;
  height: 45vw;
  width: 100%;
  justify-content: flex-end;
  font-size: 12px;
  max-height: 220px;

  &1 {
    background-image: url("../assets/images/vip/badge/banner-1.png");
  }
  &2 {
    background-image: url("../assets/images/vip/badge/banner-2.png");
  }
  &3 {
    background-image: url("../assets/images/vip/badge/banner-3.png");
  }
  &4 {
    background-image: url("../assets/images/vip/badge/banner-4.png");
  }
  &5 {
    background-image: url("../assets/images/vip/badge/banner-5.png");
  }
  &6 {
    background-image: url("../assets/images/vip/badge/banner-6.png");
  }
  &7 {
    background-image: url("../assets/images/vip/badge/banner-7.png");
  }
  &8 {
    background-image: url("../assets/images/vip/badge/banner-8.png");
  }
  &9 {
    background-image: url("../assets/images/vip/badge/banner-9.png");
  }
  &10 {
    background-image: url("../assets/images/vip/badge/banner-10.png");
  }
  &11 {
    background-image: url("../assets/images/vip/badge/banner-11.png");
  }
  &12 {
    background-image: url("../assets/images/vip/badge/banner-12.png");
  }

  .vip-level-header {
    img {
      width: 72px;
    }
    font-family: "Fugaz One";
    font-size: 30px;
    top: 24%;
    left: 6%;
    z-index: 1;
    position: absolute;
    color: #fff;

    // svg {
    //   font-family: Arial;
    //   font-size: 10rem;
    //   font-weight: bold;
    //   position: absolute;
    //   width: 125px;
    //   height: 70px;
    //   right: 0px;
    //   top: 0px;
    // }

    // .svgText {
    //   stroke: white;
    //   stroke-width: 10px;
    //   stroke-linejoin: round;
    //   paint-order: stroke;
    // }
  }
}
</style>

<style lang="scss">
.carousel__item {
  min-height: 170px;
  width: 100%;
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 5px 18px 30px;

  &.carousel__slide--next .vipitem,
  &.carousel__slide--prev .vipitem {
    filter: brightness(0.5);
    height: 150px;
    margin-top: 20px;

    .vip-contents .progress-bar-container .progress-bar-inner-bar {
      height: 8px;
    }
  }
}

.carousel__prev,
.carousel__next {
  display: none;
}

.receive-monthly {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  // padding: 0 12px;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  margin-top: 36px;
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 90px;
  position: relative;
  border-radius: 6px;
  .monthly-img {
    position: absolute;
    top: -30px;
    left: -20px;
  }
  .monthly-txt {
    margin: auto;
  }
  .monthly-btn {
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-radius: 6px;
    font-weight: bold;
    color: #000a01;

    &.disable {
      background: #313131;
      color: #999999;
    }
  }
}

@media (max-width: 480px) {
  .monthly-deposit-table {
    font-size: 10px;

    tbody td {
      font-size: 10px;

      img {
        width: 14px;
      }
    }
  }
}
</style>
