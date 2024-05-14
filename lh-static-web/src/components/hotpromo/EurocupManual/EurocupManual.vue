<template>
  <div class="eurocup-manual-container">
    <div class="banner"></div>
    <div class="container">
      <div class="btn-group">
        <div class="btn btn-active">小組賽</div>
        <div class="btn btn-active">十六強賽</div>
        <div class="btn btn-active">4/1決賽</div>
        <div class="btn btn-active">半/总决赛</div>
      </div>
      <div class="schedule"></div>
      <div class="alert-line">
        轮赛事期间，投注赛程任意赛事有效投注额≥500，若投注赛事中触发以下事件，即可获得彩金奖励，触发多个事件彩金累积计算。
      </div>
      <div class="money-table">
        <table>
          <tr>
            <th>任意赛事早盘有效投注</th>
            <th>扭转乾坤</th>
            <th>绝处逢生</th>
            <th>帽子戏法</th>
          </tr>
          <tr>
            <td>500</td>
            <td>3</td>
            <td>5</td>
            <td>6</td>
          </tr>
          <tr>
            <td>1,000</td>
            <td>8</td>
            <td>10</td>
            <td>12</td>
          </tr>
          <tr>
            <td>5,000</td>
            <td>18</td>
            <td>36</td>
            <td>38</td>
          </tr>
          <tr>
            <td>10,000</td>
            <td>36</td>
            <td>58</td>
            <td>88</td>
          </tr>
          <tr>
            <td>10,000</td>
            <td>188</td>
            <td>288</td>
            <td>388</td>
          </tr>
        </table>
      </div>
      <div class="info">
        <div class="info-item">
          <div class="title">扭转乾坤</div>
          <div class="content">任意一方落后且反超比分取胜</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { getEurocupManualSchedule } from "@/api/promotion/eurocupManual";

const init = () => {
  getEurocupManualSchedule().then((res) => {
    console.log(res);
  });
};

onMounted(() => {
  init();
});
</script>
<style lang="scss" scoped>
.eurocup-manual-container {
  background-image: url("../../../assets/promo/lh-eurocup-manual/background.png");
  position: relative;
}
.banner {
  background-image: url("../../../assets/promo/lh-eurocup-manual/banner.png");
  background-size: 100% 100%;
  width: 100%;
  height: 589px;
  position: absolute;
  top: 0px;
  left: 0px;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btn-group {
  display: flex;
  width: 1155px;
  justify-content: space-between;
  align-items: center;
  margin-top: 344px;
  z-index: 1;
}
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 260px;
  height: 105px;
  font-size: 28px;
  color: #fff;
}

.btn-active {
  background-image: url("../../../assets/promo/lh-eurocup-manual/btn-blue.png");
}

.schedule {
  width: 1305px;
  height: 500px;
  background: linear-gradient(180deg, #0b52a0 0%, #00337f 100%);
  border-radius: 20px;
  margin-top: 27px;
}

.alert-line {
  color: #f4ffe1;
  font-size: 20px;
  line-height: 25.4px;
  margin: 26px 0px;
}

.money-table {
  width: 1305px;
  table {
    width: 100%;
    /* background: #04204a4d; */
    font-size: 24px;
    line-height: 30.48px;
    text-align: center;
    margin-bottom: 27px;
  }

  tr {
    height: 64px;
    th {
      &:first-child {
        border-top-left-radius: 20px;
      }
      &:last-child {
        border-top-right-radius: 20px;
      }
    }
  }

  th {
    background: #beebff;
    color: #0d1057;
    font-weight: 700;
  }

  td {
    color: #fff;
    margin-top: 3px;
    background: #04204a4d;
  }
}

.info {
  width: 1305px;
  font-size: 24px;
  line-height: 30.48px;
  .info-item {
    width: 373px;
    position: relative;
    .title {
      background-image: url("../../../assets/promo/lh-eurocup-manual/info-back.png");
      width: 207px;
      height: 55px;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      position: absolute;
      top: -28px;
      left: 50%;
      translate: -50%;
    }
    .content {
      width: 373px;
      height: 166px;
      background: linear-gradient(180deg, #aae5ff 0%, #6fbaff 100%);
      border: 2px solid #b0d4ff;
      border-radius: 20px;
      color: #0d4b57;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 400;
    }
  }
}
</style>
