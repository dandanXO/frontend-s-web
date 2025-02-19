<template>
  <q-dialog
    width="100%"
    v-model="isShowSpinLuckyWheelPromoPopup"
    class="spin-lucky-wheel-promo-popup"
    @update:model-value="onCloseSpinLuckyWheelPromoPopup"
  >
    <div class="spin-lucky-wheel-promo-popup-wrapper">
      <div class="banner-wrapper">
        <div class="pulse1"></div>
        <div class="pulse2"></div>
        <div class="pulse3"></div>
        <div class="pulse4"></div>
        <div class="pulse5"></div>
        <img
          @click="goToPromo"
          class="banner"
          src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/home-popup.png"
        />
      </div>
      <div class="do-not-show-again-wrapper">
        <q-checkbox v-model="isDoNotShowAgain">Do not show again</q-checkbox>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted, onActivated } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";

const EXPIRATION_TIME = 60 * 1000 * 60 * 24 * 30;

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
    isShowSpinLuckyWheelPromoPopup.value = true;
  }
};

const checkExpirationTime = () => {
  if (localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
    const currTime = Date.now();
    const prevTime = Number(localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP"));

    if (currTime - prevTime > EXPIRATION_TIME) {
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
};

defineExpose({
  isDoNotShowAgain,
  checkIsCanShowPopup
});
</script>
<style lang="scss" scoped>
.spin-lucky-wheel-promo-popup-wrapper {
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
</style>
