<template>
  <div
    class="sidebar-logo-container"
    :class="[collapse ? 'notitle' : 'collapse']"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="false"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          src="favicon.ico"
          class="sidebar-logo"
        >
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          class="sidebar-logo"
          :src="Logo"
        >
        <h1 class="sidebar-title">
          {{ siteName }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import Logo from "@/assets/images/home/logo.png";
import { useStore } from "../../../store";
import { useI18n } from "vue-i18n";

export default defineComponent({
  props: {
    collapse: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const store = useStore()
    const siteName = computed(() => store.state.user.siteName)
    const { t } = useI18n();
    const title = t('common.title');
    return {
      title,
      siteName,
      Logo
    };
  }
});
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: $menuBg;
  text-align: center;
  overflow: hidden;
  padding-top: 10px;
  padding-bottom: 10px;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & .sidebar-logo {
      display: inline-block;
      height: 150%;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #ffffff;
      font-weight: 600;
      line-height: 50px;
      font-size: 30px;
      font-family: 'Oxanium';
      vertical-align: middle;
      text-shadow: 0 0 5px #f10a0a, 0 0 5px #6bf403;
      font-style: oblique;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 12px;
    }
  }

  &.notitle {
    .sidebar-title {
      display: none;
    }

    & .sidebar-logo {
      height: 60%;
    }
  }
}
</style>
