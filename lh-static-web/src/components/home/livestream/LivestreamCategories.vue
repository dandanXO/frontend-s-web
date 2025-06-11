<!-- /components/LivestreamCategories.vue -->
<template>
  <el-tabs v-model="activeTab" @tab-change="selectTab" class="livestream-tabs" :class="isDark && 'dark'">
    <el-tab-pane name="popular">
      <template #label>
        <img src="../../../assets/home/livestream/icon-popular.svg" />
        热门
      </template>
    </el-tab-pane>
    <el-tab-pane name="football">
      <template #label>
        <img src="../../../assets/home/livestream/icon-football.svg" />
        足球
      </template>
    </el-tab-pane>
    <el-tab-pane name="basketball">
      <template #label>
        <img src="../../../assets/home/livestream/icon-basketball.svg" />
        篮球
      </template>
    </el-tab-pane>
    <el-tab-pane name="esports">
      <template #label>
        <img src="../../../assets/home/livestream/icon-esports.svg" />
        电竞
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref } from "vue";
import { useDark } from "@vueuse/core";

const isDark = useDark();
const emit = defineEmits(["change"]);
const activeTab = ref("popular");

function selectTab(tabKey) {
  emit("change", tabKey);
}
</script>

<style lang="scss">
.el-tabs {
  margin-bottom: 12px;
}

.livestream-tabs {
  .el-tabs__header .el-tabs__nav-scroll .el-tabs__nav {
    gap: 16px;
    justify-content: center;
    width: 100%;

    .el-tabs__active-bar {
      display: none;
    }

    .el-tabs__item {
      // color: #98a7b5;
      color: #7a899e;
      font-size: 16px;
      line-height: 1;
      background-image: url(../../../assets/home/livestream/livestream-cat.png);
      background-size: 100% 100%;
      padding: 12px 16px 12px;
      height: 50px;
      width: 140px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        padding-right: 6px;
        filter: brightness(0.7);
      }

      &.is-active {
        color: #ffffff;
        background-image: url(../../../assets/home/livestream/livestream-cat-active.png);

        img {
          filter: brightness(1);
        }
      }
    }
  }

  &.dark {
    .el-tabs__header .el-tabs__nav-scroll .el-tabs__nav {
      .el-tabs__item {
        color: #98a7b5;
        background-image: url(../../../assets/home/livestream/livestream-cat-dark.png);
        padding: 12px 16px 18px;

        &.is-active {
          color: #ffffff;
          background-image: url(../../../assets/home/livestream/livestream-cat-dark-active.png);
        }
      }
    }
  }
}
</style>
