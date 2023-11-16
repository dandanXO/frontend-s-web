<template>
  <section class="app-main">
    <Suspense>
      <router-view :key="key" />
    </Suspense>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();
    const key = () => {
      return route.path;
    };
    return {
      key
    };
  }
});
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 3rem 1rem !important;
}

.fixed-header + .app-main {
  padding-top: 80px;
  height: 100vh;
  overflow: auto;
}
</style>
