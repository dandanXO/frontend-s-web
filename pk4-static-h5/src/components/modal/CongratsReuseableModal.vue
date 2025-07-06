<template>
  <q-dialog class="isCentreDialog" v-model="localIsShowDialog" @hide="handleBtnClose">
    <div class="congrats-container">
      <q-btn icon="close" round dense v-close-popup class="congrats-close" />
      <div class="congrats-header">
        <img :src="computedHeaderImg" />
      </div>
      <div class="congrats-coupons">
        <img :src="computedContentImg" />
      </div>
      <div class="congrats-title">{{ bonusTitle || $t("modal.appLoginBonus.claimBonus", {amount: bonusAmount }) }}</div>
      <div v-if="bonusTxt" class="congrats-highlight-txt">{{ bonusTxt }}</div>
      <div v-else class="congrats-highlight">{{store.currency.value}} {{ !!bonusAmount ? convertToCommaAmount(bonusAmount) : 0 }}</div>

      <div class="congrats-button-container">
        <q-btn no-caps unelevated class="congrats-btn" @click="handleBtnClick">
          {{ btnTxt ? $t(`${btnTxt}`) : $t("btn.receive") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { userStore } from "src/stores";
import { ref, watch, computed } from "vue";
import { convertToCommaAmount } from "src/boot/utils";

const props = defineProps([
  "isShowDialog",
  "bonusAmount",
  "headerImg",
  "contentImg",
  "btnTxt",
  "bonusTxt",
  "bonusTitle"
]);
const emit = defineEmits(["handleBtnClick", "handleBtnClose"]);

const store= userStore()
const localIsShowDialog = ref(props.isShowDialog);

const computedHeaderImg = computed(() => {
  return props.headerImg
    ? props.headerImg
    : require(`../../assets/images/index/modal/congrats-header.png`);
});

const computedContentImg = computed(() => {
  return props.contentImg ? props.contentImg : require(`../../assets/images/index/modal/congrats-coupons.png`);
});

const handleBtnClick = () => {
  emit("handleBtnClick");
};

const handleBtnClose = () => {
  emit("handleBtnClose");
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
  background-image: unset;
  background-color: #090F1E;
  border: 1px solid #2197D8;
  border-radius: 10px !important;
  max-width: 350px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  border-radius: 12px;
  height: unset;
  aspect-ratio: unset;

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

  .congrats-highlight-txt,
  .congrats-highlight {
    color: #fff96f;
    font-size: 45px;
    text-align: center;
    // background: linear-gradient(90deg, transparent, #fff96f29, transparent);
    background-image: url(../../assets/images/index/modal/congrats-highlight-bg.png);
    padding: 0 12px;
    background-repeat: no-repeat;
    background-size: 70% 100%;
    background-position: center;
    margin-top: 16px;
  }

  .congrats-highlight-txt {
    font-size: 14px;
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
    background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
  }
}
</style>
