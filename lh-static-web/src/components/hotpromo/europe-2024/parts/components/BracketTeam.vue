<template>
  <div class="bracket-team-wrapper">
    <img :src="imgUrl" v-if="imgUrl" />
    <span v-if="imgUrl" class="bracket-team__name">{{ country }}</span>
    <div v-else class="bracket-team__qn">
      <img src="~@/assets/promo/daiding.jpg" />
    </div>
  </div>
</template>
<script setup>
defineProps({
  imgUrl: String,
  country: String
});
</script>
<style scoped lang="scss">
.bracket-team-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  img {
    border-radius: 8px;
    width: 68px;
  }
  .bracket-team__name {
    font-family: Microsoft YaHei UI;
    font-size: 16px;
    line-height: 18px;
    letter-spacing: 0.12em;
    word-break: keep-all;
  }
  .bracket-team__qn {
    font-family: Microsoft YaHei UI;
    font-size: 32px;
    line-height: 35px;
    letter-spacing: 0;
    color: #000000;
    background: transparent;
    background-color: transparent;
    padding: 0px;
    border-radius: 50%;
  }
}
</style>
