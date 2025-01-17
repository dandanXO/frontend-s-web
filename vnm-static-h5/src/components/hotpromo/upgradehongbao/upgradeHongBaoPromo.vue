<template>
  <div class="hongbao-container">
    <div class="hongbao-prize">
      <div v-if="promoId !== 567" class="decal"></div>
      <!--      <div class="current-content">-->
      <!--        <div class="current">当前抽奖次数</div>-->
      <!--        <div class="count">1</div>-->
      <!--      </div>-->

      <div class="prize-redeem" @click="getPromotion">
        <img
          src="../../../assets/images/promo/hotpromo/upgradehongbao/claim-btn.png"
          width="200"
          v-if="promoId === 567"
        />
        <img
          src="../../../assets/images/promo/hotpromo/upgradehongbao/claimhongbao.png"
          width="200"
          v-else-if="promoId === 669"
        />
        <img v-else src="../../../assets/images/promo/hotpromo/upgradehongbao/red-packet.png" width="200" />
      </div>

      <!-- <div class="contents" v-if="!bonusOpened">
          <el-button class="promo-common-btn" size="large" :loading="loadingClaim" @click="getPromotion">
            打开红包
          </el-button>
        </div> -->

      <!-- <div class="buttons">
        <div class="common-btn" @click="getPromotion">抽奖</div>
        <div class="common-btn blue">十连抽</div>
      </div>->
    </div>
     <div class="activity-boxes">
      <div class="activity-box">
        <div class="activity-title">中奖名单</div>
        <div class="activity-content-container">
          <table class="content-table">
            <tr class="winner" v-for="(item, index) in visibleItems" :key="index">
              <td>{{ item.date }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.amount }}</td>
            </tr>
          </table>
        </div>
      </div>-->
    </div>
  </div>
  <!--
  <table border="0" width="100%" cellpadding="0" cellspacing="0">
    <tbody>
      <tr>
        <th>红包雨发放时间</th>
        <th>每日次数</th>
      </tr>
      <tr>
        <td>{{ startTime.time1 }}</td>
        <td rowspan="2">每日2次</td>
      </tr>
      <tr>
        <td>{{ startTime.time2 }}</td>
      </tr>
    </tbody>
  </table>  -->

  <q-dialog
    class="award-modal hongbaoyu-modal"
    width="100%"
    v-model="isClaimModal"
    :no-backdrop-dismiss="promoId !== 567 && promoId !== 669 ? true : false"
    no-esc-dismiss
  >
    <div class="modal-div">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="red-packet-opened">
        <img
          v-if="promoId === 669"
          :src="require(`../../../assets/images/promo/hotpromo/upgradehongbao/getrecord.png`)"
        />
        <img
          v-else-if="promoId === 567"
          :src="require(`../../../assets/images/promo/hotpromo/upgradehongbao/popup2.png`)"
        />
        <img v-else :src="require(`../../../assets/images/promo/hotpromo/upgradehongbao/red-packet-opened.png`)" />

        <div v-if="promoId !== 567 && promoId !== 669" class="grats">{{ $t("lang.hong_congrats") }}</div>
        <div v-if="promoId !== 567 && promoId !== 669" class="amount">{{ winAmount }}</div>
        <div v-else class="amount-halloween">{{ winAmount }}</div>

        <div
          class="get-btn"
          :class="promoId === 567 || promoId === 669 ? 'get-btn-halloween' : ''"
          @click="getPromotionPrize"
        >
          {{ $t("lang.claim") }}
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { defineProps, onMounted, ref, reactive } from "vue";
import { eventapi } from "boot/axios";
import { userStore } from "src/stores";

const store = userStore();
const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(0);
const isClaimModal = ref(false);
const loadingClaim = ref(false);
const props = defineProps(["promoCode", "params", "promoId"]);
const promoCode = ref(props.promoCode);

const startTime = reactive({
  time1: "16:00 ~ 17:00",
  time2: "18:00 ~ 19:00"
});

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
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });
        bonusOpened.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
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
    });
};
onMounted(() => {
  getPromotionListing();

  const params = props.params ? JSON.parse(props.params) : "";
  if (params && params.time1) {
    startTime.time1 = params.time1;
  }
  if (params && params.time2) {
    startTime.time2 = params.time2;
  }
});
</script>

