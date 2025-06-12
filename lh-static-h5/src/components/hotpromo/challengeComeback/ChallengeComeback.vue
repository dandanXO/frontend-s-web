<template>
  <div class="challenge-comeback-container">
    <div class="livepoker-rebate-section section-bg">
      <div class="livepoker-rebate-section-left">
        <div class="livepoker-rebate-section-title">
          <div class="claim-title-icon"></div>
          每日礼金
        </div>
        <div class="reward-info">
          <div class="reward-info-icon claim-coin-icon"></div>
          <div class="reward-info-content">
            每周期负盈利：
            <span class="amount">{{ thousandDigitNoDecimal(loss) }}元</span>
          </div>
        </div>
        <div class="reward-info">
          <div class="reward-info-icon claim-gift-icon"></div>
          <div class="reward-info-content">
            可领彩金：
            <span class="amount">{{ thousandDigitNoDecimal(bonus) }}元</span>
          </div>
        </div>
      </div>
      <div class="livepoker-rebate-section-right">
        <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 }">
          <img src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/claim-btn.png" alt="" width="100%" />
        </div>
      </div>
    </div>

    <div class="challenge-comeback-block detail-block section-bg">
      <div class="title-img">活动详情</div>

      <div class="detail-block-event-content">
        <div class="ribbon">活动内容</div>
        <span>活动期间，每周期负盈利≥500 即可在固定活动时间范围内领取对应档位彩金</span>
      </div>

      <div class="table-wrapper section-table">
        <table>
          <thead>
            <tr>
              <th>负盈利</th>
              <th>负盈利统计时间段</th>
              <th>日日领取彩金</th>
              <th>总彩金</th>
              <th>流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥500</td>
              <td rowspan="6" style="border-bottom: none">每月 1～31 号</td>
              <td>3</td>
              <td>15</td>
              <td rowspan="6" style="border-bottom: none">8倍/不限游戏</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>10</td>
              <td>50</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>36</td>
              <td>180</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>108</td>
              <td>540</td>
            </tr>
            <tr>
              <td>≥100,000</td>
              <td>258</td>
              <td>1,290</td>
            </tr>
            <tr>
              <td>≥500,000</td>
              <td>1,188</td>
              <td>5,940</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-wrapper">
        <table class="section-table">
          <thead>
            <tr>
              <th>活动时间</th>
              <th>结算时间段</th>
              <th>派发领取时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>第一期</td>
              <td>1 号～10 号</td>
              <td>当月 11～15 号，每日 00:00-24:00</td>
            </tr>
            <tr>
              <td>第二期</td>
              <td>11 号～20 号</td>
              <td>当月 21～25 号，每日 00:00-24:00</td>
            </tr>
            <tr>
              <td>第三期</td>
              <td>21 号～31 号</td>
              <td>次月 01～05 号，每日 00:00-24:00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="challenge-comeback-block rule-block section-bg">
      <div class="title-img">活动详情</div>
      <div class="content">
        <div class="item">
          <div class="item-num">1</div>
          活动周期为10天/周期，第一周期为1日-10日、第二周期为11日-20日、第三周期为21日-月底、达标后从1日、11日、21日开始连续5天前往活动页领取红包，每日红包领取时间为0点至23:59分，每日红包有效期24小时内，逾期未领取视为自动放弃，逾期不补，彩金仅需
          8 倍流水即可提款。
        </div>

        <div class="item">
          <div class="item-num">2</div>
          活动说明：
          <br />
          ①周期输赢：只统计周期内投注的已结算并产生输赢结果所有注单的总输赢、任何提前结算或取消的注单不计算。
          <br />
          ②彩金不可购买免费旋转机会，不可投注捕鱼游戏；
        </div>

        <div class="item">
          <div class="item-num">3</div>
          同一手机号、姓名、邮箱地址、银行卡号、IP
          地址等身份认证信息视为同一账号，仅限一个账号参与、任何团体或个人以非法方式套取优惠（如投注对冲等），平台保留在不提前通知情况下做出处理。
        </div>

        <div class="item">
          <div class="item-num">4</div>
          为避免文字理解差异，如有疑问可联系在线客服，平台保留活动最终解释权。
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getCycleLossRefundInit, claimCycleLossRefund } from "../../../api/index/promo";
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

const loss = ref(0);
const bonus = ref(0);

function thousandDigitNoDecimal(value, options) {
  const defaultOptions = {
    minimumFractionDigits: 0
  };
  const optionsWithDefaults = { ...defaultOptions, ...(options || {}) };
  return Number(value).toLocaleString("en-US", optionsWithDefaults);
}

const handleClaimBonus = () => {
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
  claimCycleLossRefund(props.promoCode)
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
    const res = await getCycleLossRefundInit(props.promoCode);

    loss.value = res.data.loss;
    bonus.value = res.data.bonus;
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
<style lang="scss" scoped>
.challenge-comeback-container {
  font-family: "PingFang", "Roboto", "-apple-system", "Helvetica Neue", "Microsoft YaHei", Helvetica, Arial, sans-serif;

  color: #000;
  > :not(:last-child) {
    margin-bottom: 12px;
  }

  .challenge-comeback-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f2f8fe;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    padding: 16px 12px 12px;
    border: 1px solid #f2f8fe;
    border-radius: 12px;

    .challenge-comeback-block-title {
      background: url(./img/block-title-bg.png) no-repeat;
      background-size: contain;
      aspect-ratio: 240 / 20;
      margin: 0 auto;
      font-family: Inter;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.25rem;
      text-align: center;
      color: #4c4c6c;
    }
  }
}

.detail-block {
  .detail-block-event-content {
    .detail-block-event-content-title {
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      width: max-content;
      padding: 3px 16px;
      clip-path: polygon(0 50%, 12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%);
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1rem;
      color: #fff;
      margin-bottom: 4px;
    }

    span {
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.125rem;
    }
  }
}

.rule-block {
  .rules-content {
    color: #000;
    padding: 0;
    counter-reset: list-counter;

    .step-number {
      width: 20px;
      height: 20px;
      font-size: 14px;
    }

    li {
      display: flex;
      counter-increment: list-counter;
      margin-bottom: 0 !important;
      list-style-type: none;
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.125rem;
      &::before {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        content: counter(list-counter);
        width: 16px;
        height: 16px;
        margin-right: 10px;
        background: linear-gradient(90deg, #89d3ff 8.15%, #0085e8 92.42%);
        border-radius: 50%;
        font-family: Play;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1rem;
        color: white;
      }
    }
  }
}

.table-wrapper {
  border: 1px solid #acd4f6;
  border-radius: 10px;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #acd4f6;
    padding: 10px;
    text-align: center;
  }

  thead {
    color: white;
  }
  thead th {
    background: linear-gradient(180deg, #41b9ff -21.81%, #0085e8 95.54%);
    border: none;
  }

  tbody tr {
    > :first-child {
      border-left: none;
    }
    > :last-child {
      border-right: none;
    }
    &:last-child {
      td {
        border-bottom: none;
      }
    }
  }
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
