<template>
  <div class="challenge-comeback-container">
    <div class="livepoker-rebate-section">
      <div class="livepoker-rebate-section-left">
        <div class="livepoker-rebate-section-title">
          <div>
            <img
              src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-title-img.png"
              style="width: 20px; height: 20px; margin-bottom: 0px"
            />
          </div>
          投注礼金
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
            昨日累计有效投注：
            <span class="amount">{{ thousandDigitNoDecimal(bonus) }}元</span>
          </div>
        </div>
        <div class="reward-info">
          <div class="reward-info-icon">
            <img src="./img/coin.png" alt="" width="100%" />
          </div>
          <div class="reward-info-content">
            昨日LH有效投注：
            <span class="amount">{{ thousandDigitNoDecimal(platformValidBet) }}元</span>
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
            可领取彩金：
            <span class="amount">{{ thousandDigitNoDecimal(totalValidBet) }}元</span>
          </div>
        </div>
      </div>
      <div class="livepoker-rebate-section-right">
        <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 }">
          <img src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/claim-btn.png" alt="" width="100%" />
        </div>
      </div>
    </div>

    <div class="challenge-comeback-block detail-block">
      <div class="challenge-comeback-block-title">活动详情</div>

      <div class="detail-block-event-content">
        <div class="detail-block-event-content-title">活动时间</div>
        <span>2025年1月11日-2025年2月9日</span>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>累计有效投注</th>
              <th>累计投注嘉奖</th>
              <th>雷火助力金</th>
              <th>流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥3,000</td>
              <td>8元</td>
              <td>18元</td>
              <td rowspan="9" style="border-bottom: none">6倍流水</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>18元</td>
              <td>38元</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>38元</td>
              <td>58元</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>58元</td>
              <td>88元</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>88元</td>
              <td>128元</td>
            </tr>
            <tr>
              <td>≥100,000</td>
              <td>108元</td>
              <td>288元</td>
            </tr>
            <tr>
              <td>≥200,000</td>
              <td>288元</td>
              <td>358元</td>
            </tr>
            <tr>
              <td>≥500,000</td>
              <td>588元</td>
              <td>888元</td>
            </tr>
            <tr>
              <td>≥1,000,000</td>
              <td>1,088元</td>
              <td>1,188元</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div style="display: flex; align-items: center">
          <div style="display: flex; align-items: center">
            <img src="./img/arrow.png" alt="" width="16" style="padding-right: 8px" />
          </div>
          <span style="color: #ff0000">示例</span>
        </div>
        <div style="color: #ff0000">
          会员A：在小艾电竞场馆投注VCTCN联赛5,000元后又在雷火电竞投注VCTCN联赛投注5,000元，会员A在次日可获投注奖励38元和雷火助力金38元，共76元彩金。
        </div>
      </div>
    </div>

    <div class="challenge-comeback-block rule-block">
      <div class="challenge-comeback-block-title">活动规则</div>
      <ol class="rules-content">
        <li>
          活动期间，在电竞场馆投注VCTCN联赛累计有效投注≥3,000元或以上可获的对应投注嘉奖，若在雷火电竞场馆进行投注VCTCN联赛可获更高奖励金额。
        </li>
        <div style="font-size: 0.75rem; font-weight: 400; line-height: 1.125rem; margin-left: 26px; color: #ff0000">
          注：奖金不叠加派发，奖金按最高档位每日派发一次。
        </div>
        <li>VCTCN联赛投注嘉奖在结算后24小时内有效，可登入优惠界面点击【领取】按钮获得，彩金6倍流水即可提款；</li>
        <li>
          任何低于欧洲盘 1.7 或亚洲盘 0.7
          水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
        </li>
        <li>
          根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
        </li>
        <li>
          此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
          地址视为同一账户，若有违规者，将不享受此红利；
        </li>
        <li>为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
      </ol>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getCompetitionBetPlatformInit, getCompetitionBetPlatformClaimBonus } from "../../../api/index/promo";
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

const platformValidBet = ref(0);
const totalValidBet = ref(0);
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
  getCompetitionBetPlatformClaimBonus(props.promoCode)
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
    const res = await getCompetitionBetPlatformInit(props.promoCode);
    platformValidBet.value = res.data.platformValidBet;
    totalValidBet.value = res.data.totalValidBet;
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
