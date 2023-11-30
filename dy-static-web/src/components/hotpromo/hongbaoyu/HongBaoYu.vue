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

  <el-dialog
    class="award-modal hongbaoyu-modal"
    :close-on-click-modal="false"
    :modal="false"
    v-model="privilegeClaimedModalVisible"
    align-center
  >
    <div class="modal-div">
      <!-- <span class="img-item">
        <div class="inner-contents">
          <div class="amount">{{ winAmount }}</div>
          <div class="bonus">奖金</div>
        </div>
      </span> -->

      <div class="red-packet-opened">
        <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/red-packet-opened.png`)" />
        <!-- <img src="../../../assets/images/promotion/hotpromo/red-packet-opened.png" /> -->
        <div class="grats">恭喜中奖！</div>
        <div class="amount">{{ winAmount }}</div>

        <div class="get-btn" @click="getPromotionPrize">点击领取</div>
      </div>
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

const getPromotionPrize = () => {
  store.getBalance();
  privilegeClaimedModalVisible.value = false;
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

.modal-div {
  width: 100%;
}

.red-packet-opened {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  img {
    width: 500px;
  }

  .grats {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 100px;

    color: #fffbfb;

    text-align: center;
    font-family: PingFang SC;
    font-size: 36px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .amount {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 250px;
    left: -15px;
    color: #f23b1d;
    font-size: 50px;
    font-weight: bold;
  }

  .bonus {
  }

  .get-btn {
    color: #f23b1d;
    border-radius: 30px;
    background: linear-gradient(180deg, #fdf4ee 0%, #fff3c0 100%);
    position: absolute;
    margin-top: 270px;
    margin-left: -15px;
    font-size: 20px;
    padding: 12px 24px;
    cursor: pointer;

    &:hover {
      filter: brightness(0.9);
    }
  }
}
</style>

<style lang="scss">
.hongbaoyu-modal {
  .el-dialog__header .el-dialog__headerbtn {
    display: none !important;
  }
}
</style>
