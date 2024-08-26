<template>
  <div class="hongbao-container">
    <div class="hongbao-prize">
      <div class="decal"></div>
      <div class="current">当前抽奖次数</div>
      <div class="count">1</div>

      <!-- <div class="contents" v-if="!bonusOpened">
        <el-button class="promo-common-btn" size="large" :loading="loadingClaim" @click="getPromotion">
          打开红包
        </el-button>
      </div> -->

      <div class="buttons">
        <div class="common-btn" @click="getPromotion">抽奖</div>
        <div class="common-btn blue">十连抽</div>
      </div>
    </div>
    <div class="activity-boxes">
      <div class="activity-box">
        <div class="activity-title">活动时间</div>
        <div class="activity-content-container">
          <div class="activity-content-item">
            <div class="content-title">活动时间:</div>
            <div class="content-txt">所有会员</div>
          </div>
          <div class="activity-content-item">
            <div class="content-title">抽奖次数:</div>
            <div class="content-txt">每10,000元有效投注可获得一次抽奖</div>
          </div>
          <div class="activity-content-item">
            <div class="content-title">时间:</div>
            <div class="content-txt">2023/11/10-2024/1/4</div>
          </div>
        </div>
      </div>
      <div class="activity-box">
        <div class="activity-title">活动对象</div>
        <div class="activity-content-container">
          <table class="content-table">
            <tr>
              <td>恭喜</td>
              <td>765****3234</td>
              <td>抽中</td>
              <td>二等奖</td>
              <td>Iphone15</td>
            </tr>
            <tr class="txt-blue">
              <td>恭喜</td>
              <td>765****3234</td>
              <td>抽中</td>
              <td>一等奖</td>
              <td>保时捷</td>
            </tr>
            <tr>
              <td>恭喜</td>
              <td>765****3234</td>
              <td>抽中</td>
              <td>二等奖</td>
              <td>Iphone15</td>
            </tr>
            <tr>
              <td>恭喜</td>
              <td>765****3234</td>
              <td>抽中</td>
              <td>二等奖</td>
              <td>Iphone15</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import { claimDailyRainItem, getDailyRainListing } from "@/api/index/promo";
import { userStore } from "@/store";

const promoCode = ref("hongbaoyu");

const store = userStore();
const privilegeClaimedModalVisible = ref(false);
// const promoNotReady = ref(false);
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
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  getPromotionListing();
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
    margin: 20px auto;
    gap: 20px;
    width: 100%;
    justify-content: center;
    align-items: center;
    .activity-box {
      border-radius: 20px;
      background: linear-gradient(180deg, #ffffff 0%, #e4efff 100%);
      flex: 1;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 20px;
      height: 320px;
      .activity-title {
        color: #3f8cff;
        font-size: 40px;
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
    background: url(../../../assets/images/promotion/hotpromo/upgrade-hongbao/hongbao-bg.png) no-repeat center center;
    padding: 20px;
    border-radius: 20px;
    .decal {
      background: url(../../../assets/images/promotion/hotpromo/upgrade-hongbao/union.png) no-repeat center center;
      width: 500px;
      height: 40px;
      margin: 10px auto;
    }
    .current {
      font-size: 20px;
      color: #7a8eb9;
      margin-bottom: -30px;
    }
    .count {
      background: url(../../../assets/images/promotion/hotpromo/upgrade-hongbao/number.png) no-repeat center center;
      color: #3f8cff;
      font-size: 50px;
      padding-top: 120px;
      padding-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      margin-bottom: 10px;
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
</style>
