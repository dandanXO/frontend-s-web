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
          <!-- <el-tag v-if="showTips(theOnlyOneChild.name)" type="danger" effect="dark" size="mini" style="margin-left: 10px">new</el-tag> -->
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
          {{ $t('menu.' + item.name) }}</span>
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
import { computed, defineComponent } from "vue";
import { isExternal } from "@/utils/validate";
import SidebarItemLink from "./SidebarItemLink.vue";
// import { showTips } from "../../../utils/util";
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

    const resolvePath = (routePath) => {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(props.basePath)) {
        return props.basePath;
      }
      return path.resolve(props.basePath, routePath);
    };

    return {
      alwaysShowRootMenu,
      showingChildNumber,
      theOnlyOneChild,
      allChildrenHidden,
      // showTips,
      resolvePath
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
