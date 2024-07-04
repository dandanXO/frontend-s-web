<template>
  <div class="roles-main member-tree-container">
    <div class="panel-item">
      <el-input v-model="filterText" style="width: 240px" placeholder="Filter keyword" />

      <el-tree ref="treeRef" style="max-width: 600px" class="filter-tree" :data="treeData" :props="defaultProps" default-expand-all :filter-node-method="filterNode">
        <template #default="{node}">
          <div class="custom-tree-node">
            <svg-icon :icon-class="'user'" />
            <span>{{ node.label }}</span>
          </div>
        </template>
      </el-tree>
    </div>
    <div class="panel-item">Tables</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const filterText = ref('');
const treeRef = ref();
watch(filterText, (val) => {
  treeRef.value.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

const treeData = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]
</script>

<style lang="scss" scoped>
.member-tree-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
