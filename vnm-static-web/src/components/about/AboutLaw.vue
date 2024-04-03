<template>
  <div class="about-info">
    <div class="inner">
                <ul>   
                  <p>{{ $t('about.generalTermsMessage') }}</p>
                  <li>{{ $t('about.ageRequirement') }}</li>
                  <li>{{ $t('about.singleAccount') }}</li>
                  <li>{{ $t('about.personalInformation2') }}</li>
                  <li>{{ $t('about.checkAccountBalance') }}</li>
                  <li>{{ $t('about.accountSecurity') }}</li>
                  <li>{{ $t('about.depositInstructions') }}</li>
                  <li>{{ $t('about.accessFromRestrictedArea') }}</li>
                  <li>{{ $t('about.entertainmentPurpose') }}</li>
                  <li>{{ $t('about.withdrawalRequest') }}</li>
                  <li>{{ $t('about.honestyPolicy') }}</li>
                  <br>
                  <p>{{ $t('about.suspensionPolicyMessage') }}</p>
                </ul>
            </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.about-info {
  ul  {
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
