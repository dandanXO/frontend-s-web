<template>
  <div class="section-header-wrapper">
    <img :src="SectionHeaderImg" />
    <span class="section-header__title">{{ label }}</span>
    <img :src="SectionHeaderImg" class="section-header__reverse" />
  </div>
</template>
<script setup>
import SectionHeaderImg from "components/hotpromo/LOL-msi-2024/images/section-header.png";

defineProps({
  label: String
});
</script>
<style scoped lang="scss">
.section-header-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;

  img {
    max-width: 30%;
    margin-bottom: 0px !important;
  }

  .section-header__title {
    font-family: Microsoft YaHei UI;
    font-size: 20px;
    font-weight: 700;
    line-height: 26px;
    text-align: center;
    color: transparent;
    background: linear-gradient(180deg, #ffffff 0%, #ff8080 100%);

    background-clip: text;
    flex-shrink: 0;
  }

  .section-header__reverse {
    transform: scaleX(-1);
  }
}
</style>
