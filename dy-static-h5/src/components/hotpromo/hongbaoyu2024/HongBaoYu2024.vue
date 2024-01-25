<template>
  <div class="hongbaoyu-container">
    <div class="receive-container" v-if="!promoNotReady && !bonusOpened">
      <img :src="require(`../../../assets/images/hongbaoyu/hongbao-bg.png`)" />
      <div class="contents" v-if="!bonusOpened">
        <el-button class="promo-common-btn" size="large" :loading="loadingClaim" @click="getPromotion"></el-button>
      </div>
    </div>

    <div class="winner-container">
      <img class="title" :src="require(`../../../assets/images/hongbaoyu/win-prize-title.png`)" />

      <div class="winner-wrapper">
        <img :src="require(`../../../assets/images/hongbaoyu/record-bg.png`)" />

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
      <img class="title" :src="require(`../../../assets/images/hongbaoyu/content-title.png`)" />

      <div class="contents">
        <div class="bullet-wrapper">
          <img :src="require(`../../../assets/images/hongbaoyu/coin-bullet.png`)" />
          <span>所有雷火当日累积存款500元或以上会员均可参与限时红包活动</span>
        </div>
        <div class="bullet-wrapper">
          <img :src="require(`../../../assets/images/hongbaoyu/coin-bullet.png`)" />
          <span>红包为18-888不等，奖金只限进行电竟及体育</span>
        </div>
        <div class="bullet-wrapper">
          <img :src="require(`../../../assets/images/hongbaoyu/coin-bullet.png`)" />
          <span>此奖金只需1倍有效流水即可.</span>
        </div>
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
          <!--          <img :src="require(`../../../../../../../../../assets/images/promotion/hotpromo/hongbaoyu/red-packet-opened.png`)" />-->

          <span class="grats">恭喜获得奖金</span>
          <span class="amount">{{ winAmount }}</span>
          <div class="get-btn" @click="getPromotionPrize">点击领取</div>
        </div>
      </q-card-section>

      <!-- <q-card-actions align="center">
        <q-btn flat label="确定" color="primary" v-close-popup />
      </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>
<script setup>
import { defineProps } from "vue";
import { eventapi } from "boot/axios";
import { ref } from "vue";
import { userStore } from "src/stores";

const store = userStore();
const promoNotReady = ref(false);
const bonusOpened = ref(false);
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
  eventapi
    .get(`/redPacketVip/claim?promoCode=${props.promoCode}`)
    .then((res) => {
      if (res.code === 0) {
        winAmount.value = res.data.lastDigitAmount + res.data.vipAmount;
        loadingClaim.value = false;

        isClaimModal.value = true;

        bonusOpened.value = true;
        store.getBalance();
      } else {
        // ElMessage.error(res.message)
        bonusOpened.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
      // message.error(err.message, 4);
      loadingClaim.value = false;
      // isClaimModal.value= true;
      bonusOpened.value = false;
    });
};

const getPromotionPrize = () => {
  store.getBalance();
  isClaimModal.value = false;
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

  background: url("../../../assets/images/hongbaoyu/mobile-bg.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
  height: 1080px;

  .receive-container {
    position: relative;
    width: 50%;

    .contents {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 10%;
      left: 7.5%;

      .promo-common-btn {
        background: transparent;
        background-image: url("../../../assets/images/hongbaoyu/open-hongbao-btn.png") !important;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        border: unset;
        height: 100px;
        padding: 0 100px;
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

    .title {
      width: 50% !important;
      z-index: 1;
    }

    .winner-wrapper {
      position: relative;
      top: -15%;
      padding: 0 10px;

      .contents {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 15px 30px;

        .winner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #fee2b9;
          color: white;
          padding: 2px 10px;
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

    .title {
      width: 50% !important;
    }

    .contents {
      .bullet-wrapper {
        display: flex;
        align-items: center;

        img {
          width: 20px;
        }

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
    font-family: PingFang SC;
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
    padding-right: 15px;
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
