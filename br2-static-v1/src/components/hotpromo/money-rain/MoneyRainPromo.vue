<template>
  <div>
    <q-btn class="receive-earn-btn" no-caps @click="openMoneyRainDialog">
      <img src="../../../assets/images/promotion/receive-earn/receive-earn-icon.png" />
      &nbsp;&nbsp;receive
    </q-btn>

    <div class="receive-bar-container">
      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-duration.svg" />
          Duration
        </div>
        <div class="bar-desc">Long-term (ongoing)</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-eligibility.svg" />
          Eligibility
        </div>
        <div class="bar-desc">All members who have made at least one successful deposit</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-description.svg" />
          Description
        </div>
        <div class="bar-desc">Red envelope (cash rain) giveaways at scheduled times</div>
      </div>
    </div>

    <div class="promo-subtitle">Terms and Conditions</div>

    <div class="tnc-content">
      <ol>
        <li>All members who have successfully deposited can participate.</li>
        <li>
          From the 1st to the 7th of each month, on Monday to Thursday, three rounds of money rain will be distributed
          daily at the following time:
        </li>
        <div class="tnc-time-container">
          <div class="tnc-time">12:00 - 12:59</div>
          <div class="tnc-time">18:00 - 18:59</div>
          <div class="tnc-time">21:00 - 21:59</div>
        </div>

        <li>
          From the 1st to the 7th of each month, on Friday to Sunday, six rounds of money rain will be distributed daily
          at the following times:
        </li>
        <div class="tnc-time-container">
          <div class="tnc-time">12:00 - 12:59</div>
          <div class="tnc-time">14:00 - 14:59</div>
          <div class="tnc-time">16:00 - 16:59</div>

          <div class="tnc-time">18:00 - 18:59</div>
          <div class="tnc-time">20:00 - 20:59</div>
          <div class="tnc-time">21:00 - 21:59</div>
        </div>

        <li>Each Money Rain session is distributed free of charge with R$100,000.</li>
        <li>The maximum amount of a single drop is R$7,777.</li>
        <li>The money received can be used to play or withdrawn directly.</li>
        <li>The higher your VIP membership level (refer to the VIP upgrade program), the higher value received.</li>
        <li>To avoid any misunderstanding, AKB188 reserves the final right of interpretation of this promotion.</li>
      </ol>
    </div>
  </div>

  <q-dialog v-model="moneyRainDialog" presistent>
    <div class="money-rain-dialog">
      <div class="money-rain-bg"><img src="../../../assets/images/promotion/receive-earn/money-rain-img-bg.png" /></div>
      <div class="money-rain-box">
        <img src="../../../assets/images/promotion/receive-earn/money-rain-box-bg.png" />
        <div class="money-rain-content">
          <div><img src="../../../assets/images/promotion/receive-earn/money-rain-congratulations.png" /></div>

          <div class="content-reward">+Rs 100</div>

          <div class="content-reward-txt">You get Rs100</div>
        </div>
      </div>

      <div class="money-rain-confirm" @click="moneyRainDialog = false">
        <img src="../../../assets/images/promotion/receive-earn/money-rain-confirm.png" />
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

const moneyRainDialog = ref(false);

const openMoneyRainDialog = () => {
  moneyRainDialog.value = true;
};
</script>

<style lang="scss" scoped>
.money-rain-dialog {
  // background-image: url(../../../)

  .money-rain-bg {
    background-image: url(../../../assets/images/promotion/receive-earn/money-rain-img.png);
    background-size: 100% 100%;
    z-index: 0;
    img {
      display: block;
      width: 100%;
      max-width: 400px;
    }
  }

  .money-rain-box {
    margin-top: -40px;
    background-image: url(../../../assets/images/promotion/receive-earn/money-rain-box.png);
    background-size: 100% 100%;
    z-index: 1;
    position: relative;
    width: 100%;
    max-width: 400px;

    img {
      display: block;
      width: 100%;
      max-width: 400px;
    }

    .money-rain-content {
      display: flex;
      padding: 16px;
      position: absolute;
      top: 0;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;

      img {
        display: block;
        width: 100%;
        max-width: 200px;
        margin: auto;
      }

      .content-reward {
        background: #00a919;
        padding: 4px 12px;
        border-radius: 4px;
        display: inline-flex;
        font-weight: 900;
        margin: auto;
      }

      .content-reward-txt {
        color: #e66c3f;
        font-weight: lighter;
      }
    }
  }

  .money-rain-confirm {
    img {
      display: block;
      width: 100%;
      max-width: 140px;
      margin: 20px auto;
    }
  }
}

.receive-earn-btn {
  background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
  width: 100%;
  color: #2d2d2d;
  font-weight: bold;

  img {
    width: 34px !important;
  }
}

.receive-bar-container {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .receive-bar {
    background: #1f241f;
    border: 1px solid #4b4943;
    padding: 48px 12px 8px;
    position: relative;
    border-radius: 6px;

    .bar-ribbon {
      background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
      display: inline-flex;
      padding: 8px;
      height: 34px;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      color: #2d2d2d;
      font-weight: bold;
      align-items: center;
      position: absolute;
      top: 12px;
      left: 0;
      img {
        display: block;
        margin-right: 8px;
      }
    }

    .bar-desc {
      padding: 8px;
    }
  }
}

.promo-subtitle {
  margin-top: 24px;
  text-transform: uppercase;
  font-weight: 900;
  color: #ffffff;
  font-size: 18px;
  line-height: 1;
  font-style: italic;
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;

  &:before {
    content: "";
    background: url(../../../assets/images/promotion/receive-earn/promo-subtitle-icon.png);
    width: 25px;
    height: 9px;
    display: block;
    background-size: 100% 100%;
    margin-right: 8px;
    margin-top: 4px;
  }

  &:after {
    content: "";
    background: url(../../../assets/images/promotion/receive-earn/promo-subtitle-icon.png);
    width: 25px;
    height: 9px;
    display: block;
    background-size: 100% 100%;
    transform: scaleX(-1);
    margin-left: 8px;
    margin-top: 4px;
  }
}

.tnc-content {
  ol li {
    margin-bottom: 8px !important;
  }

  .tnc-time-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 8px;
    margin-left: -12px;
    .tnc-time {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #ffe6a1;
      margin-left: 12px;

      // &:first-child {
      //   margin-left: 0;
      // }

      &:before {
        content: "";
        background-image: url(../../../assets/images/promotion/receive-earn/icon-clock.svg);
        height: 11px;
        width: 11px;
        display: block;
        background-size: cover;
        margin-bottom: 2px;
      }
    }
  }
}
</style>
