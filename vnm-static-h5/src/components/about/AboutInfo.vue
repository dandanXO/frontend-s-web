<template>
  <div class="about-info">
    <div class="inner">
      <div>
        <p>{{ $t("lang.about.policyMessage") }}</p>
        <p>{{ $t("lang.about.personalInformation") }}</p>
        <span class="content">{{ $t("lang.about.processingPurposes") }}</span>
        <ul>
          <li>{{ $t("lang.about.manageProcessInfo") }}</li>
          <li>{{ $t("lang.about.offerGames") }}</li>
          <li>{{ $t("lang.about.determineLegalAge") }}</li>
          <li>{{ $t("lang.about.meetProductPreferences") }}</li>
          <li>{{ $t("lang.about.webMaintenance") }}</li>
          <li>{{ $t("lang.about.improveServiceQuality") }}</li>
          <li>{{ $t("lang.about.riskPrevention") }}</li>
          <li>{{ $t("lang.about.complyLegalSanctions") }}</li>
          <li>{{ $t("lang.about.statisticalAnalysis") }}</li>
          <li>{{ $t("lang.about.cooperateSuppliers") }}</li>
        </ul>
        <span class="content">{{ $t("lang.about.promotionInformation") }}</span>
        <p>{{ $t("lang.about.marketingPromotions") }}</p>
        <span class="content">{{ $t("lang.about.privacy") }}</span>
        <p>{{ $t("lang.about.privacyAssurance") }}</p>
        <span class="content">{{ $t("lang.about.dataSecurity") }}</span>
        <p>{{ $t("lang.about.dataSecurityAssurance") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.about-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .content {
    font-size: 18px;
    color: #0071ed;
    margin-top: 10px;
  }
}
</style>
