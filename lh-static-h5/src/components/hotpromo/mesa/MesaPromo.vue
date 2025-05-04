<template>
    <div class="mesa-rebate-wrapper">
      <div class="mesa-rebate-container">
        <div class="mesa-rebate-section section-bg">
          <div class="mesa-rebate-section-left">
            <div class="mesa-rebate-section-title">
              <div class="claim-title-icon"></div>
              投注嘉奖
            </div>
            <div class="reward-info">
              <div class="reward-info-icon claim-coin-icon"></div>
              <div class="reward-info-content">
                昨日累计有效投注：
                <span class="amount">{{ totalValidBet }}元</span>
              </div>
            </div>
            <div class="reward-info">
              <div class="reward-info-icon claim-gift-icon"></div>
              <div class="reward-info-content">
                可领取彩金：
                <span class="amount">{{ bonus }}元</span>
              </div>
            </div>
          </div>
          <div class="mesa-rebate-section-right">
            <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0, loading: loadingClaim }">
              <img src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/claim-btn3.png" alt="" width="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, toRefs } from "vue";
  import { getMesaInit, claimMesaBonus } from "../../../api/index/promo";
  import { useNotify } from "src/hooks/notify";
  import { userStore } from "src/stores";
  
  const props = defineProps(["promoCode"]);
  const { promoCode } = toRefs(props);
  
  const notify = useNotify();
  const store = userStore();
  
  const totalValidBet = ref(0);
  const bonus = ref(0);
  const loadingClaim = ref(false);
  
  const handleClaimBonus = () => {
    loadingClaim.value = true;
    claimMesaBonus(promoCode.value)
      .then((res) => {
        if (res.code === 0) {
          notify({
            type: "success",
            message: `成功领取`
          });
          store.getBalance();
        } else {
          notify({
            type: "error",
            message: res.message
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        loadingClaim.value = false;
      });
  };
  
  const fetchData = async () => {
    loadingClaim.value = true;
    getMesaInit(promoCode.value)
      .then((res) => {
        if (res.code === 0) {
          totalValidBet.value = res.data.totalValidBet;
          bonus.value = res.data.bonus;
        }
      })
      .catch(() => {})
      .finally(() => {
        loadingClaim.value = false;
      });
  };
  
  onMounted(() => {
    if (!store.token) {
      return;
    }
    fetchData();
  });
  </script>
  
  <style scoped lang="scss">
  .mesa-rebate-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .mesa-rebate-container {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .mesa-rebate-section {
    box-shadow: 0px 0px 4px 0px #01497b0f;
    padding: 20px 12px 40px;
    border-radius: 12px;
    border: 1px solid #acd4f6;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-bg.png");
    background-size: 100% 100%;
    align-items: center;
    width: 100%;
  
    .mesa-rebate-section-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
    }
  
    .mesa-rebate-section-right {
      width: 180px;
      margin-top: 20px;
  
      .bonus-image {
        width: 100%;
        cursor: pointer;
  
        &:active {
          filter: brightness(0.85);
          transform: translate(0px, 1px);
        }
  
        &.disabled {
          filter: grayscale(100%);
          cursor: not-allowed;
          pointer-events: none;
        }
  
        &.loading {
          cursor: not-allowed;
          opacity: 0.8;
        }
      }
    }
  
    .mesa-rebate-section-title {
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 20px;
    }
  }
  
  .mesa-rebate-game {
    width: 100%;
    height: 302px;
    border-radius: 12px;
    // border: 1px solid #51acff;
    background-color: #fff;
    position: relative;
    margin-bottom: 12px;
  }
  
  .mesa-rebate-game-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .mesa-rebate-game-bottom-left-title {
      font-size: 12px;
      font-weight: 600;
      line-height: 22.4px;
      color: #ff5d5d !important;
    }
    .mesa-rebate-game-bottom-left-btn {
      font-size: 12px;
      font-weight: 600;
      line-height: 22.4px;
      color: #ff5d5d !important;
      cursor: pointer;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
    }
  }
  
  .mesa-rebate-game-info {
    width: 100%;
    height: 100%;
    margin-top: 40px;
    background: #f2f8fe;
    border-radius: 12px;
    padding: 20px 12px 12px;
    border: 1px solid #acd4f6;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    display: flex;
    flex-direction: column;
    gap: 8px;
  
    .title {
      background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-title.png");
      background-repeat: no-repeat;
      background-size: 100%;
      width: 240px;
      height: 26px;
      margin: 0 auto;
    }
    .little-title {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 10px;
      .left {
        background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-little-title-bg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 64px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 600;
        line-height: 23.33px;
        color: #ffffff;
        margin-right: 16px;
      }
      .right {
        font-size: 12px;
        font-weight: 400;
        line-height: 28px;
        color: #000000;
      }
    }
  }
  
  .mesa-rebate-game-info-table {
    width: 100%;
    height: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: center;
    vertical-align: middle;
    th {
      height: 36px;
      font-size: 12px;
      font-weight: 400;
      line-height: 28px;
      color: #fff;
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      &:first-child {
        border-top-left-radius: 12px;
      }
      &:last-child {
        border-top-right-radius: 12px;
      }
    }
    tr {
      &:last-child {
        td {
          &:first-child {
            // border-bottom-left-radius: 12px;
          }
        }
      }
      &:nth-child(2) {
        td {
          &:last-child {
            // border-bottom-right-radius: 12px;
          }
        }
      }
    }
    td {
      background: transparent;
      border: 1px solid #acd4f6;
      height: 36px;
      font-size: 12px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
    }
  }
  
  .mesa-rebate-game-bottom-rule {
    width: 100%;
    height: 100%;
    margin-top: 40px;
    background: #f2f8fe;
    border-radius: 12px;
    padding: 20px 12px 12px;
    border: 1px solid #acd4f6;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/rule-title.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 240px;
      height: 20px;
      margin-bottom: 20px;
    }
    .content {
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      color: #000000;
      padding: 8px;
      .item {
        display: flex;
        gap: 10px;
        align-items: baseline;
  
        .item-num {
          color: #ffffff;
          font-size: 12px;
          line-height: 1;
          border-radius: 50%;
          height: 16px !important;
          width: 16px !important;
          min-width: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2px;
          background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
        }
  
        .hint {
          // font-size: 12px;
          font-weight: 400;
          line-height: 22.4px;
          color: #ff0000;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }
  
  .reward-info {
    border: 1px solid rgba(215, 235, 255, 1);
    padding: 8px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .reward-info-icon {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
  
  .reward-info-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: black;
  
    .amount {
      color: #00a1ff;
      font-weight: 600;
    }
  }
  </style>
  