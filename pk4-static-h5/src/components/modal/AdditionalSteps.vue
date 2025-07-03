<template>
  <div
    style="padding-bottom: env(safe-area-inset-bottom)"
    class="abs-container"
    :class="`abs-${localType}-${localStep}`"
  >
    <div class="player-guide" :class="`${localType}-mode`">
      <div class="steps-portion" :class="`steptopmain-${currentAdditionalStep} ${localType}-mode`">
        <!-- <img class="abs-line" :class="`${localType} step-${localStep}`" v-if="localType === 'deposit'" :src="require(`../../assets/images/newplayerguide/line-${localType}-${localStep}.png`)"> -->

        <div v-if="imagePath" class="abs-line-wrapper" :style="absLineStyle">
          <img class="abs-line" :class="`${localType} step-${localStep}`" :src="imagePath" alt="Guide Line" />
        </div>
        <div class="top" :class="{ hide: localType === 'refer' && localStep === 3 }">
          <img :src="require(`../../assets/images/newplayerguide/step-top-${localTypeStep()}.png`)" />
          <div class="title" v-if="localType === 'withdraw'">{{ $t("playerGuide.recharging") }}</div>
          <div class="title" v-else-if="localType === 'deposit'">{{ $t("playerGuide.depositNow") }}</div>
          <div class="title" v-else>{{ $t("playerGuide.inviteFriends") }}</div>
        </div>
        <div class="main-box">
          <template v-for="(step, index) in currentSteps" :key="index">
            <div
              class="other-steps"
              :class="{ hide: localType === 'refer' && localStep === 3 }"
              v-if="currentAdditionalStep === step.step"
            >
              <div :class="`mid-content ${localType}-mode`">
                <div class="ins">{{ step.instruction }}</div>
              </div>
            </div>
          </template>

          <div>
            <div class="step-no" :class="`step-${currentAdditionalStep} ${localType}-mode`">
              {{ currentAdditionalStep }} / {{ currentSteps.length }}
            </div>
            <div class="buttons">
              <div
                ref="bottomButtonRef"
                @click="updateCurrentAdditionalStep"
                :class="{ whand: localType === 'refer' && localStep === 1 }"
                class="bottom-button"
              >
                {{ localType === "refer" && localStep === 1 ? $t("playerGuide.tryItOut") : $t("playerGuide.next") }}
              </div>
              <div @click="updateToWithdrawStep" class="next-button" v-if="localType === 'refer' && localStep === 1">
                {{ $t("playerGuide.next") }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref="highlightBoxRef"
        class="green-highlight-box"
        :class="`step-${currentAdditionalStep} ${localType}-mode`"
        @click="updateCurrentAdditionalStep"
      >
        <div class="inner-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useElementBounding, useWindowSize } from "@vueuse/core";
import { ref, watch, computed, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const absLineStyleMap = new Map([
  [
    "deposit-1",
    {
      top: (buttonRect, highlightRect) => `${buttonRect.bottom.value}px`,
      left: (buttonRect, highlightRect) => `${buttonRect.left.value}px`,
      right: (buttonRect, highlightRect) => `calc(100vw - ${highlightRect.right.value}px)`,
      bottom: (buttonRect, highlightRect) => `calc(100svh - ${highlightRect.top.value}px)`
    }
  ],
  [
    "deposit-2",
    {
      top: (buttonRect, highlightRect) => `${highlightRect.bottom.value}px`,
      left: (buttonRect, highlightRect) => `${buttonRect.x.value - 221}px`,
      right: (buttonRect, highlightRect) => "",
      bottom: (buttonRect, highlightRect) =>
        `calc(100svh - ${buttonRect.top.value + buttonRect.height.value / 2}px - 12px)`
    }
  ],
  [
    "deposit-3",
    {
      top: (buttonRect, highlightRect) => `${highlightRect.bottom.value}px`,
      left: (buttonRect, highlightRect) => `${buttonRect.x.value - 138}px`,
      right: (buttonRect, highlightRect) => "",
      bottom: (buttonRect, highlightRect) =>
        `calc(100svh - ${buttonRect.top.value + buttonRect.height.value / 2}px - 2px)`
    }
  ],
  [
    "deposit-4",
    {
      top: (buttonRect, highlightRect) => `${buttonRect.y.value + 10}px`,
      left: (buttonRect, highlightRect) => `${buttonRect.x.value + buttonRect.width.value / 2 - 87}px`,
      right: (buttonRect, highlightRect) => "",
      bottom: (buttonRect, highlightRect) => `calc(100svh - ${highlightRect.y.value + 29}px)`
    }
  ],
  [
    "refer-2",
    {
      top: (buttonRect, highlightRect) => `${buttonRect.y.value + buttonRect.height.value / 2}px`,
      left: (buttonRect, highlightRect) => `${buttonRect.x.value - 10}px`,
      right: (buttonRect, highlightRect) => `calc(100vw - ${buttonRect.right.value + 10}px)`,
      bottom: (buttonRect, highlightRect) => `calc(100svh - ${highlightRect.y.value + 14}px)`
    }
  ],
  [
    "refer-3",
    {
      top: (buttonRect, highlightRect) => `${highlightRect.bottom.value - 73}px`,
      left: (buttonRect, highlightRect, width) => `${(width.value - 500) / 2}px`,
      right: (buttonRect, highlightRect) => "",
      bottom: (buttonRect, highlightRect) => `calc(100svh - ${buttonRect.top.value + 50}px)`
    }
  ],
  [
    "withdraw-1",
    {
      top: (buttonRect, highlightRect) => `${buttonRect.bottom.value}px`,
      left: (buttonRect, highlightRect) => `${buttonRect.x.value}px`,
      right: (buttonRect, highlightRect) => `calc(100vw - ${highlightRect.right.value}px)`,
      bottom: (buttonRect, highlightRect) => `calc(100svh - ${highlightRect.top.value}px)`
    }
  ],
  [
    "withdraw-2",
    {
      top: (buttonRect, highlightRect) => `${highlightRect.bottom.value - highlightRect.height.value / 2}px`,
      left: (buttonRect, highlightRect) => "",
      right: (buttonRect, highlightRect) => "",
      bottom: (buttonRect, highlightRect) => `calc(100svh - ${buttonRect.y.value + buttonRect.height.value / 2 + 10}px)`
    }
  ],
  [
    "withdraw-3",
    {
      top: (buttonRect, highlightRect) => `${highlightRect.bottom.value}px`,
      left: (buttonRect, highlightRect) => `${(width.value - 500) / 2 + 120}px`,
      right: (buttonRect, highlightRect) => "",
      // bottom: (buttonRect, highlightRect) => `calc(100svh - ${buttonRect.y.value + buttonRect.height.value / 2 + 10}px)`
      bottom: (buttonRect, highlightRect) => {
        const viewportHeight = window.innerHeight;
        const offset = buttonRect.y.value + buttonRect.height.value / 2 + 10;
        return `${viewportHeight - offset}px`;
      }
    }
  ],
  [
    "withdraw-4",
    {
      top: (buttonRect, highlightRect) => `${buttonRect.bottom.value - 37}px`,
      left: (buttonRect, highlightRect) => `${buttonRect.x.value - 40}px`,
      right: (buttonRect, highlightRect) => "",
      bottom: (buttonRect, highlightRect) => `calc(100svh - ${highlightRect.y.value + 27}px)`
    }
  ]
]);

const router = useRouter();
const { t } = useI18n();

const props = defineProps({ currentAdditionalStep: Number, currentType: String });
const emit = defineEmits(["updateStep", "closeGuide"]);
const localStep = ref(props.currentAdditionalStep); // Local step variable
const localType = ref(props.currentType);
const bottomButtonRef = ref(null);
const highlightBoxRef = ref(null);

const buttonRect = useElementBounding(bottomButtonRef);
const highlightRect = useElementBounding(highlightBoxRef);
const { width, height } = useWindowSize();

const absLineStyle = computed(() => {
  if (!bottomButtonRef.value) return {};
  const styleKey = `${localType.value}-${localStep.value}`;
  const absLineStyle = absLineStyleMap.get(styleKey);
  if (!absLineStyle) return {};
  return {
    top: absLineStyle.top(buttonRect, highlightRect, width, height),
    left: absLineStyle.left(buttonRect, highlightRect, width, height),
    right: absLineStyle.right(buttonRect, highlightRect, width, height),
    bottom: absLineStyle.bottom(buttonRect, highlightRect, width, height)
  };
});

const imagePath = computed(() => {
  try {
    return require(`../../assets/images/newplayerguide/line-${localType.value}-${localStep.value}.png`);
  } catch (e) {
    return null;
  }
});
watch(
  () => props.currentAdditionalStep,
  (newVal) => {
    localStep.value = newVal;
  }
);
const localTypeStep = () => {
  if (localType.value === "deposit") {
    return 3;
  } else if (localType.value === "refer") {
    return 4;
  } else if (localType.value === "withdraw") {
    return 5;
  } else {
    return 3;
  }
};
// Deposit steps
const additionalDepSteps = ref([
  { step: 1, instruction: t("playerGuide.deposit1") },
  { step: 2, instruction: t("playerGuide.deposit2") },
  { step: 3, instruction: t("playerGuide.deposit3") },
  { step: 4, instruction: t("playerGuide.deposit4") }
]);

// Referral steps
const additionalReferSteps = ref([
  { step: 1, instruction: t("playerGuide.refer1") },
  { step: 2, instruction: t("playerGuide.refer2") },
  { step: 3, instruction: t("playerGuide.refer3") }
]);

// Withdrawal steps
const additionalWithdrawSteps = ref([
  { step: 1, instruction: t("playerGuide.withdraw1") },
  { step: 2, instruction: t("playerGuide.withdraw2") },
  { step: 3, instruction: t("playerGuide.withdraw3") },
  { step: 4, instruction: t("playerGuide.withdraw4") }
]);

// Dynamically determine which steps to use
const currentSteps = computed(() => {
  if (localType.value === "refer") return additionalReferSteps.value;
  if (localType.value === "withdraw") return additionalWithdrawSteps.value;
  return additionalDepSteps.value;
});
const updateToWithdrawStep = () => {
  router.push("/");
  emit("closeGuide", true);
  localStorage.setItem(`completedreferguide`, JSON.stringify(true));
  localStorage.setItem(`newPlayerGuide`, 5);
};
const updateCurrentAdditionalStep = () => {
  // debugger;
  if (localType.value === "deposit") {
    if (localStep.value === 1) {
      router.push("/deposit?isNewPlayer=1");
      localStep.value += 1;
      emit("updateStep", localStep.value);
      return;
    }
  }
  if (localType.value === "refer") {
    if (localStep.value === 2) {
      router.push("/earn-money?isNewPlayer=2");
      localStep.value += 1;
      emit("updateStep", localStep.value);
      return;
    }
  }
  if (localType.value === "withdraw") {
    if (localStep.value === 1) {
      router.push("/withdraw?isNewPlayer=3");
      localStep.value += 1;
      emit("updateStep", localStep.value);
      return;
    }
  }
  // debugger;
  if (localStep.value < currentSteps.value.length) {
    localStep.value += 1;
    emit("updateStep", localStep.value);
  } else {
    router.push("/");
    emit("closeGuide");
    localStorage.setItem(`completed${localType.value}guide`, JSON.stringify(true));
  }
};

onMounted(() => {
  setTimeout(() => {
    buttonRect.update();
    highlightRect.update();
  });
});
</script>
<style lang="scss" scoped>
.abs-container {
  background: rgba(0, 0, 0, 0.2);
  position: fixed; /* Change to absolute if needed */
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 500px;
  z-index: 9999;
  flex-direction: column;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  height: calc(var(--vh) * 100 - env(safe-area-inset-bottom));
  height: calc(100dvh - env(safe-area-inset-bottom));
  right: 0;
  bottom: 0;
  overflow: hidden;
  margin: auto;
  max-height: 100dvh; /* Ensure content does not get cut off */
  // overscroll-behavior: contain;
  // &.abs-refer-3 {
  //   top: 860px;
  // }
  // &.abs-withdraw-3 {

  //   top: 175px;

  // }
  .main-highlight-box {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 20px;
    left: 0;
    right: 0;
    background: transparent;
    border-radius: 10px;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
    height: 90vh;
    margin: auto;
  }
  .green-highlight-box.deposit-mode {
    position: absolute;
    right: 11vh;
    bottom: 0;
    margin: 0 auto;
    background: transparent;
    border-radius: 10px;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
    &.step-1 {
      .inner-line {
        background: url(../../assets/images/newplayerguide/dep-point-1.png) no-repeat center center;
        background-size: contain;
      }
    }
    .inner-line {
      width: 100%;
      height: 100%;
      // border: 2px dashed #5dcd77;
      // box-shadow: 0px 0px 30px 0px #00e60091;
      border: 2px dotted #0084FF;
      box-shadow: 0 0 20px 0 rgb(0 112 230 / 57%);
      border-radius: 20px;
        
      &:after {
        position: absolute;
        content: "";
        background: url(../../assets/images/newplayerguide/finger.png) no-repeat center center;
        width: 10vh;
        background-size: contain;
        height: 10vh;
        bottom: 0;
        right: 0;
        animation: moveFinger 1.5s ease-in-out infinite;
      }
    }
    &.step-1 {
      width: 16vw;
      height: 16vw;
      max-width: 80px;
      max-height: 80px;
      // right: 11vh;
      right: 22%;
      bottom: 0;
      // .inner-line {
      //   background: url(../../assets/images/newplayerguide/dep-point-1.png) no-repeat center center;
      //   background-size: 60%;
      // }
    }
    &.step-2 {
      width: 50%;
      height: 75px;
      top: 56px;
      left: 5px;
      right: unset;
    }
    &.step-3 {
      width: 95%;
      max-width: 500px;
      height: 100px;
      top: 10px;
      bottom: unset;
      left: 0;
      right: 0;
      margin: auto;
      .inner-line {
        &:after {
          left: 6vh;
        }
      }
    }
    &.step-4 {
      width: 95%;
      max-width: 500px;
      height: 60px;
      bottom: 30px;
      left: 0;
      right: 0;
      .inner-line {
        // background: url(../../assets/images/newplayerguide/dep-point-4.png) no-repeat center center;
        // background-size: 95%;
      }
    }
  }
  .green-highlight-box.refer-mode {
    width: 80px;
    height: 80px;
    position: absolute;
    right: 11vh;
    bottom: 0;
    margin: 0 auto;
    background: transparent;
    border-radius: 10px;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
    .inner-line {
      width: 100%;
      height: 100%;
      // border: 2px dashed #5dcd77;
      // box-shadow: 0px 0px 30px 0px #00e60091;
      
      border: 2px dotted #0084FF;
      box-shadow: 0 0 20px 0 rgb(0 112 230 / 57%);
      border-radius: 20px;

      &:after {
        position: absolute;
        content: "";
        background: url(../../assets/images/newplayerguide/finger.png) no-repeat center center;
        width: 10vh;
        background-size: contain;
        height: 10vh;
        bottom: 0;
        right: 0;
        animation: moveFinger 1.5s ease-in-out infinite;
      }
    }
    &.step-1 {
      width: 0px;
      height: 0px;
      right: -5vh;
      bottom: -5vh;
    }
    &.step-2 {
      width: 20%;
      height: 90px;
      left: 0;
      right: unset;
      bottom: 0;
      right: 0;
      .inner-line {
        background: url(../../assets/images/newplayerguide/refer-point-2.png) no-repeat center center;
        // background-size: 150%;
        background-size: contain;
      }
    }
    &.step-3 {
      width: 95%;
      max-width: 500px;
      height: 33vw;
      max-height: 145px;
      min-height: 125px;
      top: 85px;
      bottom: unset;
      left: 0;
      right: 0;
      margin: auto;
      .inner-line {
        &:after {
          right: 15vh;
          top: 0;
        }
      }
    }
    &.step-4 {
      width: 95%;
      max-width: 500px;
      height: 60px;
      bottom: 30px;
      left: 0;
      right: 0;
    }
  }
  .green-highlight-box.withdraw-mode {
    // width: 80px;
    // height: 80px;
    position: absolute;
    right: 11vh;
    bottom: 0;
    margin: 0 auto;
    background: transparent;
    border-radius: 10px;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
    
    &.step-1 {
      .inner-line {
        background: url(../../assets/images/newplayerguide/dep-point-1.png) no-repeat center center;
        background-size: contain;
      }
    }
    .inner-line {
      width: 100%;
      height: 100%;
      // border: 2px dashed #5dcd77;
      // box-shadow: 0px 0px 30px 0px #00e60091;
      
      border: 2px dotted #0084FF;
      box-shadow: 0 0 20px 0 rgb(0 112 230 / 57%);
      border-radius: 20px;

      &:after {
        position: absolute;
        content: "";
        background: url(../../assets/images/newplayerguide/finger.png) no-repeat center center;
        width: 10vh;
        background-size: contain;
        height: 10vh;
        bottom: 0;
        right: 0;
        animation: moveFinger 1.5s ease-in-out infinite;
      }
    }
    &.step-1 {
      // width: 80px;
      // height: 80px;
      // // right: 11vh;
      // right: 22%;
      // bottom: 0;
        width: 16vw;
        height: 16vw;
        max-width: 80px;
        max-height: 80px;
        // right: 11vh;
        right: 22%;
        bottom: 0;
      // .inner-line {
      //   background: url(../../assets/images/newplayerguide/dep-point-1.png) no-repeat center center;
      //   background-size: 60%;
      // }
    }
    &.step-2 {
      width: 50%;
      height: 75px;
      top: 55px;
      right: 5px;
      left: unset;
    }
    &.step-3 {
      width: 95%;
      max-width: 500px;
      height: 26vw;
      max-height: 130px;
      min-height: 100px;
      top: 60px;
      bottom: unset;
      left: 0;
      right: 0;
      margin: auto;
      .inner-line {
        &:after {
          left: 6vh;
        }
      }
    }
    &.step-4 {
      width: 95%;
      max-width: 500px;
      height: 60px;
      bottom: 30px;
      left: 0;
      right: 0;
      .inner-line {
        // background: url(../../assets/images/newplayerguide/dep-point-4.png) no-repeat center center;
        // background-size: 95%;
      }
    }
  }
  .player-guide {
    width: 100%;
    height: calc(100vh - env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 500px;
    position: relative;
    .steps-portion {
      position: absolute;
      z-index: 99;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &.steptopmain-3.deposit-mode {
        // top: 35vh;
        top: 25vh;
        top: 25dvh;
        // .title {
        //   bottom: 1.2vh;
        // }
      }
      // &.steptopmain-4.deposit-mode {
      //   .title {
      //     bottom: 1.3vh;
      //   }
      // }
      // &.steptopmain-3.refer-mode {
      //   top: 35vh;
      // }
      &.steptopmain-3.withdraw-mode {
        // top: 35vh;
        top: 25vh;
        @supports(height: 100dvh) {
          top: 25dvh;
        }
      }
      &.steptopmain-2.withdraw-mode {
        // top: 35vh;
        top: 25vh;
        top: 25dvh;
      }
      &.steptopmain-2.refer-mode .top {
        width: 75% !important;
      }
    }
    .abs-line-wrapper {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
    }
    .abs-line {
      width: 100%;
      height: 100%;
      // &.deposit {
      //   &.step-1 {
      //     width: 33%;
      //     top: 96%;
      //     left: 40%;
      //     height: calc(50svh - 45% - 80px);
      //     // TODO: 111
      //   }
      //   &.step-2 {
      //     left: -1%;
      //     bottom: 20svh;
      //     height: calc(50svh + 25% - 50px);
      //   }
      //   &.step-3 {
      //     left: 16.5%;
      //     bottom: 8%;
      //     height: calc(50svh + 33% - 50px);
      //   }
      //   &.step-4 {
      //     width: 27dvh;
      //     top: 38dvh;
      //     left: 11dvh;
      //     @media screen and (min-width: 360px) and (max-width: 375px) {
      //       width: 16svh;
      //       left: 20svh;
      //       top: 51svh;
      //     }
      //     @supports (-webkit-touch-callout: none) {
      //       width: 12svh;
      //       top: 57svh;
      //       left: 29svh;
      //     }
      //   }
      // }
      // &.refer {
      //   &.step-2 {
      //     width: 15dvh;
      //     top: 45dvh;
      //     left: 15dvh;
      //     transform: rotate(25deg);
      //     @media screen and (min-width: 360px) and (max-width: 375px) {
      //       width: 10svh;
      //       left: 23svh;
      //       top: 53svh;
      //     }
      //     @supports (-webkit-touch-callout: none) {
      //       width: 9svh;
      //       top: 59svh;
      //       left: 29svh;
      //     }
      //   }
      //   &.step-3 {
      //     width: 43dvh;
      //     top: -15dvh;
      //     left: 0dvh;
      //     @media screen and (min-width: 360px) and (max-width: 375px) {
      //       width: 38svh;
      //       left: 5svh;
      //       top: -4svh;
      //     }
      //     @supports (-webkit-touch-callout: none) {
      //       width: 43svh;
      //       left: 8svh;
      //       top: -3svh;
      //     }
      //   }
      // }
      // &.withdraw {
      //   &.step-1 {
      //     width: 49%;
      //     top: 95%;
      //     left: 30%;
      //     @media screen and (min-width: 360px) and (max-width: 375px) {
      //       width: 18vh;
      //       top: 54vh;
      //       left: 18vh;
      //     }
      //     @supports (-webkit-touch-callout: none) {
      //       width: 16svh;
      //       top: 60svh;
      //       left: 30svh;
      //     }
      //   }

      //   &.step-2 {
      //     width: 37dvh;
      //     top: -14dvh;
      //     left: 4dvh;
      //     @media screen and (min-width: 360px) and (max-width: 375px) {
      //       width: 40svh;
      //       top: -10svh;
      //       left: 8svh;
      //     }
      //     @supports (-webkit-touch-callout: none) {
      //       width: 45svh;
      //       top: -12svh;
      //       left: 10svh;
      //     }
      //   }
      //   &.step-3 {
      //     width: 13dvh;
      //     left: 7dvh;
      //     top: -7dvh;
      //     @media screen and (min-width: 360px) and (max-width: 375px) {
      //       width: 14svh;
      //       left: 5svh;
      //       top: -2svh;
      //     }
      //     @supports (-webkit-touch-callout: none) {
      //       width: 16svh;
      //       top: -3svh;
      //       left: 10svh;
      //     }
      //   }
      //   &.step-4 {
      //     width: 25dvh;
      //     left: 14dvh;
      //     top: 39dvh;
      //     @media screen and (min-width: 360px) and (max-width: 375px) {
      //       width: 16svh;
      //       left: 20svh;
      //       top: 52svh;
      //     }
      //     @supports (-webkit-touch-callout: none) {
      //       width: 12svh;
      //       top: 58svh;
      //       left: 28svh;
      //     }
      //   }
      // }
    }
    .top {
      width: 90%;
      position: relative;
      z-index: 999;
      max-width: 500px;
      &.hide {
        opacity: 0;
      }
      .title {
        position: absolute;
        font-family: Inter;
        font-weight: 900;
        font-size: 5.6vw;
        line-height: 71.12px;
        text-align: center;
        color: #ffffff;
        // text-shadow: -1px -1px 0 #215f25, 1px -1px 0 #215f25, -1px 1px 0 #215f25, 1px 1px 0 #215f25;
        text-transform: uppercase;
        bottom: -.6vh;
        width: 80%;
        margin: 0 auto;
        left: 0;
        right: 0;
        
        background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        -webkit-text-stroke: .2px;
          letter-spacing: -1px;
        filter: drop-shadow(0px 4.08px 0px 0px #00000026);
        @media screen and (min-width: 500px) {
          // bottom: 2.4vh;
          
          bottom: -.6vh;
          font-size: 30px;
        }
      }
      img {
        width: 100%;
      }
    }

    .main-box {
      z-index: 1;
      // background: linear-gradient(325.86deg, rgba(14, 30, 8, 0.85) 5.38%, rgba(27, 96, 38, 0.85) 98.11%);
      // box-shadow: 0px 0px 37.43px 0px #b479ff40 inset;
      // backdrop-filter: blur(10px);
      // border: 1px solid #24ee89;
      // padding: 25px 10px 15px;
      // margin: -45px auto 0;
      box-shadow: 0px 0px 37.43px 0px #b479ff40 inset;
      backdrop-filter: blur(10px);
      background: linear-gradient(231.79deg, #D8F3FA 5.22%, #E4F4FF 53.35%, #D8F3FA 95.86%);
      
      margin: -65px auto 0;
      padding: 65px 10px 15px;
      border-radius: 16px;
      display: flex;
      // gap: 25px;
      
      > div:not(:last-child) {
        margin-bottom: 25px;
      }
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 85%;
      .other-steps {
        margin: 20px auto 0;
        width: 100%;
        &.hide {
          display: none;
        }
        .midimg {
          text-align: center;
          width: 35vh;
          margin: 0 auto;
          max-width: 100%;
          img {
            width: 90%;
            margin: 0 auto;
          }
        }
        .mid-content {
          min-height: 45px;
          // background: linear-gradient(
          //   270deg,
          //   rgba(69, 181, 121, 0) 0%,
          //   rgba(69, 181, 121, 0.5) 46.5%,
          //   rgba(69, 181, 121, 0) 100%
          // );
          background: linear-gradient(270deg, rgba(6, 107, 216, 0) 0%, #066BD8 46.5%, rgba(6, 107, 216, 0) 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5px;
          gap: 5px;
          font-family: Poppins;
          font-weight: 700;
          .ins {
            color: #ffffff;
            webkit-text-stroke: .5;
            font-size: 1.5vh;
            line-height: 1.8vh;
          }
          .amt {
            color: #ffc664;

            font-size: 2vh;
            line-height: 2.5vh;
          }
          &.refer-mode {
            background: unset;
            margin: 20px auto;
            .ins {
              font-size: 2.5vh;
              line-height: 3.5vh;
              color: #000000;
              text-align: center;
            }
          }
        }
      }

      .step-no {
        color: #066AD7;
        font-weight: bold;
        margin: 0px auto 15px;
        text-align: center;
        &.refer-mode {
          display: none;
        }
      }
      .buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        // gap: 20px;
        
        > div:not(:last-child) {
          margin-right: 20px;
        }
      }
      .next-button {
        text-transform: uppercase;
        cursor: pointer;
        background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);

        padding: 10px;
        font-family: Poppins;
        font-weight: 700;
        // font-size: 2vh;
        // line-height: 2vh;
        padding: 15px 10px;
        font-size: 15px;
        line-height: 18px;
        // padding: 8px 30px;
        letter-spacing: 0px;
        text-align: center;
        color: #ffffff;
        border-radius: 8px;
        margin: 0 auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    min-width: 120px;
        // gap: 10px;
        > div:not(:last-child) {
          margin-right: 10px;
        }
      }
      .bottom-button {
        cursor: pointer;
        background: #BCDCFF;
        padding: 10px;
        font-family: Poppins;
        font-weight: 700;
        // font-size: 2vh;
        line-height: 18px;
        font-size: 15px;
        // line-height: 2vh;
        padding: 15px 10px;
        letter-spacing: 0px;
        text-align: center;
        color: #333333;
        border-radius: 8px;
        margin: 0 auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    min-width: 120px;
        img {
          width: 25px;
        }
        &.whand {
          &:after {
            position: absolute;
            content: "";
            background: url(../../assets/images/newplayerguide/finger.png) no-repeat center center;
            width: 10vh;
            background-size: contain;
            height: 10vh;
            bottom: 0;
            right: 0;
            animation: moveFinger 1.5s ease-in-out infinite;
            z-index: 99;
            @media screen and (min-width: 400px) {
              width: 70px;
              height: 70px;
            }
          }
        }
      }
    }
  }
}

/* Keyframe animation to simulate finger moving towards the button */
@keyframes moveFinger {
  0% {
    bottom: -4vh; /* Start position */
    right: -2vh; /* Start on the right */
  }
  25% {
    bottom: -4.5vh; /* Move up slightly */
    right: -1vh; /* Move left slightly (towards the center) */
  }
  50% {
    bottom: -5vh; /* Move up further */
    right: 0vh; /* Move further left */
  }
  75% {
    bottom: -4.5vh; /* Move back down slightly */
    right: -1vh; /* Move back to the center */
  }
  100% {
    bottom: -4vh; /* End position */
    right: -2vh; /* Back to the original position on the right */
  }
}
</style>
