<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div>
              <img
                src="../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/section-title-img.png"
                style="width: 20px; height: 20px; margin-bottom: 0px"
              />
            </div>
            每日彩金
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img
                src="../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon1.png"
                alt=""
                width="100%"
              />
            </div>
            <div class="reward-info-content">
              昨日体育场馆投注：
              <span class="amount">{{ totalValidBet }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img
                src="../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon2.png"
                alt=""
                width="100%"
              />
            </div>
            <div class="reward-info-content">
              可领彩金：
              <span class="amount">{{ bonus }}元</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: isGrey }">
            <img
              src="../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-btn.png"
              alt=""
              width="100%"
            />
          </div>
        </div>
      </div>
      <div class="livepoker-rebate-game-info">
        <div class="title"></div>
        <!--        <div class="little-title">-->
        <!--          <div class="left">活动平台</div>-->
        <!--          <div class="right">真人场馆、棋牌场馆</div>-->
        <!--        </div>-->
        <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">2024年8月16日起</div>
        </div>
        <div class="little-title" style="flex-direction: column; justify-content: flex-start; align-items: flex-start">
          <div class="left">活动内容</div>
          <div class="right">
            活动期间，用户每日在体育场馆投注"五大联赛"累计有效投注≥1,000
            元，即可在次日24小时内点击活动页面的【点击领取】按钮领取对应彩金。
          </div>
        </div>
        <table class="livepoker-rebate-game-info-table">
          <tr>
            <th>当日有效总流水</th>
            <th>奖金</th>
            <th>奖金流水</th>
          </tr>
          <tr>
            <td>≥1,000</td>
            <td>8</td>
            <td rowspan="9">3倍流水/限体育场馆</td>
          </tr>
          <tr>
            <td>≥3,000</td>
            <td>18</td>
          </tr>
          <tr>
            <td>≥5,000</td>
            <td>38</td>
          </tr>
          <tr>
            <td>≥10,000</td>
            <td>68</td>
          </tr>
          <tr>
            <td>≥20,000</td>
            <td>168</td>
          </tr>
          <tr>
            <td>50,000</td>
            <td>388</td>
          </tr>
          <tr>
            <td>100,000</td>
            <td>888</td>
          </tr>
          <tr>
            <td>200,000</td>
            <td>1,888</td>
          </tr>
          <tr>
            <td>200,000</td>
            <td>2,888</td>
          </tr>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img
                src="../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/game-bottom-left-btn.png"
                alt=""
                style="width: 10px"
              />
              <span>示例</span>
            </div>
            会员A在8月17日有效投注为1,000，在8月18日00:00-23:59期间，即可在此活动页面点击“领取奖金”；
          </div>
        </div>
      </div>

      <div class="livepoker-rebate-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            <div class="item-num">1</div>
            活动期间，每位会员每日仅限领取一次投注奖金，次日 00:00-23:59 期间领取奖金，逾期视为自动放弃，不予补偿；
          </div>
          <div class="item">
            <div class="item-num">2</div>
            流水仅计算当日在体育场馆内投注的“五大联赛相关赛事盘口"且结算的注单，注单未结算、取消或走盘皆不计算为有效投注；
          </div>
          <div class="item">
            <div class="item-num">3</div>
            任何低于欧洲盘 1.7 或亚洲盘 0.7
            水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
          </div>
          <div class="item">
            <div class="item-num">4</div>
            根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </div>
          <div class="item">
            <div class="item-num">5</div>
            此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
            地址视为同一账户，若有违规者，将不享受此红利；
          </div>
          <div class="item">
            <div class="item-num">5</div>
            为避免文字理解差异，东赢电竞保留此活动最终解释权；
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { footballHistroy, claimBonusItem2, footballEligibility } from "../../../api/index/promo";
// import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";

const $q = useQuasar();
const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);

// const notify = useNotify();
const store = userStore();

const totalValidBet = ref(0);
const bonus = ref(0);
const isGrey = ref(true);

const handleClaimBonus = () => {
  claimBonusItem2(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        fetchData();
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchData = async () => {
  try {
    // const res = await footballHistroy();
    const res2 = await footballEligibility();
    totalValidBet.value = res2.data.lastDayBet;
    bonus.value = res2.data.bonus;
    isGrey.value = res2.data.bonus === 0;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (!store.token) {
    return;
  }
  fetchData();
});
</script>

<style scoped lang="scss">
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}

.livepoker-rebate-container {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 20px 12px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/section-bg.png");
  background-size: 100% 100%;
  align-items: center;
  width: 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .livepoker-rebate-section-right {
    width: 180px;
    margin-top: 20px;

    .bonus-image {
      width: 100%;
      cursor: pointer;

      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }
      &.disabled {
        filter: grayscale(100%);
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .livepoker-rebate-section-title {
    color: #000000;
    font-size: 16px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
  }
}

.livepoker-rebate-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.livepoker-rebate-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .livepoker-rebate-game-bottom-left-title {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff0000;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff0000;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
}

.livepoker-rebate-game-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 240px;
    height: 26px;
    margin: 0 auto 20px;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    .left {
      background-image: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 64px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 12px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
    }
  }
}

.livepoker-rebate-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  th {
    height: 36px;
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    &:first-child {
      border-top-left-radius: 12px;
    }
    &:last-child {
      border-top-right-radius: 12px;
    }
  }
  tr {
    &:last-child {
      td {
        &:first-child {
          // border-bottom-left-radius: 12px;
        }
      }
    }
    &:nth-child(2) {
      td {
        &:last-child {
          // border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    background: transparent;
    border: 1px solid #acd4f6;
    height: 36px;
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}

.livepoker-rebate-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 240px;
    height: 20px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: #000000;
    padding: 8px;
    .item {
      display: flex;
      gap: 10px;
      align-items: baseline;

      .item-num {
        color: #ffffff;
        font-size: 12px;
        line-height: 1;
        border-radius: 50%;
        height: 16px !important;
        width: 16px !important;
        min-width: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      }
    }
  }
}

.reward-info {
  border: 1px solid rgba(215, 235, 255, 1);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.reward-info-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}

.reward-info-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: black;

  .amount {
    color: #00a1ff;
    font-weight: 600;
  }
}
</style>
