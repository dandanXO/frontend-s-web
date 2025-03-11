<template>
  <div class="extraction-progress-bar" v-if="extractionDifference > 0 && !info.hasWithdrawn">
    <div class="progress" :style="{ width: progressBarIndicatePosition }"></div>
    <img
      class="indicate"
      :style="{ left: progressBarIndicatePosition }"
      src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/coin.png"
    />
  </div>

  <div class="extraction-remaining-progress" v-if="props?.isShowDetails">
    <span class="extraction-require-amount">
      Only
      <span class="amount">Rs{{ extractionDifference }}</span>
      to go
    </span>
    <span class="extraction-require-percentage">{{ `${remainingRequired}%` }}</span>
  </div>
</template>
<script setup>
import { computed, inject } from "vue";

const props = defineProps(["isShowDetails"]);
const info = inject("info");
const extractionDifference = inject("extractionDifference");
const targetWithdrawAmount = inject("targetWithdrawAmount");
const remainingRequired = computed(() => ((info.value.accumulatedBonus / targetWithdrawAmount.value) * 100).toFixed(2));

const progressBarIndicatePosition = computed(() => {
  return `calc(${remainingRequired.value}%)`;
});
</script>
<style lang="scss" scoped>
.extraction-require-amount,
.extraction-require-percentage {
  color: #fff;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
  text-align: left;

  .amount {
    font-weight: 500;
    color: #feba02;
  }
}

.extraction-progress-bar {
  position: relative;
  width: 90%;
  margin: 0 auto;
  height: 12px;
  background-color: #cc9f8c;
  border-radius: 100px;

  .progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
    border-radius: 4px;
  }

  .indicate {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 28px !important;
  }
}

.extraction-remaining-progress {
  display: flex;
  justify-content: space-between;
  font-family: "Poppins";
  width: 100%;
  margin: 5px auto;
}

@media screen and (max-width: 400px) {
  .extraction-progress-bar {
    width: 90%;
  }
  .extraction-remaining-progress {
    width: 95%;
  }
}
</style>
