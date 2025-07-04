<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section section-bg">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div class="claim-title-icon"></div>
            每周奖励
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <div class="claim-coin-icon"></div>
            </div>
            <div class="reward-info-content">
              电子周负盈利：
              <span class="amount">{{ profitAmount }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <div class="claim-gift-icon"></div>
            </div>
            <div class="reward-info-content">
              可领彩金：
              <span class="amount">{{ expectedBonus }}元</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div class="bonus-image" @click="handleClaimBonus" >
                <img src="../../../assets/promo/lh-livepoker-rebate/new-reward-btn-1.png" alt="" width="100%" />
              </div>
              <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: expectedBonus <= 0 }">
                <img src="../../../assets/promo/lh-livepoker-rebate/new-reward-btn-2.png" alt="" width="100%" />
              </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getWeeklySlotLossBonusInit, claimWeeklySlotLossBonusInit } from "@/api/index/promo";
import { onMounted, ref, defineProps, toRefs } from "vue";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
const props = defineProps(["promoCode"]);
const { promoCode } = toRefs(props);

const notify = useNotify();

const store = userStore();
const profitAmount = ref(0);
const expectedBonus = ref(0);
const isClaiming = ref(false);
const isClaimable = ref(false);

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

  claimWeeklySlotLossBonusInit()
    .then((res) => {
      if (res.code === 0) {
        notify.redPacket("成功领取", res.data);
        fetchData();
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
    const res = await getWeeklySlotLossBonusInit();
    profitAmount.value = res.data.profitAmount || 0;
    expectedBonus.value = res.data.expectedBonus || 0;
    isClaimable.value = res.data.claimDay;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (!store.token) return;

  fetchData();
});
</script>

<style scoped lang="scss">
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}
.livepoker-rebate-container {
  margin: 0 auto;
  max-width: 1400px;
  width: 95%;
  padding: 0 20px;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 1rem 1.3rem;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  display: flex;
  justify-content: space-between;
  background: url("@/assets/promo/lh-livepoker-rebate/section-bg.png");
  background-size: 100% 100%;
  font-family: "PingFang SC", "PingFang", sans-serif;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .livepoker-rebate-section-right {
    margin-top: auto;
    margin-bottom: auto;
    width: 254px;

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

      img {
        max-width: 175px;
      }
    }
  }

  .livepoker-rebate-section-title {
    font-size: 24px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
  }
}

.livepoker-rebate-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.livepoker-rebate-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .livepoker-rebate-game-bottom-left-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: #ff0000;
  }
  .livepoker-rebate-game-bottom-left-btn {
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
