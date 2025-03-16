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
      <notificationModule />

      <el-select
        v-if="hasRole(['ADMIN', 'MANAGER'])"
        class="right-menu-item"
        placeholder=""
        style="width: 150px;"
        v-model="selectedSite"
        @change="changeSite"
      >
        <el-option
          v-for="site in sites"
          :label="site.siteName"
          :key="site.siteCode"
          :value="site.siteCode"
        />
      </el-select>
      <div v-if="selectedData" class="key-value-container">
        <div class="flex-div">
          <div class="green-circle-dot" />
          <div class="text-2">
            {{ $t('realtimeStatistics.Mobile') }}:
            <span>{{ selectedData.Mobile ? selectedData.Mobile : 0 }}</span>
          </div>
          <div class="text-2">
            {{ $t('realtimeStatistics.PC') }}:
            <span>{{ selectedData.PC ? selectedData.PC : 0 }}</span>
          </div>
          <div class="text-2">
            <router-link
              v-if="hasPermission(['sys:withdraw:simple:list']) || hasPermission(['sys:withdraw:apply'])"
              :to="{
                path: `/withdraw/withdraw-process-simple/apply`,
                force: true,
              }"
            >
              <el-link
                :disabled="!hasPermission(['sys:withdraw:simple:list'])"
                type="primary"
              >
                {{ $t('realtimeStatistics.APPLY_WITHDRAW') }}:
                <span>{{ applyWithdrawCount }}</span>
              </el-link>
            </router-link>
          </div>
          <div class="text-2">
            <router-link
              v-if="hasPermission(['sys:withdraw:simple:list:risk'])"
              :to="{
                path: `/withdraw/withdraw-process-simple/apply-risk`,
                force: true,
              }"
            >
              <el-link
                :disabled="!hasPermission(['sys:withdraw:simple:list:risk'])"
                type="primary"
              >
                {{ $t('realtimeStatistics.APPLY_WITHDRAW_RISK') }}:
                <span>{{ applyWithdrawRiskCount }}</span>
              </el-link>
            </router-link>
          </div>
        </div>
      </div>
      <!--      <div class="key-value-container">-->
      <!--        <div class="flex-div">-->
      <!--          <div class="text-2">-->
      <!--            <span style="color: red;">{{ message }}</span>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <el-select
        class="lang-container right-menu-item"
        placeholder=""
        v-model="languageVal"
        @change="handleLanguage"
      >
        <el-option key="1" value="en">en</el-option>
        <el-option key="2" value="zh">zh</el-option>
        <el-option key="3" value="th">th</el-option>
        <el-option key="4" value="kr">kr</el-option>
        <el-option key="5" value="vn">vn</el-option>
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
import notificationModule from '@/layout/components/navigation_bar/notification-module/Index.vue'

import { computed, reactive, toRefs, onMounted, ref, watch } from 'vue'
import { useStore } from '@/store'
import { AppActionTypes } from '@/store/modules/app/action-types'
import { UserActionTypes } from '@/store/modules/user/action-types'
import { MenuActionType } from '@/store/modules/menu/action-types'
import { storeToRefs } from 'pinia'
import { i18nStore } from '@/store/language'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getMemberStatistics } from '../../../api/member-statistics'
import { hasPermission, hasRole } from "@/utils/util";
// import { showAlert } from '../../../api/member'
// import { getSiteListSimple } from '@/api/site'
/* eslint-disable */
import { updateDefaultSite, loadAuthMenu } from '../../../api/user'
import { ElMessage } from 'element-plus'
import { inject } from 'vue-demi'
import { getSiteTitle } from '../../../utils/site'
import { WebSocketActionTypes } from "@/store/modules/socket/action-types";

