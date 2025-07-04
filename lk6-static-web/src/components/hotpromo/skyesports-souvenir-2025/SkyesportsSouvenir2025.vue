<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section section-bg">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div class="claim-title-icon"></div>
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
            <img
              v-if="bonus <= 0"
              src="@/assets/promo/lh-livepoker-rebate/reward-btn-3-disabled.png"
              alt=""
              width="100%"
            />
            <img v-else src="@/assets/promo/lh-livepoker-rebate/reward-btn-3.png" alt="" width="100%" />
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
          <div class="right">在活动期间当日投注 Skyesports 纪念杯 2025 赛事，满足活动要求后次日即可获得奖金，最高可获 1,088 元~</div>
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
              <img src="@/assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" style="width: 10px" />
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
            为避免文字理解差异，雷火电竞保留此活动最终解释权；
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotify } from "@/hooks/notify";
import { onMounted, ref, defineProps } from "vue";
import { userStore } from "@/store";
import { getSkyesportsSouvenir2025Bonus, claimSkyesportsSouvenir2025Bonus } from "@/api/index/promo";

const props = defineProps(["promoCode", "params"]);
const promoCode = ref(props.promoCode);
const store = userStore();
const notify = useNotify();
const totalDeposit = ref(0);
const totalPayout = ref(0);
const bonus = ref(0);
const loadingClaim = ref(false);

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
  width: 1200px;
  height: 100%;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 30px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  background: url("@/assets/promo/lh-livepoker-rebate/section-bg.png");
  background-size: 100% 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 25px;
  }

  .livepoker-rebate-section-right {
    margin-top: auto;
    margin-bottom: auto;
    width: 220px;

    .bonus-image {
      cursor: pointer;
      width: 100%;

      &:hover {
        filter: brightness(0.9);
      }
      &:active {
        transform: translate(0px, 1px);
        opacity: 0.9;
      }

      &.disabled {
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
    font-size: 24px;
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
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.livepoker-rebate-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .livepoker-rebate-game-bottom-left-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: #ff3333;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff3333;
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
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .title {
    background-image: url("@/assets/promo/lh-livepoker-rebate/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin: 0 auto 8px;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    .left {
      background-image: url("@/assets/promo/lh-livepoker-rebate/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 20px;
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
  table-layout: fixed;
  text-align: center;
  vertical-align: middle;
  th {
    height: 56px;
    font-size: 20px;
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

  td {
    border: 1px solid #acd4f6;
    height: 56px;
    font-size: 20px;
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
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("@/assets/promo/lh-livepoker-rebate/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    color: #000000;
    .item {
      padding-left: 24px;
      display: flex;
      gap: 10px;

      .item-num {
        color: #ffffff;
        font-size: 20px;
        line-height: 1;
        border-radius: 50%;
        height: 28px !important;
        width: 28px !important;
        min-width: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      }

      .hint {
        font-size: 18px;
        font-weight: 400;
        line-height: 22.4px;
        color: #ff3333;
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
  // margin-bottom: 16px;
}

.reward-info-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.reward-info-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: black;
  gap: 24px;

  .amount {
    color: #00a1ff;
    font-weight: 600;
  }
}

.dark {
  .livepoker-rebate-section,
  .livepoker-rebate-game-info,
  .livepoker-rebate-game-bottom-rule {
    position: relative;
    background: linear-gradient(180deg, #2d3f64 0%, #232a36 100%);
    border: none;
  }

  .livepoker-rebate-section::before,
  .livepoker-rebate-game-info::before,
  .livepoker-rebate-game-bottom-rule::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 1px;
    background: linear-gradient(170deg, #be9457 1.91%, rgba(190, 148, 87, 0) 33.82%);
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  .livepoker-rebate-section {
    .livepoker-rebate-section-title {
      color: #fff;
    }
    .reward-info-content {
      color: #fff;
    }
  }

  .livepoker-rebate-game-info {
    .left {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/dark-info-little-title-bg.png");
    }
    .right {
      color: #fff;
    }
    .title {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/dark-info-title.png");
    }
  }

  .livepoker-rebate-game-bottom-rule {
    .item {
      color: #fff;
    }
    .title {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/dark-info-title.png");
    }
  }

  .livepoker-rebate-game-info-table {
    th {
      background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%);
    }
    td {
      color: white;
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
    left: -10px;
    color: #f23b1d;
    font-size: 50px;
    font-weight: bold;
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

.dark {
  .claim-title-icon {
    background: url("../../../assets/promo/lh-livepoker-rebate/section-title-img.png") no-repeat center center !important;
    background-size: 100% 100% !important;
  }

  .claim-coin-icon {
    background: url("../../../assets/promo/lh-livepoker-rebate/reward-icon1.png") no-repeat center center !important;
    background-size: 100% 100% !important;
  }

  .claim-gift-icon {
    background: url("../../../assets/promo/lh-livepoker-rebate/reward-icon2.png") no-repeat center center !important;
    background-size: 100% 100% !important;
  }

  .claim-stacked-coins-icon {
    background: url("../../../assets/promo/lh-livepoker-rebate/reward-icon3.png") no-repeat center center !important;
    background-size: 100% 100% !important;
  }
}
</style>
