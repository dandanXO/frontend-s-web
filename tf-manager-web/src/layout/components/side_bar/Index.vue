<template>
  <div
    class="sideWrap has-logo"
  >
    <SidebarLogo
      :collapse="isCollapse"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        v-if="isMounted"
        :collapse="isCollapse"
        :unique-opened="false"
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        mode="vertical"
      >
        <SidebarItem
          :is-collapse="isCollapse"
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'
import variables from '@/styles/_variables.scss'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { getMemberWithdrawRecordApplySimple, getMemberWithdrawRecordApply, getMemberWithdrawRecordBeforePaid, getMemberWithdrawRecordPay } from '../../../api/member-withdraw-record'
import moment from 'moment'
import { hasPermission } from '../../../utils/util'

export default defineComponent({
  components: {
    SidebarItem,
    SidebarLogo
  },
  setup() {
    const isMounted = ref(false);
    const startDate = new Date();
    startDate.setDate(startDate.getDate());
    const defaultStartDate = convertStartDate(startDate);
    const defaultEndDate = convertEndDate(new Date());
    const store = useStore()
    const route = useRoute()
    const sidebar = computed(() => {
      return store.state.app.sidebar
    })
    const routes = computed(() => {
      return store.state.menu.routes
    })

    const activeMenu = computed(() => {
      const { meta, path } = route
      if (meta !== null || meta !== undefined) {
        if (meta.activeMenu) {
          return meta.activeMenu
        }
      }
      return path
    })

    const isCollapse = computed(() => {
      return !sidebar.value.opened
    })

    function convertStartDate(date) {
      return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    }

    function convertEndDate(date) {
      return moment(date).format('YYYY-MM-DD') + ' 23:59:59'
    }

    const checkQuery = () => {
      const query = {
        withdrawDate: [defaultStartDate, defaultEndDate]
      }
      query.withdrawDate = query.withdrawDate.join(',');
      query.memberType = "NORMAL,TEST,OUTSIDE";
      return query;
    }

    const spliceSocket = (event) => {
      const socket = JSON.parse(JSON.stringify(useStore().state.socket.event));
      socket.forEach(e => {
        if (e.event === event) {
          useStore().state.socket.event.splice(useStore().state.socket.event.indexOf(e), 1);
        }
      });
    }

    const checkOutstandingWithdraw = async() => {
      const query = checkQuery();
      const { data: ret } = await getMemberWithdrawRecordApply(query);
      sessionStorage.setItem("WITHDRAW", ret.total);
    };

    const checkOutstandingAutoWithdraw = async() => {
      const query = checkQuery();
      const { data: ret } = await getMemberWithdrawRecordApplySimple(query);
      sessionStorage.setItem("WITHDRAW", ret.total);
      // if (ret.records.length === 0) {
      //   spliceSocket('WITHDRAW');
      //   sessionStorage.setItem("WITHDRAW", 0);
      // } else {
      //   sessionStorage.setItem("WITHDRAW", ret.records.length);
      // }
    };

    const checkOutstandingBeforePaid = async() => {
      const query = checkQuery();
      const { data: ret } = await getMemberWithdrawRecordBeforePaid(query);
      if (ret.records.length === 0) {
        spliceSocket('BEFORE_PAID');
        sessionStorage.setItem("BEFORE_PAID", 0);
      } else {
        sessionStorage.setItem("BEFORE_PAID", ret.records.length);
      }
    };

    const checkOutstandingPayment = async() => {
      const query = checkQuery();
      const { data: ret } = await getMemberWithdrawRecordPay(query);
      if (ret.records.length === 0) {
        spliceSocket('PAYMENT');
        sessionStorage.setItem("PAYMENT", 0);
      } else {
        sessionStorage.setItem("PAYMENT", ret.records.length);
      }
    };

    onMounted(async() => {
      if (!hasPermission(["sys:withdraw:apply"]) && hasPermission(["sys:withdraw:simple:list"])) {
        await checkOutstandingAutoWithdraw();
      }
      if (hasPermission(["sys:withdraw:apply"])) {
        await checkOutstandingWithdraw();
      }
      if (hasPermission(["sys:withdraw:before-paid"])) {
        await checkOutstandingBeforePaid();
      }
      if (hasPermission(["sys:withdraw:pay"])) {
        await checkOutstandingPayment();
      }
      isMounted.value = true;
    });

    // within variables only have those used in the component, what hpn to the other
    return {
      sidebar,
      routes,
      variables,
      activeMenu,
      isCollapse,
      isMounted
    }
  }
})
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}

.has-logo {
  .el-scrollbar {
    height: calc(100vh - 100px);
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
