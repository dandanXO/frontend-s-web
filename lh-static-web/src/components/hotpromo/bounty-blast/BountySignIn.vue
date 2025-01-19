<template>
  <div class="bounty-sign-wrapper">
    <div class="bounty-sign-container">
      <div class="section first">
        <div class="title">
          <img class="logo" src="@/assets/images/promotion/hotpromo/blastpremier/bounty-logo.png">
          <!-- <img class="logo" src="@/assets/images/promotion/hotpromo/blastpremier/spring-logo.png" /> -->
          <img class="top" src="@/assets/images/promotion/hotpromo/blastpremier/section-2-spring.png" />
        </div>
        <div class="tips">
          <div class="tips-inner">活动时间：2025年1月14日至2025年1月26日<br>活动期间，当日存款≥200元且当天投注BLAST Premier 赏金赛≥1000元则视为签到成功，次日即可领取签到奖金</div>
        </div>
        <div class="title">
          <img class="bottom" src="@/assets/images/promotion/hotpromo/blastpremier/section-bottom.png" />
        </div>
      </div>
      <div class="bounty-sign-section">
        <div class="bounty-sign-section-left">
          <div class="bounty-sign-section-title">
            <div><img src="@/assets/promo/lh-livepoker-rebate/section-title-gold-img.png" /></div>
            签到礼金
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="@/assets/promo/lh-livepoker-rebate/reward-icon1-gold.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              昨日累计存款：
              <span class="amount">{{ yesterdayDeposit }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="@/assets/promo/lh-livepoker-rebate/reward-icon3-gold.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              昨日累计有效投注:
              <span class="amount">{{ yesterdayBet }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="@/assets/promo/lh-livepoker-rebate/reward-icon2-gold.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              签到彩金：
              <span class="amount">{{ claimableAmount }}元</span>
            </div>
          </div>
        </div>
        <div class="bounty-sign-section-right">
          <div :style="!canClaim ? 'filter: grayscale(.9); pointer-events: none;' : ''" class="bonus-image" @click="handleClaimBonus" :class="{ disabled: claimableAmount <= 0 }">
            <!-- <img
              v-if="bonus <= 0"
              src="@/assets/promo/lh-livepoker-rebate/reward-btn-disabled.png"
              alt=""
              width="100%"
            /> -->
            <img src="@/assets/promo/lh-livepoker-rebate/reward-btn-gold.png" alt="" width="100%" />
          </div>
        </div>
      </div>
      <div class="bounty-sign-game-info">
        <div class="title"><img src="@/assets/images/promotion/hotpromo/blastpremier/section-4-spring.png" /></div>
        <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">2025年1月14日至2025年1月26日</div>
        </div>
        <div class="little-title">
          <div class="left">活动内容</div>
          <div class="right">活动期间，当日存款≥200元且当天投注BLAST Premier 赏金赛≥1,000元则视为签到成功，次日即可领取签到奖金。</div>
        </div>
        <table class="bounty-sign-game-info-table">
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
        <div class="bounty-sign-game-bottom">
          <div class="bounty-sign-game-bottom-left-title">
            <div class="bounty-sign-game-bottom-left-btn">
              <img src="@/assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" style="width: 10px" />
              <span>示例</span>
            </div>
            会员A在电竞场馆投注BLAST Premier 赏金赛,当日累计有效投注为6000元,次日即可获得签到金28元并获得宝箱钥匙12把。
          </div>
        </div>
      </div>

      <div class="section third">
      <div class="title"><img src="@/assets/images/promotion/hotpromo/blastpremier/section-3-spring.png" /></div>
      <div class="content">
        <p>
          1.  活动期间,每日投注BLAST Premier 赏金赛达到500元有效投注即可在次日12：00点左右自动获得1个开箱钥匙,开箱钥匙与开箱次数每日不设上限
        </p>
        <p>
          2. 活动期间,开箱钥匙可积攒使用,获得开箱钥匙满足开箱条件可在活动期间任意时间开启宝箱,超出活动时间未开启宝箱则不予补偿
        </p>
        <p>3. 开启宝箱后获得彩金由系统自动实时派发至会员主钱包内.彩金5倍流水即可出款</p>
        <p>
          4. 活动期间,当日存款≥200元且 BLAST Premier 赏金赛有效投注≥1,000元在次日24 小时内在活动页面点击【点击领取】按钮领取签到奖金。逾期未领取则视为放弃，彩金8 倍流水即可出款；
        </p>
        <p>
          5. 同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号,仅可参与一次,若有违规者,将不享受此红利
        </p>
        <p>6. 任何会员或团体以不正常的方式进行套取活动优惠,平台方保在不通知的情况下冻结或关闭相关账户的权利,并不退还款项,且会员会被列入黑名单</p>
        <p>
          7. 为避免文字理解差异,本站保留本活动最终解释权
        </p>
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
.bounty-sign-wrapper {
  display: flex;
  justify-content: center;
}
.bounty-sign-container {
  width: 1200px;
  height: 100%;

  .section {
    margin-bottom: 30px;

    &.first {
      .title .logo {
        margin: 50px auto 10px;
        width: 200px;
        img {
          width: 100%;
        }
      }

  .title {
    margin: 0 auto 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    img {
      margin: 0 auto;
      &.logo {
        max-width: 350px;
      }
      &.top {
        max-width: 600px;
      }
      &.bottom {
        margin: 10px auto;
      }
    }
  }.tips {
    color: #fffd66;
    margin: 0 auto;
    text-align: center;
    font-size: 16px;
  }

    }
  }
}

.bounty-sign-section {
  padding: 30px 40px;
  border-radius: 12px;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  background: url("@/assets/promo/lh-livepoker-rebate/gold-container.png");
  background-size: 100% 100%;

  .bounty-sign-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .bounty-sign-section-right {
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
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .bounty-sign-section-title {
    color: #B5A73B;
    font-size: 24px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
  }
}

.bounty-sign-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.bounty-sign-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .bounty-sign-game-bottom-left-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: #ff0000;
    padding: 20px 0;
  }
  .bounty-sign-game-bottom-left-btn {
    font-size: 16px;
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

.bounty-sign-game-info {
  background: url(@/assets/images/promotion/hotpromo/blastpremier/rules-bg.png) no-repeat center center;
  background-size: 100% 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px 50px;

  color: #b5a73b;

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px auto;
    img {

    height: 70px;}
  }
  .little-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    .left {
      background-image: url("@/assets/promo/lh-livepoker-rebate/info-little-gold-bg.png");
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
      color: #000000;
      margin-right: 16px;
    }
    .right {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: #B5A73B;
      margin-bottom: 15px;
    }
  }
}

.bounty-sign-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  text-align: center;
  vertical-align: middle;
  tr:first-child {

    background: linear-gradient(90deg, #FFFD66 0%, #FF9400 100%);
  }
  th {
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
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
    border: 1px solid #FF9F0B66;
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #B5A73B;
  }
}

.bounty-sign-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #FF9F0B66;
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
        color: #ff0000;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
}
.section {
  &.third {
      background: url(@/assets/images/promotion/hotpromo/blastpremier/rules-bg.png) no-repeat center center;
      background-size: 100% 100%;
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px 50px;

      color: #b5a73b;
      .title {
        text-align: center;
        img {
          height: 70px;
          width: auto;
        }
      }

      .content {
        text-align: left;
        z-index: 99;
        position: relative;
      }
    }
}
.reward-info {
  border: 1px solid #FF9F0B66;
  padding: 15px 20px;
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
  color: #B5A73B;
  gap: 24px;

  .amount {
    color: #FFFD66;
    font-weight: 600;
  }
}
</style>
