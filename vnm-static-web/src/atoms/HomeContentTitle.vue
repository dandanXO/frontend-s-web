<template>
  <div class="tab-title">
    <img class="edge-left" src="../assets/home/download/edge-left.png" />
    <span class="title">{{ title }}</span>
    <img class="edge-right" src="../assets/home/download/edge-right.png" />
  </div>
</template>

<script setup>
defineProps(["title"]);
</script>

<style scoped lang="scss">
.tab-title {
  display: flex;
  align-items: center;
  justify-content: center;

  span.title {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    position: relative;
    width: 10rem;
    height: 2rem;

    color: #fff;
    font-family: PingFang SC;
    font-size: 1.18356rem;
    font-weight: 600;
  }

  span.title:before,
  span.title:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    z-index: -1;
    background: linear-gradient(180deg, #73b2ff 31.25%, #3981ff 100%);
  }

  span.title:before {
    transform: skew(17.5deg);
    left: 25px;
  }
  span.title:after {
    transform: skew(-17.5deg);
    right: 25px;
    left: auto;
  }

  .edge-left {
    margin: 0 1.25rem 0 0;
  }
  .edge-right {
    margin: 0 0 0 1.25rem;
  }
}
</style>
