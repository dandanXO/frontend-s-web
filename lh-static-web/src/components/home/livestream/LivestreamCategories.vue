<!-- /components/LivestreamCategories.vue -->
<template>
  <el-tabs v-model="model" class="livestream-tabs" :class="isDark && 'dark'">
    <el-tab-pane v-for="category in categories" :key="category.value" :name="category.value">
      <template #label>
        <img :src="getIcon(category.value)" />
        {{ getLabel(category.value) }}
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDark } from "@vueuse/core";

const emit = defineEmits(["change", "categories"]);
const model = defineModel();

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const isDark = useDark();
const iconMap = {
  popular: require("../../../assets/home/livestream/icon-streamer.svg"),
  football: require("../../../assets/home/livestream/icon-football.svg"),
  basketball: require("../../../assets/home/livestream/icon-basketball.svg"),
  esports: require("../../../assets/home/livestream/icon-esports.svg")
};

const labelMap = {
  popular: "主播",
  esports: "电竞",
  football: "足球",
  basketball: "篮球"
};

const getIcon = (value) => {
  return iconMap[value] || "";
};

const getLabel = (value) => {
  return labelMap[value] || value;
};
</script>

<style lang="scss">
.el-tabs {
  margin-bottom: 12px;
}

.livestream-tabs {
  .el-tabs__nav-wrap {
    &::after {
      display: none;
    }
  }

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
