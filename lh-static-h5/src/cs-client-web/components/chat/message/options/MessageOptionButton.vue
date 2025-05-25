<template>
  <div :style="{ maxWidth: items.length > 1 ? '512px' : '100%' }" v-if="items.length">
    <Carousel
      :itemsToShow="itemsToShow"
      :itemsToScroll="itemsToScroll"
      :touchDrag="false"
      :mouseDrag="false"
      snapAlign="start"
    >
      <Slide v-for="(item, index) in items" :key="index">
        <option-button :index="index + 1" :show-num="showNum" :item="item" @on-click="onClick" />
      </Slide>

      <template #addons>
        <Navigation v-if="showNavigator" />
      </template>
    </Carousel>
  </div>
  <div v-else>
    <p>No record found</p>
  </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, computed, onMounted } from "vue";
import OptionButton from "src/cs-client-web/components/chat/message/options/OptionButton";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

export default defineComponent({
  name: "MessageOptionButton",
  components: { OptionButton, Carousel, Navigation, Slide },
  props: {
    message: { type: Object, required: true }
  },
  emits: ["select"],
  setup(props, { emit }) {
    const onClick = (item) => {
      emit("select", item);
    };

    const items = computed(() => {
      return props.message.meta?.items ?? [];
    });

    const showNavigator = computed(() => {
      return items.value.length > 2;
    });

    const itemsToShow = computed(() => {
      if (items.value.length >= 2) {
        return 2;
      }

      return 1;
    });

    const itemsToScroll = computed(() => {
      if (items.value.length >= 2) {
        return 2;
      }

      return 1;
    });

    const showNum = computed(() => {
      return items.value.length > 1;
    });

    onMounted(() => {
      //
    });

    return {
      items,
      itemsToShow,
      itemsToScroll,
      showNavigator,
      showNum,
      onClick
    };
  }
});
</script>

<style>
.carousel__item {
  width: 100%;
}

.carousel__slide {
  text-align: left;
  padding-right: 5px;
}

.carousel__slide:last-child {
  padding-right: 0px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 2px solid white;
}

.carousel__prev--in-active,
.carousel__next--in-active {
  display: none;
}
</style>
