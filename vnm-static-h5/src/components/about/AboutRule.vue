<template>
  <div class="about-info">
    <div class="inner">
      <ul>
        <li>{{ $t("lang.about.familyRestriction") }}</li>
        <li>{{ $t("lang.about.entertainmentPurpose2") }}</li>
        <li>{{ $t("lang.about.modifyPromotion") }}</li>
        <li>{{ $t("lang.about.singleDeposit") }}</li>
        <li>
          {{ $t("lang.about.refundBasedOnBetTurnover") }}
          <ul class="sub-ul">
            <li>{{ $t("lang.about.refundOptions.loseAll") }}</li>
            <li>{{ $t("lang.about.refundOptions.loseLessThanStake") }}</li>
            <li>{{ $t("lang.about.refundOptions.winGreaterThanOrEqualTo75") }}</li>
            <li>{{ $t("lang.about.refundOptions.winLessThan75") }}</li>
          </ul>
        </li>
        <li>{{ $t("lang.about.requiredRounds") }}</li>
        <li>
          {{ $t("lang.about.abuseDiscretion") }}
          <ul class="sub-ul">
            <li>{{ $t("lang.about.abuseExamples.excludedGames") }}</li>
            <li>{{ $t("lang.about.abuseExamples.multipleAccounts") }}</li>
            <li>{{ $t("lang.about.abuseExamples.crossAccountBets") }}</li>
            <li>{{ $t("lang.about.abuseExamples.oddsDifference") }}</li>
            <li>{{ $t("lang.about.abuseExamples.doubleBetAmount") }}</li>
            <li>{{ $t("lang.about.abuseExamples.betOnBothSides") }}</li>
            <li>{{ $t("lang.about.abuseExamples.doubleBet") }}</li>
            <li>{{ $t("lang.about.abuseExamples.allin") }}</li>
            <li>{{ $t("lang.about.abuseExamples.affiliateAbuse") }}</li>
          </ul>
        </li>
        <li>{{ $t("lang.about.excludedBets") }}</li>
        <li>{{ $t("lang.about.transactionRecordsCheck") }}</li>
        <li>{{ $t("lang.about.falsifiedContentDisqualification") }}</li>
        <li>{{ $t("lang.about.amendTermsAndConditions") }}</li>
        <li>{{ $t("lang.about.withdrawalVerification") }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.about-info {
  .info-section {
    margin: 20px 0 0 0;
    color: #424f72;
    font-weight: 700;
    line-height: 193.482%;

    .title {
      font-size: 1rem;
      letter-spacing: 0.1rem;
    }

    .desc {
      font-size: 0.875rem;
      letter-spacing: 0.04375rem;
    }
  }
}
</style>
