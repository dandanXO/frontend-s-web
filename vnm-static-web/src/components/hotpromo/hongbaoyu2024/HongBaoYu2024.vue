<template>
  <div class="hongbao-container">
    <div class="hongbao-prize">
      <div v-if="promoId !== 567" class="decal"></div>

      <div class="prize-redeem" @click="getPromotion">
        <img
          src="../../../assets/images/promotion/hotpromo/hongbaoyu2024/claim-btn.png"
          width="350"
          v-if="promoId === 567"
        />
        <img
          src="../../../assets/images/promotion/hotpromo/hongbaoyu2024/claimhongbao.png"
          width="350"
          v-else-if="promoId === 669"
        />
        <img v-else src="../../../assets/images/promotion/hotpromo/hongbaoyu2024/red-packet.png" width="350" />
      </div>
    </div>
  </div>

  <el-dialog
    class="award-modal hongbaoyu-modal"
    :close-on-click-modal="true"
    :modal="false"
    v-model="privilegeClaimedModalVisible"
    align-center
  >
    <div class="modal-div">
      <button class="text-white popout-close" @click="privilegeClaimedModalVisible = false">✕</button>
      <div class="red-packet-opened">
        <img
          v-if="promoId === 669"
          :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu2024/getrecord.png`)"
        />
        <img
          v-else-if="promoId === 567"
          :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu2024/popup2.png`)"
        />
        <img v-else :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu2024/red-packet-opened.png`)" />
        <!-- <img src="../../../assets/images/promotion/hotpromo/red-packet-opened.png" /> -->
        <div v-if="promoId !== 567 && promoId !== 669" class="grats">{{ $t("promo.congrats") }}</div>

        <div v-if="promoId !== 567 && promoId !== 669" class="amount">{{ winAmount }}</div>
        <div v-else-if="promoId === 669" class="amount-halloween">{{ winAmount }}</div>
        <div v-else class="amount-halloween">{{ winAmount }}</div>

        <!-- <div class="get-btn" @click="getPromotionPrize">{{ $t("promo.claim") }}</div> -->
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, onMounted, reactive } from "vue";
import { claimDailyRainItem, getDailyRainListing } from "@/api/index/promo";
import { userStore } from "@/store";
import { ElMessage } from "element-plus";

const props = defineProps(["promoCode", "params", "promoId"]);
const promoCode = ref(props.promoCode);

const startTime = reactive({
  time1: "17:00 ~ 18:00",
  time2: "19:00 ~ 20:00"
});

const store = userStore();
const privilegeClaimedModalVisible = ref(false);
const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(0);
const loadingClaim = ref(false);
const getPromotion = () => {
  // privilegeClaimedModalVisible.value = true; // remove this line
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
        ElMessage.error(res.message);
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

  const params = props.params ? JSON.parse(props.params) : "";
  if (params?.time1) {
    startTime.time1 = params.time1;
  }
  if (params?.time2) {
    startTime.time2 = params.time2;
  }
});
</script>

<style scoped lang="scss">
.hongbao-container {
  width: 100%;
  max-width: 1400px;
  text-align: center;
  margin: 20px auto;

  .buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
  }

  .activity-boxes {
    display: flex;
    margin: 16px auto;
    gap: 15px;
    width: 100%;
    justify-content: center;
    align-items: center;

    .activity-box {
      border-radius: 20px;
      background: linear-gradient(180deg, #ffffff 0%, #e4efff 100%);
      flex: 1;
      padding: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      max-width: 690px;
      gap: 15px;
      height: 330px;

      .activity-title {
        color: #3f8cff;
        font-size: 40px;
        font-weight: 700;
        font-family: "PingFang SC";
        margin-bottom: 0px;
      }

      .activity-content-container {
      }

      .activity-content-item {
        display: flex;
        margin-bottom: 6px;
      }

      .content-title {
        width: 100px;
        color: #3f8cff;
        font-size: 20px;
        text-align: left;
      }

      .content-txt {
        font-size: 20px;
        color: #7a8eb9;
      }

      .content-table {
        max-height: 200px;
        overflow-y: hidden;
        display: block;
        font-size: 20px;
        color: #7a8eb9;

        .txt-blue {
          color: #2b89f5;
        }

        td {
          padding: 5px 20px;
        }
      }
    }
  }

  .hongbao-prize {
    .claim-btn-bg {
      width: 350px;
    }

    .prize-redeem {
      cursor: pointer;
    }

    .current-content {
      display: flex;
      gap: 6px;
      align-items: center;
      justify-content: center;
    }

    .decal {
      background: url(../../../assets/images/promotion/hotpromo/upgrade-hongbao/union.png) no-repeat center center;
      width: 500px;
      height: 40px;
      margin: 10px auto;
    }

    .current {
      font-size: 20px;
      color: #7a8eb9;
    }

    .count {
      //   background: url(../../../assets/images/promotion/hotpromo/upgrade-hongbao/number.png) no-repeat center center;
      color: #3f8cff;
      font-size: 50px;
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
      font-size: 20px;
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
    color: #f23b1d;
    font-size: 50px;
    font-weight: bold;
  }

  .amount-halloween {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 105px;
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
    font-size: 20px;
    padding: 12px 24px;
    cursor: pointer;

    &:hover {
      filter: brightness(0.9);
    }
  }
}

.promo-container-hongbao .promo-view-container table {
  margin-top: 24px;
  color: #7a8eb9;
  font-size: 20px;
  min-width: 60%;
}

.popout-close {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  margin-left: auto;
  margin-right: 20%;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 3px 3px 3px rgba(0,0,0,0.3);
}
</style>

<style lang="scss">
.hongbaoyu-modal {
  .el-dialog__header .el-dialog__headerbtn {
    display: none !important;
  }
}
</style>
