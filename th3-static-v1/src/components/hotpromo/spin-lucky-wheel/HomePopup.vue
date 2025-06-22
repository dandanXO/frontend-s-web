<template>
    <q-dialog width="100%" v-model="isShowSpinLuckyWheelPromoPopup" class="spin-lucky-wheel-promo-popup"
        @update:model-value="onCloseSpinLuckyWheelPromoPopup">


      <div class="">
        <div class="spin-lucky-wheel-promo-popup-wrapper">
          <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
            <div class="banner-wrapper">
                <div class="pulse1"></div>
                <div class="pulse2"></div>
                <div class="pulse3"></div>
                <div class="pulse4"></div>
                <div class="pulse5"></div>
                <img @click="goToPromo" class="banner"
                src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/home-popup.png" />
            </div>
            <div class="do-not-show-again-wrapper">
                <q-checkbox v-model="isDoNotShowAgain">
                    ไม่ต้องแสดงอีก
                </q-checkbox>
            </div>
        </div>
      </div>
    </q-dialog>
</template>
<script setup>
import { ref, onMounted, onActivated, inject } from 'vue';
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { api, eventapi } from "boot/axios";
import { storeToRefs } from 'pinia';

const store = userStore();
const isDoNotShowAgain = ref(false);
const { spinWheelLuckyPromoInfo: info } = storeToRefs(store);
const isShowSpinLuckyWheelPromoPopup = ref(false);

const onCloseSpinLuckyWheelPromoPopup = () => {
  if(isDoNotShowAgain.value) {
    localStorage.setItem("SPIN_LUCKY_WHEEL_POPUP", Date.now());
    isShowSpinLuckyWheelPromoPopup.value = false;
  }

  sessionStorage.setItem("SPIN_LUCKY_WHEEL_POPUP", '1');
}

const checkIsCanShowPopup = () => {
    if(localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
        console.log('Do not show again status ongoing...');
        return;
    }

    if(sessionStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
        console.log('Do not show again status ongoing...');
        return;
    }

    if(store.hasToken()) {
        if (info.value) {
            isShowSpinLuckyWheelPromoPopup.value = true;
        }
    } else if(!sessionStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
        api.get("/config/uiconfigs").then((res) => {
            if(res.code === 0 && res.data?.spinwheel_promo === '1') {
                isShowSpinLuckyWheelPromoPopup.value = true;
            }
        })
    }
}

onActivated(() => {
    if(localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
        const currTime = Date.now();
        const prevTime = Number(localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP"));

        if (currTime - prevTime > 60 * 1000 * 60 * 24 * 7) {
            localStorage.removeItem("SPIN_LUCKY_WHEEL_POPUP");
            isDoNotShowAgain.value = false;
        }
    }
})

onMounted(() => {
    if(localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
        const currTime = Date.now();
        const prevTime = Number(localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP"));

        if (currTime - prevTime > 60 * 1000 * 60 * 24 * 7) {
            localStorage.removeItem("SPIN_LUCKY_WHEEL_POPUP");
            isDoNotShowAgain.value = false;
        }
    }
})


const router = useRouter()

const goToPromo = () => {
  if(!store.hasToken()){
    router.push("/login")
  }else{
    router.push("/promo?name=spin-lucky-wheel")
  }

}

defineExpose({
    isDoNotShowAgain,
    checkIsCanShowPopup
})
</script>
<style lang="scss" scoped>
.spin-lucky-wheel-promo-popup-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;

  .bg-yellow{
    margin-left: auto;
    margin-right: 12px;
  }

    .banner {
        max-width: 90%;
        width: 100%;
    }

    .do-not-show-again-wrapper {
        background-color: #1E1F24;
        border: 1px solid rgb(255 255 255 / 10%);
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: 10px;
        border-radius: 4px;
    }
}


.pulse1, .pulse2, .pulse3, .pulse4, .pulse5 {
    width: 30px;
    background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/sparkle.gif) no-repeat;
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
