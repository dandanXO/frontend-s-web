<template>
  <div class="hongbao-container">
    <div class="hongbao-prize">
      <div class="decal"></div>
      <div class="current">当前抽奖次数</div>
      <div class="count">1</div>
      <div class="buttons">
        <div class="common-btn">抽奖</div>
        <div class="common-btn blue">十连抽</div>
      </div>
    </div>
    <div class="activity-boxes">
      <div class="activity-box">
        <div class="activity-title">活动时间</div>
        <div class="activity-content">2023年12月01日起</div>
      </div>
      <div class="activity-box">
        <div class="activity-title">活动对象</div>
        <div class="activity-content">VIP1及VIP1以上会员</div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.hongbao-container {
  width: 100%;
  max-width: 1400px;
  text-align: center;
  margin: 20px auto;
  .activity-boxes {
    display: flex;
    margin: 20px auto;
    gap: 20px;
    width: 100%;
    justify-content: center;
    align-items: center;
    .activity-box {
      border-radius: 20px;
      background: linear-gradient(180deg, #ffffff 0%, #e4efff 100%);
      flex: 1;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 20px;
      .activity-title {
        color: #3f8cff;
        font-size: 40px;
        font-weight: 500;
        font-family: "PingFang SC";
      }
      .activity-content {
        color: #7a8eb9;
        font-size: 24px;
      }
    }
  }
  .hongbao-prize {
    background: url(../../../assets/images/promotion/hotpromo/upgrade-hongbao/hongbao-bg.png) no-repeat center center;
    padding: 20px;
    border-radius: 20px;
    .decal {
      background: url(../../../assets/images/promotion/hotpromo/upgrade-hongbao/union.png) no-repeat center center;
      width: 500px;
      height: 40px;
      margin: 10px auto;
    }
    .current {
      font-size: 20px;
      color: #7a8eb9;
      margin-bottom: -30px;
    }
    .count {
      background: url(../../../assets/images/promotion/hotpromo/upgrade-hongbao/number.png) no-repeat center center;
      color: #3f8cff;
      font-size: 50px;
      padding-top: 120px;
      padding-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      margin-bottom: 10px;
    }
  }
  .buttons {
    .common-btn {
      font-size: 20px;
      cursor: pointer;
      padding: 15px 30px;
      border-radius: 100px;
      background: #ffffff;
      color: #3f8cff;
      width: 200px;

      box-shadow: 0px -2px 4.579999923706055px 0px #b1d7ff inset;

      box-shadow: 0px -1px 3.6640000343322754px 0px #5894ff inset;
      &.blue {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        color: #ffffff;
      }
    }
  }
}
</style>
