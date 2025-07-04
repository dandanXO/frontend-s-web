<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-game-info">
        <div class="title"></div>
        <div class="little-title">
          <div class="left">PC端切换方法</div>
          <div class="right">点击屏幕侧边栏的【夜间模式】按钮，轻松切换为黑夜模式，享受舒适的夜间浏览体验。</div>
        </div>
        <img src="../../../assets/images/promotion/hotpromo/dark-mode/desktop-demo.png" alt="" width="100%" />
      </div>

      <div class="livepoker-rebate-game-info">
        <div class="title"></div>
        <div class="little-title">
          <div class="left">H5移动端切换方法</div>
          <div class="right">点击右上角菜单，进入【系统设置】，选择【夜间模式】开启，随时随地切换夜间皮肤。</div>
        </div>
        <img src="../../../assets/images/promotion/hotpromo/dark-mode/h5-demo.png" alt="" width="100%" />
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}
.livepoker-rebate-container {
  width: 1200px;
  height: 100%;
}

.livepoker-rebate-game-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  // align-items: center;
  gap: 20px;

  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/dark-mode/title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin: 0 auto 40px;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    .left {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: max-content;
      padding: 0 20px 0 10px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
    }
  }
}
</style>
