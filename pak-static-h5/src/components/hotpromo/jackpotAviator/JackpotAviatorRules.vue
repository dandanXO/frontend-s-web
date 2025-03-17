<template>
  <div class="rules-container">
    <img
      class="back-btn"
      @click="props.onClickBackBtn"
      src="../../../assets/images/promotion/hotpromo/jackpot-aviator/back-btn.png"
    />

    <img
      v-if="langVal === 'ur'"
      class="title-img"
      src="../../../assets/images/promotion/hotpromo/jackpot-aviator/rules-title-ur.png"
    />
    <img v-else class="title-img" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/rules-title.png" />

    <!--        <div class="rule-item">{{ $t('hotPromo.jackpotAviator.rules1') }}</div><br/>-->
    <!--        <div class="rule-item">{{ $t('hotPromo.jackpotAviator.rules2') }}</div><br/>-->
    <div style="text-align: center" class="rule-item">{{ $t("hotPromo.jackpotAviator.rankingBonusRatio") }}</div>
    <RankingBonusRatioTable :rankingBonusRatioList="props.rankingBonusRatioList" />

    <br />
    <br />

    <img
      v-if="langVal === 'ur'"
      class="title-img"
      src="../../../assets/images/promotion/hotpromo/jackpot-aviator/activity-rules-title-ur.png"
    />
    <img
      v-else
      class="title-img"
      src="../../../assets/images/promotion/hotpromo/jackpot-aviator/activity-rules-title.png"
    />

    <ol class="rules">
      <li class="rule-item">{{ $t("hotPromo.jackpotAviator.activityRules1") }}</li>
      <li class="rule-item">{{ $t("hotPromo.jackpotAviator.activityRules2") }}</li>
      <li class="rule-item">{{ $t("hotPromo.jackpotAviator.activityRules3") }}</li>
      <li class="rule-item">{{ $t("hotPromo.jackpotAviator.activityRules4") }}</li>
    </ol>

    <br />

    <img
      v-if="langVal === 'ur'"
      class="title-img"
      src="../../../assets/images/promotion/hotpromo/jackpot-aviator/terms-conditions-title-ur.png"
    />
    <img
      v-else
      class="title-img"
      src="../../../assets/images/promotion/hotpromo/jackpot-aviator/terms-conditions-title.png"
    />

    <ol class="rules">
      <li class="rule-item">{{ $t("hotPromo.jackpotAviator.termsCondition1") }}</li>
      <li class="rule-item">{{ $t("hotPromo.jackpotAviator.termsCondition2") }}</li>
      <li class="rule-item">{{ $t("hotPromo.jackpotAviator.termsCondition3") }}</li>
    </ol>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { i18nStore } from "src/router/language";
import RankingBonusRatioTable from "./RankingBonusRatioTable.vue";

const props = defineProps(["onClickBackBtn", "rankingBonusRatioList"]);

const i18nStoreLanguage = i18nStore();

const langVal = computed(() => i18nStoreLanguage.languageVal);
</script>

<style lang="scss" scoped>
.rules-container {
  position: relative;
  padding: 40px 20px 20px 20px;

  .title-img {
    display: flex;
    margin: 0 auto;
  }

  .back-btn {
    position: absolute;
    top: 0px;
    left: 20px;
    width: 33px !important;
    height: 33px !important;
    cursor: pointer;
    background: transparent;

    &:hover {
      filter: brightness(1.1);
    }
  }

  .rule-item {
    font-family: Poppins;
    font-size: 12px;
    font-weight: 400;
    line-height: 25px;
    text-align: left;
    color: #9f9f9f;
  }

  .ranking {
    display: flex;
    flex-direction: column;

    .item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 30px;

      .rank {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &:first-child {
        font-family: Manrope;
        font-size: 12px;
        font-weight: 700;
        line-height: 18px;
        text-align: center;
        background: linear-gradient(180deg, #21EF89 0%, #33562d 100%);
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }

      &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      &:not(:first-child) {
        font-family: Manrope;
        font-size: 14px;
        font-weight: 700;
        line-height: 14px;
        text-align: center;
      }

      &:nth-child(odd) {
        background-color: #032503;
      }

      &:nth-child(even) {
        background-color: #113810;
      }
    }
  }
}
</style>
