<template>
  <q-btn-toggle v-model="model" class="top-toggle-menu" no-caps :options="categories">
    <template v-slot:popular>
      <img :src="getImg('popular')" />
    </template>
    <template v-slot:esport>
      <img :src="getImg('esport')" />
    </template>
    <template v-slot:football>
      <img :src="getImg('football')" />
    </template>
    <template v-slot:basketball>
      <img :src="getImg('basketball')" />
    </template>
  </q-btn-toggle>
</template>
<script setup>
import { useQuasar } from "quasar";
import { computed } from "vue";

const model = defineModel();

defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const $q = useQuasar();

const isDark = computed(() => $q.dark.isActive);

const getImg = (name) => {
  try {
    if (model.value.toLowerCase() === name) {
      return require(`../../assets/images/livestream/btn-toggle/btn-toggle-${name.toLowerCase()}-${
        isDark.value ? "dark" : "white"
      }-active.png`);
    } else {
      return require(`../../assets/images/livestream/btn-toggle/btn-toggle-${name.toLowerCase()}-${
        isDark.value ? "dark" : "white"
      }.png`);
    }
  } catch (error) {
    console.error(`Error loading image for ${name}:`, error);
    return "";
  }
};
</script>
<style lang="scss" scoped>
.top-toggle-menu {
  width: 100%;
  gap: 12px;
  // background: #ffffff;
  background: transparent;
  // box-shadow: 0px -1px 3.66px 0px #a2bff4 inset;
  box-shadow: none;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;

  :deep(.q-btn-item) {
    width: 100%;
    max-width: 83px;
    padding: 0;
    border-radius: 8px;
    background: transparent !important;

    img {
      display: block;
      width: 100%;
    }

    // white-space: nowrap;

    // &.bg-primary {
    //   border-radius: 50px;
    //   background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%) !important;
    // }
  }

  .float-stream {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.body--dark {
  .top-toggle-menu {
    width: 100%;
    padding: 0;
    // padding: 6px;
    // background: #ffffff;
    background: transparent;
    gap: 12px;
    // box-shadow: 0px -1px 3.66px 0px #a2bff4 inset;
    box-shadow: none;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    // box-shadow: 0px -1px 3.66px 0px #a2bff4 inset;

    :deep(.q-btn-item) {
      width: 100%;
      padding: 0;
      border-radius: 8px;
      background: transparent !important;

      img {
        display: block;
        width: 100%;
      }
      // white-space: nowrap;

      // &.bg-primary {
      //   border-radius: 50px;
      //   background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%) !important;
      // }
    }

    .float-stream {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
