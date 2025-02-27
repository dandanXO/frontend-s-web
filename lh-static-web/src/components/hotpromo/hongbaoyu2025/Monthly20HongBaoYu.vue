<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section section-bg">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div class="claim-title-icon"></div>
            投注礼金
          </div>
          <div class="reward-info">
            <div class="reward-info-icon claim-coin-icon"></div>
            <div class="reward-info-content">
              上月累计存款:
              <span class="amount">{{ depositAmount }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon claim-gift-icon"></div>
            <div class="reward-info-content">
              可领取红包次数：
              <span class="amount">{{ draw }}次</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div
            class="bonus-image"
            @click="handleClaimBonus"
            :class="{
              disabled: draw === 0 || !nowIsRain || gotAlready,
              loading: loadingClaim
            }"
          >
            <img v-if="draw === 0 || !nowIsRain || gotAlready" src="@/assets/promo/hongbaoyu/reward-btn-disabled.png" alt="" width="100%" />
            <img v-else src="@/assets/promo/hongbaoyu/reward-btn.png" alt="" width="100%" />
          </div>
        </div>
      </div>
      <div class="livepoker-rebate-game-info section-bg">
        <div class="title-img">活动详情</div>
        <div class="little-title">
          <div class="ribbon">活动时间</div>
          <div class="right">自2025年3月1日起</div>
        </div>
        <div class="little-title">
          <div class="ribbon">活动内容</div>
          <div class="right">
            会员在每月最后一天前累计存款≥5000元，即可在次月13日晚6点-晚10点拆红包，单个红包最高888元！
          </div>
        </div>
        <table class="livepoker-rebate-game-info-table section-table">
          <thead>
            <tr>
              <th>上月累计存款</th>
              <th>获取红包数量</th>
              <th>流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15000</td>
              <td>1</td>
              <td rowspan="6">8倍流水</td>
            </tr>
            <tr>
              <td>50000</td>
              <td>3</td>
            </tr>
            <tr>
              <td>100000</td>
              <td>5</td>
            </tr>
            <tr>
              <td>300000</td>
              <td>10</td>
            </tr>
            <tr>
              <td>500000</td>
              <td>15</td>
            </tr>
            <tr>
              <td>1000000</td>
              <td>20</td>
            </tr>
          </tbody>
        </table>
        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img src="@/assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" style="width: 10px" />
              <span>示例</span>
            </div>
            会员A在2月累计存款60000元，在3月13日晚上6点-10点即可登录账号进入活动页面拆红包，共计红包数量为3个。
          </div>
        </div>
      </div>

      <div class="livepoker-rebate-game-bottom-rule section-bg">
        <div class="title-img">活动规则</div>
        <br />
        <div class="content">
          <div class="item">
            <div class="item-num">1</div>
            <div style="display: flex; flex-direction: column">
              活动期间内累计存款达到指定金额（月累计存款≥5000元）即可参与红包雨。存款金额越高，获得的红包奖励越丰厚。
              <div class="hint">注：红包数量不叠加，红包按最高档位每月派发</div>
            </div>
          </div>
          <div class="item">
            <div class="item-num">2</div>
            红包发放时间为每月13日晚上6点至晚上10点之间，符合要求的会员可登入优惠界面点击【拆红包】即可参与，红包实时到账，红包彩金8倍流水即可提款；
          </div>
          <div class="item">
            <div class="item-num">3</div>
            红包彩金不可用于以下游戏或投注：购买免费旋转、桌面游戏、街机游戏、能量累积类游戏和部分多旋转类游戏；
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
            为避免文字理解差异，雷火电竞保留此活动最终解释权；
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog
    class="award-modal hongbaoyu-modal"
    :close-on-click-modal="false"
    :modal="false"
    v-model="privilegeClaimedModalVisible"
    align-center
  >
    <div class="modal-div">
      <div class="red-packet-opened">
        <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu2024/red-packet-opened.png`)" />
        <div class="grats">恭喜中奖！</div>
        <div class="amount">{{ winAmount }}元</div>

        <div class="get-btn" @click="getPromotionPrize">点击领取</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ResponseCode } from "@/api/response";
import { useNotify } from "@/hooks/notify";
import { onMounted, ref, defineProps } from "vue";
import { userStore } from "@/store";
import { initDepositRedPacket, claimDailyRainItem, initNextRainTime } from "@/api/index/promo";

const props = defineProps(["promoCode", "params"]);
const promoCode = ref(props.promoCode);
const store = userStore();
const notify = useNotify();
const depositAmount = ref(0);
const draw = ref(0);
const winAmount = ref(0);
const loadingClaim = ref(false);
const privilegeClaimedModalVisible = ref(false);
const nowIsRain = ref(false);
const gotAlready = ref(false);

const fetchData = async () => {
  loadingClaim.value = true;
  initDepositRedPacket(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        depositAmount.value = res.data.depositAmount;
        draw.value = res.data.draw;

        store.getBalance();
      }
    })
    .catch(() => {})
    .finally(() => {
      loadingClaim.value = false;
    });

  initNextRainTime(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        nowIsRain.value = res.data.nowIsRain;
        gotAlready.value = res.data.gotAlready;
      }
    })
    .catch(() => {})
    .finally(() => {
      loadingClaim.value = false;
    });
};

const handleClaimBonus = () => {
  loadingClaim.value = true;
  claimDailyRainItem(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        privilegeClaimedModalVisible.value = true;
        winAmount.value = res.data.lastDigitAmount + res.data.vipAmount;
        store.getBalance();
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
    .catch(() => {})
    .finally(() => {
      loadingClaim.value = false;
    });
};

const getPromotionPrize = () => {
  store.getBalance();
  privilegeClaimedModalVisible.value = false;
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
