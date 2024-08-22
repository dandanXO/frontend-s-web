<template>
  <div class="description-wrapper">
    <div>
      <img :src="DescriptionImg" />
      <span class="description-title">活动内容：</span>
      <span class="description-content">
        <slot />
      </span>
    </div>
  </div>
</template>
<script setup>
import DescriptionImg from "components/hotpromo/LOL-msi-2024/images/description-icon.png";
</script>
<style scoped lang="scss">
.description-wrapper {
  align-self: flex-start;
  margin-bottom: 27px;
  font-family: Microsoft YaHei UI;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.3rem;
  text-align: left;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 13px;

  > div {
    display: flex;
    align-items: start;

    img {
      max-width: 1rem;
    }
  }

  .description-title {
    padding-left: 15px;
    flex-shrink: 0;
    font-weight: 800;
  }
}
</style>
