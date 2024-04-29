<template>
  <div class="bracket-team-wrapper">
    <img :src="imgUrl" />
    <span class="bracket-team__name">{{ country }}</span>
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
  gap: 7px;

  img {
    max-width: 36px !important;
    margin-bottom: 0 !important;
  }

  .bracket-team__name {
    font-family: Microsoft YaHei UI;
    font-size: 1rem;
    line-height: 1.3rem;
    letter-spacing: 0.12em;
  }
}
</style>
