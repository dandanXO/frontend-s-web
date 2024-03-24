<template>
  <div class="about-info">
    <div class="inner">
    <p>{{ $t('about.intro') }}</p>
    <ul>
        <li>{{ $t('about.questions.question1') }}</li>
        <li>{{ $t('about.questions.question2') }}</li>
        <li>{{ $t('about.questions.question3') }}</li>
        <li>{{ $t('about.questions.question4') }}</li>
        <li>{{ $t('about.questions.question5') }}</li>
        <li>{{ $t('about.questions.question6') }}</li>
        <li>{{ $t('about.questions.question7') }}</li>
        <li>{{ $t('about.questions.question8') }}</li>
        <li>{{ $t('about.questions.question9') }}</li>
        <li>{{ $t('about.questions.question10') }}</li>
    </ul>
    <p>{{ $t('about.signsOfGambling') }}</p>
    <span class="content">{{ $t('about.adviceTitle') }}</span>
    <ul class="bullet-ul">
        <li>{{ $t('about.advice1') }}</li>
        <li>{{ $t('about.advice2') }}</li>
        <li>{{ $t('about.advice3') }}</li>
        <li>{{ $t('about.advice4') }}</li>
        <li>{{ $t('about.advice5') }}</li>
    </ul>
    <span class="content">{{ $t('about.tf88SupportTitle') }}</span>
    <p>{{ $t('about.tf88SupportContent') }}</p>
    <div class="note" style="color: orange; font-size: 16px;">
        {{ $t('about.ageRestriction') }}
    </div>
</div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.about-info {
  .info-section {
    margin: 20px 0 0 0;
    color: #424f72;
    ;
    font-weight: 700;
    line-height: 193.482%;

    .desc {
      font-size: 0.875rem;
      letter-spacing: 0.04375rem;
    }
  }
}
</style>
