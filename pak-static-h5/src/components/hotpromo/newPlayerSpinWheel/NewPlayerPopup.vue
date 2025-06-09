<template>

<div class="spin-lucky-container">
  <div class="controller-wrapper">
    <slot name="controller" />
  </div>
  <NewPlayerWheel :hasUnusedCoupons="props.hasUnusedCoupons"  />
  </div>
</template>
<script setup>
import { ref, onMounted, onActivated } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { defineEmits } from "vue";
import NewPlayerWheel from "./NewPlayerWheel.vue";
import moment from "moment";
const props = defineProps([
  "hasUnusedCoupons"
])
const emits = defineEmits(["closeDialog"]);
const store = userStore();
const isDoNotShowAgain = ref(false);

const isShowSpinLuckyWheelPromoPopup = ref(false);
const onCloseSpinLuckyWheelPromoPopup = () => {
  if (isDoNotShowAgain.value) {
    localStorage.setItem("SPIN_LUCKY_WHEEL_POPUP", Date.now());
    isShowSpinLuckyWheelPromoPopup.value = false;
  }

  sessionStorage.setItem("SPIN_LUCKY_WHEEL_POPUP", "1");
};

const checkIsCanShowPopup = () => {
  console.log("Checking if can show popup...");
  if (localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
    console.log("Do not show again status ongoing...");
    return;
  }

  if (sessionStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
    console.log("Do not show again status ongoing...");
    return;
  }

  if (store.hasToken()) {
    setTimeout(() => {
      isShowSpinLuckyWheelPromoPopup.value = true;
    }, 750);
  }
};

const checkExpirationTime = () => {
  const preTimeStr = localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP");
  if (preTimeStr) {
    const currTime = moment().startOf("day");
    const prevTime = moment(Number(preTimeStr));
    const diff = currTime.diff(prevTime, "milliseconds");

    if (diff > 0) {
      localStorage.removeItem("SPIN_LUCKY_WHEEL_POPUP");
      isDoNotShowAgain.value = false;
    }
  }
};

onActivated(() => {
  checkExpirationTime();
});

onMounted(() => {
  checkExpirationTime();
});

const router = useRouter();

const goToPromo = () => {
  router.push("/promo?name=spin-lucky-wheel");
  emits('closeDialog');
};

defineExpose({
  isDoNotShowAgain,
  checkIsCanShowPopup
});
</script>
<style lang="scss" scoped>
.spin-lucky-wheel-promo-popup-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;

  .banner {
    max-width: 90%;
    width: 100%;
  }

  .do-not-show-again-wrapper {
    background-color: #1e1f24;
    border: 1px solid rgb(255 255 255 / 10%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 10px;
    border-radius: 4px;
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
  bottom: 5%;
  right: 3%;
}

.pulse2 {
  bottom: 3%;
  left: 4%;
}

.pulse3 {
  bottom: 1%;
  left: 46%;
}

.pulse4 {
  bottom: 3%;
  right: 22%;
}

.pulse5 {
  bottom: 1%;
  left: 19%;
}

.banner-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-close {
  position: absolute;
  right: 0;
  top: 0;
}


.spin-lucky-container {
  background: url(../../../assets/images/promotion/hotpromo/bonus-spinwheel/frame-bg.png)no-repeat center center;
  background-size: contain;
  max-width: 400px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  border-radius: 12px;
  min-height: 640px;
  .controller-wrapper { 
    width: fit-content;   
    margin: 190px auto 100px;
    max-width: 280px;
    
  }
}
</style>
