<template>
  <q-dialog v-model="_modelValue" @hide="$emit('hide')">
    <div class="wheel-result-wrapper">
      <span class="prize">+{{ $t("hotPromo.rs") }}{{ props.prize }}</span>
      <span class="desc">{{$t("hotPromo.withdraw_money_over_rs") }}{{ targetWithdrawAmount }}</span>
      <CommonButton class="close-btn" v-close-popup>Okay</CommonButton>
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
  width: 75%;
  max-width: 375px;
  background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/envelope-simply.png) no-repeat;
  aspect-ratio: 290 / 296;
  background-size: 100% 100%;
  position: relative;
  min-height: 300px;

  .prize {
    position: absolute;
    top: 20%;
    width: 100%;
    font-size: 36px;
    font-weight: 900;
    color: #ee281d;
    text-align: center;
  }

  .desc {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    font-size: 20px;
    font-weight: 900;
    color: #ee281d;
    text-align: center;
  }

  .close-btn {
    position: absolute;
    bottom: 9%;
    left: 50%;
    width: 80%;
    transform: translateX(-50%);
    // background-image: url('../../../assets/images/promotion/hotpromo/spin-lucky-wheel/common-btn-gold.png');
    // color: #8A2C05;
    
    background: unset;
        color: #D01608;
    min-height: 60px;

    &.common-btn {
      background-size: 100% 100%;
    }
  }
}

@media screen and (max-width: 500px) {
  .wheel-result-wrapper {
    .prize {
      font-size: 34px;
    }
  }
}
</style>
