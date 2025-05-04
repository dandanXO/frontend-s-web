<template>
    <div class="mesa-wrapper">
      <div class="mesa-container">
        <div class="mesa-section section-bg">
          <div class="mesa-section-left">
            <div class="mesa-section-title">
              <div class="claim-title-icon" />
              投注嘉奖
            </div>
            <div class="reward-info">
              <div class="claim-coin-icon" />
              <div class="reward-info-content">
                昨日累计有效投注：
                <span class="amount">{{ formatNumber(totalValidBet) }}元</span>
              </div>
            </div>
            <div class="reward-info">
              <div class="claim-gift-icon" />
              <div class="reward-info-content">
                可领取彩金：
                <span class="amount">{{ formatNumber(bonus) }}元</span>
              </div>
            </div>
          </div>
          <div class="mesa-section-right">
            <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 }">
              <img
                v-if="bonus <= 0"
                src="@/assets/promo/lh-livepoker-rebate/reward-btn-3-disabled.png"
                alt=""
                width="100%"
              />
              <img v-else src="@/assets/promo/lh-livepoker-rebate/reward-btn-3.png" alt="" width="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { getMesaInit, claimMesaBonus } from "@/api/index/promo";
  import { onMounted, ref, defineProps, toRefs } from "vue";
  import { useNotify } from "@/hooks/notify";
  import { userStore } from "@/store";
  import { ElMessageBox } from "element-plus";
  import { ResponseCode } from "@/api/response";
  const props = defineProps(["promoCode"]);
  const { promoCode } = toRefs(props);
  
  const notify = useNotify();
  
  const store = userStore();
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
    if (isClaiming.value) return;
    isClaiming.value = true;
    if (!store.hasToken()) {
      ElMessageBox.alert("请登录后再操作", "系统提示", {
        autofocus: false,
        center: true,
        confirmButtonText: "确认",
        showClose: false,
        buttonSize: "large",
        closeOnClickModal: true
      }).then(() => {
        store.loginPageVisible = true;
      });
      return;
    }
  
    claimMesaBonus(promoCode.value)
      .then((res) => {
        if (res.code === 0) {
          notify.redPacket("成功领取", res.data);
          fetchData();
        } else if (
          !(
            res.code === ResponseCode.ERROR_USER_TOO_FAST ||
            res.code === ResponseCode.ERROR_PROMO_NOT_STARTED ||
            res.code === ResponseCode.ERROR_PROMO_USER_NOT_MEET_REQUIREMENT ||
            res.code === ResponseCode.ERROR_PROMO_CLAIMED ||
            res.code === ResponseCode.ERROR_SYSTEM
          )
        ) {
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
      const res = await getMesaInit(promoCode.value);
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
  .mesa-wrapper {
    display: flex;
    justify-content: center;
    font-family: 'PingFang SC';
  }
  .mesa-container {
    width: 100%;
    height: 100%;
  }
  
  .mesa-section {
    box-shadow: 0px 0px 4px 0px #01497b0f;
    padding: 30px 40px;
    border-radius: 12px;
    border: 1px solid #acd4f6;
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    background: url("@/assets/promo/lh-livepoker-rebate/section-bg.png");
    background-size: 100% 100%;
    margin-bottom: 30px;

    .mesa-section-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  
    .mesa-section-right {
      margin-top: auto;
      margin-bottom: auto;
      width: 160px;
  
      .bonus-image {
        cursor: pointer;
        width: 100%;
  
        &:hover {
          filter: brightness(0.9);
        }
        &:active {
          transform: translate(0px, 1px);
          opacity: 0.9;
        }
  
        &.disabled {
          cursor: not-allowed;
          pointer-events: none;
          filter: grayscale(1);
        }
      }
    }
  
    .mesa-section-title {
      font-size: 24px;
      line-height: 1;
      font-weight: 600;
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 20px;
    }
  }
  
  .mesa-game {
    width: 100%;
    height: 302px;
    border-radius: 12px;
    // border: 1px solid #51acff;
    background-color: #fff;
    position: relative;
    margin-bottom: 12px;
  }
  
  .mesa-game-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .mesa-game-bottom-left-title {
      font-size: 16px;
      font-weight: 500;
      line-height: 22.4px;
      color: #ff0000;
    }
    .mesa-game-bottom-left-btn {
      font-size: 16px;
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
  
  .reward-info {
    border: 1px solid rgba(215, 235, 255, 1);
    padding: 8px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .reward-info-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  .icon-img {
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .reward-info-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    gap: 24px;
  
    .amount {
      color: #00a1ff;
      font-weight: 600;
    }
  }
  </style>
  