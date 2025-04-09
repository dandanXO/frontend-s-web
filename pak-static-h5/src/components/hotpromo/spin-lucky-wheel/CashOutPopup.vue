<template>
  <q-dialog v-model="_modelValue" @hide="hideCashOutPopup" @show="handleDialogShow">
    <div v-if="isShowInviteWins" class="invite-wins">
      <SharePopup ref="sharePopupRef" v-model="isShowInviteWins" />
    </div>
    <div class="cash-out" v-else>
      <GradientTextAmount v-if="isShowTextAmount" :amountText="`${$t('hotPromo.CASH_OUT_COSTS')}  ${extractionDifference}$`" />
      <div v-else class="text-amount-placeholder"></div>
      <!-- <span class="next-spin-remaining-time">COUNTDOWN: {{ nextFreeSpinRemainingTime }}</span> -->
      <div class="cash-out-backdrop-wrapper">
        <div class="pulse1"></div>
        <div class="pulse2"></div>
        <div class="pulse3"></div>
        <div class="pulse4"></div>
        <div class="pulse5"></div>
        <img
          class="cash-out-backdrop"
          src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/cash-out-backdrop.png"
        />
      </div>
      <ProgressBar :isShowDetails="true" />
      <CommonButton class="invite-wins-btn" @click="showInviteWins">{{ $t("hotPromo.invitation_wins") }}</CommonButton>
    </div>
  </q-dialog>
</template>
<script setup>
import { computed, inject, ref } from "vue";
import CommonButton from "./CommonButton.vue";
import GradientTextAmount from "./GradientTextAmount.vue";
import ProgressBar from "./ProgressBar.vue";
import SharePopup from "./SharePopup.vue";

const props = defineProps(["modelValue", "prize"]);
const emit = defineEmits(["update:modelValue", "hide"]);
const showInviteWins = () => (isShowInviteWins.value = true);
const isShowTextAmount = ref(false);

defineExpose({
  showInviteWins
});

const isShowInviteWins = ref(false);

const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});

const hideCashOutPopup = () => {
  isShowInviteWins.value = false;
  isShowTextAmount.value = false;
  emit("hide");
};

const extractionDifference = inject("extractionDifference");
const nextFreeSpinRemainingTime = inject("nextFreeSpinRemainingTime");

const handleDialogShow = () => {
  isShowTextAmount.value = true;
};
</script>
<style lang="scss" scoped>
.invite-wins {
  width: 90%;
  background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/invite-win-popup-bg.png)
    no-repeat;
  background-size: 100% 100%;
  position: relative;
  padding: 40px 20px 20px;
}

.cash-out-backdrop-wrapper {
  position: relative;

  .cash-out-backdrop {
    aspect-ratio: 861 / 720;
    width: 100%;
  }
}

.cash-out {
  width: 85%;

  .text-amount-placeholder {
    width: 100%;
    height: 50px;
  }

  .prize {
    position: absolute;
    top: 20%;
    width: 100%;
    font-size: 56px;
    font-weight: 900;
    color: #8100ae;
    text-align: center;
  }

  .invite-wins-btn {
    width: 65%;
    aspect-ratio: 228 / 90;
    margin: 2px auto;
    min-height: 100px;

    &.common-btn {
      background-size: 100% 100%;
    }

    &:active {
      transform: translateY(2px);
    }
  }
}

@media screen and (max-width: 500px) {
  .cash-out {
    .prize {
      font-size: 11vw;
    }
  }
}

.next-spin-remaining-time {
  display: flex;
  justify-content: center;
  font-family: Inter;
  font-weight: 700;
  font-size: 20px;
  line-height: 24.2px;
  letter-spacing: 0px;
}

@media screen and (max-width: 400px) {
  .next-spin-remaining-time {
    font-size: 18px;
  }
}

@media screen and (max-width: 350px) {
  .next-spin-remaining-time {
    font-size: 14px;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.pulse1,
.pulse2,
.pulse3,
.pulse4,
.pulse5 {
  width: 30px;
  background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/sparkle.gif) no-repeat;
  aspect-ratio: 480 / 467;
  background-size: cover;
  animation: pulse 2s infinite;
  position: absolute;
  top: 80px;
  right: 30px;
}

.pulse2 {
  top: 100px;
  left: 20px;
}

.pulse3 {
  top: 30px;
  left: 160px;
}

.pulse4 {
  top: 190px;
  left: 100px;
}

.pulse5 {
  top: 180px;
  right: 60px;
}
</style>
