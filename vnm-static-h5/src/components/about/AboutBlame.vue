<template>
  <div class="about-info">
    <div class="inner">
      <p>{{ $t("lang.about.intro") }}</p>
      <ul>
        <li>{{ $t("lang.about.questions.question1") }}</li>
        <li>{{ $t("lang.about.questions.question2") }}</li>
        <li>{{ $t("lang.about.questions.question3") }}</li>
        <li>{{ $t("lang.about.questions.question4") }}</li>
        <li>{{ $t("lang.about.questions.question5") }}</li>
        <li>{{ $t("lang.about.questions.question6") }}</li>
        <li>{{ $t("lang.about.questions.question7") }}</li>
        <li>{{ $t("lang.about.questions.question8") }}</li>
        <li>{{ $t("lang.about.questions.question9") }}</li>
        <li>{{ $t("lang.about.questions.question10") }}</li>
      </ul>
      <p>{{ $t("lang.about.signsOfGambling") }}</p>
      <span class="content">{{ $t("lang.about.adviceTitle") }}</span>
      <ul class="bullet-ul">
        <li>{{ $t("lang.about.advice1") }}</li>
        <li>{{ $t("lang.about.advice2") }}</li>
        <li>{{ $t("lang.about.advice3") }}</li>
        <li>{{ $t("lang.about.advice4") }}</li>
        <li>{{ $t("lang.about.advice5") }}</li>
      </ul>
      <span class="content">{{ $t("lang.about.tf88SupportTitle") }}</span>
      <p>{{ $t("lang.about.tf88SupportContent") }}</p>
      <div class="note" style="color: orange; font-size: 16px">
        {{ $t("lang.about.ageRestriction") }}
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
    font-weight: 700;
    line-height: 193.482%;

    .desc {
      font-size: 0.875rem;
      letter-spacing: 0.04375rem;
    }
  }
}
</style>
