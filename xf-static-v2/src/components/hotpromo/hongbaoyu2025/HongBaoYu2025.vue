<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section section-bg cny">
        <img
          src="../../../assets/images/promotion/hotpromo/hongbaoyu/red-packet-2025.png"
          alt=""
          @click="getPromotion"
          :class="{ loading: loadingClaim }"
        />
      </div>
    </div>
  </div>
  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <div class="close-btn">
        <q-btn
          @click="isClaimModal = false"
          v-close-popup
          rounded
          icon="close"
          color="white"
          height="40"
          width="40"
        ></q-btn>
      </div>

      <q-card-section class="row items-center">
        <div class="red-packet-opened">
          <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/red-packet-opened.png`)" />

          <span class="grats">恭喜获得奖金</span>
          <span class="amount">{{ winAmount }}元</span>
          <div class="get-btn" @click="getPromotionPrize">点击领取</div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps } from "vue";
import { eventapi } from "src/boot/axios";
import { ref } from "vue";
import { userStore } from "src/stores";

const store = userStore();
const winAmount = ref(0);
const isClaimModal = ref(false);
const loadingClaim = ref(false);

const props = defineProps({
  promoCode: {
    type: String,
    required: true
  }
});

const getPromotion = () => {
  loadingClaim.value = true;
  const randNum = Math.floor(Math.random() * 1000) + 1;
  eventapi
    .get(`/redPacketVip/claim?promoCode=${props.promoCode}&v=${randNum}`)
    .then((res) => {
      if (res.code === 0) {
        winAmount.value = res.data.lastDigitAmount + res.data.vipAmount;
        isClaimModal.value = true;

        store.getBalance();
      }
    })
    .catch(() => {})
    .finally(() => {
      loadingClaim.value = false;
    });
};

const getPromotionPrize = () => {
  store.getBalance();
  isClaimModal.value = false;
};
</script>

<style scoped lang="scss">
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}

.livepoker-rebate-container {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  // padding: 20px 12px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: url("../../../assets/images/promotion/hotpromo/hongbaoyu2025/section-bg-w-decor.png") !important;
  background-size: 100% 100% !important;
  border: none !important;

  img {
    width: 200px !important;
    &.loading {
      filter: grayscale(100%);
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}

.livepoker-rebate-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.tab-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;

  .tab {
    width: 160px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60px;
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    color: #818181;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;

    &.active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
    }
  }
}

.red-packet-opened {
  position: relative;
  img {
    display: block;
    width: 100%;
  }

  .grats {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 20%;
    color: #fffbfb;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    padding-right: 10px;
  }

  .amount {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 45%;
    // left: -15px;
    color: #f23b1d;
    font-size: 36px;
    font-weight: bold;
    padding-right: 10px;
  }

  .get-btn {
    color: #f23b1d;
    border-radius: 30px;
    background: linear-gradient(180deg, #fdf4ee 0%, #fff3c0 100%);
    position: absolute;

    font-size: 16px;
    padding: 4px 16px;
    bottom: 17%;
    display: flex;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    width: 100px;
    left: 0;
    right: 10px;

    &:hover {
      filter: brightness(0.9);
    }
  }
}
</style>
