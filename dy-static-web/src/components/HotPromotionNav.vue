<template>
  <div class="hot-promo-nav">
    <div
      v-for="(nav, navIndex) in hotPromoNav"
      :key="`hot-promo-nav-${navIndex}`"
      :class="`nav-tab-btn ${nav.label === label ? 'active' : ''}`"
      @click="onTabClick(nav.path)"
    >
      {{ nav.label }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

defineProps(["label"]);

const router = useRouter();

const hotPromoNav = [
  {
    label: "晋升有礼",
    path: "/promotion?name=dy2-vip-upgrade"
  },
  {
    label: "携手宏图",
    path: "/promotion?name=dy2-refer-bonus"
  },
  {
    label: "共创未来",
    path: "/promotion?name=Dongying-refer"
  }
];

const onTabClick = (path) => {
  router.push(path);
};
</script>

<style lang="scss">
.hot-promo-nav {
  display: flex;
  justify-content: space-between;
  padding: 0 75px;
  margin: 0 0 50px 0;

  .nav-tab-btn {
    background: url("../assets/images/promotion/hotpromo/common/btn_blue.png");
    background-size: contain;
    background-repeat: no-repeat;
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: white;
    font-weight: 600;
    opacity: 0.5;
    cursor: pointer;

    &.active {
      opacity: 1;
    }
  }
}
</style>
