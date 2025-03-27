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
              昨日累计有效投注：
              <span class="amount">{{ totalLoss }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon claim-gift-icon"></div>
            <div class="reward-info-content">
              可领取彩金：
              <span class="amount">{{ bonus }}元</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 }">
            <img src="../../../assets/promo/lh-livepoker-rebate/reward-btn.png" alt="" width="100%" />
          </div>
        </div>
      </div>
      <div class="livepoker-rebate-game-info section-bg">
        <div class="title-img">活动详情</div>
        <div class="little-title">
          <div class="ribbon">活动时间</div>
          <div class="right">2025 年 04 月 07 日至 2025 年 04 月 13 日  </div>
        </div>
        <div class="little-title">
          <div class="ribbon">活动内容</div>
          <div class="right">活动期间，当日 2025 ESL One 罗利有效投注≥1,500 元即可获得 最高 1388 元的奖励金</div>
        </div>
        <table class="livepoker-rebate-game-info-table section-table">
          <tbody>
                <tr>
                  <th>有效投注</th>
                  <th>投注金</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥1,500</td>
                  <td>8 元</td>
                  <td :rowspan="9">6 倍流水</td>
                </tr>
                <tr>
                  <td>≥5,000</td>
                  <td>28 元</td>
                </tr>
                <tr>
                  <td>≥10,000</td>
                  <td>58 元</td>
                </tr>
                <tr>
                  <td>≥15,000</td>
                  <td>88 元</td>
                </tr>
                <tr>
                  <td>≥30,000</td>
                  <td>168 元</td>
                </tr>
                <tr>
                  <td>≥50,000</td>
                  <td>288 元</td>
                </tr>
                <tr>
                  <td>≥100,000</td>
                  <td>588 元</td>
                </tr>
                <tr>
                  <td>≥300,000</td>
                  <td>888 元</td>
                </tr>
                <tr>
                  <td>≥500,000</td>
                  <td>1,388 元</td>
                </tr>
              </tbody>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img src="../../../assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" width="22px" />
              <span>示例</span>
            </div>
            用户 A 在 04 月 08 日投注 2025 ESL One 罗利有效投注 50,000 元，用户 A 在次日 24 小时内可获得彩金：288 元
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
              <div>
                活动期间，活动仅计算电竞场馆中 2025 ESL One 罗利，会员在当日 2025 ESL One 罗利中累计有效投注≥1,500 元即可获得对应彩金，有效投注次日清零；
              </div>
              <div class="hint">注：救援金不叠加派发，救援金按最高档位每日派发一次。</div>
            </div>
          </div>
          <div class="item">
            <div class="item-num">2</div>
            活动期间，活动仅计算当日 2025 ESL One 罗利已结算的赛事总有效投注，次日 24 小时内在活动页面点击【点击领取】按钮领取。逾期未领取则视为放弃，彩金 6 倍流水即可出款；
          </div>
          <div class="item">
            <div class="item-num">3</div>
            任何低于欧洲盘 1.7 或亚洲盘 0.7 水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
          </div>
          <div class="item">
            <div class="item-num">4</div>
            根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </div>
          <div class="item">
            <div class="item-num">5</div>
            此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP 地址视为同一账户，若有违规者，将不享受此红利；
          </div>
          <div class="item">
            <div class="item-num">6</div>
            为避免文字理解差异，东赢电竞保留此活动最终解释权；
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps } from "vue";
import { ElMessageBox } from "element-plus";
import { ResponseCode } from "@/api/response";
import { claimVctBangkokBonus, getVctBangkokInit } from "@/api/index/promo";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";

const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);
const notify = useNotify();
const store = userStore();

const totalLoss = ref(0);
const bonus = ref(0);

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

  claimVctBangkokBonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取`
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
  try {
    const res = await getVctBangkokInit(props.promoCode);
    totalLoss.value = res.data?.totalValidBet || 0;
    bonus.value = res.data?.bonus || 0;
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
  background: url("../../../assets/promo/lh-livepoker-rebate/section-bg.png");
  background-size: 100% 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .livepoker-rebate-section-right {
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
    color: #ff4343;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff4343;
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
    background-image: url("../../../assets/promo/lh-livepoker-rebate/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin: 0 auto 40px;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    .left {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/info-little-title-bg.png");
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
    background-image: url("../../../assets/promo/lh-livepoker-rebate/rule-title.png");
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
        color: #ff4343;
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
  gap: 24px;

  .amount {
    color: #00a1ff;
    font-weight: 600;
  }
}
</style>
