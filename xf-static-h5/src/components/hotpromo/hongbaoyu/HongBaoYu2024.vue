<template>
  <div class="hongbaoyu-container">
    <div class="empty-container"></div>
    <div class="receive-container" v-if="!promoNotReady && !bonusOpened">
      <img
        :src="
          require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/hongbao-bg.png`)
        "
        style="display: block; width: 100%"
      />
      <div class="contents" v-if="!bonusOpened">
        <el-button
          class="promo-common-btn"
          size="large"
          :loading="loadingClaim"
          @click="getPromotion"
        >
          打开红包
        </el-button>
      </div>
    </div>

    <div class="winner-container">
      <div class="title-wrapper">
        <img
          class="title"
          :src="
            require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/title-board.png`)
          "
        />
        <span>中奖记录</span>
      </div>

      <div class="winner-wrapper">
        <div class="contents">
          <div
            class="winner"
            v-for="(item, index) in visibleItems"
            :key="index"
          >
            <div>{{ item.date }}</div>
            <div>{{ item.name }}</div>
            <div>{{ item.amount }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <div class="title-wrapper">
        <img
          class="title"
          :src="
            require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/title-board.png`)
          "
        />
        <span>活动内容</span>
      </div>

      <div class="contents">
        <div class="bullet-wrapper">
          <img
            :src="
              require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/coin-bullet.png`)
            "
          />
          <span>1. 历史存款≥1000元或以上会员均可免费参与限时红包活动</span>
        </div>
        <div class="bullet-wrapper">
          <img
            :src="
              require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/coin-bullet.png`)
            "
          />
          <span>2. 红包金额随机不等，单个红包金额最大为1888元</span>
        </div>
        <div class="bullet-wrapper">
          <img
            :src="
              require(`../../../assets/images/promotion/hotpromo/hongbaoyu/2024/coin-bullet.png`)
            "
          />
          <span>3. 此奖金只需3倍有效流水即可</span>
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="isClaimModal">
    <q-card class="bg-transparent no-shadow">
<!--      <div class="close-btn">-->
<!--        <q-btn-->
<!--          @click="isClaimModal = false"-->
<!--          v-close-popup-->
<!--          rounded-->
<!--          icon="close"-->
<!--          color="white"-->
<!--          height="40"-->
<!--          width="40"-->
<!--        ></q-btn>-->
<!--      </div>-->

      <q-card-section class="row items-center">
        <div class="red-packet-opened">
          <img
            :src="
              require(`../../../assets/images/promotion/hotpromo/hongbaoyu/claim-bg.png`)
            "
          />

<!--          <span class="grats">恭喜获得奖金</span>-->
          <span class="amount">{{ winAmount }} 元</span>
        </div>

        <div class="get-btn" @click="getPromotionPrize">我知道了</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { eventapi } from "boot/axios";
import { userStore } from "src/stores";
const props = defineProps({
  promoCode: {
    type: String,
    required: true
  }
});
const store = userStore();
const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(0);
const isClaimModal = ref(false);
const loadingClaim = ref(false);
const promoCode = ref(props.promoCode);

const getPromotion = () => {
  loadingClaim.value = true;
  eventapi
    .get(`/redPacketVip/claim?promoCode=${promoCode.value}`)
    .then((res) => {
      if (res.code === 0) {
        winAmount.value = res.data.lastDigitAmount + res.data.vipAmount;
        loadingClaim.value = false;

        isClaimModal.value = true;

        bonusOpened.value = true;
        store.getBalance();
      } else {
        bonusOpened.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
      loadingClaim.value = false;
      bonusOpened.value = false;
    });
};

const getPromotionPrize = () => {
  store.getBalance();
  isClaimModal.value = false;
  bonusOpened.value = false;
};

const promotionListing = ref();
const visibleItems = ref([]);
const maxVisibleItems = ref(5);
const intervalId = ref(null);

const getPromotionListing = () => {
  eventapi
    .get(`/redPacketVip/list?promoCode=${promoCode.value}`)
    .then((res) => {
      if (res.code === 0) {
        promotionListing.value = res.data;
        visibleItems.value = promotionListing.value.slice(
          0,
          maxVisibleItems.value
        );
        setTimeout(() => {
          const addItem = () => {
            if (visibleItems.value.length < promotionListing.value.length) {
              const nextItemIndex =
                promotionListing.value.length - visibleItems.value.length - 1;
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
  background: url("../../../assets/images/promotion/hotpromo/hongbaoyu/2024/mobile-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  // height: 940px;
  padding-bottom: 120px;
  background-color: #d60202;

  .empty-container {
    height: 75px;
  }

  .receive-container {
    position: relative;
    margin: 0 0 25px 0;

    .contents {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 2.5%;
      left: 50%;
      transform: translate(-50%, 0);

      .promo-common-btn {
        background: transparent;
        background-image: url("../../../assets/images/promotion/hotpromo/hongbaoyu/2024/open-hongbao-btn.png") !important;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        border: unset;
        aspect-ratio: 392/168;
        padding: 20px 50px;
        color: #6b3300;
        font-weight: 700;
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

    .title-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .title {
        width: 50% !important;
        z-index: 1;
      }

      span {
        position: absolute;
        z-index: 1;

        font-size: 1rem;
        font-weight: 400;
        background: linear-gradient(180deg, #ffd976 0%, #ffefc7 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .winner-wrapper {
      position: relative;
      padding: 20px;
      background-image: url("../../../assets/images/promotion/hotpromo/hongbaoyu/2024/record-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;

      .contents {
        max-height: 120px;
        overflow-y: hidden;
        scroll-behavior: smooth;

        .winner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #fee2b9;
          color: white;
          padding: 2px 10px;
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
    margin-top: 30px;

    .title-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .title {
        width: 50% !important;
      }

      span {
        position: absolute;
        z-index: 1;

        font-size: 1rem;
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
    padding-right: 15px;
  }

  .grats {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 58%;
    color: #fffbfb;
    text-align: center;
    font-family: PingFang SC;
    font-size: 1.3em;
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
    margin-top: 41%;
    // left: -15px;
    color: #E8280C;
    font-size: 1.8em;
    font-weight: bold;
    padding-left: 10px;
  }

}


.get-btn {
  color: #FFEFC2;
  border-radius: 30px;
  background: #FF1300;
  position: absolute;
  border: 1px solid #FDE583;
  font-size: 16px;
  padding: 6px 26px;
  bottom: 0%;
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
  width: 140px;
  left: 0;
  right: 10px;

  &:hover {
    filter: brightness(0.9);
  }
}
</style>

<style lang="scss">
//.banner-container {
//  display: none !important;
//}
</style>
