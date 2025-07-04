<template>
  <div class="bounty-sign-wrapper">
    <div class="bounty-sign-container">
      <div class="section first">
        <div class="title">
          <img class="logo" src="../../../assets/images/promo/hotpromo/blastbounty/bounty-logo.png" />
          <img class="top" src="../../../assets/images/promo/hotpromo/blastbounty/section-2-spring.png" />
        </div>
        <div class="tips">
          <div class="tips-inner">活动时间：2025年1月14日至2025年1月26日</div>
          <div class="tips-inner">
            活动期间，当日存款≥200元且当天投注BLAST Premier 赏金赛≥1000元则视为签到成功，次日即可领取签到奖金
          </div>
        </div>
        <div class="title">
          <img class="bottom" src="../../../assets/images/promo//hotpromo/blastbounty/section-bottom.png" />
        </div>
      </div>
      <div class="bounty-sign-section">
        <div class="bounty-sign-section-left">
          <div class="bounty-sign-section-title">
            <div>
              <img
                src="../../../assets/images/promo/hotpromo/blastbounty/section-title-gold-img.png"
                style="width: 20px; height: 20px; margin-bottom: 0px"
              />
            </div>
            签到礼金
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="../../../assets/images/promo/hotpromo/blastbounty/reward-icon1-gold.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              昨日累计存款：
              <span class="amount">{{ yesterdayDeposit }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="../../../assets/images/promo/hotpromo/blastbounty/reward-icon3-gold.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              昨日累计有效投注：
              <span class="amount">{{ yesterdayBet }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="../../../assets/images/promo/hotpromo/blastbounty/reward-icon2-gold.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              签到彩金:
              <span class="amount">{{ claimableAmount }}元</span>
            </div>
          </div>
        </div>
        <div class="bounty-sign-section-right">
          <div
            :style="!canClaim ? 'filter: grayscale(.9); pointer-events: none;' : ''"
            class="bonus-image"
            @click="handleClaimBonus"
            :class="{ disabled: claimableAmount <= 0 }"
          >
            <img src="../../../assets/images/promo/hotpromo/blastbounty/claim-btn.png" alt="" width="100%" />
          </div>
        </div>
      </div>
      <div class="bounty-sign-game-info">
        <div class="title"><img src="../../../assets/images/promo/hotpromo/blastbounty/section-3-spring.png" /></div>
        <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">2025年1月14日至2025年1月26日</div>
        </div>
        <div class="little-title">
          <div class="left">活动内容</div>
          <div class="right">
            活动期间，当日存款≥200元且当天投注BLAST Premier 赏金赛≥1,000元则视为签到成功，次日即可领取签到奖金。
          </div>
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
              <img
                src="../../../assets/images/promo/hotpromo/blastbounty/game-bottom-left-btn.png"
                alt=""
                style="width: 10px"
              />
              <span>示例</span>
            </div>
            会员A在电竞场馆投注BLAST Premier 赏金赛,当日累计有效投注为6000元,次日即可获得签到金28元并获得宝箱钥匙12把。
          </div>
        </div>
      </div>

      <div class="section third">
        <div class="title"><img src="../../../assets/images/promo/hotpromo/blastbounty/section-3-spring.png" /></div>
        <div class="content">
          <p>
            1. 活动期间,每日投注BLAST Premier
            赏金赛达到500元有效投注即可在次日12：00点左右自动获得1个开箱钥匙,开箱钥匙与开箱次数每日不设上限
          </p>
          <p>
            2.
            活动期间,开箱钥匙可积攒使用,获得开箱钥匙满足开箱条件可在活动期间任意时间开启宝箱,超出活动时间未开启宝箱则不予补偿
          </p>
          <p>3. 开启宝箱后获得彩金由系统自动实时派发至会员主钱包内.彩金5倍流水即可出款</p>
          <p>
            4. 活动期间,当日存款≥200元且 BLAST Premier 赏金赛有效投注≥1,000元在次日24
            小时内在活动页面点击【点击领取】按钮领取签到奖金。逾期未领取则视为放弃，彩金8 倍流水即可出款；
          </p>
          <p>5. 同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号,仅可参与一次,若有违规者,将不享受此红利</p>
          <p>
            6.
            任何会员或团体以不正常的方式进行套取活动优惠,平台方保在不通知的情况下冻结或关闭相关账户的权利,并不退还款项,且会员会被列入黑名单
          </p>
          <p>7. 为避免文字理解差异,本站保留本活动最终解释权</p>
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
    canClaim.value = res.data.canClaim;
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
  width: 100%;
  height: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .section {
    margin-bottom: 30px;
    &.first {
    }
    &.second {
    }
    &.third {
      background: url(../../../assets/images/promo/hotpromo/blastbounty/rules-bg.png) no-repeat center center;
      background-size: 100% 100%;
      padding: 20px;

      color: #b5a73b;
      text-align: left;
      img {
        max-width: 120px;
        margin: 0px auto;
      }
    }
    .title {
      margin: 10px auto;
      img {
        margin: 0 auto;
        &.logo {
          max-width: 150px;
          margin-bottom: 10px;
        }
        &.top {
          max-width: 250px;
        }
      }
    }

    .tips {
      color: #fffd66;
      margin: 0 auto;
      text-align: center;
    }
  }
}

.bounty-sign-section {
  padding: 20px 12px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("../../../assets/images/promo/hotpromo/blastbounty/section-bg.png");
  background-size: 100% 100%;
  align-items: center;
  width: 100%;

  .bounty-sign-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .bounty-sign-section-right {
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

  .bounty-sign-section-title {
    color: #b5a73b;
    font-size: 16px;
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
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff0000;
  }
  .bounty-sign-game-bottom-left-btn {
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

.bounty-sign-game-info {
  width: 100%;
  height: 100%;
  background: url(../../../assets/images/promo/hotpromo/blastbounty/rules-bg.png) no-repeat center center;
  background-size: 100% 100%;
  padding: 20px;
  margin: 20px auto;
  color: #b5a73b;
  text-align: left;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    margin: 0 auto;
  }
  .little-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    .left {
      background-image: url("../../../assets/images/promo/hotpromo/blastbounty/info-little-gold-bg.png");
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
      color: #000000;
      margin-right: 16px;
    }
    .right {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: #b5a73b;
    }
  }
}

.bounty-sign-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  tr:first-child {
    background: linear-gradient(90deg, #fffd66 0%, #ff9400 100%);
  }
  th {
    height: 36px;
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
    background: unset;
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
    border: 1px solid #ff9f0b66;
    height: 36px;
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #b5a73b;
    background-color: transparent;
  }
}
.promo-container .selected-promo .selected-promo-wrapper .inner table.bounty-sign-game-info-table th {
  background-color: unset;
}
.promo-container .selected-promo .selected-promo-wrapper .inner table.bounty-sign-game-info-table td {
  border: 1px solid #ff9f0b66;
  height: 36px;
  font-size: 12px;
  font-weight: 400;
  line-height: 28px;
  color: #b5a73b;
  background-color: transparent;
}

.reward-info {
  border: 1px solid #ff9f0b66;
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
  color: #b5a73b;

  .amount {
    color: #fffd66;
    font-weight: 600;
  }
}
</style>
