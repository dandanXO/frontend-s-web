<template>
  <q-btn-toggle v-model="model" class="top-toggle-menu" no-caps :options="categories" :style="aspectRatio">
    <template v-slot:popular>
      <img :src="getImg('popular')" />
    </template>
    <template v-slot:streamer>
      <img :src="getImg('streamer')" />
      <span>主播</span>
    </template>
    <template v-slot:esport>
      <img :src="getImg('esport')" />
      <span>电竞</span>
    </template>
    <template v-slot:football>
      <img :src="getImg('football')" />
      <span>足球</span>
    </template>
    <template v-slot:basketball>
      <img :src="getImg('basketball')" />
      <span>篮球</span>
    </template>
  </q-btn-toggle>
</template>
<script setup>
import { useQuasar } from "quasar";
import { computed } from "vue";

const model = defineModel();

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const $q = useQuasar();

const isDark = computed(() => $q.dark.isActive);

const aspectRatio = computed(() => {
  const length = props.categories.length;
  let ratio;
  switch (length) {
    case 3:
      ratio = "107 / 40";
      break;
    case 4:
    default:
      ratio = "83 / 40";
  }
  return "--category-aspect-ratio: " + ratio;
});

const getImg = (name) => {
  try {
    if (model.value.toLowerCase() === name) {
      return require(`../../assets/images/livestream/btn-toggle/icon-${name.toLowerCase()}${
        isDark.value ? "-dark" : ""
      }-active.png`);
    } else {
      return require(`../../assets/images/livestream/btn-toggle/icon-${name.toLowerCase()}${
        isDark.value ? "-dark" : ""
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
  gap: 0.6rem;
  // background: #ffffff;
  background: #f0f7ff;
  // box-shadow: 0px -1px 3.66px 0px #a2bff4 inset;
  box-shadow: 0px 2px 4.58px 0px #bbdcff inset, 0px -1px 3.66px 0px #a2bff4 inset;
  padding: 6px;
  border-radius: 100px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;

  :deep(.q-btn-item) {
    width: 100%;
    padding: 0;
    border-radius: 8px;
    background: transparent !important;
    aspect-ratio: var(--category-aspect-ratio);

    &[aria-pressed="true"] {
      background: url(../../assets/images/livestream/btn-toggle/category-active-bg.png) no-repeat !important;
      background-size: 100% 100% !important;

      .q-btn__content {
        color: #fff;
      }
    }

    .q-btn__content {
      flex-direction: row;
      align-items: center;
      gap: 4px;
      font-size: 1rem;
      color: #7a899e;

      img {
        width: 1.4rem;
        max-width: 20px;
      }
    }
  }

  .float-stream {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.body--dark {
  .top-toggle-menu {
    background: #2d4065;
    border: 1px solid #be945733;
    box-shadow: 2px 4px 10px 0px #00194b52, 0px 4px 4px 0px #ffffff12 inset, 0px -3px 4px 0px #ffffff12 inset;

    :deep(.q-btn-item) {
      &[aria-pressed="true"] {
        background: url(../../assets/images/livestream/btn-toggle/category-active-bg-dark.png) no-repeat !important;
        background-size: 100% 100% !important;

        .q-btn__content {
          color: #fff;
        }
      }

      .q-btn__content {
        color: #98a7b5;
      }
    }

    .float-stream {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
