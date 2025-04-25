<template>
    <div>
        <div :class="{ disable: !isClaimable}" class="receive-btn" @click="onClickReceive">
            {{ $t("btn.receive") }}
        </div>
    </div>

    <q-dialog width="100%" v-model="isShowClaimPrizePopup">
        <div class="claim-dialog">
            <div class="claim-btn">
            {{ $t("btn.claim") }}
            </div>
            <div class="claim-amt" @click="closeDialog">
                Rs {{ claimPrizeAmt }}
            </div>
        </div>
    </q-dialog>
</template>
<script setup>
import { ref, onMounted, } from "vue";
import ClaimPrizePopup from "./ClaimPrizePopup.vue";
import { eventapi } from "boot/axios";
import { userStore } from "stores/index";
const isShowClaimPrizePopup = ref(false);
const store = userStore();
const isClaimable = ref(false);
const claimPrizeAmt = ref(0);
const onClickReceive = () => {
  const endpoint = "/session/app-login-bonus/claimBonus?promoCode=pak-lucky-10-day-bonus";

  eventapi.post(endpoint).then((res) => {
    if (res.code == 0) {
      claimPrizeAmt.value = res?.data;
      isShowClaimPrizePopup.value = true;
    }
  });
};
const closeDialog = () => {
    refreshBalance();
    isShowClaimPrizePopup.value = false;
}

const initData = () => {
    const endpoint = "/session/lucky-day/init?promoCode=pak-lucky-10-day-bonus";


  eventapi.get(endpoint).then((res) => {
    if (res.code == 0) {
      isClaimable.value = res?.data?.isClaimable;
    }
  });
};
const refreshBalance = () => {
  if (store.token) store.getBalance();
};

onMounted(() => {
  initData();
});
</script>
<style lang="scss" scoped>
.receive-btn {
    background: url(./img/button.png)no-repeat center center;
    background-size: contain;
    
    display: flex;
    align-items: center;
    height: 60px;
    justify-content: center;
    width: 200px;
    margin: 0 auto;
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    &.disable {
        filter: grayscale(1);
    }
}
.claim-dialog {
      width: 90%;
      height: 360px;
      background: url(./img/claimbg.png)no-repeat center center;
      margin: 0 auto;
      background-size: contain;
      position: relative;
        .claim-btn {
        bottom: 20px;
        left: 30px;
        margin: auto;
        position: absolute;
        right: 0;
        width: 75px;
        text-align: center;
        }
        .claim-amt {
            font-size: 50px;
            font-weight: bold;
            background: linear-gradient(180deg, #FFC8D7 6.73%, #FF6767 41.66%, #FF6F70 113.56%);

            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;

            // text-shadow: 2px 2px 4px #0000004d;
            position: absolute;
            bottom: 90px;
            left: 30px;
            right: 0;
            margin: auto;
            width: 200px;
            text-align: center;
        }
    }

</style>