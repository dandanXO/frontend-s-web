<template>
  <div>
    <!-- <q-btn class="receive-earn-btn" no-caps>
      <img src="../../../assets/images/promotion/receive-earn/receive-earn-icon.png" />
      &nbsp;&nbsp;receive
    </q-btn> -->

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
        <div class="bar-desc">
          Upgrade to the corresponding VIP level based on the accumulated betting amount in the member's account.
        </div>
      </div>
    </div>

    <div class="promo-subtitle">Terms and Conditions</div>

    <div class="tnc-content">
      <ol>
        <li>
          Starting from the member’s first valid bet after completing their first successful deposit, accumulated valid
          betting amounts will be used to determine VIP level upgrades according to the thresholds below:
          <table class="promo-table">
            <thead>
              <tr>
                <th>BET</th>
                <th>VIP Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0+</td>
                <td>
                  <div class="vip-level-td">
                    <img class="vip-badge" src="../../../assets/images/vip/badge/vip_1.png" />
                    <div>VIP 1</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>500.00</td>
                <td>
                  <div class="vip-level-td">
                    <img class="vip-badge" src="../../../assets/images/vip/badge/vip_2.png" />
                    <div>VIP 2</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2000.00</td>
                <td>
                  <div class="vip-level-td">
                    <img class="vip-badge" src="../../../assets/images/vip/badge/vip_3.png" />
                    <div>VIP 3</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>8000.00</td>
                <td>
                  <div class="vip-level-td">
                    <img class="vip-badge" src="../../../assets/images/vip/badge/vip_4.png" />
                    <div>VIP 4</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>4000.00</td>
                <td>
                  <div class="vip-level-td">
                    <img class="vip-badge" src="../../../assets/images/vip/badge/vip_5.png" />
                    <div>VIP 5</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>12000.00</td>
                <td>
                  <div class="vip-level-td">
                    <img class="vip-badge" src="../../../assets/images/vip/badge/vip_6.png" />
                    <div>VIP 6</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>50000.00</td>
                <td>
                  <div class="vip-level-td">
                    <img class="vip-badge" src="../../../assets/images/vip/badge/vip_7.png" />
                    <div>VIP 7</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>1500000.00</td>
                <td>
                  <div class="vip-level-td">
                    <img class="vip-badge" src="../../../assets/images/vip/badge/vip_8.png" />
                    <div>VIP 8</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>3000000.00</td>
                <td>
                  <div class="vip-level-td">
                    <img class="vip-badge" src="../../../assets/images/vip/badge/vip_9.png" />
                    <div>VIP 9</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td><span style="color: #ff9500">6000000.00</span></td>
                <td>
                  <div class="vip-level-td">
                    <img class="vip-badge" src="../../../assets/images/vip/badge/vip_10.png" />
                    <div>VIP 10</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </li>
        <li>
          Only bets that result in a win or loss on the website are counted as valid betting amounts; cancelled bets or
          those with refunded stakes will not be included.
        </li>
        <li>
          VIP members can enjoy other exclusive benefits related to their VIP level on the website, such as higher
          weekly cashback percentages for higher VIP tiers.
        </li>
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

.promo-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  margin: 20px 0;

  thead {
    background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
  }

  th {
    height: 36px;
    font-size: 12px;
    font-weight: 700;
    line-height: 28px;
    color: #2d2d2d;
    background-image: none !important;

    &:first-child {
      border-top-left-radius: 12px;
    }

    &:last-child {
      border-top-right-radius: 12px;
    }
  }

  tbody {
    tr {
      &:nth-child(odd) {
        background-color: #253028;
      }

      &:nth-child(even) {
        background-color: #1f241f;
      }

      // &:last-child {
      //   td {
      //     &:first-child {
      //       border-bottom-left-radius: 12px;
      //     }

      //     &:last-child {
      //       border-bottom-right-radius: 12px;
      //     }
      //   }
      // }
    }
  }

  td {
    background: transparent;
    background-color: unset !important;
    border: 1px solid #ffffff1a;
    height: 36px;
    font-size: 12px;
    font-weight: 700;
    line-height: 28px;
    color: #fff;
    font-family: Poppins;
  }
}

.vip-level-td {
  display: flex;
  align-items: center;
  justify-content: center;
  .vip-badge {
    height: 25px;
    margin-right: 4px;
    margin-top: 2px;
  }
}
</style>
