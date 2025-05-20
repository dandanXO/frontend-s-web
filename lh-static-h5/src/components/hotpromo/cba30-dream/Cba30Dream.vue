<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="tab-wrapper">
        <div class="tab" :class="{ active: tabValue === 1 }" @click="tabValue = 1">一掷千元</div>
        <div class="tab" :class="{ active: tabValue === 2 }" @click="tabValue = 2">扭亏为盈</div>
      </div>

      <template v-if="tabValue === 1">
        <div>
          <div class="livepoker-rebate-section">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div>
                  <img
                    src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-title-img.png"
                    style="width: 20px; height: 20px; margin-bottom: 0px"
                  />
                </div>
                每日礼金
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img
                    src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/reward-icon1.png"
                    alt=""
                    width="100%"
                  />
                </div>
                <div class="reward-info-content">
                  赛事有效投注：
                  <span class="amount">{{ totalValidBet }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img
                    src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/reward-icon2.png"
                    alt=""
                    width="100%"
                  />
                </div>
                <div class="reward-info-content">
                  可领彩金：
                  <span class="amount">{{ dailyBonus }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimDailyBonus" :class="{ disabled: dailyBonus <= 0 }">
                <img
                  src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/claim-btn.png"
                  alt=""
                  width="100%"
                />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info">
            <div class="title"></div>
            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="left">活动时间</div>
              <div class="right">2024年10月12日00:00起</div>
            </div>
            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="left">活动内容</div>
              <div class="right">在活动期间投注CBA赛事，满足投注要求后即可获得奖金，最高可获1,888元</div>
            </div>
            <table class="livepoker-rebate-game-info-table">
              <tbody>
                <tr>
                  <th>当日单笔下注金额</th>
                  <th>当日下注次数</th>
                  <th>奖金</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td :rowspan="8">≥1,000元</td>
                  <td>1</td>
                  <td>18</td>
                  <td :rowspan="8">5 倍流水</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>58</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>88</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>188</td>
                </tr>
                <tr>
                  <td>20</td>
                  <td>288</td>
                </tr>
                <tr>
                  <td>50</td>
                  <td>588</td>
                </tr>
                <tr>
                  <td>80</td>
                  <td>888</td>
                </tr>
                <tr>
                  <td>100</td>
                  <td>1,888</td>
                </tr>
              </tbody>
            </table>
            <div class="livepoker-rebate-game-bottom">
              <div class="livepoker-rebate-game-bottom-left-title">
                例：用户A在10月12日当天在常规赛辽宁本钢VS浙江稠州金租比赛中单笔下注2,000元，下注一次，根据规则会员次日于24小时内在活动页面可获得18元奖金，奖金仅需5倍水即可出款。
              </div>
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title"></div>
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                本活动仅计算所有体育场馆内CBA赛季当日单笔有效投注≥1,000元，并根据完成的下注次数获得相应彩金。所获彩金只需完成5倍流水即可申请提款；
              </div>
              <div class="item">
                <div class="item-num">2</div>
                活动期间，符合条件的会员可在赛事结算的次日24小时内前往优惠界面点击【点击领取】按钮领取彩金。彩金保留24小时，逾期未领取将视为自动放弃；
              </div>
              <div class="item">
                <div class="item-num">3</div>
                负盈利仅计算当天下注且结算的注单，若提前兑现、注单未结算、取消或走盘皆不计算为累计负盈利；
              </div>
              <div class="item">
                <div class="item-num">4</div>
                任何低于欧洲盘 1.7 或亚洲盘 0.7 水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为累计负盈利内；
              </div>
              <div class="item">
                <div class="item-num">5</div>
                每位有效玩家、手机号码、电子邮箱、银行卡、IP
                地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消全部优惠的权利；
              </div>
              <div class="item">
                <div class="item-num">6</div>
                为避免文字理解差异，雷火电竞保留此活动最终解释权；
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tabValue === 2">
        <div>
          <div class="livepoker-rebate-section">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div>
                  <img
                    src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-title-img.png"
                    style="width: 20px; height: 20px; margin-bottom: 0px"
                  />
                </div>
                每日礼金
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img
                    src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/reward-icon1.png"
                    alt=""
                    width="100%"
                  />
                </div>
                <div class="reward-info-content">
                  周期总负盈利：
                  <span class="amount">{{ totalLoss }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img
                    src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/reward-icon2.png"
                    alt=""
                    width="100%"
                  />
                </div>
                <div class="reward-info-content">
                  可领彩金：
                  <span class="amount">{{ weeklyBonus }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimWeeklyBonus" :class="{ disabled: weeklyBonus <= 0 }">
                <img
                  src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/claim-btn.png"
                  alt=""
                  width="100%"
                />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info">
            <div class="title"></div>
            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="left">活动时间</div>
              <div class="right">2024年10月12日00:00起</div>
            </div>
            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="left">活动内容</div>
              <div class="right">
                在CBA常规赛季期间的每周一到周日完成至少一次存款且一周内累计负盈利≥5,000元的会员在下一周的周一即可获得回馈奖金，最高可获
                888 元
              </div>
            </div>
            <table class="livepoker-rebate-game-info-table">
              <tbody>
                <tr>
                  <th>一周累计负盈利</th>
                  <th>周返还比例</th>
                  <th>周包赔奖金上限</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥5,000元</td>
                  <td>1%</td>
                  <td>888 元</td>
                  <td>8 倍流水</td>
                </tr>
              </tbody>
            </table>
            <div class="livepoker-rebate-game-bottom">
              <div class="livepoker-rebate-game-bottom-left-title">
                例：用户A在10月12日至10月18日一周内累计负盈利为20,000
                元，在下周一至周日的任意一天即可在优惠页面点击【领取】获得周包赔奖金，根据规则会员可获得200
                元包赔奖金，奖金仅需8倍水即可出款。
              </div>
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title"></div>
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                当前活动仅计算体育场馆，在CBA赛季期间内以周为单位根据累计负盈利计算会员应获得的彩金，彩金只需8
                倍流水即可出款
              </div>
              <div class="item">
                <div class="item-num">2</div>
                当前活动符合条件的会员可在活动开始后的次周任意一天在优惠界面点击【领取】按钮获得包赔奖金。彩金保留7
                天，每周领取一次。
              </div>
              <div class="item">
                <div class="item-num">3</div>
                流水仅计算当天下注且结算的注单，若提前兑现、注单未结算、取消或走盘皆不计算为有效投注；
              </div>
              <div class="item">
                <div class="item-num">4</div>
                任何低于欧洲盘1.7或亚洲盘0.7
                水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
              </div>
              <div class="item">
                <div class="item-num">5</div>
                每位有效玩家、手机号码、电子邮箱、银行卡、IP
                地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消全部优惠的权利；
              </div>
              <div class="item">
                <div class="item-num">6</div>
                为避免文字理解差异，雷火电竞保留此活动最终解释权；
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getCBAInit, claimCBADailyBonus, getCBAWeeklyInit, claimCBAWeeklyBonus } from "../../../api/index/promo";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);

const notify = useNotify();
const store = userStore();
const $q = useQuasar();
const router = useRouter();

const totalValidBet = ref(0);
const dailyBonus = ref(0);
const betCount = ref(0);

const weeklyBonus = ref(0);
const totalLoss = ref(0);
const claimedBonus = ref(0);

const tabValue = ref(1);

const handleClaimDailyBonus = () => {
  if (!store.token) {
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "primary",
        label: "去登录",
        tabindex: 1
      },
      cancel: {
        push: true,
        color: "warning",
        label: "取消",
        tabindex: 0
      },
      persistent: true
    }).onOk(() => {
      router.push("/login");
    });
    return;
  }
  claimCBADailyBonus()
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取${res.data}元`
        });
        fetchData();
      } else {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleClaimWeeklyBonus = () => {
  if (!store.token) {
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "primary",
        label: "去登录",
        tabindex: 1
      },
      cancel: {
        push: true,
        color: "warning",
        label: "取消",
        tabindex: 0
      },
      persistent: true
    }).onOk(() => {
      router.push("/login");
    });
    return;
  }
  claimCBAWeeklyBonus()
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取${res.data}元`
        });
        fetchData();
      } else {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchData = async () => {
  try {
    const res = await getCBAInit();
    const res1 = await getCBAWeeklyInit();

    totalValidBet.value = res.data.totalValidBet;
    betCount.value = res.data.betCount;
    dailyBonus.value = res.data.bonus;

    totalLoss.value = res1.data.totalLoss;
    weeklyBonus.value = res1.data.bonus;
    claimedBonus.value = res1.data.claimedBonus;
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
    background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-title.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 240px;
    height: 26px;
    margin: 0 auto;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
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

.tab-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;

  .tab {
    width: 160px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60px;
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    color: #818181;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;

    &.active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
    }
  }
}
</style>
