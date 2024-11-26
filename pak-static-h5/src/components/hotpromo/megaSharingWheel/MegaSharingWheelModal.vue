<template>
  <div class="mega-sharing-wheel-modal-outer-wrapper">
    <q-btn
      v-if="showMission"
      class="mega-sharing-wheel-dialog-back"
      icon="chevron_left"
      round
      dense
      @click="handleBackClick"
    />
    <div class="mega-sharing-wheel-modal-wrapper">
      <div class="mega-sharing-wheel-modal__title">
        <span v-if="showMission">{{ $t("hotPromo.megaSharingWheel.missionTitle") }}</span>
        <span v-else>{{ $t("hotPromo.megaSharingWheel.wheelTitle") }}</span>
      </div>
      <div v-if="!showMission">
        <div class="controller-wrapper">
          <slot name="controller" />
        </div>
        <div class="mega-sharing-wheel-modal__time-limit-wrapper">
          <img src="../../../assets/images/promotion/hotpromo/mega-sharing-spin-wheel/clock.svg" />
          <span>{{ $t("hotPromo.megaSharingWheel.timeLimited") }}</span>
          <div
            v-for="(item, index) in remainingTime"
            :key="index"
            class="mega-sharing-wheel-modal__time-limit-item-wrapper"
          >
            <div class="mega-sharing-wheel-modal__time-limit-value">
              {{ item.value }}
            </div>
            <span class="mega-sharing-wheel-modal__time-limit-label">{{ item.label }}</span>
          </div>
        </div>
        <div class="mega-sharing-wheel-modal__spin-wrapper">
          <img
            class="mega-sharing-wheel-modal__spin-glow"
            src="../../../assets/images/promotion/hotpromo/mega-sharing-spin-wheel/spin-wheel-glow.png"
            :style="{ marginLeft: glowDrift }"
          />
          <MegaSharingWheel />
        </div>
        <div class="progress-bar">
          <ProgressBar :progress="50" />
        </div>
        <div class="mega-sharing-wheel-modal__winner-wrapper">
          <div class="mega-sharing-wheel-modal__winner-bg top" />
          <img
            class="mega-sharing-wheel-modal__winner-decoration"
            src="../../../assets/images/promotion/hotpromo/mega-sharing-spin-wheel/winner-decoration.png"
          />
          <div ref="winnerContainerRef" class="mega-sharing-wheel-modal__winner-list">
            <div v-for="(winner, index) in mockWinners" :key="index" class="mega-sharing-wheel-modal__winner-item">
              <span>{{ winner.name }}</span>
              <span class="prize">{{ winner.prize }}</span>
            </div>
          </div>
          <div class="mega-sharing-wheel-modal__winner-bg bottom" />
        </div>
      </div>
      <MissionTab v-else />
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import MegaSharingWheel from "./MegaSharingWheel.vue";
import moment from "moment";
import { useI18n } from "vue-i18n";
import { useWindowSize } from "@vueuse/core";
import ProgressBar from "./ProgressBar.vue";
import MissionTab from "./MissionTab.vue";

const mockWinners = [
  { name: "032***2", prize: "Rs88888" },
  { name: "034***5", prize: "Rs188" },
  { name: "036***8", prize: "Rs8888" },
  { name: "038***1", prize: "Rs888" },
  { name: "040***4", prize: "Rs1888" },
  { name: "042***7", prize: "Rs88888" },
  { name: "044***0", prize: "Rs888" },
  { name: "046***3", prize: "Rs288888" },
  { name: "048***6", prize: "Rs8888" },
  { name: "050***9", prize: "iPhone 16 Pro Max" }
];

const { t } = useI18n();
const { width } = useWindowSize();

const showMission = ref(false);
const now = ref(Date.now());
const dateTimer = ref();
const winnerTimer = ref();
const winnerContainerRef = ref();

const remainingTime = computed(() => {
  const startTime = moment(now.value);
  const endTime = moment("2024/12/31 00:00:00");
  const duration = moment.duration(endTime.diff(startTime));
  return [
    {
      label: t("hotPromo.megaSharingWheel.day"),
      value: duration.days()
    },
    {
      label: t("hotPromo.megaSharingWheel.hour"),
      value: duration.hours()
    },
    {
      label: t("hotPromo.megaSharingWheel.minute"),
      value: duration.minutes()
    },
    {
      label: t("hotPromo.megaSharingWheel.second"),
      value: duration.seconds()
    }
  ];
});

const glowDrift = computed(() => {
  if (width.value >= 550) return "0px";
  return width.value * 0.59 - 320 + "px";
});

