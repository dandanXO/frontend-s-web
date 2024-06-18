<template>
  <a-modal v-model:visible="visible" centered :footer="null" :width="400" :style="{ padding: '13px 17px' }">
    <div class="social-media-content-wrapper">
      <span class="social-media-title">{{ $t("shareView.shareModal.title") }}</span>
      <div class="social-media-list">
        <a class="social-media-item" @click="$emit('shareClick', 'youtube')">
          <img src="@/assets/images/account/share/logo-youtube.png" />
        </a>
        <a class="social-media-item" @click="$emit('shareClick', 'facebook')">
          <img src="@/assets/images/account/share/logo-facebook.png" />
        </a>
        <a class="social-media-item" @click="$emit('shareClick', 'email')">
          <img src="@/assets/images/account/share/logo-email.png" />
        </a>
      </div>
    </div>
  </a-modal>
</template>
<script setup>
const visible = defineModel();
defineEmits(["shareClick"]);
</script>
<style scoped lang="scss">
.social-media-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c968f;

  .social-media-title {
    margin-bottom: 45px;
    font-size: 18px;
    line-height: 20.92px;
    text-align: center;
    color: #fff;
  }

  .social-media-list {
    display: flex;
    justify-content: space-around;
    width: 100%;

    .social-media-item {
      img {
        max-width: 48px;
      }
    }
  }
}
</style>
