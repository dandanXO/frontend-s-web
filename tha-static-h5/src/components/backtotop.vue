<template>
  <q-page-sticky
    position="bottom-right"
    :offset="[18, 18]"
    style="transform: none"
  >
    <q-btn
      class="back-to-top-btn"
      padding="sm"
      @click="scrollToTop"
      fab
      icon="keyboard_arrow_up"
    />
  </q-page-sticky>
</template>
<script>
import { useUI } from "stores/ui";
import { defineComponent } from "vue";

export default defineComponent({
  name: "BackToTopComponent",
  setup() {
    const ui = useUI();
    const scrollToTop = () => {
      ui.setScrollPosition("vertical", 0, 250);
    };
    return {
      scrollToTop,
      ui
    };
  }
});
</script>
<style lang="scss" >
.back-to-top-btn {
  border: 3px solid #D92515;
  color: #D92515;
}
</style>