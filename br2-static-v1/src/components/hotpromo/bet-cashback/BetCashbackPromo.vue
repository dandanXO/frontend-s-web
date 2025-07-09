<template>
  <div>
    <div class="receive-bar-container">
      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-duration.svg" />
          {{ $t("hotPromo.duration") }}
        </div>
        <div class="bar-desc">{{$t("hotPromo.betCashback.duration") }}</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-eligibility.svg" />
          {{ $t("hotPromo.eligibility") }}
        </div>
        <div class="bar-desc">{{ $t("hotPromo.betCashback.eligible") }}</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-description.svg" />
          {{ $t("hotPromo.desc") }}
        </div>
        <div class="bar-desc">{{ $t("hotPromo.betCashback.description") }}</div>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
        <tr>
          <th>{{ $t("hotPromo.betCashback.thead1") }}</th>
          <th>{{ $t("hotPromo.betCashback.thead2") }}</th>
          <th>{{ $t("hotPromo.betCashback.thead3") }}</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>0.7%</td>
          </tr>
          <tr>
            <td>2</td>
            <td>1,000</td>
            <td>0.8%</td>
          </tr>
          <tr>
            <td>3</td>
            <td>5,000</td>
            <td>0.9%</td>
          </tr>
          <tr>
            <td>4</td>
            <td>10,000</td>
            <td>1.0%</td>
          </tr>
          <tr>
            <td>5</td>
            <td>50,000</td>
            <td>1.1%</td>
          </tr>
          <tr>
            <td>6</td>
            <td>100,000</td>
            <td>1.2%</td>
          </tr>
          <tr>
            <td>7</td>
            <td>500,000</td>
            <td>1.4%</td>
          </tr>
          <tr>
            <td>8</td>
            <td>1,000,000</td>
            <td>1.7%</td>
          </tr>
          <tr>
            <td>9</td>
            <td>3,000,000</td>
            <td>2.2%</td></tr>
          <tr class="highlight">
            <td>10</td>
            <td>5,000,000</td>
            <td>3.0%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <div class="promo-subtitle">{{ $t("hotPromo.tnc") }}</div>

    <div class="tnc-content">
      <ol>
        <li v-for="index in 7" :key="index">
          {{ $t(`hotPromo.betCashback.tnc${`${index}`.padStart(2, "0")}`) }}
        </li>
      </ol>
    </div> -->
  </div>
</template>

<script setup>
</script>
<style lang="scss" scoped>

.table-container {
  max-width: 500px;
  margin: 15px auto 10px;
  border-radius : 10px;
  overflow: hidden;
  background: linear-gradient(145deg, #1a1a1a, #0f0f0f);


  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
    color: #2d2d2d;
  }

  th{
    background:transparent !important;
  }

  th, td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #333;
  }

  tbody tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.03);
  }

  td:last-child {
    font-weight: bold;
    color: #fff;
  }

  .highlight {
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
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

  ol {
    padding-left: 24px !important;
  }
}

.congrats-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: url(../../assets/images/index/money-rain/congrats-bg.png) no-repeat top center;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  background-size: contain;
  flex-direction: column;
  gap: 20px;
  // padding-top: 100px;
}
.congrats-head {
  margin-top: -100px;
  font-family: "Poppins";
  font-weight: 900;
  font-size: 2.4rem;
  line-height: 3.4rem;
  max-width: 300px;
  letter-spacing: 0px;
  text-align: center;
  color: #ffd288;
}
.congrats-container {
  position: relative;
  background: url(../../../assets/images/promotion/receive-earn/congrats-modal.png) no-repeat center center;
  background-size: contain;
  width: 100%;
  height: 470px;
  .congrats-highlight {
    font-family: "Poppins";
    font-weight: 700;
    font-size: 3rem;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    color: #10d16f;
    margin-top: 280px;
  }

  .congrats-txt {
    font-family: "Poppins";
    font-weight: 700;
    font-size: 1rem;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    color: #2d2d2d;
    margin-top: 20px;
  }
  .congrats-button {
    position: absolute;
    bottom: 11.5%;
    left: 0;
    right: 0;
    margin: auto;
    font-family: Poppins;
    font-weight: 700;
    font-size: 26.48px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    color: #ffffff;
  }

  .congrats-btns {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 40px;
    .btn-cancel {
      border: 1px solid #10d16f;
      color: #2d2d2d;
    }
    .btn-confirm {
      background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
      color: #ffffff;
    }
  }
}
</style>
