<template>
  <div class="fifa-2025-promowrapper">
    <div class="fifa-2025-promocontainer">
      <div class="fifa-2025-promosection section-bg">
        <div class="fifa-2025-promosection-left">
          <div class="fifa-2025-promosection-title">
            <div class="claim-title-icon">
            </div>
            投注嘉奖
          </div>
          <div class="reward-info">
            <div class="reward-info-icon claim-coin-icon">
            </div>
            <div class="reward-info-content">
              昨日累计投注：
              <span class="amount">{{ totalLoss }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon claim-gift-icon">
            </div>
            <div class="reward-info-content">
              可领取投注金：
              <span class="amount">{{ bonus }}元</span>
            </div>
          </div>
        </div>
        <div class="fifa-2025-promosection-right">
          <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 || isClaimed }">
            <img src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/claim-btn3.png" alt="" width="100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <br/>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import { getFifa2025PromoInit, claimFifa2025PromoBonus } from "../../../api/index/promo";
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

const totalLoss = ref(0);
const bonus = ref(0);
const isClaiming = ref(false);
const isClaimed = ref(false)
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
  claimFifa2025PromoBonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        notify({
          message: "成功领取",
          type: "red-packet",
          params: {
            redPacket: res.data
          }
        });
        isClaimed.value = true;
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
    const res = await getFifa2025PromoInit(promoCode.value);
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
.fifa-2025-promowrapper {
  display: flex;
  justify-content: center;
}

.fifa-2025-promocontainer {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fifa-2025-promosection {
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

  .fifa-2025-promosection-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .fifa-2025-promosection-right {
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
    }
  }

  .fifa-2025-promosection-title {
    font-size: 16px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
  }
}

.fifa-2025-promogame {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.fifa-2025-promogame-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .fifa-2025-promogame-bottom-left-title {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff5d5d !important;
  }
  .fifa-2025-promogame-bottom-left-btn {
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

.fifa-2025-promogame-info {
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
      line-height: 20px;
      color: #000000;
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
  font-size: 15px;
  color: black;

  .amount {
    color: #00a1ff;
    font-weight: 600;
  }
}
</style>
