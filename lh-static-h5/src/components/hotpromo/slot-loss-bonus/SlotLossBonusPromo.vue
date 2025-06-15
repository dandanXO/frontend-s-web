<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div>
              <img
                src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-title-img.png"
                style="width: 20px; height: 20px; margin-bottom: 0px"
              />
            </div>
            每周奖励
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img
                src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/reward-icon1.png"
                alt=""
                width="100%"
              />
            </div>
            <div class="reward-info-content">
              电子周负盈利：
              <span class="amount">{{ profitAmount }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img
                src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/reward-icon2.png"
                alt=""
                width="100%"
              />
            </div>
            <div class="reward-info-content">
              可领彩金：
              <span class="amount">{{ expectedBonus }}元</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div class="bonus-image" :class="{ disabled: expectedBonus <= 0 || !isClaimable }" @click="handleClaimBonus">
            <img src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/claim-btn3.png" alt="" width="100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import { getWeeklySlotLossBonusInit, claimWeeklySlotLossBonusInit } from "../../../api/index/promo";
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

const profitAmount = ref(0);
const expectedBonus = ref(0);
const isClaiming = ref(false);
const isClaimable = ref(false);

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
  claimWeeklySlotLossBonusInit(promoCode.value)
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
    const res = await getWeeklySlotLossBonusInit(promoCode.value);
    profitAmount.value = res.data.profitAmount || 0;
    expectedBonus.value = res.data.expectedBonus || 0;
    isClaimable.value = res.data.claimDay;
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
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}

.livepoker-rebate-container {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-bg.png");
  background-size: 100% 100%;
  align-items: center;
  width: 100%;
  font-family: "PingFang", "Roboto", "-apple-system", "Helvetica Neue", "Microsoft YaHei", Helvetica, Arial, sans-serif;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .livepoker-rebate-section-right {
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

  .livepoker-rebate-section-title {
    color: #000000;
    font-size: 1.3rem;
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
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff0000;
  }
  .livepoker-rebate-game-bottom-left-btn {
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

.reward-info {
  border: 1px solid rgba(215, 235, 255, 1);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.reward-info-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.reward-info-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: #333;

  .amount {
    color: #00a1ff;
    font-weight: 600;
  }
}
</style>
