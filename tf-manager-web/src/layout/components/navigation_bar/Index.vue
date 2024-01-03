<template>
  <div class="navbar">
    <Hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <BreadCrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <div class="statistics-container">
        <select v-model="selectedSite" @change="updateData">
          <option v-for="site in statisticsList.list" :key="site.siteCode" :value="site.siteCode">{{ site.siteCode }}</option>
        </select>
      </div>
      <div v-if="selectedData" class="key-value-container">
        <div>{{ displayData(selectedData) }}</div>
      </div>
      <el-select
        class="lang-container right-menu-item"
        placeholder=""
        v-model="languageVal"
        @change="handleLanguage"
      >
        <el-option key="1" value="en">en</el-option>
        <el-option key="2" value="zh">zh</el-option>
        <el-option key="3" value="th">th</el-option>
      </el-select>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar">
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <span style="display:block;">{{ name }}</span>
            </el-dropdown-item>

            <ForgetPasswordModal :requireOld="true" @submit="changePassword">
              <el-dropdown-item divided>
                {{ $t('common.changePassword') }}
              </el-dropdown-item>
            </ForgetPasswordModal>

            <el-dropdown-item @click="goToGoogleAuth">
              {{ $t('google.google_auth_menu') }}
            </el-dropdown-item>

            <el-dropdown-item @click="logout">
              <span style="display:block;">
                {{ $t('common.logout') }}
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import BreadCrumb from '@/components/bread-crumb/Index.vue'
import Hamburger from '@/components/hamburger/Index.vue'
import ForgetPasswordModal from '@/components/forgetpassword-modal/Index.vue'

import { computed, reactive, toRefs, onMounted, ref, watch } from 'vue'
import { useStore } from '@/store'
import { AppActionTypes } from '@/store/modules/app/action-types'
import { UserActionTypes } from '@/store/modules/user/action-types'
import { storeToRefs } from 'pinia'
import { i18nStore } from '@/store/language'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getMemberStatistics } from '../../../api/member-statistics'

export default {
  components: {
    BreadCrumb,
    Hamburger,
    ForgetPasswordModal,
  },
  setup() {
    // eslint-disable-next-line
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()
    const sidebar = computed(() => {
      return store.state.app.sidebar
    })
    const device = computed(() => {
      return store.state.app.device.toString()
    })
    const siteId = computed(() => {
      return store.state.siteId
    })
    const avatar = computed(() => {
      return store.state.user.avatar
    })
    const name = computed(() => {
      return store.state.user.name
    })
    const state = reactive({
      toggleSideBar: () => {
        store.dispatch(AppActionTypes.ACTION_TOGGLE_SIDEBAR, false)
      },
      logout: async () => {
        await store.dispatch(UserActionTypes.ACTION_LOGOUT)
        location.reload()
      },
    })
    const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
    const { setLanguage } = i18nStoreLanguage

    const handleLanguage = () => {
      setLanguage(languageVal.value)
    }
    const changePassword = async formObj => {
      await store.dispatch(UserActionTypes.ACTION_UPDATE_LOGIN, formObj)
    }
    const goToGoogleAuth = () => {
      router.push({ path: '/google-auth' }).catch(err => {
        console.warn(err)
      })
    }

    const statisticsList = reactive({
      list: [],
    })

    const selectedSite = ref(null);
    const selectedData = ref(null);

    async function loadMemberStatistics() {
      const response = await getMemberStatistics();
      const { data: memberStatistics } = response;
      const parsedStatistics = JSON.parse(memberStatistics);
      statisticsList.list = Array.isArray(parsedStatistics) ? parsedStatistics : [];
      console.log(memberStatistics);
      console.log(statisticsList.list);
    }

    function updateData() {
      const selectedSiteData = statisticsList.list.find(site => site.siteCode === selectedSite.value);
      selectedData.value = selectedSiteData || null;
    }

    // 将对象转换为单行字符串
    function displayData(data) {
      if (!data) return '';
      return Object.entries(data)
        .filter(([key]) => key !== 'siteCode')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }

    onMounted(() => {
      loadMemberStatistics();
      console.log("=====>" + siteId.value)
    })

    watch(statisticsList, () => {
      if (statisticsList.list.length > 0) {
        selectedSite.value = statisticsList.list[0].siteCode;
        updateData();
      }
    });

    return {
      sidebar,
      siteId,
      device,
      avatar,
      name,
      languageVal,
      handleLanguage,
      ...toRefs(state),
      changePassword,
      goToGoogleAuth,
      statisticsList,
      selectedSite,
      selectedData,
      updateData,
      displayData,
    }
  },
}

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

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

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
        margin-top: 5px;
        margin-right: 16px;
        margin-left: 16px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
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
    .statistics-container{
      margin-top: 5px;
      right: 200px;
      position: absolute;
    }

    .key-value-container {
        margin-top: 5px;
        right: 250px;
        position: absolute;
    }

    .lang-container {
      margin-top: 5px;
      width: 100px;
      position: relative;
    }
  }
}
</style>
