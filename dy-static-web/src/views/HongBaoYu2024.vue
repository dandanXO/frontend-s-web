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
        <!-- <img :src="require(`../assets/images/hongbaoyu/record-bg.png`)" /> -->

        <div class="contents">
          <div class="winner" v-for="(item, index) in visibleItems" :key="index">
            <div>{{ item.date }}</div>
            <div>{{ item.name }}</div>
            <div>{{ item.amount }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <img :src="require(`../assets/images/hongbaoyu/content-title.png`)" />

      <div class="contents">
        <div class="bullet-wrapper">
          <img :src="require(`../assets/images/hongbaoyu/coin-bullet.png`)" />
          <span>历史存款≥1000或以上会员均可参与限时红包活动</span>
        </div>
        <div class="bullet-wrapper">
          <img :src="require(`../assets/images/hongbaoyu/coin-bullet.png`)" />
          <span>红包金额随机不等，单个红包金额最大为1888元</span>
        </div>
        <div class="bullet-wrapper">
          <img :src="require(`../assets/images/hongbaoyu/coin-bullet.png`)" />
          <span>此奖金只需3倍有效流水即可</span>
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
        <img :src="require(`../assets/images/hongbaoyu/hongbao-bg.png`)" />
        <div class="grats">恭喜中奖！</div>
        <div class="amount">{{ winAmount }}</div>

        <div class="get-btn" @click="getPromotionPrize">点击领取</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import { claimDailyRainItem, getDailyRainListing } from "@/api/index/promo";
import { userStore } from "@/store";

const promoCode = ref("hongbaoyu");

const store = userStore();
const privilegeClaimedModalVisible = ref(true);
const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(0);
const loadingClaim = ref(false);
const getPromotion = () => {
  loadingClaim.value = true;
  claimDailyRainItem(promoCode.value)
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

const promotionListing = ref();
const visibleItems = ref([]);
const maxVisibleItems = ref(5);
const intervalId = ref(null);

const getPromotionListing = () => {
  getDailyRainListing(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        promotionListing.value = res.data;
        visibleItems.value = promotionListing.value.slice(0, maxVisibleItems.value);
        setTimeout(() => {
          const addItem = () => {
            if (visibleItems.value.length < promotionListing.value.length) {
              const nextItemIndex = promotionListing.value.length - visibleItems.value.length - 1;
              visibleItems.value.unshift(promotionListing.value[nextItemIndex]);

              setTimeout(addItem, 1500);
            } else {
              clearInterval(intervalId.value);
            }
          };
          addItem();
        }, 4000);
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

onMounted(() => {
  getPromotionListing();
});
</script>

<style scoped lang="scss">
.hongbaoyu-container {
  margin: 0px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  width: 100%;
  // width: 1440px;
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
      padding: 20px;
      background-image: url("../assets/images/hongbaoyu/record-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-bottom: 80px;
      width: 100%;
      max-width: 700px;
      .contents {
        max-height: 280px;
        overflow-y: hidden;
        scroll-behavior: smooth;
        .winner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #fee2b9;
          color: white;
          padding: 15px;
          gap: 20px;
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
    padding-right: 30px;
  }

  .grats {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 330px;
    margin-top: 0px;
    z-index: 22;
    text-align: center;
    color: #fffbfb;
    text-align: center;
    font-family: PingFang SC;
    font-size: 36px;
    font-style: normal;
    padding-left: 10px;
    font-weight: 600;
    line-height: normal;
  }

  .amount {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 270px;
    left: 0px;
    color: #fff;
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
