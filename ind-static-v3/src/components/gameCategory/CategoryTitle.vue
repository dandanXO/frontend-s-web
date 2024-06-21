<template>
  <div class="title-game">
    <img :src="`${require('../../assets/images/index/category/cat-' + props.icon + '.png')}`" />
    <div class="txt-style">{{ props.title }}</div>
  </div>
</template>

<script setup>
const props = defineProps(["title", "icon"]);
</script>

<style scoped lang="scss">
.title-game {
  margin-left: -8px;
  margin-right: -8px;
  padding: 10px 12px 0px;
  display: flex;
  gap: 8px;
  align-items: center;

  img {
    width: auto;
    height: 24px;
  }

  .txt-style {
    padding-top: 2px;
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0px;
    line-height: 1;
    text-transform: uppercase;
    color: #51554f;
  }
}
</style>
