<template>
  <div class="platform-item-wrapper">
    <div class="platform-item-img-wrapper">
      <img class="platform-item-img" :src="require(`../../assets/index/live/platform-img-${platform.image}.png`)" />
    </div>
    <img class="platform-item-logo" :src="require(`../../assets/index/live/platform-logo-${platform.logo}.png`)" />
    <div class="platform-item-bottom-wrapper">
      <RedirectButton class="platform-item-play-btn" @click="$emit('click')">{{ $t("btn.betNow") }}</RedirectButton>
      <div class="platform-item-desc">
        {{ platform.message }}
      </div>
    </div>
  </div>
</template>
<script setup>
import RedirectButton from "../RedirectButton.vue";

defineProps({
  platform: {
    type: Object,
    required: true
  }
});

defineEmits(["click"]);
</script>
<style lang="scss" scoped>
.platform-item-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 9px 14px;
  background: url(../../assets/index/live/platform-bg.png) no-repeat center;
  background-size: 100% 100%;
  aspect-ratio: 345 / 299;
  box-shadow: 0px 0px 5.9px 0px #93c7ff69;
  border-radius: 10px;

  .platform-item-img-wrapper {
    position: absolute;
    left: 16px;
    right: 16px;
    top: 8%;
    mask-image: url(../../assets/index/live/platform-img-mask.png);
    mask-repeat: no-repeat;
    mask-position: bottom;
    -webkit-mask-image: url(../../assets/index/live/platform-img-mask.png);
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: bottom;

    .platform-item-img {
      width: unset;
      max-width: 100%;
    }
  }

  .platform-item-logo {
    z-index: 1;
    width: 30vw !important;
    max-width: 150px;
  }

  .platform-item-bottom-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
    margin-bottom: 10px;

    .platform-item-play-btn {
      margin-bottom: 10px;
    }

    .platform-item-desc {
      font-size: 12px;
      color: #7a80a1;
      text-align: center;
    }
  }
}
</style>