<style scoped lang="scss">
.hongbao-container {
  width: 100%;
  max-width: 1400px;
  text-align: center;
  margin: 20px auto 0px;

  .buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
  .activity-boxes {
    display: flex;
    flex-direction: column;
    margin: 20px auto;
    gap: 20px;
    width: 100%;
    justify-content: center;
    align-items: center;
    .activity-box {
      border-radius: 20px;
      background: linear-gradient(180deg, #ffffff 0%, #e4efff 100%);
      flex: 1;
      padding: 16px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 20px;
      .activity-title {
        color: #3f8cff;
        font-size: 20px;
        font-weight: 700;
        font-family: "PingFang SC";
        margin-bottom: auto;
      }
      .activity-content-container {
      }
      .activity-content-item {
        display: flex;
        margin-bottom: 6px;
      }
      .content-title {
        min-width: 100px;
        color: #3f8cff;
        font-size: 14px;
        text-align: left;
      }
      .content-txt {
        font-size: 14px;
        color: #7a8eb9;
        text-align: left;
      }

      .content-table {
        max-height: 180px;
        overflow-y: hidden;
        display: block;
        width: 100%;
        font-size: 14px;
        color: #7a8eb9;

        .txt-blue {
          color: #2b89f5;
        }

        td {
          // padding: 5px 20px;
          background: none;
          border: 0;
        }
      }
    }
  }
  .hongbao-prize {
    // background: url(../../../assets/images/promo/hotpromo/upgradehongbao/hongbao-bg.png) no-repeat center center;
    // padding: 20px;
    // border-radius: 20px;

    .prize-redeem {
      cursor: pointer;
      width: 57%;
      margin: auto;

      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }

      img {
        &:active {
          filter: brightness(0.85);
          transform: translate(0px, 1px);
        }
      }
    }

    .current-content {
      display: flex;
      gap: 6px;
      align-items: center;
      justify-content: center;
    }
    .decal {
      background: url(../../../assets/images/promo/hotpromo/upgradehongbao/union.png) no-repeat center center;
      width: 100%;
      height: 40px;
      margin: 10px auto;
    }
    .current {
      font-size: 14px;
      color: #7a8eb9;
    }
    .count {
      //   background: url(../../../assets/images/promo/hotpromo/upgradehongbao/number.png) no-repeat center center;
      color: #3f8cff;
      font-size: 20px;
      //   padding-top: 120px;
      //   padding-bottom: 20px;
      //   display: flex;
      //   justify-content: center;
      //   align-items: flex-end;
      //   margin-bottom: 10px;
    }
  }
  .buttons {
    .common-btn {
      font-size: 14px;
      cursor: pointer;
      padding: 15px 30px;
      border-radius: 100px;
      background: #ffffff;
      color: #3f8cff;
      width: 200px;

      box-shadow: 0px -2px 4.579999923706055px 0px #b1d7ff inset;

      box-shadow: 0px -1px 3.6640000343322754px 0px #5894ff inset;
      &.blue {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        color: #ffffff;
      }
    }
  }
}

.modal-div {
  width: 100%;
  position: relative;
}

.red-packet-opened {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  img {
    width: 100%;
  }

  .grats {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 23%;

    color: #fffbfb;

    text-align: center;
    font-family: PingFang SC;
    font-size: 18px;
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
    margin-top: 48%;
    color: #f23b1d;
    font-size: 35px;
    font-weight: bold;
  }

  .amount-halloween {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 18%;
    color: #fff;
    font-size: 50px;
    font-weight: bold;
  }

  .get-btn {
    color: #f23b1d;
    border-radius: 30px;
    background: linear-gradient(180deg, #fdf4ee 0%, #fff3c0 100%);
    font-size: 14px;
    padding: 5px 25px;
    cursor: pointer;
    position: absolute;
    z-index: 2;
    bottom: 20%;

    &.get-btn-halloween {
      display: none;
    }

    &:hover {
      filter: brightness(0.9);
    }
  }
}

.popout-close {
  margin-left: auto;
  margin-right: 20px;
  display: flex;
  color: #787878;
}
</style>
