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
::-webkit-scrollbar {
  width: 5px;
}
.el-form-item {
  align-items: center;
}
.el-card {
  border-radius: 20px !important;
}

.el-card__header {
  border: none !important;
}
.role-span {
  font-weight: bold;
  font-size: 30px;
}
.rightBtn {
  margin-left: 200px;
}
@media (max-width: 768px) {
  .role-span {
    font-weight: bold;
    font-size: 20px;
  }
  .inputs-wrap {
    margin: 0;
    flex-direction: column;
  }
  // .el-button {
  //   margin: 0 !important;
  // }
  .el-button + .el-button {
    // margin-left: 20px !important;
  }
  .el-form-item {
    flex-direction: column;
    align-items: flex-start !important;
    &__label {
      text-align: left;
      width: unset !important;
      color: #7D8592;
    }
    &__content {
      margin-left: 0 !important;
    }
  }
  .el-space {
    flex-direction: column;
  }
  .inputs-wrap {
    align-items: flex-start;
  }
  .navbar .avatar-container {
    display: none;
  }
  .rightBtn {
    margin-left: 0;
  }
}
</style>
