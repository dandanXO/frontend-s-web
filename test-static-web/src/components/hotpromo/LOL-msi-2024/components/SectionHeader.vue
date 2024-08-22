<template>
  <div class="section-header-wrapper">
    <img :src="SectionHeaderImg" />
    <span class="section-header__title">{{ label }}</span>
    <img :src="SectionHeaderImg" class="section-header__reverse" />
  </div>
</template>
<script setup>
import SectionHeaderImg from "@/components/hotpromo/LOL-msi-2024/images/section-header.png";

defineProps({
  label: String
});
</script>
<style scoped lang="scss">
.section-header-wrapper {
  display: flex;
  gap: 16px;
  align-items: center;

  .section-header__title {
    font-family: Microsoft YaHei UI;
    font-size: 39.33px;
    font-weight: 700;
    line-height: 52.32px;
    text-align: center;
    color: transparent;
    background: linear-gradient(180deg, #23bdff 0%, #ffffff 100%);
    background-clip: text;
  }

  .section-header__reverse {
    transform: scaleX(-1);
  }
}
</style>
