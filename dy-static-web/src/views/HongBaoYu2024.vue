<template>
  <div class="hongbaoyu-container">
    <div class="receive-container" v-if="!promoNotReady && !bonusOpened">
      <img :src="require(`../assets/images/hongbaoyu/hongbao-bg.png`)" />
      <div class="contents" v-if="!bonusOpened">
        <el-button class="promo-common-btn" size="large" :loading="loadingClaim" @click="getPromotion">
          打开红包
        </el-button>
      </div>
    </div>

    <div class="winner-container">
      <img :src="require(`../assets/images/hongbaoyu/win-prize-title.png`)" />

      <div class="winner-wrapper">
        <img :src="require(`../assets/images/hongbaoyu/record-bg.png`)" />

        <div class="contents">
          <div class="winner">
            <div>2024-01-05 15:30</div>
            <div>1801****9833</div>
            <div>1000USDT*1</div>
          </div>
          <div class="winner">
            <div>2024-01-05 15:30</div>
            <div>1801****9833</div>
            <div>1000USDT*1</div>
          </div>
          <div class="winner">
            <div>2024-01-05 15:30</div>
            <div>1801****9833</div>
            <div>1000USDT*1</div>
          </div>
          <div class="winner">
            <div>2024-01-05 15:30</div>
            <div>1801****9833</div>
            <div>1000USDT*1</div>
          </div>
          <div class="winner">
            <div>2024-01-05 15:30</div>
            <div>1801****9833</div>
            <div>1000USDT*1</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <img :src="require(`../assets/images/hongbaoyu/content-title.png`)" />

      <div class="contents">
        <div class="bullet-wrapper">
          <img :src="require(`../assets/images/hongbaoyu/coin-bullet.png`)" />
          <span>所有雷火当日累积存款500元或以上会员均可参与限时红包活动</span>
        </div>
        <div class="bullet-wrapper">
          <img :src="require(`../assets/images/hongbaoyu/coin-bullet.png`)" />
          <span>红包为18-888不等，奖金只限进行电竟及体育</span>
        </div>
        <div class="bullet-wrapper">
          <img :src="require(`../assets/images/hongbaoyu/coin-bullet.png`)" />
          <span>此奖金只需1倍有效流水即可.</span>
        </div>
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
      <div class="red-packet-opened">
        <!--        <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/red-packet-opened.png`)" />-->
        <!-- <img src="../../../assets/images/promotion/hotpromo/red-packet-opened.png" /> -->
        <div class="grats">恭喜中奖！</div>
        <div class="amount">{{ winAmount }}</div>

        <div class="get-btn" @click="getPromotionPrize">点击领取</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { claimDailyRainItem } from "@/api/index/promo";
import { userStore } from "@/store";

const props = defineProps({
  promoCode: {
    type: String,
    required: true
  }
});

const store = userStore();
const privilegeClaimedModalVisible = ref(false);
const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(0);
const loadingClaim = ref(false);
const getPromotion = () => {
  loadingClaim.value = true;
  claimDailyRainItem(props.promoCode)
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
  bonusOpened.value = false;
};
</script>

<style scoped lang="scss">
.hongbaoyu-container {
  margin: 0px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  //width: 100%;
  width: 1440px;
  height: 1900px;
  background: url("../assets/images/hongbaoyu/web-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .receive-container {
    position: relative;
    top: 225px;

    img {
      width: 465px;
    }

    .contents {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 15%;
      left: 17.5%;

      .promo-common-btn {
        background: transparent;
        background-image: url("../assets/images/hongbaoyu/open-btn.png") !important;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        border: unset;
        height: 125px;
        padding: 0 125px;
      }

      :deep(.el-button) {
        span {
          color: #271500;
          font-weight: 700;
        }
      }
    }
  }

  .winner-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 150px;

    img {
      z-index: 1;
    }

    .winner-wrapper {
      position: relative;
      top: -10%;

      .contents {
        position: absolute;
        top: 0;
        left: 0;
        width: 85%;
        padding: 67.5px 87.5px 87.5px 87.5px;

        .winner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #fee2b9;
          color: white;
          padding: 15px;
        }
      }
    }
  }

  .content-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 125px;

    .contents {
      .bullet-wrapper {
        display: flex;
        align-items: center;

        span {
          color: #fcd6a3;
          font-weight: 400;
        }
      }
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
