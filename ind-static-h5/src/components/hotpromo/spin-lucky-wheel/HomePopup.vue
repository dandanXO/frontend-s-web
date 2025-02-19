<template>
    <q-dialog width="100%" v-model="isShowSpinLuckyWheelPromoPopup" class="spin-lucky-wheel-promo-popup"
        @update:model-value="onCloseSpinLuckyWheelPromoPopup">
        <div class="spin-lucky-wheel-promo-popup-wrapper">
            <img @click="goToPromo" class="banner"
                src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/home-popup.png" />
            <div class="do-not-show-again-wrapper">
                <q-checkbox v-model="isDoNotShowAgain">
                    Do not show again
                </q-checkbox>
            </div>
        </div>
    </q-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { api, eventapi } from "boot/axios";

const store = userStore();
const isDoNotShowAgain = ref(false);

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
        eventapi.post("/refer-spin/check").then((res) => {
            if (res.code === 0) {
                isShowSpinLuckyWheelPromoPopup.value = true;
            }
        });
    } else if(!sessionStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
        api.get("/config/uiconfigs").then((res) => {
            if(res.code === 0 && res.data?.spinwheel_promo === '1') {
                isShowSpinLuckyWheelPromoPopup.value = true;
            }
        })
    }
}

onMounted(() => {
    if(localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
        const currTime = Date.now();
        const prevTime = Number(localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP"));
        
        if (currTime - prevTime > 60 * 1000 * 60 * 24 * 30) {
            localStorage.removeItem("SPIN_LUCKY_WHEEL_POPUP");
        }
    }
})


const router = useRouter()

const goToPromo = () => {
    router.push("/promo?name=spin-lucky-wheel")
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
</style>
