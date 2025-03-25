<template>
  <div class="bottom" :class="{ isNotInApp: isNotInApp, isLoading: isLoadingRanking }">
    <q-spinner style="margin: auto" color="yellow" size="3em" :thickness="5" v-if="isLoadingRanking" />
    <template v-else>
      <div>
        {{
          props?.rankDetails?.rank > -1
            ? `${$t("hotPromo.jackpotAviator.rank")} ${props?.rankDetails?.rank}`
            : $t("hotPromo.jackpotAviator.noRank")
        }}
      </div>
      <div class="column">
        <div class="label">
          {{ $t("hotPromo.jackpotAviator.myBets") }}
          <span class="value">{{ props?.rankDetails?.currentBet }}</span>
        </div>
        <div class="label">{{ `${$t("hotPromo.jackpotAviator.myReward")} ${props?.rankDetails?.rewardPerc}%` }}</div>
      </div>
      <div class="column">
        <div class="label">{{ $t("hotPromo.jackpotAviator.ranksLeft") }}</div>
        <div class="value">{{ store.currency.value }} {{ props?.rankDetails?.betAmtNeeded }}</div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { userStore } from "stores/index";

const store = userStore();

const isNotInApp = window.location.pathname === "/promo";
const props = defineProps(["rankDetails", "isLoadingRanking"]);
</script>
<style lang="scss" scoped>
.bottom {
  // background: linear-gradient(180deg, #0d5819 0%, #082a23 100%);
  // border: 1px solid #258838;
  background: #323738;
  color: #ffffff;
  display: grid;
  grid-template-columns: 0.8fr 1fr 1fr;
  align-items: center;
  padding: 10px;
  position: fixed;
  bottom: 0px;
  width: 100%;
  min-height: 70px;
  max-width: 500px;
  font-size: 14px;
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0;
  text-align: center;
  > div {
    position: relative;
  }

  > div:nth-child(1),
  > div:nth-child(2) {
    &:after {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      content: "";
      width: 1px;
      height: 37px;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.5) 57%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  }

  &.isLoading {
    grid-template-columns: 1fr;
  }

  &.isNotInApp {
    bottom: 95px;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    align-items: flex-start;
    &:last-child {
      align-items: flex-end;
    }
  }

  .label {
    color: #c84846;
  }

  .value {
    color: #f1ff55;
  }
}

@media (max-width: 400px) {
  .bottom {
    padding: 5px;
    min-height: 50px;
    font-size: 14px;
    letter-spacing: -1px;
  }
}

@media (max-width: 350px) {
  .bottom {
    padding: 5px;
    min-height: 50px;
    font-size: 12px;
    letter-spacing: -1px;
  }
}
</style>
