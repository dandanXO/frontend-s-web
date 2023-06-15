<template>
  <div>
    <div class="receive-container">
      <button v-if="promoNotReady && bonusOpened" class="check-tip">
        活动未开启
      </button>
      <div
        @click="getPromotion"
        v-if="!promoNotReady && !bonusOpened"
        class="receive-btn"
      >
        <img
          src="../../../assets/images/promotion/hotpromo/hongbaoyu/package_light.png"
        />
      </div>
      <p v-if="bonusOpened" class="money-account">
        <span>{{ winAmount }}</span
        >元
      </p>
      <div class="red-packet" :class="bonusOpened ? 'open' : ''"></div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { claimBonusItem } from "@/api/index/promo";
const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(0);
const getPromotion = () => {
  claimBonusItem("red-packet-rain")
    .then((res) => {
      if (res.code === 0) {
        winAmount.value = res.data;

        // this.privilegeClaimedModalVisible = true;
        // this.loadingClaim = false;
        // this.store.getBalance();

        bonusOpened.value = true;
      } else {
        // ElMessage.error(res.message)
        bonusOpened.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
      // message.error(err.message, 4);
      bonusOpened.value = false;
    });
};
</script>

<style scoped lang="scss">
.receive-container {
  margin: 0.55rem auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 200px;
  background: url(../../../assets/images/promotion/hotpromo/hongbaoyu/hongbaoyu.png)
    no-repeat center center;
  background-size: contain;
  .red-packet {
    width: 50%;
    height: 200px;
    margin: 0 auto;
    background: url(../../../assets/images/promotion/hotpromo/hongbaoyu/package_red.png)
      no-repeat center center;
    background-size: contain;
    &.open {
      background-image: url(../../../assets/images/promotion/hotpromo/hongbaoyu/img_repacket_open.png);
    }
  }
  .check-tip,
  .money-account,
  .receive-btn {
    position: absolute;
  }
  .check-tip {
    color: #ccc;
    background-color: grey;
    min-height: 1rem;
    border-radius: 30px;
    border: none;
    white-space: normal;
    padding: 5px 15px;
    text-align: center;
    left: 0;
    right: 0;
    bottom: 0px;
    margin: auto;
    width: 90px;
  }
  .money-account {
    left: 0;
    right: 0;
    top: 20px;
    margin: auto;
    text-align: center;
    font-size: 1.5rem;
    span {
      font-size: 2.5rem;
    }
  }

  .receive-btn {
    text-align: center;
    line-height: 0.83rem;
    color: #fff;
    padding: 0;
    margin: 0.3rem auto 0;
    width: 180px;
    left: 0;
    right: 0;
    bottom: -15px;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
}
</style>
