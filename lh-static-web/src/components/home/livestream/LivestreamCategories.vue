<!-- /components/LivestreamCategories.vue -->
<template>
  <div class="livestream-tabs-wrapper">
    <el-tabs v-model="model" class="livestream-tabs" :class="isDark && 'dark'">
      <el-tab-pane v-for="category in categories" :key="category.value" :name="category.value">
        <template #label>
          <img :src="getIcon(category.value)" />
          {{ getLabel(category.value) }}
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
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

.livestream-tabs-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;

  .livestream-tabs {
    background: #f0f7ff;
    box-shadow: 0px 2px 4.58px 0px #bbdcff inset, 0px -1px 3.66px 0px #a2bff4 inset, 0px 4px 4px 0px #00000012;
    border-radius: 100px;
    max-width: 598px;
    padding: 4px;

    .el-tabs__nav-wrap {
      &::after {
        display: none;
      }
    }

    .el-tabs__header {
      margin: 0;

      .el-tabs__nav-scroll .el-tabs__nav {
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
            background-image: url(../../../assets/home/livestream/category-active-bg.png);
            background-size: 100% 100%;

            img {
              filter: brightness(1);
            }
          }
        }
      }
    }

    &.dark {
      background: #2d4065;
      box-shadow: 2px 4px 10px 0px #00194b52, 0px 4px 4px 0px #ffffff12 inset, 0px -3px 4px 0px #ffffff12 inset;
      border: 1px solid #be945733;
      .el-tabs__header .el-tabs__nav-scroll .el-tabs__nav {
        .el-tabs__item {
          color: #98a7b5;

          &.is-active {
            color: #ffffff;
            background-image: url(../../../assets/home/livestream/category-active-bg-dark.png);
          }
        }
      }
    }
  }
}
</style>
