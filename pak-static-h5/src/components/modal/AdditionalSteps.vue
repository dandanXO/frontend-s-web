<template>
  <div class="abs-container">
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
            <div
              @click="updateCurrentAdditionalStep"
              :class="{ whand: localType === 'refer' && localStep === 1 }"
              class="bottom-button"
            >
              {{ localType === "refer" && localStep === 1 ? $t("playerGuide.tryItOut") : $t("playerGuide.next") }}
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
import { ref, watch, computed } from "vue";
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
    emit("closeGuide");
    localStorage.setItem(`completed${localType.value}guide`, JSON.stringify(true));
  }
};
</script>
<style lang="scss" scoped>
.abs-container {
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  overflow: hidden;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2); /* Adjust the alpha value to change transparency */

  .main-highlight-box {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
    border-radius: 10px;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
    height: 100vh;
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
      right: 11vh;
      bottom: 0;
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
      top: 140px;
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
      right: 11vh;
      bottom: 0;
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
    }
  }
  .player-guide {
    width: 100%;
    height: 100vh;
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
        top: 35vh;
      }
      &.steptopmain-3.refer-mode {
        top: 35vh;
      }
      &.steptopmain-3.withdraw-mode {
        top: 35vh;
      }
      &.steptopmain-2.withdraw-mode {
        top: 35vh;
      }
    }
    .abs-line {
      position: absolute;
      pointer-events: none;
      z-index: 9999;
      &.deposit {
        &.step-1 {
          width: 20vh;
          top: 56vh;
          left: 18vh;
        }
        &.step-2 {
          width: 44vh;
          left: -5vh;
          top: 0vh;
        }
        &.step-3 {
          width: 14vh;
          left: 6vh;
          top: 2vh;
        }
        &.step-4 {
          width: 20vh;
          left: 20vh;
          top: 50vh;
        }
      }
      &.refer {
        &.step-2 {
          width: 10vh;
          left: 20vh;
          top: 58vh;
        }
        &.step-3 {
          width: 43vh;
          top: -8vh;
        }
      }
      &.withdraw {
        &.step-1 {
          width: 20vh;
          top: 56vh;
          left: 18vh;
        }
        &.step-2 {
          width: 50vh;
          left: 5vh;
          top: -16vh;
        }
        &.step-3 {
          width: 18vh;
          left: 3vh;
          top: -13vh;
        }
        &.step-4 {
          width: 20vh;
          left: 20vh;
          top: 50vh;
        }
      }
    }
    .top {
      width: 100%;
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
      .bottom-button {
        cursor: pointer;
        background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
        padding: 10px;
        font-family: Poppins;
        font-weight: 700;
        font-size: 2vh;
        line-height: 2vh;
        padding: 15px 30px;
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
    right: -7vh; /* Start on the right */
  }
  25% {
    bottom: -4.5vh; /* Move up slightly */
    right: -6vh; /* Move left slightly (towards the center) */
  }
  50% {
    bottom: -5vh; /* Move up further */
    right: -5vh; /* Move further left */
  }
  75% {
    bottom: -4.5vh; /* Move back down slightly */
    right: -6vh; /* Move back to the center */
  }
  100% {
    bottom: -4vh; /* End position */
    right: -7vh; /* Back to the original position on the right */
  }
}
</style>
