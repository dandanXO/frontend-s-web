<template>
  <q-tabs :value="tab" indicator-color="transparent" @update:model-value="onTabChange">
    <q-tab v-for="item in items" :key="item.name" :class="{active: tab === item.name}" :name=item.name :label=item.label />
  </q-tabs>
</template>
<script setup>
const props = defineProps({
  tab: String,
  items: {
    type: Array,
    required: true,
    default: () => ([])
  },
});

const emit = defineEmits(['update:tab']);

const onTabChange = (val) => {
  console.log(val)
  emit('update:tab', val);
}
</script>
<style scoped lang="scss">
.q-tabs {
  background-color: #213057;
  background-attachment: fixed;
  border-radius: 50px;
  border: 1px solid #FFFFFF33;
  min-height: 36px;
  margin: 16px;
}

.q-tab {
  min-height: 36px;
  &.active {
    background: linear-gradient(180deg, #00C7C0 0%, #0996C7 100%);
    border-radius: 50px;
    color: #fff;
  }
}

// .q-tab--active {
//   background: linear-gradient(180deg, #00C7C0 0%, #0996C7 100%);
//   border-radius: 50px;
// }

.q-tab--inactive {
  color: #FFFFFF99;
}

.q-tabs__content--align-justify .q-tab {
  margin: 6px;
}
</style>