const handleBackClick = () => {
  showMission.value = false;
};

onMounted(() => {
  dateTimer.value = setInterval(() => {
    now.value = Date.now();
  }, 1000);

  let scrollPosition = 0;

  winnerTimer.value = setInterval(() => {
    if (scrollPosition >= winnerContainerRef.value.scrollHeight) {
      scrollPosition = 0;
    } else {
      scrollPosition += 43;
    }

    winnerContainerRef.value.scrollTo({
      top: scrollPosition,
      behavior: "smooth"
    });
  }, 2000);
});

onUnmounted(() => {
  dateTimer.value && clearInterval(dateTimer.value);
  winnerTimer.value && clearInterval(winnerTimer.value);
});
</script>
<style lang="scss" scoped>
.mega-sharing-wheel-modal-wrapper {
  max-width: 550px;
  margin: 0 auto;
  overflow-x: hidden;
  min-height: calc(100vh - 108px);
  position: relative;
  .mega-sharing-wheel-modal__title {
    position: relative;
    background: url(../../../assets/images/promotion/hotpromo/mega-sharing-spin-wheel/title.png) no-repeat;
    background-size: cover;
    aspect-ratio: 272/138;
    margin: 0 auto 12px;
    width: 100%;
    max-width: 272px;

    span {
      position: absolute;
      width: 100%;
      bottom: 10px;
      font-size: 18px;
      line-height: 24px;
      font-weight: 700;
      text-align: center;
    }
  }
  .controller-wrapper {
    width: fit-content;
    margin: 0 auto 12px;
  }
  .mega-sharing-wheel-modal__time-limit-wrapper {
    display: flex;
    // align-items: center;
    justify-content: center;
    gap: 10px;
    font-weight: 700;
    margin-bottom: 12px;

    img {
      align-self: flex-start;
    }

    .mega-sharing-wheel-modal__time-limit-item-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      width: 30px;

      .mega-sharing-wheel-modal__time-limit-value {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background-color: #24283b;
        background-clip: border-box;
        border: 1px solid #ffffffcc;
        border-radius: 4px;
        font-size: 14px;
        line-height: 24px;
      }
      .mega-sharing-wheel-modal__time-limit-label {
        font-size: 10px;
        line-height: 22px;
        font-weight: 300;
      }
      &:nth-child(4),
      &:nth-child(5) {
        &::after {
          content: ":";
          display: block;
          position: absolute;
          right: -8px;
          font-size: 14px;
          line-height: 24px;
          font-weight: 700;
        }
      }
    }
  }

  .mega-sharing-wheel-modal__spin-wrapper {
    position: relative;
    overflow: visible;
    .mega-sharing-wheel-modal__spin-glow {
      position: absolute;
      animation: spin 5s linear infinite;
      width: 550px;
      top: -130px;
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: -1;
    }
  }
}

.progress-bar {
  max-width: 75%;
  margin: 0 auto;
}

.mega-sharing-wheel-modal__winner-wrapper {
  position: relative;
  aspect-ratio: 331/163;
  width: 100%;
  max-width: 80%;
  margin: 0 auto;
  background-size: cover;
  .mega-sharing-wheel-modal__winner-decoration {
    position: absolute;
    max-width: 44px;
    top: 0;
    left: 0;
  }
  .mega-sharing-wheel-modal__winner-bg {
    aspect-ratio: 340/36;
    width: 100%;
    &.top {
      background: url(../../../assets/images/promotion/hotpromo/mega-sharing-spin-wheel/winner-bg-top.png) no-repeat;
      background-size: cover;
    }
    &.bottom {
      background: url(../../../assets/images/promotion/hotpromo/mega-sharing-spin-wheel/winner-bg-bottom.png) no-repeat;
      background-size: cover;
    }
  }
  .mega-sharing-wheel-modal__winner-list {
    width: 100%;
    height: 128px;
    background: url(../../../assets/images/promotion/hotpromo/mega-sharing-spin-wheel/winner-bg-center.png) repeat-y;
    background-size: 100% auto;
    padding: 0 30px 0 40px;
    top: 10%;
    overflow-y: auto;
    pointer-events: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .mega-sharing-wheel-modal__winner-item {
      height: 43px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      line-height: 18px;
      font-weight: 700;
      color: #fff;
      border-bottom: 1px solid #ffffff1a;
      .prize {
        font-size: 14px;
        line-height: 21px;
        color: #fff96f;
      }
    }
  }
}

.mega-sharing-wheel-dialog-back {
  position: absolute;
  left: 40px;
  top: 40px;
  border: 1px solid #ffffff;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
