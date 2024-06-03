<template>
  <a-modal
    class="spinwheel"
    v-model:visible="isSpinWheel"
    :footer="null"
    width="100%"
    :mask-closable="false"
    destroy-on-close
    centered
    :after-close="spinWheelHideHandler"
    :closable="false"
  >
    <Roulette v-show="isEligible" ref="rouletteRef" :is-modal="true" @modal-visible="openModal" />
  </a-modal>
</template>
<script setup id="SpinWheelModal">
import { ref, defineExpose, nextTick } from "vue";
import Roulette from "@/components/roulette.vue";
const isSpinWheel = ref(false);
const isEligible = ref(false);
const rouletteRef = ref(null);
const emits = defineEmits(["spinWheelOnClose"]);

const spinWheelHideHandler = () => {
  isEligible.value && emits("spinWheelOnClose");
};

const openModal = (v) => {
  if (v === "close") {
    isSpinWheel.value = false;
  } else {
    isSpinWheel.value = true;
  }
};
const open = async () => {
  isSpinWheel.value = true;

  await nextTick();
  console.log(rouletteRef.value);

  return new Promise((resolve, reject) => {
    rouletteRef.value
      .getSpinRoulette()
      ?.then((isShowSpinWheelSuccess) => {
        if (isShowSpinWheelSuccess) {
          isEligible.value = true;
          return resolve(isShowSpinWheelSuccess);
        }

        isSpinWheel.value = false;
        return resolve();
      })
      .catch((err) => {
        console.log(err);
        isSpinWheel.value = false;
        return resolve();
      });
  });
};
defineExpose({
  open
});
</script>
