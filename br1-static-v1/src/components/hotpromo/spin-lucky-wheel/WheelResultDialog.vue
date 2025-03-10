<template>
  <q-dialog v-model="_modelValue" @hide="$emit('hide')">
    <div class="wheel-result-wrapper">
      <span class="prize">+{{store.currency.value}} {{ props.prize?.toFixed(4) }}</span>
      <CommonButton class="close-btn" v-close-popup>Tudo bem</CommonButton>
    </div>
  </q-dialog>
</template>
<script setup>
import { computed } from "vue";
import CommonButton from "./CommonButton.vue";
import { userStore } from "stores/index";

const store = userStore();
const props = defineProps(["modelValue", "prize"]);
const emit = defineEmits(["update:modelValue", "hide"]);

const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});
</script>
<style lang="scss" scoped>
.wheel-result-wrapper {
  width: 75%;
  max-width: 375px;
  background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/envelope-simply.png) no-repeat;
  aspect-ratio: 290 / 296;
  background-size: cover;
  position: relative;

  .prize {
    position: absolute;
    top: 22%;
    width: 100%;
    font-size: 30px;
    font-weight: 900;
    color: #8100ae;
    text-align: center;
    letter-spacing: -1px;
  }

  .close-btn {
    position: absolute;
    bottom: 2%;
    left: 50%;
    width: 80%;
    transform: translateX(-50%);
  }
}

@media screen and (max-width: 500px) {
  .wheel-result-wrapper {
    .prize {
      font-size: 22px;
    }
  }
}
</style>
