<template>
  <q-page-sticky
    position="bottom-right"
    style="position: absolute"
    class="q-px-lg"
    :offset="offset"
    v-show="showing"
  >
    <q-btn
      round
      unelevated
      text-color="black"
      icon="keyboard_arrow_down"
      class="bg-grey-2"
      size="md"
      @click="onClick"
    >
      <q-badge floating color="green" :label="count" rounded v-show="count > 0">
        <q-tooltip anchor="top middle" self="bottom middle">
          有{{ count }}条新信息
        </q-tooltip>
      </q-badge>
    </q-btn>
  </q-page-sticky>
</template>

<script>
import { defineComponent, ref, watch, computed, onBeforeUnmount } from "vue";

export default defineComponent({
  name: "ScrollToBottom",
  props: {
    target: { type: Object, required: true },
    scrollAreaInfo: { type: Object, required: true },
    scrollOffset: {
      type: Number,
      default: 1000
    },
    offset: {
      default: () => [18, 18]
    },
    count: {
      type: Number,
      default: 0
    }
  },
  emits: ["hide"],
  setup(props, { emit }) {
    let heightWatcher;

    const scrollHeight = computed(
      () =>
        props.scrollAreaInfo.verticalPosition +
        props.scrollAreaInfo.verticalContainerSize
    );

    function isVisible() {
      return (
        props.scrollAreaInfo.verticalSize - scrollHeight.value >
        props.scrollOffset
      );
    }

    const showing = ref(isVisible());

    function updateVisibility() {
      const newVal = isVisible();

      if (showing.value !== newVal) {
        showing.value = newVal;
      }

      if (!showing.value) {
        emit("hide");
      }
    }

    heightWatcher = watch(
      () => props.scrollAreaInfo.verticalPosition,
      updateVisibility
    );

    function cleanup() {
      if (heightWatcher !== void 0) {
        heightWatcher();
        heightWatcher = void 0;
      }
    }

    onBeforeUnmount(cleanup);

    return {
      showing,
      onClick() {
        const scrollAreaRef = props.scrollAreaInfo.ref;

        // 返回底部
        scrollAreaRef.setScrollPercentage("vertical", 1);
      }
    };
  }
});
</script>

<style scoped></style>
