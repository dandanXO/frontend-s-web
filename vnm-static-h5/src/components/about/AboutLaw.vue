<template>
  <div class="about-info">
    <div class="inner">
      <ul>
        <p>{{ $t("lang.about.generalTermsMessage") }}</p>
        <li>{{ $t("lang.about.ageRequirement") }}</li>
        <li>{{ $t("lang.about.singleAccount") }}</li>
        <li>{{ $t("lang.about.personalInformation2") }}</li>
        <li>{{ $t("lang.about.checkAccountBalance") }}</li>
        <li>{{ $t("lang.about.accountSecurity") }}</li>
        <li>{{ $t("lang.about.depositInstructions") }}</li>
        <li>{{ $t("lang.about.accessFromRestrictedArea") }}</li>
        <li>{{ $t("lang.about.entertainmentPurpose") }}</li>
        <li>{{ $t("lang.about.withdrawalRequest") }}</li>
        <li>{{ $t("lang.about.honestyPolicy") }}</li>
        <br />
        <p>{{ $t("lang.about.suspensionPolicyMessage") }}</p>
      </ul>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.about-info {
  ul {
    margin: 0;
    padding: 15px;
  }
  li {
    margin: 5px 20px;
    list-style-type: decimal;
    font-size: 14px;
  }
}
</style>
