<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section">
        <img
          src="../../../assets/images/promotion/hotpromo/hongbaoyu/red-packet-2025.png"
          alt=""
          @click="getPromotion"
          :class="{ loading: loadingClaim }"
        />
      </div>
      <div class="livepoker-rebate-game-info section-bg">
        <div class="title-img">活动详情</div>
        <div class="little-title" style="justify-content: flex-start; align-items: flex-start">
          <div class="ribbon">活动时间</div>
          <div class="right">2025年1月29日至2025年2月4日</div>
        </div>
        <div class="little-title" style="flex-direction: column; justify-content: flex-start; align-items: flex-start">
          <div class="ribbon">活动内容</div>
          <div class="right">
            VIP1及以上会员当天累计存款达到200元，即可在当天活动时间内领新年红包，单个红包最高888元。
          </div>
        </div>
        <table class="livepoker-rebate-game-info-table">
          <tbody>
            <tr>
              <th>当天累计存款</th>
              <th>红包雨时间</th>
              <th>流水倍数</th>
            </tr>
            <tr>
              <td>200元</td>
              <td style="padding: 24px 0">
                下午 16:00-18:00
                <br />
                晚上 20:00-22:00
              </td>
              <td>5倍流水</td>
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
            会员A在1月29日累计存款200元，在1月29日下午16点-18点和晚上20点-22点登录账号进入活动页面领取新年红包，每轮红包雨可参与一次。
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
              <div>活动期间内VIP1及以上会员当日累计存款达到指定金额（当天累计存款≥200元）即可参与红包雨。</div>
              <div class="hint">注：单次红包雨数量为5000个，每人每轮红包雨可参与一次</div>
            </div>
          </div>
          <div class="item">
            <div class="item-num">2</div>
            红包发放时间为每日下午16点-18点和晚上20点-22点之间，符合要求的会员可登入优惠界面点击【新年红包】按钮获得，红包实时到账，红包彩金5倍流水即可提款；
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
  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <div class="close-btn">
        <q-btn
          @click="isClaimModal = false"
          v-close-popup
          rounded
          icon="close"
          color="white"
          height="40"
          width="40"
        ></q-btn>
      </div>

      <q-card-section class="row items-center">
        <div class="red-packet-opened">
          <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/red-packet-opened.png`)" />

          <span class="grats">恭喜获得奖金</span>
          <span class="amount">{{ winAmount }}元</span>
          <div class="get-btn" @click="getPromotionPrize">点击领取</div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps } from "vue";
import { eventapi } from "src/boot/axios";
import { ref } from "vue";
import { userStore } from "src/stores";

const store = userStore();
const winAmount = ref(0);
const isClaimModal = ref(false);
const loadingClaim = ref(false);

const props = defineProps({
  promoCode: {
    type: String,
    required: true
  }
});

const getPromotion = () => {
  loadingClaim.value = true;
  const randNum = Math.floor(Math.random() * 1000) + 1;
  eventapi
    .get(`/redPacketVip/claim?promoCode=${props.promoCode}&v=${randNum}`)
    .then((res) => {
      if (res.code === 0) {
        winAmount.value = res.data.lastDigitAmount + res.data.vipAmount;
        isClaimModal.value = true;

        store.getBalance();
      }
    })
    .catch(() => {})
    .finally(() => {
      loadingClaim.value = false;
    });
};

const getPromotionPrize = () => {
  store.getBalance();
  isClaimModal.value = false;
};
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
  // padding: 20px 12px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-bg.png");
  background-size: 100% 100%;
  align-items: center;
  width: 100%;

  img {
    width: 200px !important;
    &.loading {
      filter: grayscale(100%);
      cursor: not-allowed;
      opacity: 0.6;
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
    color: #ff6b6b !important;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff6b6b !important;
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
    justify-content: flex-start;
    align-items: center;
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
    background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-title.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 240px;
    height: 26px;
    margin: 0 auto;
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
        color: #ff0000;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.tab-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;

  .tab {
    width: 160px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60px;
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    color: #818181;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;

    &.active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
    }
  }
}

.red-packet-opened {
  position: relative;
  img {
    display: block;
    width: 100%;
  }

  .grats {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 20%;
    color: #fffbfb;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    padding-right: 10px;
  }

  .amount {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 45%;
    // left: -15px;
    color: #f23b1d;
    font-size: 36px;
    font-weight: bold;
    padding-right: 10px;
  }

  .get-btn {
    color: #f23b1d;
    border-radius: 30px;
    background: linear-gradient(180deg, #fdf4ee 0%, #fff3c0 100%);
    position: absolute;

    font-size: 16px;
    padding: 4px 16px;
    bottom: 17%;
    display: flex;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    width: 100px;
    left: 0;
    right: 10px;

    &:hover {
      filter: brightness(0.9);
    }
  }
}

.body--dark {
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
    padding: 1.5px;
    background: linear-gradient(170deg, #be9457 1.91%, rgba(190, 148, 87, 0) 33.82%);
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  .livepoker-rebate-game-info {
    .left {
      background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/dark-info-little-title-bg.png");
    }
    .right {
      color: #fff;
    }
    .title {
      background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/dark-info-title.png");
    }
  }

  .livepoker-rebate-game-bottom-rule {
    .item {
      color: #fff;
    }
    .title {
      background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/dark-info-title.png");
    }
  }

  .livepoker-rebate-game-info-table {
    th {
      background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) !important;
    }
    td {
      color: white;
      background: transparent !important;
    }
  }
}
</style>
