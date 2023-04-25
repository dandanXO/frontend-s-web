<template>
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="[
      isCollapse ? 'simple-mode' : 'full-mode'
    ]"
  >
    <template
      v-if="allChildrenHidden || (!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children)"
    >
      <SidebarItemLink
        v-if="theOnlyOneChild.meta"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
        >
          <svg-icon :icon-class="theOnlyOneChild.meta.icon" />
          <span v-if="theOnlyOneChild.name">
            {{ $t('menu.' + theOnlyOneChild.name) }}</span>
          <el-tag v-if="hasTips" type="danger" effect="dark" size="mini" style="margin-left: 10px">new</el-tag>
        </el-menu-item>
      </SidebarItemLink>
    </template>
    <el-sub-menu
      v-else
      :index="resolvePath(item.path)"
    >
      <!-- popper-append-to-body -->
      <template #title>
        <svg-icon v-if="item.meta && item.meta.icon" :icon-class="item.meta.icon"
                  style="height: 32px;width: 16px;"
        />
        <span v-if="item.name">
          {{ $t('menu.' + item.name) }}
          <el-tag v-if="hasTips" type="danger" effect="dark" size="mini" style="margin-left: 10px">new</el-tag>
        </span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script>
import path from "path";
import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue";
import { isExternal } from "@/utils/validate";
import SidebarItemLink from "./SidebarItemLink.vue";
import { useStore } from "../../../store";
import moment from "moment";
import { getMemberWithdrawRecordApply, getMemberWithdrawRecordBeforePaid, getMemberWithdrawRecordPay } from "../../../api/member-withdraw-record";
import { useI18n } from "vue-i18n";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true
    },
    isCollapse: {
      type: Boolean,
      required: false
    },
    basePath: {
      type: String,
      required: true
    }
  },
  components: {
    SidebarItemLink
  },
  setup(props) {
    // eslint-disable-next-line
    const { t } = useI18n();
    const startDate = new Date();
    startDate.setDate(startDate.getDate());
    const defaultStartDate = convertDate(startDate);
    const defaultEndDate = convertDate(new Date());
    const hasTips = ref(false);
    const menu = reactive({
      upperLevelWithdraw: ['Withdrawal Management', 'Withdrawal Process'],
      withdraw: 'Applying',
      beforePaid: 'To be paid',
      payment: 'Payment on going'
    })

    const alwaysShowRootMenu = computed(() => {
      if (props.item.meta && props.item.meta.alwaysShow) {
        return true;
      } else {
        return false;
      }
    });

    // support breadcrumb from route to show trail but the inner routes are hidden / not directly navigatable
    const allChildrenHidden = computed(() => {
      if (props.item.children) {
        return props.item.children.every(child => child.meta && child.meta.hidden);
      }
      return false;
    });

    const showingChildNumber = computed(() => {
      if (props.item.children) {
        const showingChildren = props.item.children.filter((item) => {
          if (item.meta && item.meta.hidden) {
            return false;
          } else {
            return true;
          }
        });
        return showingChildren.length;
      }
      return 0;
    });

    const theOnlyOneChild = computed(() => {
      if (showingChildNumber.value > 1) {
        return null;
      }
      if (props.item.children) {
        for (const child of props.item.children) {
          if (!child.meta || !child.meta.hidden) {
            return child;
          }
        }
      }
      // If there is no children, return itself with path removed,
      // because this.basePath already contains item's path information
      return { ...props.item, path: "" };
    });

    function convertDate(date) {
      return moment(date).format('YYYY-MM-DD');
    }

    const checkQuery = () => {
      const query = {
        withdrawDate: [defaultStartDate, defaultEndDate]
      }
      query.withdrawDate = query.withdrawDate.join(',');
      return query;
    }

    const spliceSocket = (event) => {
      const socket = JSON.parse(JSON.stringify(useStore().state.socket.event));
      socket.forEach(e => {
        if (e.event === event) {
          useStore().state.socket.event.splice(useStore().state.socket.event.indexOf(e), 1);
          sessionStorage.setItem(e.event, 0);
        }
      });
    }

    const checkOutstandingWithdraw = async() => {
      const query = checkQuery();
      const { data: ret } = await getMemberWithdrawRecordApply(query);
      if (ret.records.length === 0) {
        spliceSocket('WITHDRAW');
      } else {
        sessionStorage.setItem("WITHDRAW", ret.records.length);
      }
    };

    const checkOutstandingBeforePaid = async() => {
      const query = checkQuery();
      const { data: ret } = await getMemberWithdrawRecordBeforePaid(query);
      if (ret.records.length === 0) {
        spliceSocket('BEFORE_PAID');
      } else {
        sessionStorage.setItem("BEFORE_PAID", ret.records.length);
      }
    };

    const checkOutstandingPayment = async() => {
      const query = checkQuery();
      const { data: ret } = await getMemberWithdrawRecordPay(query);
      if (ret.records.length === 0) {
        spliceSocket('PAYMENT');
      } else {
        sessionStorage.setItem("PAYMENT", ret.records.length);
      }
    };

    watch(() => useStore().state.socket.event, () => {
      const toRemove = useStore().state.socket.event.filter(e => e.event === 'REMOVE');
      if (toRemove) {
        if (toRemove.removeEvent === 'PAYMENT') {
          checkOutstandingPayment();
        } else if (toRemove.removeEvent === 'WITHDRAW') {
          checkOutstandingWithdraw();
        } else if (toRemove.removeEvent === 'BEFORE_PAID') {
          checkOutstandingBeforePaid();
        }
      }
      checkTips();
    }, { deep: true });

    const checkTips = async() => {
      if (menu.upperLevelWithdraw.includes(props.item.name)) {
        if ((sessionStorage.getItem('PAYMENT') && parseInt(sessionStorage.getItem('PAYMENT')) !== 0) ||
        (sessionStorage.getItem('WITHDRAW') && parseInt(sessionStorage.getItem('WITHDRAW')) !== 0) ||
        (sessionStorage.getItem('BEFORE_PAID') && parseInt(sessionStorage.getItem('BEFORE_PAID')) !== 0)) {
          hasTips.value = true;
        } else {
          hasTips.value = false;
        }
      } else {
        if (menu.payment === props.item.name) {
          if (sessionStorage.getItem('PAYMENT') && parseInt(sessionStorage.getItem('PAYMENT')) !== 0) {
            hasTips.value = true;
          } else {
            hasTips.value = false;
          }
        } else if (menu.withdraw === props.item.name) {
          if (sessionStorage.getItem('WITHDRAW') && parseInt(sessionStorage.getItem('WITHDRAW')) !== 0) {
            hasTips.value = true;
          } else {
            hasTips.value = false;
          }
        } else if (menu.beforePaid === props.item.name) {
          if (sessionStorage.getItem('BEFORE_PAID') && parseInt(sessionStorage.getItem('BEFORE_PAID')) !== 0) {
            hasTips.value = true;
          } else {
            hasTips.value = false;
          }
        } else {
          hasTips.value = false;
        }
      }
    }

    const resolvePath = (routePath) => {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(props.basePath)) {
        return props.basePath;
      }
      return path.resolve(props.basePath, routePath);
    };

    onMounted(async() => {
      await checkTips();
    })

    return {
      alwaysShowRootMenu,
      showingChildNumber,
      theOnlyOneChild,
      allChildrenHidden,
      resolvePath,
      hasTips
    };
  }
});
</script>

<style lang="scss" scoped>
.el-submenu.is-active > .el-submenu__title {
  color: $subMenuActiveText !important;
}

.full-mode {
  .el-submenu > .el-submenu__title,
  .el-sub-menu .el-menu-item {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg !important;

    &:hover {
      background-color: $subMenuHover !important;
    }
  }

  .el-menu-item {
    display: flex;
    align-items: center;

    & > span {
      display: inline-block;
      padding-left: 5px;
    }
  }

  .el-sub-menu {
    overflow: hidden;

    ::v-deep(.el-sub-menu__title) {
      display: flex;
      & > span {
        display: inline-block;
        padding-left: 5px;
      }
    }
  }

}

.nest-menu {
  .el-sub-menu{
    ::v-deep(.el-sub-menu__title){
      background-color: #1f2d3d!important;
    }
  }
}

svg {
  margin-right: 16px;
}

.simple-mode {
  .el-menu-item {
    display: flex;
    span {
      margin-left: 20px;
    }
  }
  ::v-deep(.el-sub-menu__title) {
    display: flex;

    & > span {
      display: inline-block;
      padding-left: 20px;
    }
  }
}
</style>
<style lang="scss">
.el-notification__content {
  text-align: left !important;
}
</style>
