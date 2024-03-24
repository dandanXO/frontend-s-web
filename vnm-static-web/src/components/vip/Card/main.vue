<script setup>
import { getImageUrl } from "@/utils/utils";

defineProps({
  level: String,
  description: String
});
</script>

<template>
  <div class="vip-left-box">
    <img :src="getImageUrl(`vip/vip_detail_${level}.png`)" class="vip-badge" />
    <img :src="getImageUrl('vip/vip_detail_item_bg.png')" class="vip-card" />
    <div class="vip-card-content">
      <img :src="getImageUrl(`vip/vip_detail_txt_${level}.png`)" />
      <div v-html="description"></div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
