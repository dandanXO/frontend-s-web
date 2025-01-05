<template>
  <div class="challenge-comeback-container">
    <div class="livepoker-rebate-section">
      <div class="livepoker-rebate-section-left">
        <div class="livepoker-rebate-section-title">
          <div><img src="../../../assets/promo/lh1-blast-premier/section-title-img.png" /></div>
          投注礼金
        </div>
        <div class="reward-info">
          <div class="reward-info-icon">
            <img src="../../../assets/promo/lh1-blast-premier/reward-icon1.png" alt="" width="100%" />
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
            <img src="../../../assets/promo/lh1-blast-premier/reward-icon2.png" alt="" width="100%" />
          </div>
          <div class="reward-info-content">
            可领取彩金：
            <span class="amount">{{ thousandDigitNoDecimal(totalValidBet) }}元</span>
          </div>
        </div>
      </div>
      <div class="livepoker-rebate-section-right">
        <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 }">
          <img src="./img/boxAndBtn.png" alt="" width="100%" />
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
          <div style="display: flex;align-items: center;"><img src="./img/arrow.png" alt="" width="22" style="padding-right: 8px" /></div>
          <span style="color: #ff0000">示例</span>
        </div>
        <div  style="color: #ff0000">会员A：在小艾电竞场馆投注VCTCN联赛5,000元后又在雷火电竞投注VCTCN联赛投注5,000元，会员A在次日可获投注奖励38元和雷火助力金38元，共76元彩金。</div>
      </div>
    </div>

    <div class="challenge-comeback-block rule-block">
      <div class="challenge-comeback-block-title">活动规则</div>
      <ol class="rules-content">
        <li>
          活动期间，在电竞场馆投注VCTCN联赛累计有效投注≥3,000元或以上可获的对应投注嘉奖，若在雷火电竞场馆进行投注VCTCN联赛可获更高奖励金额。      
        </li>
        <div style="font-size: 20px;font-weight: 400;line-height: 28px;margin-left: 34px;color: #ff0000;">注：奖金不叠加派发，奖金按最高档位每日派发一次。</div>
        <li>
          VCTCN联赛投注嘉奖在结算后24小时内有效，可登入优惠界面点击【领取】按钮获得，彩金6倍流水即可提款；
        </li>
        <li>
          任何低于欧洲盘 1.7 或亚洲盘 0.7 水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
        </li>
        <li>根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；</li>
        <li>此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP 地址视为同一账户，若有违规者，将不享受此红利；</li>
        <li>
          为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
      </ol>
    </div>
  </div>
</template>
<script setup>
import { getCompetitionBetPlatformInit, getCompetitionBetPlatformClaimBonus } from "@/api/index/promo";
import { onMounted, ref, defineProps } from "vue";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);
import { ResponseCode } from "@/api/response";
const notify = useNotify();

const store = userStore();
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
  if (!store.hasToken()) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large",
      closeOnClickModal: true
    }).then(() => {
      store.loginPageVisible = true;
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
      } else if (
        !(
          res.code === ResponseCode.ERROR_USER_TOO_FAST ||
          res.code === ResponseCode.ERROR_PROMO_NOT_STARTED ||
          res.code === ResponseCode.ERROR_PROMO_USER_NOT_MEET_REQUIREMENT ||
          res.code === ResponseCode.ERROR_PROMO_CLAIMED ||
          res.code === ResponseCode.ERROR_SYSTEM
        )
      ) {
        // notify({
        //   type: "error",
        //   message: res.message
        // });
      }
    })
    .catch((err) => {
      console.log(err);
      notify({
        type: "error",
        message: err.message
      });
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
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  fetchData();
});
</script>
<style lang="scss" scoped>
.challenge-comeback-container {
  max-width: 1200px;
  margin: 0 auto;
  color: #000;
  > :not(:last-child) {
    margin-bottom: 40px;
  }
}

.challenge-comeback-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #f2f8fe;
  border: 1px solid #acd4f6;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0px 0px 4px 0px #01497b0f;

  .challenge-comeback-block-title {
    background: url(@/components/hotpromo/challengeComeback/img/block-title-bg.png) no-repeat;
    background-size: contain;
    aspect-ratio: 738 / 44;
    margin: 0 auto;
    font-size: 32px;
    font-weight: 400;
    line-height: 44px;
    text-align: center;
    color: #4c4c6c;
  }
}

.detail-block {
  .detail-block-event-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .detail-block-event-content-title {
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      padding: 3px 28px;
      clip-path: polygon(0 50%, 12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%);
      font-size: 16px;
      font-weight: 600;
      line-height: 23.33px;
      color: #fff;
    }

    span {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
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
      margin-bottom: 4px;
      list-style-type: none;
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      &::before {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        content: counter(list-counter);
        width: 24px;
        height: 24px;
        margin-right: 10px;
        background: linear-gradient(90deg, #89d3ff 8.15%, #0085e8 92.42%);
        border-radius: 50%;
        font-family: Play;
        font-size: 18px;
        font-weight: 700;
        line-height: 24px;
        color: white;
      }
    }
  }
}

.table-wrapper {
  /* border: 1px solid #acd4f6;
  border-radius: 10px; */
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
    background: linear-gradient(180deg, #41b9ff -21.81%, #0085e8 95.54%);
    color: white;
  }
  thead th {
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
  padding: 30px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  background: url("../../../assets/promo/lh1-blast-premier/section-bg.png");
  background-size: 100% 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .livepoker-rebate-section-right {
    margin-top: auto;
    margin-bottom: auto;
    width: 254px;

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
        filter: grayscale(100%);
        cursor: not-allowed;
        pointer-events: none;
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

.reward-info {
  border: 1px solid rgba(215, 235, 255, 1);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
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
</style>
