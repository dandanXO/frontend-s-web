<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-game-info section-bg">
        <div class="title-img">活动详情</div>
        <div class="little-title">
          <div class="ribbon">活动时间</div>
          <div class="right">2025年3月21日至4月11日23:59</div>
        </div>
        <div class="little-title">
          <div class="ribbon">活动内容</div>
          <div class="right">投注乘数与免费旋转，每周五赠送88,880封红包！</div>
        </div>
        <table class="livepoker-rebate-game-info-table section-table">
          <thead>
            <tr>
              <th>奖励数量</th>
              <th>奖励</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>5</td>
              <td>x100 投注乘数</td>
            </tr>
            <tr>
              <td>55</td>
              <td>x50 投注乘数</td>
            </tr>
            <tr>
              <td>470</td>
              <td>x10 投注乘数</td>
            </tr>
            <tr>
              <td>56,000</td>
              <td>x5 投注乘数</td>
            </tr>
            <tr>
              <td>350</td>
              <td>10次免费旋转</td>
            </tr>
            <tr>
              <td>32,000</td>
              <td>5次免费旋转</td>
            </tr>
          </tbody>
        </table>


      </div>

      <div class="livepoker-rebate-game-bottom-rule section-bg">
        <div class="title-img">活动规则</div>
        <br />
        <div class="content">
          <div class="item">
            <div class="item-num__pseudo"></div>
            合格游戏：果冻糖，毛怪赢翻天，胜利表情，招财蛙，福虎生财，福气鼠，金牛来福，旺福狗，灵猴招福，福虎生财
            1000(3月31日推出）
          </div>
          <div class="item">
            <div class="item-num">1</div>
            <div style="display: flex; flex-direction: column">
              自2025年3月21日00:00至2025年4月11日23:59(GMT+7)，总共有355,520个奖项，价值¥ 12,640,600
              元的天降奖金将送给幸运玩家。
            </div>
          </div>
          <div class="item">
            <div class="item-num">2</div>
            每周五的天降奖金将自00:00至23:59(GMT+7)期间进行，每次有88,880个奖项与总价值¥ 3,160,150 元的奖金。
          </div>
          <div class="item">
            <div class="item-num">3</div>
            玩家可在天降奖金活动赢得投注金额倍数或免费旋转奖励。在促销期间，您每周五可赢得高达投注额的100倍奖金。
          </div>
          <div class="item">
            <div class="item-num">4</div>
            奖金乘数将用于确定最终中奖金额（投注额 x
            中奖倍数），最高投注限额为¥7元。投注越大就有越高的机会在单次旋转中赢得高达¥700元的奖金！如果投注超过¥7元，则超过限额的任何金额将不计入奖金计算。
            <br />
            举例:
            <br />
            投注金额: ¥8
            <br />
            有效中奖金额：¥7
            <br />
            中奖倍数: X 100
            <br />
            中奖奖金: ¥7 x 100 = ¥700
          </div>
          <div class="item">
            <div class="item-num">5</div>
            免费旋转奖励的投注金额将与玩家中奖时的投注金额相同，最高限额为¥7元。例如，若玩家以¥8元投注获胜，每次免费旋转的奖励金额为¥7元。
          </div>
          <div class="item">
            <div class="item-num">6</div>
            玩家可以选择立即使用或稍后使用免费旋转奖励。免费旋转自发放日起有效期为5天，逾期将失效。
          </div>
          <div class="item">
            <div class="item-num">7</div>
            所有免费旋转只适用于这5款游戏：福虎生财，福气鼠，金牛来福，旺福狗与灵猴招福。玩家一旦开始在某款合资格游戏中使用免费旋转，必须在该游戏中使用所有剩余的免费旋转。
          </div>
          <div class="item">
            <div class="item-num">8</div>
            本次活动不设最低投注额。
          </div>
          <div class="item">
            <div class="item-num">9</div>
            每位玩家于每次天降奖金最多可赢得2个奖项。
          </div>
          <div class="item">
            <div class="item-num">10</div>
            雷火电竞保留随时修改，取消，停止 活动而不做另行通知的权利。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import { getFissureUniverseS4Bonus, claimFissureUniverseS4Bonus } from "../../../api/index/promo";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";

const props = defineProps(["promoCode"]);
const { promoCode } = toRefs(props);

const notify = useNotify();
const store = userStore();

const totalValidBet = ref(0);
const bonus = ref(0);
const loadingClaim = ref(false);

const handleClaimBonus = () => {
  loadingClaim.value = true;
  claimFissureUniverseS4Bonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取`
        });
        store.getBalance();
      } else {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .catch(() => {})
    .finally(() => {
      loadingClaim.value = false;
    });
};

const fetchData = async () => {
  loadingClaim.value = true;
  getFissureUniverseS4Bonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        totalValidBet.value = res.data.totalValidBet;
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

      .item-num__pseudo {
        height: 16px;
        width: 16px;
        display: flex;
      }

      .hint {
        // font-size: 12px;
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
</style>
