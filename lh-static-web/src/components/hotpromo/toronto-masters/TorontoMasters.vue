<template>
    <div class="toronto-masters-wrapper">
      <div class="toronto-masters-container">
        <div class="toronto-masters-section">
          <div class="toronto-masters-section-left">
            <div class="toronto-masters-section-title">
              <div><img class="icon-img" src="@/assets/promo/lh-livepoker-rebate/section-title-img.png" /></div>
              每日礼金
            </div>
            <div class="reward-info">
              <div class="reward-info-icon">
                <img class="icon-img" src="@/assets/promo/lh-livepoker-rebate/reward-icon1.png" alt="" width="100%" />
              </div>
              <div class="reward-info-content">
                昨日累计负盈利：
                <span class="amount">{{ formatNumber(totalLoss) }}元</span>
              </div>
            </div>
            <div class="reward-info">
              <div class="reward-info-icon">
                <img class="icon-img" src="@/assets/promo/lh-livepoker-rebate/reward-icon3.png" alt="" width="100%" />
              </div>
              <div class="reward-info-content">
                今日可领取荣耀金：
                <span class="amount">{{ formatNumber(bonus) }}元</span>
              </div>
            </div>
          </div>
          <div class="toronto-masters-section-right">
            <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 }">
              <img
                v-if="bonus <= 0"
                src="@/assets/promo/lh-livepoker-rebate/reward-btn-disabled.png"
                alt=""
                width="100%"
              />
              <img v-else src="@/assets/promo/lh-livepoker-rebate/reward-btn.png" alt="" width="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { getTorontoMastersInit, claimTorontoMastersBonus } from "@/api/index/promo";
  import { onMounted, ref, defineProps, toRefs } from "vue";
  import { useNotify } from "@/hooks/notify";
  import { userStore } from "@/store";
  import { ElMessageBox } from "element-plus";
  import { ResponseCode } from "@/api/response";
  const props = defineProps(["promoCode"]);
  const { promoCode } = toRefs(props);
  
  const notify = useNotify();
  
  const store = userStore();
  const totalLoss = ref(0);
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
  
    claimTorontoMastersBonus(promoCode.value)
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
      const res = await getTorontoMastersInit(promoCode.value);
      totalLoss.value = res.data.totalLoss;
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
  .toronto-masters-wrapper {
    display: flex;
    justify-content: center;
    font-family: 'PingFang SC';
  }
  .toronto-masters-container {
    width: 100%;
    height: 100%;
  }
  
  .toronto-masters-section {
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

    .toronto-masters-section-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  
    .toronto-masters-section-right {
      margin-top: auto;
      margin-bottom: auto;
      width: 200px;
  
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
        }
      }
    }
  
    .toronto-masters-section-title {
      color: #000000;
      font-size: 24px;
      line-height: 1;
      font-weight: 600;
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 20px;
    }
  }
  
  .toronto-masters-game {
    width: 100%;
    height: 302px;
    border-radius: 12px;
    // border: 1px solid #51acff;
    background-color: #fff;
    position: relative;
    margin-bottom: 12px;
  }
  
  .toronto-masters-game-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .toronto-masters-game-bottom-left-title {
      font-size: 16px;
      font-weight: 500;
      line-height: 22.4px;
      color: #ff0000;
    }
    .toronto-masters-game-bottom-left-btn {
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
    color: black;
    gap: 24px;
  
    .amount {
      color: #00a1ff;
      font-weight: 600;
    }
  }
  </style>
  