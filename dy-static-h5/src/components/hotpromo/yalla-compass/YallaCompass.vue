<template>
    <div class="livepoker-rebate-wrapper">
      <div class="yalla-compass-container">
        <div class="yalla-compass-section">
          <div class="yalla-compass-section-left">
            <div class="yalla-compass-section-title">
              <div>
                <img
                  src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/section-title-img.png"
                  style="width: 24px; height: 24px; margin-bottom: 0px"
                />
              </div>
              每日礼金
            </div>
            <div class="reward-info">
              <div class="reward-info-icon">
                <img
                  src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/reward-icon1.png"
                  alt=""
                  width="100%"
                />
              </div>
              <div class="reward-info-content">
                当日累计存款金额：
                <span class="amount">{{ formatNumber(totalDeposit) }}元</span>
              </div>
            </div>
            <div class="reward-info">
              <div class="reward-info-icon">
                <img
                  src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/reward-icon3.png"
                  alt=""
                  width="100%"
                />
              </div>
              <div class="reward-info-content">
                当日累计有效投注：
                <span class="amount">{{ formatNumber(totalValidBet) }}元</span>
              </div>
            </div>
            <div class="reward-info">
              <div class="reward-info-icon">
                <img
                  src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/reward-icon2.png"
                  alt=""
                  width="100%"
                />
              </div>
              <div class="reward-info-content">
                可领取彩金：
                <span class="amount">{{ formatNumber(bonus) }}元</span>
              </div>
            </div>
          </div>
          <div class="yalla-compass-section-right">
            <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 }">
              <img src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/claim-btn.png" alt="" width="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, toRefs } from "vue";
  import { getYallaCompassInit, claimYallaCompassBonus } from "../../../api/index/promo";
  import { useNotify } from "src/hooks/notify";
  import { userStore } from "src/stores";
  import { useQuasar } from "quasar";
  import { useRouter } from "vue-router";
  
  const props = defineProps(["promoCode"]);
  const { promoCode } = toRefs(props);
  
  const notify = useNotify();
  const store = userStore();
  const $q = useQuasar();
  const router = useRouter();
  
  const totalDeposit = ref(0);
  const totalValidBet = ref(0);
  const bonus = ref(0);
  const isClaiming = ref(false);
  
  const formatNumber = (value, type) => {
  if (value === undefined) {
    return "-";
  }
  value = value.toString().replace(/,/g, "");

  const number = parseFloat(value);

  if (number % 1 !== 0 || type === "redPacket") {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

  const handleClaimBonus = () => {
    if (isClaiming.value === true) {
      return;
    }
    isClaiming.value = true;
    if (!store.token) {
      $q.dialog({
        class: "q-px-md q-pt-md",
        title: "系统提示",
        message: "请登录后再操作",
        ok: {
          push: true,
          color: "primary",
          label: "去登录",
          tabindex: 1
        },
        cancel: {
          push: true,
          color: "warning",
          label: "取消",
          tabindex: 0
        },
        persistent: true
      }).onOk(() => {
        router.push("/login");
      });
      return;
    }
    claimYallaCompassBonus(promoCode.value)
      .then((res) => {
        if (res.code === 0) {
          notify({
            message: "成功领取",
            type: "red-packet",
            params: {
              redPacket: res.data
            }
          });
          fetchData();
        } else {
          notify({
            type: "error",
            message: res.message
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        isClaiming.value = false;
      });
  };
  
  const fetchData = async () => {
    try {
      const res = await getYallaCompassInit(promoCode.value);
      totalDeposit.value = res.data.totalDeposit;
      totalValidBet.value = res.data.totalValidBet;
      bonus.value = res.data.bonus;
    } catch (error) {
      console.log(error);
    }
  };
  
  onMounted(() => {
    if (!store.token) {
      return;
    }
    fetchData();
  });
  </script>
  
  <style scoped lang="scss">
  .yalla-compass-wrapper {
    display: flex;
    justify-content: center;
  }
  
  .yalla-compass-container {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .yalla-compass-section {
    box-shadow: 0px 0px 4px 0px #01497b0f;
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid #acd4f6;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: url("../../../assets/images/promotion/hotpromo/dy2-blast-premier/section-bg.png");
    background-size: 100% 100%;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
  
    .yalla-compass-section-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
    }
  
    .yalla-compass-section-right {
      width: 180px;
  
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
      }
    }
  
    .yalla-compass-section-title {
      color: #000000;
      font-size: 1.2rem;
      line-height: 1;
      font-weight: 600;
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 20px;
    }
  }
  
  .yalla-compass-game {
    width: 100%;
    height: 302px;
    border-radius: 12px;
    // border: 1px solid #51acff;
    background-color: #fff;
    position: relative;
    margin-bottom: 12px;
  }
  
  .yalla-compass-game-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .yalla-compass-game-bottom-left-title {
      font-size: 12px;
      font-weight: 600;
      line-height: 22.4px;
      color: #ff0000;
    }
    .yalla-compass-game-bottom-left-btn {
      font-size: 12px;
      font-weight: 600;
      line-height: 22.4px;
      color: #ff0000;
      cursor: pointer;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
    }
  }
  
  .yalla-compass-game-info {
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
      background-image: url("../../../assets/images/promotion/hotpromo/dy2-blast-premier/info-title.png");
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
        background-image: url("../../../assets/images/promotion/hotpromo/dy2-blast-premier/info-little-title-bg.png");
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
  
  .yalla-compass-game-info-table {
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
  
  .yalla-compass-game-bottom-rule {
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
      background-image: url("../../../assets/images/promotion/hotpromo/dy2-blast-premier/rule-title.png");
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
          font-size: 12px;
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
    margin-bottom: 12px;
  }
  
  .reward-info-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
  
  .reward-info-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    color: black;
  
    .amount {
      color: #00a1ff;
      font-weight: 600;
    }
  }
  </style>
  