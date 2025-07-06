<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section section-bg">
        <div class="livepoker-rebate-section-btn" @click="handleClaimBonus">
          <img src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/reward-btn-4.png" alt="" />
        </div>
      </div>
      <div class="livepoker-rebate-game-info section-bg">
        <div class="title-img">活动详情</div>
        <div class="little-title">
          <div class="ribbon">活动时间</div>
          <div class="right">2025年6月29日至2025年7月14日</div>
        </div>
        <div class="little-title">
          <div class="ribbon">活动内容</div>
          <div class="right">
            在世俱杯期间，每一场比赛都将限时开启一轮“红包雨”活动，会员可在指定赛事即将开始前登录账号，即可参与世俱杯红包雨活动，每场最高狂撒8,888元红包雨！
          </div>
        </div>
        <table class="livepoker-rebate-game-info-table section-table">
          <thead>
            <tr>
              <th>红包雨开放时间</th>
              <th>派发时间</th>
              <th>流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>6月29日-7月14日</td>
              <td>每场世俱杯指定赛事</td>
              <td>1倍流水</td>
            </tr>
          </tbody>
        </table>

        <table class="livepoker-rebate-game-info-table section-table">
          <thead>
            <tr>
              <th colspan="2">世俱杯指定红包雨活动赛事</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025.7.9 03:00</td>
              <td>世俱杯半决赛  弗鲁米嫩塞 - 切尔西</td>
            </tr>
            <tr>
              <td>2025.7.10 03:00</td>
              <td>世俱杯半决赛 巴黎圣日耳曼 - 皇家马德里</td>
            </tr>
          </tbody>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img
                src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/game-bottom-left-btn.png"
                alt=""
                style="width: 10px"
              />
              <span>示例</span>
            </div>
            在世俱杯赛事期间，会员在指定赛事开始登录雷火账号，即可领取到最高8,888元的开赛红包。
          </div>
        </div>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            注：每场世俱杯红包雨限量500个，抢完为止，若您抢到【本场红包雨已全部派发】，则代表该场次红包数量已全部抽完
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
              世俱杯红包雨仅限已实名绑定银行卡账号的会员才可以参与。
            </div>
          </div>
          <div class="item">
            <div class="item-num">2</div>
            未存款会员领取红包雨后仅可提款一次，提款金额不超过100元。
          </div>
          <div class="item">
            <div class="item-num">3</div>
            每场世俱杯红包雨限量500个，抢完即止，若您抢到【本场红包雨已全部派发】，则代表该场次红包数量已全部抽完
          </div>
          <div class="item">
            <div class="item-num">4</div>
            指定赛事开始前登录雷火账号即可参与红包雨活动，彩金实时到账，彩金 1倍流水即可出款；
          </div>
          <div class="item">
            <div class="item-num">5</div>
            根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </div>
          <div class="item">
            <div class="item-num">6</div>
            此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
            地址视为同一账户，若有违规者，将不享受此红利；
          </div>
          <div class="item">
            <div class="item-num">7</div>
            为避免文字理解差异，雷火电竞保留此活动最终解释权；
          </div>
        </div>
      </div>
    </div>
  </div>
  <q-dialog align-center centered class="fifa-cwc-red-packet-dialog" v-model="isBonusDialog">
    <q-btn v-close-popup flat dense round class="close-btn" style="height: 30px; width: 30px; padding: 0">
      <img src="./images/close-icon.png" alt="Close" style="width: 24px; height: 24px" />
    </q-btn>

    <div class="title">红包雨</div>
    <div class="content center-items">
      <img src="./images/success.png" />
      <div>恭喜您成功开启红包</div>
      <div class="amount-txt">获得{{ amount }}元</div>
    </div>
    <div class="dialog-btn" @click="closeDialog">确定</div>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import { claimFifaCwcRedPacketBonus } from "../../../api/index/promo";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";

const props = defineProps(["promoCode"]);
const { promoCode } = toRefs(props);

const notify = useNotify();
const store = userStore();

const amount = ref(0);
const loadingClaim = ref(false);

const isBonusDialog = ref(false);

const handleClaimBonus = () => {
  loadingClaim.value = true;
  claimFifaCwcRedPacketBonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        amount.value = res.data.lastDigitAmount + res.data.vipAmount;
        isBonusDialog.value = true;
        store.getBalance();
      } else {
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

const closeDialog = () => {
  // store.getBalance();
  isBonusDialog.value = false;
};

onMounted(() => {
  if (!store.token) {
    return;
  }
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

      &.loading {
        cursor: not-allowed;
        opacity: 0.8;
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
  .livepoker-rebate-section-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    img {
      width: 50%;
    }
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
        // font-size: 12px;
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
<style lang="scss">
.fifa-cwc-red-packet-dialog {
  max-width: 500px;

  .q-dialog__inner {
    padding: 0;
    color: #157eff;
    width: 80%;
    max-width: 360px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: #fff;
    align-self: center;
    height: fit-content;
    border-radius: 8px;
    > div {
      border-radius: 0;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
  .title {
    width: 100%;
    padding: 0.9rem;
    font-size: 24px;
    font-weight: 500;
    background-image: url("./images/claim-success-header-bg.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    text-align: center;
    color: #fff;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-size: 18px;
    img {
      width: 90%;
      margin-bottom: 20px;
    }
    .amount-txt {
      margin-top: 20px;
      font-size: 28px;
    }
  }
  .dialog-btn {
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -2px 4.58px 0px #b1d7ff inset;
    box-shadow: 0px -1px 3.66px 0px #5894ff inset;
    padding: 0.5rem 14px;
    width: 100%;
    max-width: 120px;
    border-radius: 100px;
    place-self: center;
    font-size: 18px;
    text-align: center;
    margin-bottom: 30px;
    cursor: pointer;
    color: #fff;
    border-radius: 100px !important;
  }
  .close-btn {
    position: absolute;
    z-index: 1;
    top: -30px;
    right: -30px;
    cursor: pointer;
  }
}
.body--dark {
  .fifa-cwc-red-packet-dialog {
    .q-dialog__inner {
      background: linear-gradient(180deg, #384e79 0%, #212e4b 100%);
    }
  }
}
</style>
