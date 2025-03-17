<template>
  <div style="padding-bottom: env(safe-area-inset-bottom);" class="abs-container" :class="`abs-${localType}-${localStep}`">
    <div class="player-guide" :class="`${localType}-mode`">
      <div class="steps-portion" :class="`steptopmain-${currentAdditionalStep} ${localType}-mode`">
        <!-- <img class="abs-line" :class="`${localType} step-${localStep}`" v-if="localType === 'deposit'" :src="require(`../../assets/images/newplayerguide/line-${localType}-${localStep}.png`)"> -->

        <img
          v-if="imagePath"
          class="abs-line"
          :class="`${localType} step-${localStep}`"
          :src="imagePath"
          alt="Guide Line"
        />
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
              @click="updateCurrentAdditionalStep"
              :class="{ whand: localType === 'refer' && localStep === 1 }"
              class="bottom-button"
            >
              {{ localType === "refer" && localStep === 1 ? $t("playerGuide.tryItOut") : $t("playerGuide.next") }}
            </div>
            <div @click="updateToWithdrawStep" class="next-button" v-if="localType === 'refer' && localStep === 1">{{ $t("playerGuide.next") }}</div>
          </div>
          </div>
        </div>
      </div>
      <div
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
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({ currentAdditionalStep: Number, currentType: String });
const emit = defineEmits(["updateStep", "closeGuide"]);
const localStep = ref(props.currentAdditionalStep); // Local step variable
const localType = ref(props.currentType);

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
  { step: 1, instruction: "Click on wallet in the menu" },
  { step: 2, instruction: "Select deposit tab" },
  { step: 3, instruction: "Select bank" },
  { step: 4, instruction: "Update amount and click Submit" }
]);

// Referral steps
const additionalReferSteps = ref([
  { step: 1, instruction: "How to earn money by sharing invitations" },
  { step: 2, instruction: "Click on earn money in the menu" },
  { step: 3, instruction: "Invite friends through the link" }
]);

