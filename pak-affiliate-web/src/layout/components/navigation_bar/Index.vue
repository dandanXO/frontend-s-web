<template>
  <div class="navbar">
    <div class="logo-container">
      <img class="logo" src="../../../assets/images/xf/logo.png" v-if="siteId === '1' || siteId === 1"> <!--XF-->
      <img class="logo" src="../../../assets/images/dy/logo.png" v-if="siteId === '6' || siteId === 6"> <!--DY-->
      <img class="logo" src="../../../assets/images/home/logo_w_text.png" v-if="siteId === '7' || siteId === 7"> <!--LH-->
      <img class="logo" src="../../../assets/images/ind/logo.png" v-if="siteId === '5' || siteId === 5"> <!--LH-->
    </div>
    <div class="right-menu">
      <el-select class="lang-container right-menu-item" placeholder="" v-model="languageVal" @change="handleLanguage">
        <el-option key="1" value="en">en</el-option>
        <el-option key="2" value="zh">zh</el-option>
        <el-option key="3" value="th">th</el-option>
        <el-option key="4" value="vi">vi</el-option>
        <el-option key="5" value="kr">kr</el-option>
        <el-option key="6" value="ur">ur</el-option>
      </el-select>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar">
          <span style="display:inline-block;"> {{ name }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <span style="display:block;"> {{ name }}</span>
            </el-dropdown-item>
            <ForgetPasswordModal :requireOld="true" @submit="changePassword">
              <el-dropdown-item divided>
                {{ $t('common.changePassword') }}
              </el-dropdown-item>
            </ForgetPasswordModal>
            <el-dropdown-item @click="logout">
              <span style="display:block;">
                {{ $t('common.logout') }}
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <svg-icon :class="'logout-btn-container'" :icon-class="'logout'" style="height: 40px;width: 40px;" :title="$t('common.logout')" @click="logout" />
    </div>
  </div>
</template>

<script>
import ForgetPasswordModal from "@/components/forgetpassword-modal/Index.vue";

import { computed, reactive, toRefs, onMounted } from "vue";
import { useStore } from "@/store";
import { AppActionTypes } from "@/store/modules/app/action-types";
import { UserActionTypes } from "@/store/modules/user/action-types";
import { storeToRefs } from "pinia";
import { i18nStore } from "@/store/language";
import { useRouter } from 'vue-router';

export default {
  components: {
    ForgetPasswordModal
  },
  setup() {
    onMounted(() => {
      handleLanguage();
    })
    const router = useRouter();
    const store = useStore();
    const sidebar = computed(() => {
      return store.state.app.sidebar;
    });
    const device = computed(() => {
      return store.state.app.device.toString();
    });
    const avatar = computed(() => {
      return store.state.user.avatar;
    });
    const name = computed(() => {
      return store.state.user.name;
    });
    const siteId = computed(() => {
      return store.state.user.siteId
    })
    const state = reactive({
      toggleSideBar: () => {
        store.dispatch(AppActionTypes.ACTION_TOGGLE_SIDEBAR, false);
      },
      logout: async () => {
        const siteIdStore = store.state.user.siteId;
        await store.dispatch(UserActionTypes.ACTION_LOGOUT);
        checkSite(siteIdStore)
      }
    });
    const checkSite = (siteId) => {
      if (siteId === "1" || siteId === 1) {
        return router.push("/xf/login")
      } else if (siteId === "3" || siteId === 3) {
        return router.push("/th/login")
      } else if (siteId === "5" || siteId === 5) {
        return router.push("/ind/login")
      } else if (siteId === "6" || siteId === 6) {
        return router.push("/dy/login")
      } else if (siteId === "7" || siteId === 7) {
        return router.push("/lh/login")
      } else if (siteId === "8" || siteId === 8) {
        return router.push("/vi/login")
      } else if (siteId === "10" || siteId === 10) {
        return router.push("/kr/login")
      } else if (siteId === "11" || siteId === 11) {
        return router.push("/pak/login")
      } else {
        return location.reload();
      }
    }
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
    const { setLanguage } = i18nStoreLanguage;

    const handleLanguage = () => {
      // Clear existing language classes from <body> element
      document.body.classList.forEach((className) => {
        if (className.endsWith('lang')) {
          document.body.classList.remove(className);
        }
      });

      // Set the new language class on <body> element
      document.body.classList.add(languageVal.value + 'lang');
      setLanguage(languageVal.value);
    }
    const changePassword = async (formObj) => {
      formObj.affId = store.state.user.id;
      formObj.siteId = store.state.user.siteId;
      await store.dispatch(UserActionTypes.ACTION_UPDATE_LOGIN, formObj);
    };
    return {
      sidebar,
      device,
      avatar,
      name,
      languageVal,
      handleLanguage,
      ...toRefs(state),
      changePassword,
      siteId
    };
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .logo-container {
    float: left;
    height: 100%;
    width: auto;
    margin-left: 2em;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    img.logo {
      height: 40px;
      width: auto;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 5px 20px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      .avatar-wrapper {
        cursor: pointer;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;
        padding: 5px 12px;
        gap: 8px;

        .user-avatar {
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 25px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .lang-container {
      width: 100px;
      position: relative;
    }

    .logout-btn-container {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.navbar {

  .lang-container,
  .avatar-container,
  .logout-btn-container {
    background: #F3F8FC;
    border-radius: 10px;
  }
}
</style>
