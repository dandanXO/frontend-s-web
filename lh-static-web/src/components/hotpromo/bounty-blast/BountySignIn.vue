<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="section first">
        
        <!-- <div class="tips">
          <div class="tips-inner">活动时间：2025年1月14日至2025年1月26日<br>活动期间，当日存款≥200元且当天投注BLAST Premier 赏金赛≥1000元则视为签到成功，次日即可领取签到奖金</div>
        </div> -->
        <!-- <div class="title">
          <img class="bottom" src="@/assets/images/promotion/hotpromo/blastpremier/section-bottom.png" />
        </div> -->
      </div>
      <div class="livepoker-rebate-section section-bg">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div><img src="@/assets/promo/lh-livepoker-rebate/section-title-img.png" /></div>
            签到礼金
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="@/assets/promo/lh-livepoker-rebate/reward-icon1.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              昨日累计存款：
              <span class="amount">{{ yesterdayDeposit }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="@/assets/promo/lh-livepoker-rebate/reward-icon3.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              昨日累计有效投注:
              <span class="amount">{{ yesterdayBet }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="@/assets/promo/lh-livepoker-rebate/reward-icon2.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              签到彩金：
              <span class="amount">{{ claimableAmount }}元</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: claimableAmount <= 0 || loadingClaim }">
            <img
              v-if="claimableAmount <= 0 || loadingClaim"
              src="@/assets/promo/lh-livepoker-rebate/reward-btn-3-disabled.png"
              alt=""
              width="100%"
            />
            <img v-else src="@/assets/promo/lh-livepoker-rebate/reward-btn-3.png" alt="" width="100%" />
          </div>
        </div>
      </div>
      <div class="livepoker-rebate-game-info">
        <div class="title-img">活动详情</div>
        <div class="little-title">  
          <div class="left">活动时间</div>
          <div class="right">2025年8月05日至2025年8月17日 </div>
        </div>
        <div class="little-title">
          <div class="left">活动内容</div>
          <div class="right">活动期间，当日存款≥500元且当天投注BLAST赏金赛第二赛季≥1000元则视为签到成功，次日即可领取签到奖金 </div>
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
              <img src="@/assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" style="width: 10px" />
              <span>示例</span>
            </div>
            会员A在电竞场馆投注BLAST赏金赛第二赛季,当日存款500元并累计有效投注为6,000元,次日即可获得签到金28元并获得宝箱钥匙12把。 
          </div>
        </div>
      </div>

      <div class="livepoker-rebate-game-bottom-rule section-bg section third">
      <div class="title-img">活动规则</div>
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
import { getBountyInit, claimBountyBonus } from "@/api/index/promo";
import { onMounted, ref, defineProps, toRefs } from "vue";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
import { ResponseCode } from "@/api/response";
const props = defineProps(["promoCode"]);
const { promoCode } = toRefs(props);

const notify = useNotify();

const store = userStore();
const yesterdayDeposit = ref(0);
const yesterdayBet = ref(0);
const claimableAmount = ref(0);
const canClaim = ref(false);
const isClaiming = ref(false);

const handleClaimBonus = () => {
  if (canClaim.value === false) return;
  if (isClaiming.value) return;
  isClaiming.value = true;
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

  claimBountyBonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        notify.redPacket("成功领取", res.data);
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
    // justify-content: space-between;
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
  // align-items: center;
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
// .section {
//   &.third {
//       background: url(@/assets/images/promotion/hotpromo/blastpremier/rules-bg.png) no-repeat center center;
//       background-size: 100% 100%;
//       max-width: 1200px;
//       margin: 20px auto;
//       padding: 20px 50px;

//       color: #b5a73b;
//       .title {
//         text-align: center;
//         img {
//           height: 70px;
//           width: auto;
//         }
//       }

//       .content {
//         text-align: left;
//         z-index: 99;
//         position: relative;
//       }
//     }
// }

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
</style>
