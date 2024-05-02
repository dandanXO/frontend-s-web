<template>
  <div class="description-wrapper">
    <!--    <div>-->
    <!--      <img :src="DescriptionImg" />-->
    <!--      <span class="description-title">活动时间：</span>-->
    <!--      <span class="description-content">以官网通知为准</span>-->
    <!--    </div>-->
    <!--    <div>-->
    <!--      <img :src="DescriptionImg" />-->
    <!--      <span class="description-title">活动对象：</span>-->
    <!--      <span class="description-content">全体会员</span>-->
    <!--    </div>-->
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
import DescriptionImg from "@/components/hotpromo/LOL-msi-2024/images/description-icon.png";
</script>
<style scoped lang="scss">
.description-wrapper {
  align-self: start;
  margin-bottom: 37px;
  font-family: Microsoft YaHei UI;
  font-size: 28px;
  font-weight: 400;
  line-height: 37.24px;
  text-align: left;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding: 0 60px;

  > div {
    display: flex;
    align-items: start;
  }

  .description-title {
    padding-left: 15px;
    flex-shrink: 0;
    font-weight: 800;
  }
}
</style>