export default {
  methods: { hasPermission, hasRole },
  components: {
    BreadCrumb,
    Hamburger,
    ForgetPasswordModal,
    notificationModule,
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
    const sites = computed(() => {
      return store.state.user.sites.filter(site => site.id !== 9999 && site.status === true)
    })
    // const sites = ref([])
    // const loadSites = async () => {
    //   const response = await getSiteListSimple()
    //   const { data: site } = response
    //   sites.value = site
    // }
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
    let originalSiteTitle = ''

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
    const applyWithdrawCount = ref(0);
    const applyWithdrawRiskCount = ref(0);
    // const message = ref(null);

    async function loadMemberStatistics() {
      const response = await getMemberStatistics();
      const { data: memberStatistics } = response;
      const parsedStatistics = JSON.parse(memberStatistics);
      statisticsList.list = Array.isArray(parsedStatistics) ? parsedStatistics : [];
    }

    function updateData() {
      const selectedSiteData = statisticsList.list.find(
        site =>
          site.siteCode.toLowerCase() === selectedSite.value?.toLowerCase()
      )
      selectedData.value = selectedSiteData || null
    }

    function updateApplyWithdrawCount() {
      applyWithdrawCount.value = sessionStorage.getItem('WITHDRAW') || 0
      applyWithdrawRiskCount.value = sessionStorage.getItem('WITHDRAW_RISK') || 0
      updateSiteTitle()
    }

    let intervalId = null; // To store the interval ID and control blinking
    function updateSiteTitle() {
      originalSiteTitle = document.querySelector("title").innerText

      const existingCountRegex = /\(\d+\)$/;
      originalSiteTitle = originalSiteTitle.replace(existingCountRegex, "").trim();

      let blinkingTitle = originalSiteTitle + ` (${applyWithdrawCount.value})`;

      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (applyWithdrawCount.value > 0) {
        let isOriginalTitle = true;
        intervalId = setInterval(() => {
          document.title = isOriginalTitle ? blinkingTitle : originalSiteTitle;
          isOriginalTitle = !isOriginalTitle;
        }, 1000);
      } else {
        document.title = originalSiteTitle;
      }
    }

    const reload = inject('reload')
    const changeSite = async () => {
      const getSelectedSite = sites.value.find(
        site =>
          site.siteCode.toLowerCase() === selectedSite.value?.toLowerCase()
      )
      getSelectedSite.value = getSelectedSite || null

      const { data: token } = await updateDefaultSite(getSelectedSite.id)

      await store.dispatch(UserActionTypes.ACTION_UPDATE_TOKEN, token)
      await store.dispatch(
        UserActionTypes.ACTION_CHANGE_SITE_ID,
        getSelectedSite
      )

      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      document.title = getSiteTitle(getSelectedSite.id)
      ElMessage({
        message: `switch site to ` + getSelectedSite.siteName,
        type: 'success',
      })
      setTimeout(() => {
        reload()
        loadMenu()
        updateData()
      }, 500)
    }

    function mapMenuPaths(menus, parentPath = '') {
      const paths = [];
      menus.forEach(menu => {
        const fullPath = parentPath + menu.path;
        paths.push(fullPath);

        if (menu.children && menu.children.length > 0) {
            paths.push(...mapMenuPaths(menu.children, fullPath));
        }
      });
      return paths;
    }

    async function loadMenu(){
      const { data : menus } = await loadAuthMenu()
      await store.dispatch(MenuActionType.ACTION_SET_ROUTES, menus);

      const mappedPaths = mapMenuPaths(menus);
      const currentRoute = router.currentRoute.value;

      const isRouteMatched = mappedPaths.includes(currentRoute.path);
      if (!isRouteMatched) {
          router.push({ path: '/welcome' });
      }
    }

    // async function showAlertMessage() {
    //   const response = await showAlert()
    //   const { data: alert } = response;
    //   if (alert) {
    //     message.value = t('fields.' + alert)
    //   }
    // }

    onMounted(async () => {
      // 根据情况赋值sites
      // if (hasRole(['ADMIN'])) {
      //   sites.value = store.state.user.sites
      // } else if (hasRole(['MANAGER'])) {
      //   sites.value = store.state.user.sites
      // } else {
      //   sites.value = store.state.user.sites
      // }
      sites.value = store.state.user.sites
      // 根据情况指定selectedSite , 'MANAGER'
      // if (hasRole(['ADMIN'])) {
      //   selectedSite.value = sites.value[0]?.siteCode || null
      // } else {
      selectedSite.value =
        sites.value.find(site => site.id === store.state.user.siteId)
          ?.siteCode || null
      // }
      // 根据情况捞取所需的统计资料
      if (store.state.user.siteId && hasPermission(['sys:member-stats:list'])) {
        loadMemberStatistics();
        updateApplyWithdrawCount();
      } else if (hasRole(["ADMIN", "MANAGER"])) {
        loadMemberStatistics();
      }
      // if (hasPermission(['sys:member:alert'])) {
      //   showAlertMessage()
      // }
    })

    watch(statisticsList, () => {
      if (statisticsList.list.length > 0) {
        statisticsList.list.sort((a, b) => b.APPLY_WITHDRAW - a.APPLY_WITHDRAW);
      }
      updateData();
    });

    // watch(() => store.state.socket.event, () => {
    //   const memberAlertEventArr = store.state.socket.event.filter(e => e.event === 'MEMBER_ALERT');
    //   if (memberAlertEventArr.length > 0) {
    //     const alert = memberAlertEventArr[0].memberAlertMsg
    //
    //     if (alert) {
    //       message.value = t('fields.' + alert)
    //     } else {
    //       message.value = null
    //     }
    //   } else {
    //     message.value = null
    //   }
    // }, { deep: true });

    // watch(() => useStore().state.socket.event, () => {
    //   const memberStatistics = useStore().state.socket.event.filter(e => e.event === 'MEMBER_STATISTICS');
    //   if (memberStatistics.length > 0) {
    //     const parsedStatistics = JSON.parse(memberStatistics[0].statistics);
    //     statisticsList.list = Array.isArray(parsedStatistics) ? parsedStatistics : [];
    //   }
    //   updateApplyWithdrawCount();
    // }, { deep: true });

    const previousStatisticsMap = {};
    watch(() => useStore().state.socket.event, () => {
      const memberStatistics = useStore().state.socket.event.filter(e => e.event === 'MEMBER_STATISTICS');
      if (memberStatistics.length > 0) {
        const parsedStatistics = JSON.parse(memberStatistics[0].statistics);

        const siteId = String(useStore().state.user.siteId);
        const getStatisticBySiteId = parsedStatistics.find(e => String(e.siteId) === siteId);

        // Store previous data specific to each siteId
        if (!previousStatisticsMap[siteId]) {
          previousStatisticsMap[siteId] = [];
        }

        if (getStatisticBySiteId === undefined) {
          // If undefined, keep the previous statistics for this specific siteId
          statisticsList.list = previousStatisticsMap[siteId];
        } else {
          // If valid, update and store the new data for this siteId
          statisticsList.list = Array.isArray(parsedStatistics) ? parsedStatistics : [];
          previousStatisticsMap[siteId] = statisticsList.list;
        }
        updateApplyWithdrawCount();
      }
    }, { deep: true });

    return {
      sidebar,
      siteId,
      device,
      avatar,
      name,
      sites,
      languageVal,
      ...toRefs(state),
      handleLanguage,
      changePassword,
      goToGoogleAuth,
      statisticsList,
      selectedSite,
      selectedData,
      updateData,
      changeSite,
      applyWithdrawCount,
      applyWithdrawRiskCount,
      updateApplyWithdrawCount,
      // message,
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

  display:flex;
  justify-content: flex-start;

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
    margin-left:auto;
    //float: right;
    height: 100%;
    display:flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 40px;
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
        //margin-top: 5px;
        margin-right: 16px;
        margin-left: 16px;
        width:40px;
        height: 40px;
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
      display:flex;
      align-items: center;
      //margin-top: 5px;
      //right: 200px;
      //position: absolute;

      .el-select{
        line-height: 36px;
        height: 36px;
      }
    }

    .key-value-container {
      display:flex;
      align-items: center;
      justify-content: flex-start;
      gap:5px;
      margin-right: 16px;
    }

    .flex-div{
      display:flex;
      align-items: center;
      justify-content: flex-start;
      gap:10px;

      .text-1{
        font-size: 14px;
        line-height: 14px;
        margin-right: 8px;
        color: rgba(0, 0, 0, 0.45);
      }

      .text-2{
        color: rgba(0, 0, 0, 0.8);

        span{
          color: #000;
          font-weight: bold;
        }
      }
      .text-3{
        color: rgba(0, 0, 0, 0.8);

        span{
          color: #000;
          font-weight: bold;
        }
      }
    }

    .green-circle-dot{
      display:inline-block;
      width: 8px;
      height:8px;
      background: #67c23a;
      border-radius: 50%;
    }

    .lang-container {
      //margin-top: 5px;
      width: 100px;
      //position: relative;
    }
  }
}
</style>
