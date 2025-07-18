<template>
  <div class="spin-lucky-wheel-promo-wrapper">
    <EnvelopeStage v-if="stage === 'envelope'" @envelope-click="handleEnvelopClick" />
    <WheelStage v-else-if="stage === 'wheel'" :info="info" @reload="loadData" ref="wheelstage" />
    <q-inner-loading :showing="isDuringInit" />
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, provide, computed } from "vue";
import EnvelopeStage from "./EnvelopeStage.vue";
import { useUI } from "src/stores/ui";
import WheelStage from "./WheelStage.vue";
import { eventapi } from "src/boot/axios";
const ui = useUI();

const props = defineProps(["params"]);
const params = JSON.parse(props.params || "{}");

const stage = ref("");
const wheelstage = ref();
const isDuringInit = ref(false);
const info = ref({
  wheelStartTime: "",
  wheelEndTime: "",
  hasWithdrawn: false,
  wheelNo: 0,
  // nextFreeSpinTime: "2025-02-14 00:00:00",
  accumulatedBonus: 0,
  availableSpin: 0,
  currentBonusType: ""
});

const targetWithdrawAmount = computed(() => {
  // switch (info.value.wheelNo) {
  //   case 3:
  //     return 1000;
  //   case 2:
  //     return 600;
  //   case 1:
  //     return 300;
  //   default:
  //     return 0;
  // }
  return 1000;
});

const extractionDifference = computed(() =>
  (((targetWithdrawAmount.value - info.value.accumulatedBonus) * 10000) / 10000).toFixed(4)
);

provide("info", info);
provide("extractionDifference", extractionDifference);
provide("targetWithdrawAmount", targetWithdrawAmount);

const loadData = async () => {
  isDuringInit.value = true;
  const res = await eventapi.get("/session/refer-wheel-spin/init?promoCode=pak-refer-wheel-spin");
  if (res.code === 0) {
    switch (res.data.currentBonusType) {
      case "REDPACKET":
        stage.value = "envelope";
        ui.promoBg = "spin-lucky-wheel-envelope";
        break;
      case "SPIN":
        stage.value = "wheel";
        ui.promoBg = "spin-lucky-wheel";
        break;
    }
    info.value = {
      ...info.value,
      ...res.data
    };

    isDuringInit.value = false;
  }
};

const handleEnvelopClick = async () => {
  resetPromoBg();
  await loadData();
  stage.value = "wheel";
  wheelstage.value.updateCountdownTime();
};

const resetPromoBg = () => {
  ui.promoBg = "";
};

onMounted(() => {
  loadData();
});

onUnmounted(() => {
  if (ui.promoBg === "spin-lucky-wheel-envelope") {
    resetPromoBg();
  }
});
</script>
<style lang="scss">
.spin-lucky-wheel-promo-wrapper {
  .q-inner-loading {
    justify-content: flex-start;
  }
}
</style>
