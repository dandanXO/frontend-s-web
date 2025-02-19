<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="tab-wrapper">
        <div class="tab" :class="{ active: tabValue === 1 }" @click="tabValue = 1">投注挑战赛</div>
        <div class="tab" :class="{ active: tabValue === 2 }" @click="tabValue = 2">点灯迎福</div>
      </div>

      <template v-if="tabValue === 1">
        <div>
          <div class="livepoker-rebate-section section-bg">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div class="claim-title-icon"></div>
                投注挑战赛
              </div>
              <div class="reward-info">
                <div class="reward-info-icon claim-coin-icon"></div>
                <div class="reward-info-content">
                  累计有效投注：
                  <span class="amount">{{ totalValidBet }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon claim-gift-icon"></div>
                <div class="reward-info-content">
                  可领元宵特别奖金：
                  <span class="amount">{{ bonus1 }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimBonus1" :class="{ disabledd: bonus1 <= 0 }">
                <img src="./images/reward.png" alt="" width="100%" />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info section-bg">
            <div
              style="
                background: linear-gradient(270.62deg, #e6cc93 -6.62%, #fff1e1 101.55%);
                background-clip: text;
                --webkit-background-clip: text;
                text-align: center;
                color: transparent !important;
                font-weight: 600;
                font-size: 22px;
              "
            >
              活动详情
            </div>

            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="ribbon">活动时间</div>
              <div class="right">2025 年 2 月 10 日 00:00 至 2 月 12 日 23:59(共 3 天!）</div>
            </div>
            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="ribbon">活动内容</div>
              <div class="right">
                在元宵节期间（3 天内），会员累计达到一定的有效投注金额，即可获得元宵特别奖金，投注越高，奖励越丰厚！
              </div>
            </div>
            <table class="livepoker-rebate-game-info-table section-table">
              <tbody>
                <tr>
                  <th>有效投注金额 (元)</th>
                  <th>奖励金额 (元)</th>
                  <th>流水要求</th>
                </tr>
                <tr>
                  <td>3,888 - 9,999</td>
                  <td>58</td>
                  <td :rowspan="5">6 倍流水</td>
                </tr>
                <tr>
                  <td>10,000 - 29,999</td>
                  <td>88</td>
                </tr>
                <tr>
                  <td>30,000 - 59,999</td>
                  <td>188</td>
                </tr>
                <tr>
                  <td>60,000 - 99,999</td>
                  <td>588</td>
                </tr>
                <tr>
                  <td>100,000 及以上</td>
                  <td>888</td>
                </tr>
              </tbody>
            </table>
            <div class="livepoker-rebate-game-bottom">
              <div class="livepoker-rebate-game-bottom-left-title">
                <div class="livepoker-rebate-game-bottom-left-btn">
                  <img src="./images/triangle.png" alt="" style="width: 10px" />
                  <span>示例</span>
                </div>
                会员在 2 月 10 日至 2 月 12 日三天活动时间内累计有效投注 58,888 元，在 2 月 13 日可获得 188
                元的元宵特别奖金，仅需 6 倍流水即可提款。
              </div>
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule section-bg">
            <div
              style="
                background: linear-gradient(270.62deg, #e6cc93 -6.62%, #fff1e1 101.55%);
                background-clip: text;
                --webkit-background-clip: text;
                text-align: center;
                color: transparent !important;
                font-weight: 600;
                font-size: 28px;
              "
            >
              活动规则
            </div>
            <br />
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                <div style="display: flex; flex-direction: column">
                  <div>活动期间会员在 2 月 10 日至 2 月 12 日活动期间内累计有效投注≥3,888元即可获得元宵特别奖金；</div>
                  <div class="hint">注：奖金不叠加派发，奖金按最高档位派发一次。</div>
                </div>
              </div>
              <div class="item">
                <div class="item-num">2</div>
                活动领取时间为 2 月 13
                日全天（00:00-23:59）,满足活动要求的会员在活动页面点击【元宵奖金】按钮领取。逾期未领取则视为放弃，彩金
                6倍流水即可出款；
              </div>
              <div class="item">
                <div class="item-num">3</div>
                彩金不可用于以下游戏或投注：购买免费旋转、桌面游戏、街机游戏、能量累积类游戏和部分多旋转类游戏；
              </div>
              <div class="item">
                <div class="item-num">4</div>
                此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
                地址视为同一账户，若有违规者，将不享受此红利；
              </div>
              <div class="item">
                <div class="item-num">5</div>
                根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
              </div>
              <div class="item">
                <div class="item-num">6</div>
                为避免文字理解差异，兴发电竞保留此活动最终解释权；
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tabValue === 2">
        <div>
          <div class="livepoker-rebate-section section-bg">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div class="claim-title-icon"></div>
                点灯迎福
              </div>
              <div class="reward-info">
                <div class="reward-info-icon claim-coin-icon"></div>
                <div class="reward-info-content">
                  当天累计存款金额：
                  <span class="amount">{{ totalDeposit }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon claim-gift-icon"></div>
                <div class="reward-info-content">
                  可点亮灯笼数量：
                  <span class="amount">{{ lanternAvailable }}盏</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimBonus2" :class="{ disabledd: lanternAvailable <= 0 }">
                <img src="./images/reward.png" alt="" width="100%" />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info section-bg">
            <div
              style="
                background: linear-gradient(270.62deg, #e6cc93 -6.62%, #fff1e1 101.55%);
                background-clip: text;
                --webkit-background-clip: text;
                text-align: center;
                color: transparent !important;
                font-weight: 600;
                font-size: 28px;
              "
            >
              活动详情
            </div>
            <div class="little-title" style="justify-content: flex-start; align-items: flex-start">
              <div class="ribbon">活动时间</div>
              <div class="right">2 月 12 日</div>
            </div>
            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="ribbon">活动内容</div>
              <div class="right">
                在 2 月 12 日当天累计总存款≥1,000 元以上即可获得灯笼抽奖机会，点亮灯笼数量高达 60 盏！
              </div>
            </div>
            <table class="livepoker-rebate-game-info-table section-table">
              <tbody>
                <tr>
                  <th>当日总存款</th>
                  <th>点亮灯笼</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥1,000 元</td>
                  <td>1 盏</td>
                  <td :rowspan="9">8 倍流水</td>
                </tr>
                <tr>
                  <td>≥5,000 元</td>
                  <td>3 盏</td>
                </tr>
                <tr>
                  <td>≥10,000 元</td>
                  <td>5 盏</td>
                </tr>
                <tr>
                  <td>≥30,000 元</td>
                  <td>10 盏</td>
                </tr>
                <tr>
                  <td>≥80,000 元</td>
                  <td>15 盏</td>
                </tr>
                <tr>
                  <td>≥100,000 元</td>
                  <td>20 盏</td>
                </tr>
                <tr>
                  <td>≥500,000 元</td>
                  <td>30 盏</td>
                </tr>
                <tr>
                  <td>≥1,000,000 元</td>
                  <td>50 盏</td>
                </tr>
                <tr>
                  <td>≥5,000,000 元</td>
                  <td>60 盏</td>
                </tr>
              </tbody>
            </table>
            <div class="livepoker-rebate-game-bottom">
              <div class="livepoker-rebate-game-bottom-left-title">
                <div class="livepoker-rebate-game-bottom-left-btn">
                  <img src="./images/triangle.png" alt="" style="width: 10px" />
                  <span>示例</span>
                </div>
                会员在 2 月 12 日当天存款 50,000 元，2 月 13 日全天即可进入优惠页面点亮灯笼 10
                盏，获得对应的点亮礼金，礼金仅需 8 倍流水即可出款。
              </div>
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule section-bg">
            <div
              style="
                background: linear-gradient(270.62deg, #e6cc93 -6.62%, #fff1e1 101.55%);
                background-clip: text;
                --webkit-background-clip: text;
                text-align: center;
                color: transparent !important;
                font-weight: 600;
                font-size: 28px;
              "
            >
              活动规则
            </div>
            <br />
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                <div style="display: flex; flex-direction: column">
                  <div>活动期间会员在 2 月 12 日当天累计总存款≥1,000 元即可点亮灯笼。</div>
                  <div class="hint">注：奖金不叠加派发，点亮灯笼数量高达 60 盏！</div>
                </div>
              </div>
              <div class="item">
                <div class="item-num">2</div>
                点亮灯笼时间为 2 月 13
                日全天（00:00-23:59），符合要求的会员可登入优惠界面点击【点亮灯笼】按钮获得，彩金实时到账，仅需 8
                倍流水即可提款；
              </div>
              <div class="item">
                <div class="item-num">3</div>
                彩金不可用于以下游戏或投注：购买免费旋转、桌面游戏、街机游戏、能量累积类游戏和部分多旋转类游戏；
              </div>
              <div class="item">
                <div class="item-num">4</div>
                此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
                地址视为同一账户，若有违规者，将不享受此红利；
              </div>
              <div class="item">
                <div class="item-num">5</div>
                根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
              </div>
              <div class="item">
                <div class="item-num">6</div>
                为避免文字理解差异，兴发电竞保留此活动最终解释权；
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import {
  initLanternFestivalBonus,
  claimLanternFestivalBonus,
  initLanternFestivalDeposit,
  claimLanternFestivalDeposit
} from "../../../api/index/promo";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const props = defineProps(["promoParam"]);
const { promoParam } = toRefs(props);

const notify = useNotify();
const store = userStore();
const $q = useQuasar();
const router = useRouter();

const totalValidBet = ref(0);
const bonus1 = ref(0);

const lanternLighted = ref(0);
const lanternAvailable = ref(0);
const totalDeposit = ref(0);

const tabValue = ref(1);

const handleClaimBonus2 = () => {
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
  claimLanternFestivalDeposit(promoParam.value.promoCode2)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功点亮灯笼！成功领取${res.data}元！`
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

const handleClaimBonus1 = () => {
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
  claimLanternFestivalBonus(promoParam.value.promoCode1)
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
    const res1 = await initLanternFestivalBonus(promoParam.value.promoCode1);
    const res2 = await initLanternFestivalDeposit(promoParam.value.promoCode2);

    totalValidBet.value = res1.data?.totalValidBet || 0;
    bonus1.value = res1.data?.bonus || 0;

    totalDeposit.value = res2.data?.totalDeposit || 0;
    lanternLighted.value = res2.data?.lanternLighted || 0;
    lanternAvailable.value = res2.data?.lanternAvailable || 0;
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
  padding: 10px 20px;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 20px 12px 40px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: unset !important;
  background: url("./images/bg1.png");
  background-size: 100% 100%;
  align-items: center;
  width: 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    color: #fff;
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

      &.disabledd {
        filter: grayscale(100%);
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .livepoker-rebate-section-title {
    color: #fff;
    font-size: 16px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
    .claim-title-icon {
      background: url("./images/icon.png") no-repeat center center;
      background-size: 100% 100%;
    }
  }
  .claim-coin-icon {
    background: url("./images/icon3.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .claim-gift-icon {
    background: url("./images/icon2.png") no-repeat center center;
    background-size: 100% 100%;
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
    color: #fff !important;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #fff !important;
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

  border: 0px !important;
  background-image: url("./images/bg2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    // background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-title.png");
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

    .ribbon {
      background: linear-gradient(259.14deg, #d47c33 27.82%, #fafe8a 52.4%, #d47c33 99.13%);
      color: #000;
    }
    .left {
      // background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-little-title-bg.png");
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
      color: #fff;
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
    color: #000 !important;
    background: linear-gradient(259.14deg, #d47c33 27.82%, #fafe8a 52.4%, #d47c33 99.13%) !important;
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
    background: transparent !important;
    border: 1px solid rgba(244, 210, 76, 1) !important;
    height: 36px;
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
  }
}

.livepoker-rebate-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 20px 12px 12px;
  border: 0px !important;
  background-image: url("./images/bg3.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    // background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/rule-title.png");
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
      color: #fff;
      .item-num {
        color: #000;
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
        background: linear-gradient(259.14deg, #d47c33 27.82%, #fafe8a 52.4%, #d47c33 99.13%);
      }

      .hint {
        font-size: 12px;
        font-weight: 400;
        line-height: 22.4px;
        color: rgba(225, 255, 0, 1);
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
  color: #fff;

  .amount {
    background: linear-gradient(
      259.14deg,
      #ffecce 11.64%,
      #f3cd92 27.82%,
      #fff2ca 52.4%,
      #efd190 72.12%,
      #e4bd80 99.13%
    );
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
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
      background: linear-gradient(90deg, #fffd66 0%, #ff9400 100%);
      color: #000;
    }
  }
}
</style>
