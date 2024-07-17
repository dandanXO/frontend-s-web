<template>
  <div class="top-container">
    <div class="inner">
    <div>
        <span class="remark">{{ $t('about.welcome') }}</span>
    </div>
    <div class="aboutus-message">
        <div class="message-content">
            <span class="title">{{ $t('about.product') }}</span>
            <span class="remark">{{ $t('about.productDescription') }}</span>
        </div>
    </div>
    <div class="aboutus-message">
        <div class="message-content">
            <span class="title">{{ $t('about.liquidity') }}</span>
            <span class="remark">{{ $t('about.liquidityDescription') }}</span>
        </div>
    </div>
    <div class="aboutus-message">
        <div class="message-content">
            <span class="title">{{ $t('about.security') }}</span>
            <span class="remark">{{ $t('about.securityDescription') }}</span>
        </div>
    </div>
    <div class="aboutus-message">
        <div class="img-bg">
            <div class="info-img"></div>
        </div>
        <div class="message-content">
            <span class="title">{{ $t('about.promotion') }}</span>
            <span class="remark">{{ $t('about.promotionDescription') }}</span>
        </div>
    </div>
    <div class="aboutus-message">
        <div class="img-bg">
            <div class="info-img"></div>
        </div>
        <div class="message-content">
            <span class="title">{{ $t('about.license') }}</span>
            <span class="remark">{{ $t('about.licenseDescription') }}</span>
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
