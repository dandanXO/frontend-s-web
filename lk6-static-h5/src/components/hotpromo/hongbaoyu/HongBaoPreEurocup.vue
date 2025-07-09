<template>
  <div class="hongbaoyu-container">
    <!--      <div class="hongbao-subtitle">-->
    <!--        <img src="../../../assets/images/promotion/hotpromo/hongbaoyu/eurocup/subtitle-01.png" />-->
    <!--      </div>-->

    <div class="receive-container" v-if="!promoNotReady && !bonusOpened">
      <div class="contents" v-if="!bonusOpened">
        <div @click="getPromotion" class="hongbao-open">
          <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/claimbg-new.png`)" />
        </div>
      </div>
    </div>

    <!--    <div class="winner-container">-->
    <!--      <div class="title-wrapper">-->
    <!--        <img-->
    <!--          class="title"-->
    <!--          :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/eurocup/hongbao-ribbon.png`)"-->
    <!--        />-->
    <!--        <span>中奖记录</span>-->
    <!--      </div>-->

    <!--      <div class="winner-wrapper">-->
    <!--        <div class="contents">-->
    <!--          <div class="winner" v-for="(item, index) in visibleItems" :key="index">-->
    <!--            <div>{{ item.date }}</div>-->
    <!--            <div>{{ item.name }}</div>-->
    <!--            <div class="amount-txt">{{ item.amount.toFixed(2) }}</div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="content-container">-->
    <!--      <div class="hongbao-subtitle">-->
    <!--        <img src="../../../assets/images/promotion/hotpromo/hongbaoyu/eurocup/subtitle-02.png" />-->
    <!--      </div>-->

    <!--      <div class="contents">-->
    <!--        <div class="event-details">-->
    <!--          <div class="details-item">-->
    <!--            <div class="event-frame">活动时间</div>-->
    <!--            <div class="event-txt">{{ getDateRange(promoParam) }}</div>-->
    <!--          </div>-->

    <!--          <div class="details-item">-->
    <!--            <div class="event-frame">活动对象</div>-->
    <!--            <div class="event-txt">东赢全体会员</div>-->
    <!--          </div>-->

    <!--          <div class="details-item">-->
    <!--            <div class="event-frame">活动期间</div>-->
    <!--            <div class="event-txt">-->
    <!--              根据欧洲杯赛事-->
    <!--              <span class="color-red">当日进球粒数</span>-->
    <!--              派发开启红包雨，-->
    <!--              <span class="color-red">所有会员</span>-->
    <!--              均可参与，红包仅需-->
    <!--              <span class="color-red">一倍流水</span>-->
    <!--              即可转出。-->
    <!--            </div>-->
    <!--          </div>-->

    <!--          <table class="details-table" border="0" cellpadding="0" cellspacing="0">-->
    <!--            <thead>-->
    <!--              <tr>-->
    <!--                <td>进*粒球</td>-->
    <!--                <td>红包雨总奖金</td>-->
    <!--                <td>流水倍数</td>-->
    <!--              </tr>-->
    <!--            </thead>-->
    <!--            <tbody>-->
    <!--              <tr>-->
    <!--                <td>≥1</td>-->
    <!--                <td>10,000</td>-->
    <!--                <td>1倍/不限场馆</td>-->
    <!--              </tr>-->
    <!--              <tr>-->
    <!--                <td>≥3</td>-->
    <!--                <td>50,000</td>-->
    <!--                <td>1倍/不限场馆</td>-->
    <!--              </tr>-->
    <!--              <tr>-->
    <!--                <td>≥5</td>-->
    <!--                <td>100,000</td>-->
    <!--                <td>1倍/不限场馆</td>-->
    <!--              </tr>-->
    <!--            </tbody>-->
    <!--          </table>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="content-container">-->
    <!--      <div class="hongbao-subtitle">-->
    <!--        <img src="../../../assets/images/promotion/hotpromo/hongbaoyu/eurocup/subtitle-03.png" />-->
    <!--      </div>-->

    <!--      <div class="contents">-->
    <!--        <div class="rules-content">-->
    <!--          <div v-html="promoContent" />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>

  <q-dialog v-model="isClaimModal">
    <q-card class="bg-transparent no-shadow">
      <q-card-section class="row items-center">
        <div class="red-packet-opened">
          <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/claim-bg.png`)" />

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
  },
  pageContent: {
    type: String,
    required: true
  },
  promoParam: {
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
const promoContent = ref(props.pageContent);
const promoParam = ref(props.promoParam);

const getDateRange = (param) => {
  try {
    const promoObject = JSON.parse(param);
    const dateTimeRange = promoObject["datetime"].trim(); // Trim the property name
    return dateTimeRange;
  } catch (error) {
    console.error("Error parsing promoParam:", error);
    return "";
  }
};

const getPromotion = () => {
  if (loadingClaim.value) return;
  loadingClaim.value = true;

  const randNum = Math.floor(Math.random() * 1000) + 1;
  eventapi
    .get(`/redPacketVip/claim?promoCode=${promoCode.value}&v=${randNum}`)
    .then((res) => {
      if (res.code === 0) {
        winAmount.value = res.data.lastDigitAmount + res.data.vipAmount;
        loadingClaim.value = false;

        isClaimModal.value = true;

        // bonusOpened.value = true;
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

      /** draft data **/
      // visibleItems.value = [
      //   {
      //     date: "2024-05-12 15:43",
      //     name: "1911****8888",
      //     amount: "888 元"
      //   },
      //   {
      //     date: "2024-05-12 15:43",
      //     name: "1911****8888",
      //     amount: "888 元"
      //   },
      //   {
      //     date: "2024-05-12 15:43",
      //     name: "1911****8888",
      //     amount: "888 元"
      //   },
      //   {
      //     date: "2024-05-12 15:43",
      //     name: "1911****8888",
      //     amount: "888 元"
      //   },
      //   {
      //     date: "2024-05-12 15:43",
      //     name: "1911****8888",
      //     amount: "888 元"
      //   }
      // ];
    });
};
onMounted(() => {
  if (!store.token) {
    return;
  }
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
  //background-color: #dde5f1;
  padding: 0px 20px;

  .hongbao-subtitle {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    img {
      display: block;
      width: 100%;
      max-width: 800px;
    }
  }

  .receive-container {
    position: relative;
    margin: 0 0 0px 0;

    .hongbao-open {
      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }
    }

    .contents {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0px;

      img {
        display: block;
        width: 100%;
        max-width: 240px;
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

      .title {
        width: 50% !important;
      }

      span {
        margin-top: 4px;
        position: absolute;
        z-index: 1;
        font-size: 1rem;
        font-weight: 500;
        color: #ffffff;
      }
    }

    img {
      z-index: 1;
    }

    .winner-wrapper {
      position: relative;
      padding: 45px 20px 20px;
      background-color: #f2f8fe;
      border-radius: 8px;
      margin-bottom: 30px;
      margin-top: -60px;
      min-height: 250px;
      width: 100%;
      max-width: 700px;
      border: 1px solid #51acff;

      .contents {
        max-height: 280px;
        overflow-y: hidden;
        scroll-behavior: smooth;
        .winner {
          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #7a8eb9;
          padding: 15px;
          gap: 20px;

          &:nth-child(odd) {
            background-color: #ffffff;
          }
        }

        .amount-txt {
          color: #fcc939;
        }
      }
    }
  }

  .content-container {
    width: 100%;
    position: relative;
    background-color: #f2f8fe;
    width: 100%;
    max-width: 1280px;
    margin: auto;
    padding-bottom: 40px;
    margin-bottom: 40px;
    border-radius: 8px;
    border: 1px solid #acd4f6;

    .contents {
      margin-top: 10px;
      padding: 0 40px;

      .rules-content {
        p {
          font-size: 1rem;
        }
      }

      .event-details {
        padding: 10px 0px 0;

        .details-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;

          .event-frame {
            background-image: url("../../../assets/images/promotion/hotpromo/hongbaoyu/eurocup/event-frame.png");
            background-size: 100% 100%;
            background-position: center center;
            background-repeat: no-repeat;
            display: flex;
            justify-content: center;
            align-items: center;

            color: #ffffff;
            font-weight: 600;
            font-size: 0.875rem;
            min-width: 100px;
            height: 30px;
          }

          .event-txt {
            font-size: 0.825rem;
            color: #000000;

            .color-red {
              color: #f41f1c;
            }
          }
        }

        .details-table {
          width: 100%;
          border-radius: 8px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #acd4f6;

          thead {
            color: #ffffff;
            font-weight: 600;

            td {
              background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
            }
          }

          tbody {
            tr:nth-child(even) td {
              background-color: #f2f8fe;
            }
          }

          td {
            padding: 8px 16px;
            text-align: center;
          }
        }
      }

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
    color: #e8280c;
    font-size: 1.8em;
    font-weight: bold;
    padding-left: 10px;
  }
}

.get-btn {
  color: #ffefc2;
  border-radius: 30px;
  background: #ff1300;
  position: absolute;
  border: 1px solid #fde583;
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
