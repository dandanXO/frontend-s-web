<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="please enter Icon name"
              @clear="filterIcons" @input="filterIcons"
    >
      <i class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <svg-icon :icon-class="item" style="height: 30px;width: 16px;" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import icons from "./requireIcons.js";

export default defineComponent({
  emits: ['selected'],
  setup: (props, { emit }) => {
    const data = reactive({
      name: "",
      iconList: icons,
      filterIcons: () => {
        data.iconList = icons;
        if (data.name) {
          data.iconList = data.iconList.filter(item => item.includes(data.name));
        }
      },
      selectedIcon: (name) => {
        emit("selected", name);
      },
      reset: () => {
        data.name = "";
        data.iconList = icons;
      }
    });
    return { ...toRefs(data) };
  }
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;

  .icon-list {
    height: 200px;
    overflow-y: scroll;

    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }

    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
