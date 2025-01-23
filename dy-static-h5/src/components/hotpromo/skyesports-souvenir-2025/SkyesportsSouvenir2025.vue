<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section section-bg">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div class="reward-info-icon claim-title-icon"></div>
            投注礼金
          </div>
          <div class="reward-info">
            <div class="reward-info-icon claim-coin-icon"></div>
            <div class="reward-info-content">
              昨日累计存款金额：
              <span class="amount">{{ totalDeposit }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon claim-stacked-coins-icon"></div>
            <div class="reward-info-content">
              昨日单笔派彩金额：
              <span class="amount">{{ totalPayout }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon claim-gift-icon"></div>
            <div class="reward-info-content">
              昨日可领取彩金：
              <span class="amount">{{ bonus }}元</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0, loading: loadingClaim }">
            <img src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/claim-btn3.png" alt="" width="100%" />
          </div>
        </div>
      </div>
      <div class="livepoker-rebate-game-info section-bg">
        <div class="title-img">活动详情</div>
        <div class="little-title">
          <div class="ribbon">活动时间</div>
          <div class="right">2025 年 2 月 17 日至 2025 年 2 月 23 日</div>
        </div>
        <div class="little-title">
          <div class="ribbon">活动内容</div>
          <div class="right">
            在活动期间当日投注 Skyesports 纪念杯 2025 赛事，满足活动要求后次日即可获得奖金，最高可获 1,088 元~
          </div>
        </div>
        <table class="livepoker-rebate-game-info-table section-table">
          <thead>
            <tr>
              <th>昨日累计存款</th>
              <th>昨日单笔派彩金额</th>
              <th>奖金</th>
              <th>流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="8">≥300 元</td>
              <td>500</td>
              <td>8 元</td>
              <td rowspan="8">6 倍流水</td>
            </tr>
            <tr>
              <td>1,000</td>
              <td>28 元</td>
            </tr>
            <tr>
              <td>3,000</td>
              <td>58 元</td>
            </tr>
            <tr>
              <td>5,000</td>
              <td>88 元</td>
            </tr>
            <tr>
              <td>10,000</td>
              <td>108 元</td>
            </tr>
            <tr>
              <td>30,000</td>
              <td>388 元</td>
            </tr>
            <tr>
              <td>50,000</td>
              <td>588 元</td>
            </tr>
            <tr>
              <td>100,000</td>
              <td>1,088 元</td>
            </tr>
          </tbody>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img
                src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/game-bottom-left-btn.png"
                alt=""
                style="width: 10px"
              />
              <span>示例</span>
            </div>
              会员在 2 月 19 日当日累计存款 500 元，在 Skyesports 纪念杯 2025 赛事投注中，其中一笔最高有效注单派彩金额为 1,800 元，根据规则会员次日可获得 28 元奖金，奖金仅需 6 倍水即可出款。

          </div>
        </div>
      </div>

      <div class="livepoker-rebate-game-bottom-rule section-bg">
        <div class="title-img">活动规则</div>
        <br />
        <div class="content">
          <div class="item">
            <div class="item-num">1</div>
            <div style="display: flex; flex-direction: column">
              活动仅计算电竞场馆，在 Skyesports 纪念杯 2025 赛事期间内当日累计存款≥300 元且单笔派彩最高金额≥500 元次日即可获得对应彩金，彩金只需 6 倍流水即可出款；
            </div>
          </div>
          <div class="item">
            <div class="item-num">2</div>
            单笔派彩金额按当天最高一次的派彩金额进行计算，符合活动条件的会员可在次日优惠界面【点击领取】按钮获得彩金，彩金保留 24 小时；
          </div>
          <div class="item">
            <div class="item-num">3</div>
            有效流水仅计算当日下注 Skyesports 纪念杯 2025 赛事且结算的注单，若提前兑现、注单未结算、取消或走盘皆不及不计算为有效投注；
          </div>
          <div class="item">
            <div class="item-num">4</div>
            任何低于欧洲盘 1.7 或亚洲盘 0.7 水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；

          </div>
          <div class="item">
            <div class="item-num">5</div>
            每位有效玩家、手机号码、电子邮箱、银行卡、IP 地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消全部优惠的权利；
          </div>
          <div class="item">
            <div class="item-num">6</div>
            为避免文字理解差异，东赢电竞保留此活动最终解释权；
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import { getSkyesportsSouvenir2025Bonus, claimSkyesportsSouvenir2025Bonus } from "../../../api/index/promo";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";

const props = defineProps(["promoCode"]);
const { promoCode } = toRefs(props);

const notify = useNotify();
const store = userStore();

const totalDeposit = ref(0);
const totalPayout = ref(0);
const bonus = ref(0);
const loadingClaim = ref(false);

const handleClaimBonus = () => {
  loadingClaim.value = true;
  claimSkyesportsSouvenir2025Bonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取`
        });
        store.getBalance();
      }
      // else {
      //   notify({
      //     type: "error",
      //     message: res.message
      //   });
      // }
    })
    .catch(() => {})
    .finally(() => {
      loadingClaim.value = false;
    });
};

const fetchData = async () => {
  loadingClaim.value = true;
  getSkyesportsSouvenir2025Bonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        totalDeposit.value = res.data.totalDeposit;
        totalPayout.value = res.data.totalPayout;
        bonus.value = res.data.bonus;
      }
    })
    .catch(() => {})
    .finally(() => {
      loadingClaim.value = false;
    });
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
  background: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-bg.png");
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

      &.loading {
        cursor: not-allowed;
        opacity: 0.8;
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
    color: #ff5d5d !important;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff5d5d !important;
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
    background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-title.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 240px;
    height: 26px;
    margin: 0 auto;
  }
  .little-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    .left {
      background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-little-title-bg.png");
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
    background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/rule-title.png");
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

      .hint {
        font-size: 12px;
        font-weight: 400;
        line-height: 22.4px;
        color: #ff0000;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
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

.body--dark {
  .claim-title-icon {
    background: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/section-title-img.png") no-repeat
      center center !important;
    background-size: 100% 100% !important;
  }

  .claim-coin-icon {
    background: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon1.png") no-repeat center
      center !important;
    background-size: 100% 100% !important;
  }

  .claim-gift-icon {
    background: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon2.png") no-repeat center
      center !important;
    background-size: 100% 100% !important;
  }

  .claim-stacked-coins-icon {
    background: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon3.png") no-repeat center
      center !important;
    background-size: 100% 100% !important;
  }
}
.claim-title-icon {
    background: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/section-title-img.png") no-repeat
      center center !important;
    background-size: 100% 100% !important;
  }

  .claim-coin-icon {
    background: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon1.png") no-repeat center
      center !important;
    background-size: 100% 100% !important;
  }

  .claim-gift-icon {
    background: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon2.png") no-repeat center
      center !important;
    background-size: 100% 100% !important;
  }

  .claim-stacked-coins-icon {
    background: url("../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon3.png") no-repeat center
      center !important;
    background-size: 100% 100% !important;
  }
</style>