// Withdrawal steps
const additionalWithdrawSteps = ref([
  { step: 1, instruction: "Click on wallet in the bottom menu" },
  { step: 2, instruction: "Select withdrawal tab" },
  { step: 3, instruction: "Enter withdrawal amount" },
  { step: 4, instruction: "Confirm withdrawal request" }
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
}
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
      border: 2px dashed #5dcd77;
      box-shadow: 0px 0px 30px 0px #00e60091;
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
      width: 80px;
      height: 80px;
      // right: 11vh;
      right: 20%;
      bottom: 0;
      // .inner-line {
      //   background: url(../../assets/images/newplayerguide/dep-point-1.png) no-repeat center center;
      //   background-size: 60%;
      // }
    }
    &.step-2 {
      width: 50%;
      height: 75px;
      top: 70px;
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
      border: 2px dashed #5dcd77;
      box-shadow: 0px 0px 30px 0px #00e60091;
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
      // .inner-line {
      //   background: url(../../assets/images/newplayerguide/refer-point-2.png) no-repeat center center;
      //   background-size: 150%;
      // }
    }
    &.step-3 {
      width: 95%;
      max-width: 500px;
      height: 125px;
      top: 95px;
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
      border: 2px dashed #5dcd77;
      box-shadow: 0px 0px 30px 0px #00e60091;
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
      width: 80px;
      height: 80px;
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
      top: 70px;
      right: 5px;
      left: unset;
    }
    &.step-3 {
      width: 95%;
      max-width: 500px;
      height: 100px;
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
        top: 25dvh;
      }
      // &.steptopmain-3.refer-mode {
      //   top: 35vh;
      // }
      &.steptopmain-3.withdraw-mode {
        // top: 35vh;
        top: 25dvh;
      }
      &.steptopmain-2.withdraw-mode {
        // top: 35vh;
        top: 25dvh;
      }
      &.steptopmain-2 .top {
        width: 75% !important;
      }
    }
    .abs-line {
      position: absolute;
      pointer-events: none;
      z-index: 9999;
      &.deposit {
        &.step-1 {
          @media screen  and (min-width: 360px) and (max-width: 375px) {
            width: 18vh;
            top: 54vh;
            left: 18vh;
          }
          @supports (-webkit-touch-callout: none) {
            width: 16svh;
            top: 60svh;
            left: 30svh;
          }
          width: 49%;
          top: 95%;
          left: 30%;
        }
        &.step-2 {
          @media screen  and (min-width: 360px) and (max-width: 375px) {
            width: 36svh;
            top: -3svh;
            left: 2svh;
          }
          @supports (-webkit-touch-callout: none) {
            width: 44svh;
            top: -3svh;
            left: 2svh;
          }
          width: 40dvh;
          top: -14dvh;
          left: -6dvh;
        }
        &.step-3 {
          @media screen  and (min-width: 360px) and (max-width: 375px) {
            width: 16svh;
            left: 5svh;
            top: -9svh;
          }
          @supports (-webkit-touch-callout: none) {
            width: 18svh;
            top: -11svh;
            left: 8svh;
          }
          width: 14svh;
          left: 3svh;
          top: -12svh;
        }
        &.step-4 {
          @media screen  and (min-width: 360px) and (max-width: 375px) {
            width: 16svh;
            left: 20svh;
            top: 51svh;
          }
          @supports (-webkit-touch-callout: none) {
            width: 12svh;
            top: 57svh;
            left: 29svh;
          }
          width: 27dvh;
          top: 38dvh;
          left: 11dvh;
        }
      }
      &.refer {
        &.step-2 {
          @media screen  and (min-width: 360px) and (max-width: 375px) {
            width: 10svh;
            left: 23svh;
            top: 53svh;
          }
          @supports (-webkit-touch-callout: none) {
            width: 9svh;
            top: 59svh;
            left: 29svh;
          }
          width: 15dvh;
          top: 45dvh;
          left: 15dvh;
          transform: rotate(25deg);
        }
        &.step-3 {
          
          @media screen  and (min-width: 360px) and (max-width: 375px) {
            width: 38svh;
            left: 5svh;
            top: -4svh;
          }
          @supports (-webkit-touch-callout: none) {
            width: 43svh;
            left: 8svh;
            top: -3svh;
          }
          width: 43dvh;
          top: -15dvh;
          left: 0dvh;
        }
      }
      &.withdraw {
        &.step-1 {
          @media screen  and (min-width: 360px) and (max-width: 375px) {
            width: 18vh;
            top: 54vh;
            left: 18vh;
          }
          @supports (-webkit-touch-callout: none) {
            width: 16svh;
            top: 60svh;
            left: 30svh;
          }
          width: 49%;
          top: 95%;
          left: 30%;
        }
        
        &.step-2 {
          @media screen  and (min-width: 360px) and (max-width: 375px) {
            width: 40svh;
            top: -10svh;
            left: 8svh;
          }
          @supports (-webkit-touch-callout: none) {
            width: 45svh;
            top: -12svh;
            left: 10svh;
          }
          width: 37dvh;
          top: -14dvh;
          left: 4dvh;
        }
        &.step-3 {
          @media screen  and (min-width: 360px) and (max-width: 375px) {
            width: 14svh;
            left: 5svh;
            top: -2svh;
          }
          @supports (-webkit-touch-callout: none) {
            width: 16svh;
            top: -3svh;
            left: 10svh;
          }
          width: 13dvh;
          left: 7dvh;
          top: -7dvh;
        }
        &.step-4 {
          @media screen  and (min-width: 360px) and (max-width: 375px) {
            width: 16svh;
            left: 20svh;
            top: 52svh;
          }
          @supports (-webkit-touch-callout: none) {
            width: 12svh;
            top: 58svh;
            left: 28svh;
          }
          width: 25dvh;
          left: 14dvh;
          top: 39dvh;
        }
      }
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
        font-weight: 700;
        font-size: 5.6vw;
        line-height: 71.12px;
        text-align: center;
        color: #ffffff;
        text-shadow: -1px -1px 0 #215f25, 1px -1px 0 #215f25, -1px 1px 0 #215f25, 1px 1px 0 #215f25;
        text-transform: uppercase;
        bottom: 1vh;
        width: 80%;
        margin: 0 auto;
        left: 0;
        right: 0;
        @media screen and (min-width: 500px) {
          bottom: 2.4vh;
          font-size: 30px;
        }
      }
      img {
        width: 100%;
      }
    }

    .main-box {
      z-index: 1;
      background: linear-gradient(325.86deg, rgba(14, 30, 8, 0.85) 5.38%, rgba(27, 96, 38, 0.85) 98.11%);
      box-shadow: 0px 0px 37.43px 0px #b479ff40 inset;
      backdrop-filter: blur(10px);
      border: 1px solid #24ee89;
      padding: 25px 10px 15px;
      margin: -45px auto 0;
      border-radius: 16px;
      display: flex;
      gap: 25px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 85%;
      .other-steps {
        margin: 20px auto 0;
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
          background: linear-gradient(
            270deg,
            rgba(69, 181, 121, 0) 0%,
            rgba(69, 181, 121, 0.5) 46.5%,
            rgba(69, 181, 121, 0) 100%
          );
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5px;
          gap: 5px;
          font-family: Poppins;
          font-weight: 700;
          .ins {
            color: #90e974;
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
              color: #fff15c;
              text-align: center;
            }
          }
        }
      }

      .step-no {
        color: #90e974;
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
        gap: 20px;
      }
      .next-button {
        text-transform: uppercase;
        cursor: pointer;
        background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
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
        color: #000000;
        border-radius: 8px;
        margin: 0 auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
      }
      .bottom-button {
        cursor: pointer;
        background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
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
        color: #000000;
        border-radius: 8px;
        margin: 0 auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
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
            @media screen and (min-width: 400px) {
              width: 70px;
              height: 70px;
            }
            z-index: 99;
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
