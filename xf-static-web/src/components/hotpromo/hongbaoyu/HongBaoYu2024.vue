<template>
  <div class="hongbaoyu-container">
    <div class="receive-container" v-if="!promoNotReady && !bonusOpened">
      <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/hongbao-bg.png`)" />
      <div class="contents" v-if="!bonusOpened">
        <el-button class="promo-common-btn" size="large" :loading="loadingClaim" @click="getPromotion">
          打开红包
        </el-button>
      </div>
    </div>

    <div class="winner-container">
      <div class="title-wrapper">
        <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/title-board.png`)" />
        <span>中奖记录</span>
      </div>

      <div class="winner-wrapper">
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
      <div class="title-wrapper">
        <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/title-board.png`)" />
        <span>活动内容</span>
      </div>

      <div class="contents">
        <div class="bullet-wrapper">
          <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/coin-bullet.png`)" />
          <span>1. 当日累积存款≥100元或以上会员均可参与限时红包活动</span>
        </div>
        <div class="bullet-wrapper">
          <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/coin-bullet.png`)" />
          <span>2. 红包金额随机不等，单个红包金额最大为1888元</span>
        </div>
        <div class="bullet-wrapper">
          <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/coin-bullet.png`)" />
          <span>3. 此奖金只需3倍有效流水即可</span>
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
        <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/claim-bg.png`)" />
        <!--        <div class="grats">恭喜中奖！</div>-->
        <div class="amount">{{ winAmount }} 元</div>

        <div class="get-btn" @click="getPromotionPrize">我知道了</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { claimDailyRainItem, getDailyRainListing } from "@/api/index/promo";
import { userStore } from "@/store";

const props = defineProps({
  promoCode: {
    type: String,
    required: true
  }
});
console.log(props);

const promoCode = ref(props.promoCode);

const store = userStore();
const privilegeClaimedModalVisible = ref(false);
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
        store.getBalance();

        bonusOpened.value = true;
      } else {
        bonusOpened.value = false;
      }
    })
    .catch((err) => {
      loadingClaim.value = false;
      console.log(err.message);
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
  background: url("../../../assets/images/promotion/hotpromo/hongbaoyu/2024/web-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .receive-container {
    position: relative;

    img {
      width: 1000px;
    }

    .contents {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 5%;
      left: 37.5%;

      .promo-common-btn {
        background: transparent;
        background-image: url("../../../assets/images/promotion/hotpromo/hongbaoyu/2024/open-btn.png") !important;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        border: unset;
        height: 100px;
        padding: 0 75px;
      }

      :deep(.el-button) {
        span {
          color: #6b3300;
          font-size: 2rem;
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

    .title-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 0 0 25px 0;

      span {
        position: absolute;
        z-index: 1;

        font-size: 1.75rem;
        font-weight: 400;
        background: linear-gradient(180deg, #ffd976 0%, #ffefc7 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    img {
      z-index: 1;
    }

    .winner-wrapper {
      position: relative;
      padding: 20px;
      background-image: url("../../../assets/images/promotion/hotpromo/hongbaoyu/2024/record-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-bottom: 80px;
      margin-top: -60px;
      min-height: 250px;
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

    .title-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 0 0 25px 0;

      span {
        position: absolute;
        z-index: 1;

        font-size: 1.75rem;
        font-weight: 400;
        background: linear-gradient(180deg, #ffd976 0%, #ffefc7 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

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
    top: 200px;
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
    margin-top: 206px;
    left: 10px;
    // left: -15px;
    color: #e8280c;
    font-size: 40px;
    font-weight: bold;
  }

  .bonus {
  }
}
.get-btn {
  color: #ffefc2;
  border-radius: 30px;
  background: #ff1300;
  position: absolute;
  border: 1px solid #fde583;
  margin-top: 350px;
  //left: 0%;
  margin-left: -15px;
  width: 150px;
  text-align: center;
  font-size: 20px;
  padding: 12px 24px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
}
</style>

<style lang="scss"></style>
