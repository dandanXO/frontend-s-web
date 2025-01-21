<template>
  <q-dialog v-model="localIsShowDialog" @hide="handleBtnClick">
    <div class="congrats-container">
      <q-btn icon="close" round dense v-close-popup class="congrats-close" />
      <div class="congrats-header">
        <img
          :src="headerImg ? require(headerImg) : require('../../assets/images/index/modal/congrats-header-v2.png')"
        />
      </div>
      <div class="congrats-coupons">
        <img :src="contentImg ? require(headerImg) : require('../../assets/images/index/modal/congrats-coupon.png')" />
      </div>
      <div class="congrats-title">Congratulations! You have unlocked bonuses</div>
      <div class="congrats-highlight">{{ !!bonusAmount ? convertToCommaAmount(bonusAmount) : 0 }}BDT</div>

      <div class="congrats-button-container">
        <q-btn no-caps unelevated class="congrats-btn" @click="handleBtnClick">
          {{ btnTxt ? $t(`${btnTxt}`) : $t("btn.receive") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import { convertToCommaAmount } from "src/boot/utils";

const props = defineProps(["isShowDialog", "bonusAmount", "headerImg", "contentImg", "btnTxt"]);
const emit = defineEmits(["handleBtnClick"]);

const localIsShowDialog = ref(props.isShowDialog);

const handleBtnClick = () => {
  emit("handleBtnClick");
};
watch(
  () => props.isShowDialog,
  (newValue) => {
    localIsShowDialog.value = newValue;
  }
);
</script>
<style lang="scss" scoped>
.congrats-container {
  background-color: #1e371f;
  border: 1px solid #337e3a;
  border-radius: 10px !important;
  max-width: 350px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  border-radius: 12px;

  &:before {
    content: "";
    background-image: url(../../assets/images/index/modal/congrats-container-light.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    top: -150px;
  }

  .congrats-header {
    display: flex;
    justify-content: center;
    margin-top: -18px;
    z-index: 2;

    img {
      display: block;
      width: 100%;
      max-width: 320px;
    }
  }

  .congrats-coupons {
    img {
      display: block;
      width: 100%;
      margin: auto;
      max-width: 240px;
    }
  }

  .congrats-title {
    color: #ffffff;
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
  }

  .congrats-highlight {
    color: #fff96f;
    font-size: 45px;
    text-align: center;
    background-image: url(../../assets/images/index/modal/congrats-highlight-bg.png);
    padding: 0 12px;
    background-repeat: no-repeat;
    background-size: 70% 100%;
    background-position: center;
    margin-top: 16px;
  }
}

.congrats-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.congrats-button-container {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  .congrats-btn {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #000a01;
  }
}
</style>
