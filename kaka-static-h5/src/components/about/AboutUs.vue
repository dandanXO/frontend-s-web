<template>
  <div class="top-container">
    <div class="inner">
      <div>
        <span class="remark">{{ $t("lang.about.welcome") }}</span>
      </div>
      <div class="aboutus-message">
        <div class="message-content">
          <span class="title">{{ $t("lang.about.product") }}</span>
          <span class="remark">{{ $t("lang.about.productDescription") }}</span>
        </div>
      </div>
      <div class="aboutus-message">
        <div class="message-content">
          <span class="title">{{ $t("lang.about.liquidity") }}</span>
          <span class="remark">{{ $t("lang.about.liquidityDescription") }}</span>
        </div>
      </div>
      <div class="aboutus-message">
        <div class="message-content">
          <span class="title">{{ $t("lang.about.security") }}</span>
          <span class="remark">{{ $t("lang.about.securityDescription") }}</span>
        </div>
      </div>
      <div class="aboutus-message">
        <div class="img-bg">
          <div class="info-img"></div>
        </div>
        <div class="message-content">
          <span class="title">{{ $t("lang.about.promotion") }}</span>
          <span class="remark">{{ $t("lang.about.promotionDescription") }}</span>
        </div>
      </div>
      <div class="aboutus-message">
        <div class="img-bg">
          <div class="info-img"></div>
        </div>
        <div class="message-content">
          <span class="title">{{ $t("lang.about.license") }}</span>
          <span class="remark">{{ $t("lang.about.licenseDescription") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.message-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .title {
    font-size: 18px;
    color: #0071ed;
    margin-top: 10px;
  }
}
</style>
