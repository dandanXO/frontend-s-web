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
.el-dialog {
  border-radius: 20px !important;
  &__header {
    margin: 0 20px;
    border-bottom: 1px solid #eeeeee;
  }
  &__title {
    color: #0A1629;
    font-family: PFBold;
  }
}
.el-dialog__headerbtn .el-dialog__close {
  font-size: 25px;
}
.el-button {
  border-radius: 10px;
  box-shadow: 0px 6px 58px 0px #C4CBD61A;
}

@media screen and (max-width: 600px) {
  table {
    border: 0;
  }
  table caption {
    font-size: 1.3em;
  }
  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: .625em;
  }
  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: .8em;
    text-align: right;
  }
  table td::before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }
  table td:last-child {
    border-bottom: 0;
  }
}

</style>
