<template>
  <div>
    <!--    <button v-if="promoNotReady && bonusOpened" class="check-tip">活动未开启</button>-->
    <div class="receive-container" v-if="!promoNotReady && !bonusOpened">
      <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/icon.png`)" />
      <div class="contents" v-if="!bonusOpened">
        <el-button class="promo-common-btn" size="large" :loading="loadingClaim" @click="getPromotion">
          点击领取
        </el-button>
      </div>
    </div>
  </div>

  <el-dialog class="award-modal" :modal="false" v-model="privilegeClaimedModalVisible" align-center>
    <div class="modal-div">
      <span class="img-item">
        <div class="inner-contents">
          <div class="amount">{{ winAmount }}</div>
          <div class="bonus">奖金</div>
        </div>
      </span>
      <img src="../../../assets/images/index/bonus.svg" />
    </div>
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import { claimDailyRainItem } from "@/api/index/promo";
import { userStore } from "@/store";

const store = userStore();
const privilegeClaimedModalVisible = ref(false);
const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(0);
const loadingClaim = ref(false);
const getPromotion = () => {
  loadingClaim.value = true;
  claimDailyRainItem("dy-red-packet-rain")
    .then((res) => {
      loadingClaim.value = false;
      if (res.code === 0) {
        winAmount.value = res.data.lastDigitAmount + res.data.vipAmount;

        privilegeClaimedModalVisible.value = true;
        // lastDigitAmount:0
        // redPacketSequence:1
        // vipAmount:0.6
        store.getBalance();

        bonusOpened.value = true;
      } else {
        // ElMessage.error(res.message)
        bonusOpened.value = false;
      }
    })
    .catch((err) => {
      loadingClaim.value = false;
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
  justify-content: center;
  flex-direction: column;
  position: relative;
  width: 100%;
  //background: url(../../../assets/images/promotion/hotpromo/hongbaoyu/hongbaoyu.png) no-repeat center center;
  //background-size: contain;

  //.red-packet {
  //  width: 50%;
  //  height: 200px;
  //  margin: 0 auto;
  //  background: url(../../../assets/images/promotion/hotpromo/hongbaoyu/package_red.png) no-repeat center center;
  //  background-size: contain;
  //}

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
