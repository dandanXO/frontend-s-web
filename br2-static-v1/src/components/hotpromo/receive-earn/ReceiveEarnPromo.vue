<template>
  <div>
    <q-btn class="receive-earn-btn" no-caps>
      {{ $t("hotPromo.receive") }}
    </q-btn>

    <div class="receive-bar-container">
      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-duration.svg" />
          {{ $t("hotPromo.duration") }}
        </div>
        <div class="bar-desc">{{ $t("hotPromo.longTerm") }}</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-eligibility.svg" />
          {{ $t("hotPromo.eligibility") }}
        </div>
        <div class="bar-desc">{{ $t("hotPromo.newMember") }}</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-description.svg" />
          {{ $t("hotPromo.desc") }}
        </div>
        <div class="bar-desc">{{ $t("hotPromo.receiveEarn.description") }}</div>
      </div>
    </div>

    <div class="promo-subtitle">Terms and Conditions</div>

    <div class="tnc-content">
      <ol>
        <li v-for="index in 7" :key="index">
          {{ $t(`hotPromo.receiveEarn.tnc${`${index}`.padStart(2, "0")}`) }}
        </li>
      </ol>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.receive-earn-btn {
  background: linear-gradient(180deg, #419f74 0%, #1d3f31 100%);
  width: 100%;
  color: #fff;
  border-radius: 50px;
  font-weight: 500;
  border: 1.5px solid #e0c4a8;
  box-shadow: 0px 4px 4px 0px #ffffff66 inset;
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
