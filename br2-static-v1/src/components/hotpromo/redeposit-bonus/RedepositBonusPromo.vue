<template>
  <div>
    <q-btn class="receive-earn-btn" no-caps>
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
        <div class="bar-desc">Members can receive a 100% bonus on their second deposit</div>
      </div>
    </div>

    <div class="promo-subtitle">Terms and Conditions</div>

    <div class="tnc-content">
      <ol>
        <li>Each member can enjoy this re-deposit bonus once.</li>
        <li>
          After successfully making their second deposit during the promotion period, members can apply to receive a
          100% bonus based on the second deposit amount.
        </li>
        <li>The minimum deposit amount is R$100.</li>
        <li>The maximum re-deposit bonus is R$1000.</li>
        <li>Withdrawals cannot be made before the bonus is credited to the account.</li>
        <li>
          To participate in this promotion, members must submit an application by clicking the "Join Now" button on this
          page.
        </li>
        <li>The deposit amount and bonus must be wagered at least 36 times before a withdrawal can be made.</li>
        <li>To avoid any misunderstanding, AKB188 reserves the final right of interpretation of this promotion.</li>
      </ol>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  // padding: 0 24px;
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
}
</style>
