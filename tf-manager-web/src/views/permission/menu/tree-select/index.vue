<template>
  <el-select v-model="label"
             v-bind="$attrs"
             ref="select"
  >
    <el-option value="">
      <el-tree ref="tree"
               lazy
               :expand-on-click-node="false"
               :props="treeProps"
               :load="loadTreeMenu"
               highlight-current
               @node-click="handleNodeClick"
      />
    </el-option>
  </el-select>
</template>

<script setup>

import { defineEmits, defineProps, onMounted, ref, watch } from "vue";
import { fetchMenuName, fetchSimpleMenu, fetchSimpleChildMenu } from "../../../../api/menus";

const select = ref("");
const label = ref("");
const emit = defineEmits(["selected"]);
const props = defineProps({
  treeProps: {
    type: Object,
    default: () => {
      return {
        id: "id",
        label: "name",
        children: "children",
        isLeaf: "isLeaf"
      };
    }
  },
  viewVal: {
    type: Number,
    default: () => 0
  }
});

onMounted(async () => {
  if (props.viewVal) {
    const { data: menu } = await fetchMenuName(props.viewVal);
    label.value = menu;
  } else {
    label.value = null;
  }
});

watch(() => props.viewVal, async () => {
  if (props.viewVal) {
    const { data: menu } = await fetchMenuName(props.viewVal);
    label.value = menu;
  } else {
    label.value = null;
  }
});

function handleNodeClick(node) {
  label.value = node[props.treeProps.label];
  emit("selected", node[props.treeProps.id]);
  select.value.blur();
}

async function loadTreeMenu(treeNode, resolve) {
  if (treeNode.level === 0) {
    const { data: children } = await fetchSimpleMenu();
    resolve(children);
  } else {
    const { data: children } = await fetchSimpleChildMenu(treeNode.data.id);
    resolve(children);
  }
};

</script>

<style scoped>

.el-select-dropdown__item {
  height: 100%;
  padding: 10px 0;
}

</style>
