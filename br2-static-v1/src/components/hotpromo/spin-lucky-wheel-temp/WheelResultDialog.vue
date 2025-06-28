<template>
  <q-dialog v-model="_modelValue" @hide="$emit('hide')">
    <div class="wheel-result-wrapper">
      <span class="prize">+{{ $t("hotPromo.rs") }}{{ props.prize }}</span>
      <span class="desc">Obtendrás R$ {{ props.prize }}</span>
      <button class="close-btn" v-close-popup>Okay</button>
    </div>
  </q-dialog>
</template>
<script setup>
import { computed, inject } from "vue";
import CommonButton from "./CommonButton.vue";

const props = defineProps(["modelValue", "prize"]);
const emit = defineEmits(["update:modelValue", "hide"]);

const targetWithdrawAmount = inject("targetWithdrawAmount");

const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});
</script>
<style lang="scss" scoped>
.wheel-result-wrapper {
  width: 90%;
  max-width: 375px;
  background: url(./img/N-dialog-bg.png) no-repeat;
  aspect-ratio: 290 / 296;
  background-size: 100% 100%;
  position: relative;
  min-height: 300px;

  .prize {
    position: absolute;
    top: 50%;
    width: 100%;
    font-size: 56px;
    font-weight: 900;
    background: linear-gradient(90deg, #4FFFA5 0%, #10D16F 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    text-align: center;

  }

  .desc {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    font-size: 20px;
    font-weight: 900;
    color: #000;
    text-align: center;
  }

  .close-btn {
    position: absolute;
    bottom: 8%;
    left: 50%;
    width: 80%;
    transform: translateX(-50%);
    width: 117px;
    height: 40px;
    color: #fff;
    border: 0px;
    border-radius: 8px;
    background: linear-gradient(90deg, #4FFFA5 0%, #10D16F 100%);
  }
}

@media screen and (max-width: 500px) {
  .wheel-result-wrapper {
    .prize {
      font-size: 11vw;
    }
  }
}
</style>
