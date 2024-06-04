<template>
  <q-item v-if="scope" v-bind="scope.itemProps" class="full-width item-wrapper">
    <q-item-section v-if="scope.opt.icon" avatar class="item-icon">
      <img class="w-1.8" :src="imgURL + scope.opt.icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-truncate">{{ scope.opt.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  scope: {
    type: Object,
    default: () => null,
  },
  directory:{
    type: String
  }
});

const imgURL = process.env.IMAGE_CDN + props.directory;
</script>

<style lang="scss" scoped>
.item-wrapper {
  padding-block: 0;
}
.item-icon {
  min-width: 0 !important;
}
</style>
