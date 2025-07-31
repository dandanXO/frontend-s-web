<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="section first">
        <!-- <div class="title">
          <img class="logo" src="../../../assets/images/promo/hotpromo/blastbounty/bounty-logo.png" />
          <img class="top" src="../../../assets/images/promo/hotpromo/blastbounty/section-2-spring.png" />
        </div> -->
        <!-- <div class="tips">
          <div class="tips-inner">活动时间：2025年1月14日至2025年1月26日</div>
          <div class="tips-inner">
            活动期间，当日存款≥200元且当天投注BLAST Premier 赏金赛≥1000元则视为签到成功，次日即可领取签到奖金
          </div>
        </div> -->
        <!-- <div class="title">
          <img class="bottom" src="../../../assets/images/promo//hotpromo/blastbounty/section-bottom.png" />
        </div> -->
      </div>
      <div class="livepoker-rebate-section">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div>
              <img
                src="../../../assets/images/promo/hotpromo/blastbounty/section-title-img.png"
                style="width: 20px; height: 20px; margin-bottom: 0px"
              />
            </div>
            签到礼金
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img
                src="../../../assets/images/promo/hotpromo/blastbounty/reward-icon1.png"
                alt=""
                width="100%"
              />
            </div>
            <div class="reward-info-content">
              昨日累计存款：
              <span class="amount">{{ yesterdayDeposit }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img
                src="../../../assets/images/promo/hotpromo/blastbounty/reward-icon3.png"
                alt=""
                width="100%"
              />
            </div>
            <div class="reward-info-content">
              昨日累计有效投注：
              <span class="amount">{{ yesterdayBet }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img
                src="../../../assets/images/promo/hotpromo/blastbounty/reward-icon2.png"
                alt=""
                width="100%"
              />
            </div>
            <div class="reward-info-content">
              签到彩金:
              <span class="amount">{{ claimableAmount }}元</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div :style="!canClaim ? 'filter: grayscale(.9); pointer-events: none;' : ''" class="bonus-image" @click="handleClaimBonus" :class="{ disabled: claimableAmount <= 0 }">
            <img src="../../../assets/images/promo/hotpromo/blastbounty/claim-btn.png" alt="" width="100%" />
          </div>
        </div>
      </div>
      <div class="livepoker-rebate-game-info">
         <div class="title-img">活动详情</div>
         <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">2025年8月05日至2025年8月17日</div>
        </div>
        <div class="little-title">
          <div class="left">活动内容</div>
          <div class="right">活动期间，当日存款≥500元且当天投注BLAST赏金赛第二赛季≥1000元则视为签到成功，次日即可领取签到奖金</div>
        </div>
        <table class="livepoker-rebate-game-info-table">
          <tbody>
            <tr>
              <th>当日存款</th>
              <th>当日累计有效投注</th>
              <th>签到奖金</th>
              <th>流水倍数</th>
            </tr>
            <tr>
              <td rowspan="8">≥200元</td>
              <td>≥1,000</td>
              <td>8元</td>
              <td rowspan="8">8倍流水</td>
            </tr>
            <tr>
              <td>≥5000</td>
              <td>28元</td>
            </tr>
            <tr>
              <td>≥10000</td>
              <td>58元</td>
            </tr>
            <tr>
              <td>≥30000</td>
              <td>128元</td>
            </tr>
            <tr>
              <td>≥50000</td>
              <td>288元</td>
            </tr>
            <tr>
              <td>≥100000</td>
              <td>558元</td>
            </tr>
            <tr>
              <td>≥200000</td>
              <td>888元</td>
            </tr>
          </tbody>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img
                src="../../../assets/images/promo/hotpromo/blastbounty/game-bottom-left-btn.png"
                alt=""
                style="width: 10px"
              />
              <span>示例</span>
            </div>
            会员A在电竞场馆投注BLAST赏金赛第二赛季,当日存款500元并累计有效投注为6,000元,次日即可获得签到金28元并获得宝箱钥匙12把。 
          </div>
        </div>
      </div>

      
      <div class="livepoker-rebate-game-bottom-rule section-bg">
        <div class="title-img">活动规则</div>
        <br/>
        <div class="content">
        <div class="item">
          <div class="item-num">1</div>
          <div style="display: flex; flex-direction: column">
            活动期间，每日投注 BLAST 赏金赛第二赛季达到 500 元有效投注，即可在次日 12:00 自动获得 1 个开箱钥匙，开箱钥匙与开箱次数每日不设上限；
            <div class="hint">注：开箱钥匙可累积使用，仅限活动期间开启，逾期未开启不予补偿。</div>
          </div>
        </div>
        <div class="item">
          <div class="item-num">2</div>
          开启宝箱后获得的彩金由系统自动实时派发至会员主钱包内，彩金 5 倍流水即可出款；
        </div>
        <div class="item">
          <div class="item-num">3</div>
          活动期间，仅计算当日投注 BLAST 赏金赛第二赛季已结算的注单；
        </div>
        <div class="item">
          <div class="item-num">4</div>
          当日存款 ≥500 元且 BLAST 赏金赛第二赛季有效投注 ≥1,000 元的会员，可在次日 24 小时内于活动页面点击【立即领取】按钮领取签到奖金；逾期未领取视为放弃，彩金 8 倍流水即可出款；
        </div>
        <div class="item">
          <div class="item-num">5</div>
          同一手机号、姓名、邮箱地址、银行卡号等信息视为同一账户，每位会员仅可参与一次，若发现违规行为，将不享受此红利；
        </div>
        <div class="item">
          <div class="item-num">6</div>
          任何会员或团体以不正常的方式套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，且不退还款项，并将会员列入黑名单；
        </div>
        <div class="item">
          <div class="item-num">7</div>
          为避免文字理解差异，本站保留本活动最终解释权；
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import { getBountyInit, claimBountyBonus } from "../../../api/index/promo";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const props = defineProps(["promoCode"]);
const { promoCode } = toRefs(props);

const notify = useNotify();
const store = userStore();
const $q = useQuasar();
const router = useRouter();

const yesterdayDeposit = ref(0);
const yesterdayBet = ref(0);
const claimableAmount = ref(0);
const canClaim = ref(false);
const isClaiming = ref(false);

const handleClaimBonus = () => {
  if (isClaiming.value === true) {
    return;
  }
  isClaiming.value = true;
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
  claimBountyBonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        notify({
          message: "成功领取",
          type: "red-packet",
          params: {
            redPacket: res.data
          }
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
    })
    .finally(() => {
      isClaiming.value = false;
    });
};

const fetchData = async () => {
  try {
    const res = await getBountyInit(promoCode.value);
    yesterdayDeposit.value = res.data.yesterdayDeposit;
    yesterdayBet.value = res.data.yesterdayBet;
    claimableAmount.value = res.data.claimableAmount;
    canClaim.value = res.data.canClaim
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
      line-height: 20px;
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
        color: #ff5d5d !important;
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
