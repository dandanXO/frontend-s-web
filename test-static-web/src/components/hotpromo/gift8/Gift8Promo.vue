<template>
  <div class="gift8-container">
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
    <div class="common-btn">点击申请</div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.gift8-container {
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
      background: linear-gradient(180deg, #ffffff 0%, #e4efff 100%);
      border-radius: 20px;
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
  .common-btn {
    font-size: 20px;
    cursor: pointer;
    padding: 8px 30px;
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    border-radius: 100px;
    color: #ffffff;
  }
}
</style>
