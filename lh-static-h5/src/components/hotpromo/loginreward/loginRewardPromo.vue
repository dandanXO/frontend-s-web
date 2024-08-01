<template>
  <div>
    <div class="loginreward">
      <div class="reward-label">当前签到: {{ loginDay }}天</div>
      <div class="reward-container">
        <div class="reward-status-bar">
          <img src="../../../assets/images/promo/hotpromo/loginreward/status-bar.png" />
        </div>

        <div class="reward-item checked-in">
          <div class="reward-box">
            <img src="../../../assets/images/promo/hotpromo/loginreward/gift-01.png" />
          </div>
          <div class="reward-value">15</div>
          <q-btn color="brightbtn" class="redeem-btn" label="已领取" />
        </div>

        <div class="reward-item active">
          <div class="reward-box">
            <img src="../../../assets/images/promo/hotpromo/loginreward/gift-02.png" />
          </div>
          <div class="reward-value">25</div>
          <q-btn color="brightbtn" class="redeem-btn" label="点击领取" />
        </div>

        <div class="reward-item">
          <div class="reward-box">
            <img src="../../../assets/images/promo/hotpromo/loginreward/gift-03.png" />
          </div>
          <div class="reward-value">30</div>
          <q-btn color="brightbtn" class="redeem-btn" label="未达到条件" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

const loginDay = ref(25);
const dateDetails = ref([]);
const init = () => {};
onMounted(() => {
  if (!store.token) {
    return;
  }
  init();
});
</script>
<style lang="scss" scoped>
.loginreward {
  position: relative;
  border-radius: 20px;
  border: 3px solid #e6eeff;
  background: linear-gradient(180deg, #fff 0%, #e4efff 100%);
  padding: 50px 16px 20px;

  .reward-label {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url(../../../assets/images/promo/hotpromo/loginreward/label-login-day.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    width: 150px;
    height: 32px;
    font-size: 12px;
  }

  .reward-container {
    display: flex;
    gap: 16px;

    .reward-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      width: 80%;

      .redeem-btn {
        opacity: 0.5;
        font-size: 10px;
      }

      &.checked-in {
        filter: grayscale(0.8);
      }

      &.active {
        width: 100%;

        .redeem-btn {
          opacity: 1;
        }
      }

      .reward-box {
        img {
          display: block;
          width: 100%;
        }
      }

      .reward-value {
        border-radius: 50%;
        background: radial-gradient(50% 50% at 50% 50%, #22e5ff 0%, #34aaff 100%);
        box-shadow: 0px -4px 2px 0px rgba(255, 255, 255, 0.8) inset;
        font-size: 16px;
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: bold;
        position: relative;
        z-index: 3;
      }
    }
  }
  .reward-status-bar {
    display: flex;
    width: 100%;
    position: absolute;
    bottom: 70px;
    left: 0;
  }
}
</style>
