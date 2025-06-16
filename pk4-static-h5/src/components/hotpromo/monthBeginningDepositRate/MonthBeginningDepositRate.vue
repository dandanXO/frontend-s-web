<template>
  <div>
    <img src="./../../../assets/images/promotion/hotpromo/month-beginning-deposit-rebate/event-name.png" />

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

<script setup></script>

<style lang="scss" scoped>
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
</style>
