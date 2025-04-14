<template>
  <div>
    <StatsHeader />
    <Breadcrumb />
    <section class="app-main">
      <Suspense>
        <router-view :key="key" />
      </Suspense>
    </section>
  </div>
</template>

<script>
import './app.scss';
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import StatsHeader from "@/components/StatsHeader.vue";
import Breadcrumb from "@/components/bread-crumb/Index.vue";

export default defineComponent({
  components: { StatsHeader, Breadcrumb },
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
// Assuming you have multiple el-tables on your page
const elTables = document.querySelectorAll('.el-table');

elTables.forEach((elTable) => {
  // Assuming the th elements are directly inside the thead
  const thElements = elTable.querySelectorAll('thead th');

  // Loop through each th element and set data-label to the corresponding td elements
  thElements.forEach((th, index) => {
    const columnName = th.textContent.trim();
    const tdElements = elTable.querySelectorAll(`tbody td:nth-child(${index + 1})`);

    tdElements.forEach((td) => {
      td.setAttribute('data-label', columnName);
    });
  });
});
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  position: relative;
  overflow: auto;
  height: calc(100vh - 157px);
  background-color: #e4e5e6;

  &::-webkit-scrollbar-track {
    background-color: #d5d5d5;
  }

  &::-webkit-scrollbar {
    width: 3px;
    background-color: #ffffff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #999999;
  }
}

.fixed-header+.app-main {
  padding-top: 80px;
  height: 100vh;
  overflow: auto;
}
</style>

<style lang="scss">
::-webkit-scrollbar {
  //width: 5px;
  //height: 10px;
}

.el-form-item {
  align-items: center;
}

.el-card {
  // border-radius: 20px !important;
  border: none !important;
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
  .el-form-item {
    flex-direction: column;
    align-items: flex-start;
  }

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
  .el-button+.el-button {
    // margin-left: 20px !important;
  }

  .el-form-item {

    // flex-direction: column;
    // align-items: flex-start !important;
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

.el-table__empty-block {
  width: unset !important;
}

.el-empty__image {
  width: 80% !important;
  margin: auto !important;
  max-width: 300px;
}

.el-table__empty-text {
  width: 100% !important;
}

.el-form-item__content {
  width: 100%;
  line-height: normal !important;
}

.el-input__inner {
  width: 100%;
}

@media screen and (max-width: 600px) {
  table.el-responsive-table {
    border: 0;

    caption {
      font-size: 1.3em;
    }

    thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    tr {
      border-bottom: 2px solid #7fb2ff;
      display: block;
      // margin-bottom: .625em;
    }

    td {
      border-bottom: 1px solid #ddd;
      display: block;
      font-size: .8em;
      text-align: right;
      min-height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 5px;

      img {
        width: 80%;
        max-width: 200px;
      }
    }

    td::before {
      /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
      content: attr(data-label);
      float: left;
      font-weight: bold;
      text-transform: uppercase;
    }

    td:last-child {
      border-bottom: 0;
    }
  }
}

@media (max-width: 700px) {
  .el-date-range-picker {
    &__content {
      float: none !important;
      width: 100% !important;
    }

    &.has-sidebar {
      width: 400px !important;
    }

    .el-picker-panel__body {
      min-width: 290px !important;
    }
  }
}

@media (max-width: 400px) {
  .el-date-range-picker {
    .el-picker-panel__sidebar {
      width: 88px !important;

      .el-picker-panel__shortcut {
        font-size: 10px !important;
      }
    }

    .el-picker-panel [slot=sidebar]+.el-picker-panel__body,
    .el-picker-panel__sidebar+.el-picker-panel__body {
      margin-left: 88px !important;
    }

    &__content {
      padding: 8px !important;
    }

    &.has-sidebar {
      width: 320px !important;
    }

    .el-picker-panel__body {
      min-width: 232px !important;
    }

    &__header div {
      font-size: 12px !important;
    }

    .el-date-table th,
    .el-date-table__row {
      font-size: 10px !important;
    }
  }
}
</style>
