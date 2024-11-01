<template>
  <q-tabs
    :value="tab"
    indicator-color="transparent"
    @update:model-value="onTabChange"
    :style="`border-radius: ${borderRadius}px; background-color: ${backgroundColor}`"
  >
    <q-tab
      v-for="item in items"
      :key="item.name"
      :class="{ active: tab === item.name }"
      :name="item.name"
      :label="item.label"
      :style="`border-radius: ${borderRadius}px;`"
    />
  </q-tabs>
</template>
<script setup>
const props = defineProps({
  tab: String,
  items: {
    type: Array,
    default: () => []
  },
  borderRadius: {
    type: Number,
    default: 50
  },
  backgroundColor: {
    type: String,
    default: "#213057"
  }
});

const emit = defineEmits(["update:tab"]);

const onTabChange = (val) => {
  emit("update:tab", val);
};
</script>
<style scoped lang="scss">
.q-tabs {
  background-color: #213057;
  background-attachment: fixed;
  border-radius: 50px;
  border: 1px solid #ffffff33;
  min-height: 36px;
  margin: 16px;
}

.q-tab {
  min-height: 36px;
  &.active {
    background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
    border-radius: 50px;
    color: #fff;
    box-shadow: 0px 0px 4px 0px #ffffff inset;
  }
}

.q-tab--inactive {
  color: #ffffff99;
}

.q-tabs__content--align-justify .q-tab {
  margin: 6px;
}
</style>
