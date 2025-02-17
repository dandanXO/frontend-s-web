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
const wheelstage= ref();
const isDuringInit = ref(false);
const info = ref({
  startTime: "",
  // nextFreeSpinTime: "2025-02-14 00:00:00",
  currAmount: 0,
  targetWithdrawAmount: 0,
  spinChance: 0,
  status: ""
});

const extractionDifference = computed(() =>
    Math.min(Math.round((info.value.targetWithdrawAmount - info.value.currAmount) * 100) / 100, 100)
);

provide('info', info);
provide('extractionDifference', extractionDifference);

const loadData = async () => {
  isDuringInit.value = true;
  const res= await eventapi.post("/refer-spin/check");
  if (res.code === 0) {
    switch (res.data.status) {
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
    info.value = {
      ...info.value,
      ...res.data
    };
    
    isDuringInit.value = false;
  }
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
