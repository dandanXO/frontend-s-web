<template>
  <div>
    <img
      class="promo-banner-img"
      src="./../../../assets/images/promotion/hotpromo/month-beginning-deposit-rebate/promo-banner.png"
    />
    <div class="vip-progress">
      <div class="bar-wrapper">
        <div class="percentage" :style="{ left: percent + '%' }">
          {{ percent }}%
          <span class="triangle"></span>
        </div>
        <div class="bar-border">
          <div class="bar">
            <div class="bar-img-fill" :style="{ width: percent + '%' }">
              <img
                src="./../../../assets/images/promotion/hotpromo/month-beginning-deposit-rebate/progress-bar-fill.png"
                alt="progress fill"
                class="bar-img-fill"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="vip-labels">
        <span class="label">VIP1</span>
        <span class="label">VIP2</span>
      </div>
    </div>
    <div class="receive-btn">Receive</div>
    <div class="rebate-table-container">
      <img
        class="big-rebate-title-img"
        src="./../../../assets/images/promotion/hotpromo/month-beginning-deposit-rebate/big-rebate-title.png"
      />
      <table class="rebate-table">
        <thead>
          <tr>
            <th align="center">Vip Level</th>
            <th align="center">Rebate</th>
            <th align="center">Running Water</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>VIP1-VIP2</td>
            <td><span style="color: #ff9500">1%</span></td>
            <td rowspan="6">X2</td>
          </tr>
          <tr>
            <td>VIP3-VIP4</td>
            <td><span style="color: #3dd3f0">2%</span></td>
          </tr>
          <tr>
            <td>VIP5-VIP6</td>
            <td><span style="color: #e3d730">2%</span></td>
          </tr>
          <tr>
            <td>VIP7-VIP8</td>
            <td>4%</td>
          </tr>
          <tr>
            <td>VIP9-VIP10</td>
            <td>5%</td>
          </tr>
          <tr>
            <td>VIP11-VIP12</td>
            <td>6%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <img
      src="./../../../assets/images/promotion/hotpromo/month-beginning-deposit-rebate/monthly-recharge-rebate-event-title.png"
    />
    <ul class="rebate-list">
      <li>
        Recharge 1000Rs or more from the 1st to the 7th of each month to get the following VIP level corresponding
        rebates.
      </li>
      <li>
        Rebates can be obtained through the event page the next day. Manual collection.   Effective turnover 2 times.
      </li>
    </ul>
  </div>
</template>

<script setup>
const percent = 35;
</script>

<style lang="scss" scoped>
.promo-banner-img {
  width: 90% !important;
  place-self: center;
}
.receive-btn {
  background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
  width: fit-content;
  padding: 12px;
  border-radius: 4px;
  font-family: Poppins;
  font-weight: 600;
  place-self: center;
  font-size: 14px;
  margin-top: 30px;
}
.rebate-table-container {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 28px 0;
  .big-rebate-title-img {
    height: 34px;
    width: auto !important;
    position: absolute;
    z-index: 1;
    align-self: center;
    top: -6px;
  }
  .rebate-table {
    font-size: 14px;
    th {
      background: #121829 !important;
      border: 1px solid #2e3039;
      padding: 40px 0 10px 0 !important;
      color: #ffffff80;
    }
    td {
      background-color: #121829 !important;
      font-weight: 700;
      padding: 10px 5px !important;
    }
  }
}
.rebate-list {
  margin-top: 20px !important;
}

.vip-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: sans-serif;
  margin-top: 36px;

  .bar-wrapper {
    position: relative;
    height: 26px;

    .percentage {
      position: absolute;
      top: -35px;
      transform: translateX(-50%);
      background: #0666d3;
      color: #fff;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;

      .triangle {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #0666d3;
      }
    }

    .bar-border {
      height: 100%;
      border-radius: 999px;
      padding: 3px;
      background: linear-gradient(
        47.73deg,
        #21c9ec 9.9%,
        #176ec9 20.93%,
        #21c9ec 47.13%,
        #ffffff 61.38%,
        #176ec9 86.2%,
        #21c9ec 101.83%
      );
    }

    .bar {
      height: 100%;
      width: 100%;
      background: #000b30;
      border-radius: 999px;
      overflow: hidden;
      position: relative;

      .bar-img-fill {
        height: 100%;
        object-fit: cover;
        border-radius: 999px 0 0 999px;
        display: block;
        transition: width 0.3s ease;
      }
    }
  }

  .vip-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 3px;

    .label {
      width: auto;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
