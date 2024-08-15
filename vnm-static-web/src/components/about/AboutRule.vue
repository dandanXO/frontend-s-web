<template>
  <div class="about-info">
    <div class="inner">
      <ul>
        <li>{{ $t("about.familyRestriction") }}</li>
        <li>{{ $t("about.entertainmentPurpose2") }}</li>
        <li>{{ $t("about.modifyPromotion") }}</li>
        <li>{{ $t("about.singleDeposit") }}</li>
        <li>
          {{ $t("about.refundBasedOnBetTurnover") }}
          <ul class="sub-ul">
            <li>{{ $t("about.refundOptions.loseAll") }}</li>
            <li>{{ $t("about.refundOptions.loseLessThanStake") }}</li>
            <li>{{ $t("about.refundOptions.winGreaterThanOrEqualTo75") }}</li>
            <li>{{ $t("about.refundOptions.winLessThan75") }}</li>
          </ul>
        </li>
        <li>{{ $t("about.requiredRounds") }}</li>
        <li>
          {{ $t("about.abuseDiscretion") }}
          <ul class="sub-ul">
            <li>{{ $t("about.abuseExamples.excludedGames") }}</li>
            <li>{{ $t("about.abuseExamples.multipleAccounts") }}</li>
            <li>{{ $t("about.abuseExamples.crossAccountBets") }}</li>
            <li>{{ $t("about.abuseExamples.oddsDifference") }}</li>
            <li>{{ $t("about.abuseExamples.doubleBetAmount") }}</li>
            <li>{{ $t("about.abuseExamples.betOnBothSides") }}</li>
            <li>{{ $t("about.abuseExamples.doubleBet") }}</li>
            <li>{{ $t("about.abuseExamples.allin") }}</li>
            <li>{{ $t("about.abuseExamples.affiliateAbuse") }}</li>
          </ul>
        </li>
        <li>{{ $t("about.excludedBets") }}</li>
        <li>{{ $t("about.transactionRecordsCheck") }}</li>
        <li>{{ $t("about.falsifiedContentDisqualification") }}</li>
        <li>{{ $t("about.amendTermsAndConditions") }}</li>
        <li>{{ $t("about.withdrawalVerification") }}</li>
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
