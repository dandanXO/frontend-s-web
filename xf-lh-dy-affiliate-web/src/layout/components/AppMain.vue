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
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 80px;
  height: 100vh;
  overflow: auto;
}
</style>

<style lang="scss">
.el-card {
  border-radius: 20px !important;
}

.el-card__header {
  border: none !important;
}
</style>
