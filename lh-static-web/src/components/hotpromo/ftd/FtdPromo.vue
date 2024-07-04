<template>
  <div class="banner-wrapper">
    <img class="genie" src="../../../assets/images/promotion/hotpromo/ftd/genie.png" />
    <div class="genie-ball-wrapper">
      <img class="genie-ball" src="../../../assets/images/promotion/hotpromo/ftd/genie-ball.png" />
      <span class="genie-ball-text">{{ currentType }}</span>
    </div>

    <div class="tab-wrapper">
      <div
        class="tab"
        :class="t === currentType ? 'active-tab' : ''"
        v-for="(t, index) in typesArr"
        @click="switchType(index)"
      >
        {{ t }}首存
      </div>
    </div>
  </div>
  <div class="content-wrapper">
    <div class="second-tab-wrapper">
      <img src="../../../assets/images/promotion/hotpromo/ftd/left-decor.png" />
      <div class="second-tab-content-wrapper" :class="tabArr.length === 1 ? 'mono-tab' : ''">
        <div
          class="tab"
          v-for="(t, index) in tabArr"
          :class="t === currentTab ? 'active-tab' : ''"
          @click="switchTab(index)"
        >
          <span class="tab-label">{{ t }}优惠</span>
        </div>
      </div>
      <img src="../../../assets/images/promotion/hotpromo/ftd/right-decor.png" />
    </div>
    <div class="separator-wrapper">
      <img
        class="separator"
        v-if="currentTab === '首存'"
        src="../../../assets/images/promotion/hotpromo/ftd/first-deposit-separator.png"
      />
      <img
        class="separator"
        v-else-if="currentTab === '复存'"
        src="../../../assets/images/promotion/hotpromo/ftd/consecutive-deposit-separator.png"
      />
    </div>

    <ActionButtons :tab="currentTab" :type="currentType" />

    <SportContent v-if="currentType === '体育'" :tab="currentTab" :type="currentType" />
    <EsportContent v-else-if="currentType === '电竞'" :tab="currentTab" :type="currentType" />
    <LiveContent v-else-if="currentType === '真人'" :tab="currentTab" :type="currentType" />
    <PokerContent v-else-if="currentType === '棋牌'" :tab="currentTab" :type="currentType" />
    <SlotContent v-else-if="currentType === '电子'" :tab="currentTab" :type="currentType" />
    <FishingContent v-else-if="currentType === '捕鱼'" :tab="currentTab" :type="currentType" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SportContent from "./SportContent.vue";
import EsportContent from "./EsportContent.vue";
import LiveContent from "./LiveContent.vue";
import PokerContent from "./PokerContent.vue";
import SlotContent from "./SlotContent.vue";
import FishingContent from "./FishingContent.vue";
import ActionButtons from "./ActionButtons.vue";

const typesArr = ref(["体育", "电竞", "真人", "棋牌", "电子", "捕鱼"]);
const typeIndex = ref(0);
const currentType = computed(() => {
  return typesArr.value[typeIndex.value];
});

const tabArr = computed(() => {
  if (currentType.value === "体育" || currentType.value === "电竞") {
    return ["首存"];
  }

  return ["首存", "复存"];
});
const tabIndex = ref(0);
const currentTab = computed(() => {
  return tabArr.value[tabIndex.value];
});

const switchType = (index) => {
  typeIndex.value = index;
  tabIndex.value = 0;
};

const switchTab = (index) => {
  tabIndex.value = index;
};
</script>

<style lang="scss" scoped>
.banner-wrapper {
  width: 100%;
  min-height: 1073px;
  background: url("../../../assets/images/promotion/hotpromo/ftd/banner.jpg") no-repeat top center;
  background-size: 100% 100%;
  position: relative;

  .genie {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .genie-ball-wrapper {
    position: absolute;
    top: 45%;
    left: 49.2%;
    transform: translate(-50%, -50%);
    aspect-ratio: 321 / 319;
    width: 250px;
  }

  .genie-ball {
    aspect-ratio: 321 / 319;
    width: 250px;
    animation: pulse 2s infinite;
  }

  .genie-ball-text {
    position: absolute;
    top: 53%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-size: 40px;
    font-weight: bold;
    font-family: "FZHanZhenGuangBiaoS-GB";
    background: -webkit-linear-gradient(180deg, #ffffff 0%, #d0abff 44%, #ffffff 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .tab-wrapper {
    display: flex;
    gap: 10px;
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translate(-50%, -50%);

    .tab {
      width: 184px;
      height: 63px;
      background: url("../../../assets/images/promotion/hotpromo/ftd/tab.png") no-repeat center center;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: rgba(255, 255, 255, 0.8);
      // font-weight: bold;
      font-family: "FZHanZhenGuangBiaoS-GB";
      cursor: pointer;

      &:hover {
        filter: brightness(0.9);
      }

      &.active-tab {
        background: url("../../../assets/images/promotion/hotpromo/ftd/tab-active.png") no-repeat center center;
        background-size: 100% 100%;
        color: #fff;
      }
    }
  }
}

.content-wrapper {
  width: 100%;
  padding-bottom: 60px;
  //min-height: 2533px;
  background: url("../../../assets/images/promotion/hotpromo/ftd/content-bg.jpg") no-repeat top center;
  background-size: 100% 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 50px;

  .second-tab-wrapper {
    display: flex;
    align-items: center;

    .second-tab-content-wrapper {
      width: 821px;
      height: 91px;
      background: url("../../../assets/images/promotion/hotpromo/ftd/second-tab-bg.png") no-repeat center center;
      background-size: 100% 100%;
      display: flex;
      position: relative;

      &.mono-tab {
        width: 435px;
        background-size: 0% 0%;
      }

      .tab {
        width: 435px;
        height: 91px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Microsoft YaHei UI;
        font-size: 30px;
        font-weight: 700;
        line-height: 47.88px;
        text-align: center;
        color: #ffffff99;
        position: absolute;
        cursor: pointer;

        &:first-child {
          left: 0%;
        }

        &:nth-child(2) {
          right: 0%;
        }

        &:hover {
          color: #ffffffcc;
        }

        &.active-tab {
          background: url("../../../assets/images/promotion/hotpromo/ftd/second-tab-active.png") no-repeat center center;
          background-size: 100% 100%;
          color: #fff;
        }

        .tab-label {
          position: absolute;
        }
      }
    }
  }

  .separator-wrapper {
    .separator {
      aspect-ratio: 1232 / 76;
      width: 600px;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
  }

  70% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.95);
  }
}
</style>
