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
import { userStore } from "stores/index";
import { storeToRefs } from "pinia";

const ui = useUI();
const store = userStore();

const props = defineProps(["params"]);
const params = JSON.parse(props.params || "{}");


const stage = ref("");
const wheelstage= ref();
const isDuringInit = ref(false);
const { spinWheelLuckyPromoInfo: info } = storeToRefs(store);
const extractionDifference = computed(() =>
  ((info.value.targetWithdrawAmount - info.value.currAmount) * 10000 / 10000).toFixed(4)
);

provide('info', info);
provide('extractionDifference', extractionDifference);

const loadData = async () => {
  isDuringInit.value = true;
  const res= await eventapi.post("/refer-spin/check");

  const newInfo = res.code === 0 ? res.data : info.value;

  switch (newInfo.status) {
      case "NOT_STARTED":
      case "EXPIRED":
        stage.value = "envelope";
        ui.promoBg = "spin-lucky-wheel-envelope";
        break;
      case "CLAIMED":
      case "IN_PROGRESS":
        stage.value = "wheel";
        break;
    }
    store.spinWheelLuckyPromoInfo = { ...store.spinWheelLuckyPromoInfo, ...newInfo };
    
    isDuringInit.value = false;
};

const handleEnvelopClick = async () => {
  resetPromoBg();
  await loadData()
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
