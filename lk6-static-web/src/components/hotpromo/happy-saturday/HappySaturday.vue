<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section section-bg">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div class="claim-title-icon"></div>
            {{ $t("hotpromo.happySaturday.rewardSection.title") }}
          </div>
          <div class="reward-info">
            <div class="reward-info-icon claim-coin-icon"></div>
            <div class="reward-info-content">
              {{ $t("hotpromo.happySaturday.rewardSection.validBets") }}
              <span class="amount">{{ totalValidBet }}{{ store.currency.value }}</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon claim-gift-icon"></div>
            <div class="reward-info-content">
              {{ $t("hotpromo.happySaturday.rewardSection.todayBonus") }}
              <span class="amount">{{ bonus }}{{ store.currency.value }}</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 || loadingClaim }">
            <template v-if="languageVal !== 'en'">
              <img
                v-if="bonus <= 0 || loadingClaim"
                src="@/assets/promo/lh-livepoker-rebate/reward-btn-3-disabled.png"
                alt=""
                width="100%"
              />
              <img v-else src="@/assets/promo/lh-livepoker-rebate/reward-btn-3.png" alt="" width="100%" />
            </template>
            <template v-else>
              <img
                v-if="bonus <= 0 || loadingClaim"
                src="@/assets/promo/lh-livepoker-rebate/reward-btn-3-disabled-en.png"
                alt=""
                width="100%"
              />
              <img v-else src="@/assets/promo/lh-livepoker-rebate/reward-btn-3-en.png" alt="" width="100%" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotify } from "@/hooks/notify";
import { onMounted, ref, defineProps } from "vue";
import { userStore } from "@/store";
import { initHappySaturdayBonus, claimHappySaturdayBonus } from "@/api/index/promo";
import { storeToRefs } from "pinia";
import { i18nStore } from "@/store/language";
import { useI18n } from "vue-i18n";

const props = defineProps(["promoCode", "params"]);
const promoCode = ref(props.promoCode);
const store = userStore();
const notify = useNotify();
const { languageVal } = storeToRefs(i18nStore());
const { t } = useI18n();

const loadingClaim = ref(false);

const totalValidBet = ref(0);
const bonus = ref(0);

const fetchData = async () => {
  loadingClaim.value = true;
  initHappySaturdayBonus(promoCode.value)
    .then((res) => {
      totalValidBet.value = res.data.totalValidBet;
      bonus.value = res.data.bonus;
    })
    .catch(() => {})
    .finally(() => {
      loadingClaim.value = false;
    });
};

const handleClaimBonus = () => {
  loadingClaim.value = true;
  claimHappySaturdayBonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: t("message.claimSuccessfully")
        });
        store.getBalance();
      }
      // else {
      //   notify({
      //     type: "error",
      //     message: res.message
      //   });
      // }
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
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}
.livepoker-rebate-container {
  width: 1200px;
  height: 100%;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 30px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  background: url("@/assets/promo/lh-livepoker-rebate/section-bg.png");
  background-size: 100% 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    justify-content: flex-start;
    gap: 25px;
  }

  .livepoker-rebate-section-right {
    margin-top: auto;
    margin-bottom: auto;
    width: 220px;

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

  .livepoker-rebate-section-title {
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
    color: #ff3333;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff3333;
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
  // margin-bottom: 16px;
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
  color: black;
  gap: 24px;

  .amount {
    color: #00a1ff;
    font-weight: 600;
  }
}
</style>
