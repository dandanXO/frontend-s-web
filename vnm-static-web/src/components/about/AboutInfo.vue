<template>
  <div class="about-info">
    <div class="inner">
    <div>
        <p>{{ $t('about.policyMessage') }}</p>
        <p>{{ $t('about.personalInformation') }}</p>
        <span class="content">{{ $t('about.processingPurposes') }}</span>
        <ul>
            <li>{{ $t('about.manageProcessInfo') }}</li>
            <li>{{ $t('about.offerGames') }}</li>
            <li>{{ $t('about.determineLegalAge') }}</li>
            <li>{{ $t('about.meetProductPreferences') }}</li>
            <li>{{ $t('about.webMaintenance') }}</li>
            <li>{{ $t('about.improveServiceQuality') }}</li>
            <li>{{ $t('about.riskPrevention') }}</li>
            <li>{{ $t('about.complyLegalSanctions') }}</li>
            <li>{{ $t('about.statisticalAnalysis') }}</li>
            <li>{{ $t('about.cooperateSuppliers') }}</li>
        </ul>
        <span class="content">{{ $t('about.promotionInformation') }}</span>
        <p>{{ $t('about.marketingPromotions') }}</p>
        <span class="content">{{ $t('about.privacy') }}</span>
        <p>{{ $t('about.privacyAssurance') }}</p>
        <span class="content">{{ $t('about.dataSecurity') }}</span>
        <p>{{ $t('about.dataSecurityAssurance') }}</p>
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
