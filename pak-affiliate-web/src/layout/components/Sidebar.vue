<template>
  <nav class="sidebar expanded" style="position: relative;">
    <!-- <div class="expansionbtn" @click="toggleExpansion">
      <img class="hamburger-bars-img" src="@/assets/images/home/hamburger-bars.png" />
    </div> -->
    <div class="navigation">
      <!-- <a :href="krwUrl" target="_blank"> -->
        <div class="logo-section">
          <h1>
            代理人
          </h1>
        </div>
      <!-- </a> -->
      <div class="row-item">
        <el-select
          class="lang-container right-menu-item"
          placeholder=""
          v-model="languageVal"
          @change="handleLanguage"
          size="small"
        >
          <el-option key="1" value="en">en</el-option>
          <el-option key="6" value="ur">ur</el-option>
        </el-select>
      </div>
      <div class="row-item">
        <div class="name-and-logout">
          <div class="name-wrapper">
            <div class="name">{{ store.state.user.name }}</div>
            <!-- <div class="nickname">{{ store.state.user.name }}</div> -->
            <div class="nickname">{{ affInfo.affiliateCode }}</div>
          </div>
          <div class="action-wrapper">
            <ForgetPasswordModal :requireOld="true" @submit="changePassword">
              <svg-icon :icon-class="'lock'" />
            </ForgetPasswordModal>
            <svg-icon
              :icon-class="'logout'"
              :title="$t('common.logout')"
              @click="logout"
            />
          </div>
        </div>
      </div>
      <!-- <div class="route-wrapper">
        <div :class="`route-container show-menu ${route.path.substring(route.path.lastIndexOf('/'))==='/announcement' ? 'active' : ''}`">
          <RouterLink to="/personal/announcement" class="route">
            <div class="route-content">
              <el-badge :value="affInfo.unreadCount" v-show="affInfo.unreadCount != 0">
                <span class="route-label" style="margin-right: 5px">
                  {{ t('fields.systemAnnouncement') }}
                </span>
              </el-badge>
              <span class="route-label" v-show="affInfo.unreadCount == 0">
                {{ t('fields.systemAnnouncement') }}
              </span>
            </div>
          </RouterLink>
        </div>
      </div> -->
      <div
        v-for="nav in navigationData"
        :key="nav.id"
        :class="`route-wrapper ${nav.active ? 'active' : ''}`"
      >
        <div
          v-if="nav.display"
          class="route-title row-item"
          @click="checkMenu(nav)"
        >
          {{ nav.title }}
          <ArrowUpBold style="width: 10px" v-if="nav.menuShown" />
          <ArrowDownBold style="width: 10px" v-if="!nav.menuShown" />
        </div>
        <div
          v-for="child in nav.children"
          :key="child.id"
          :class="
            `route-container ${child.active ? 'active' : ''} ${
              nav.menuShown ? 'show-menu' : ''
            }`
          "
        >
          <template v-if="child.path === '/commission-info' ? false : true">
            <RouterLink
              :to="nav.path + child.path"
              class="route"
              v-if="child.isMainNav"
            >
              <div class="route-content">
                <svg-icon :icon-class="`${child.icon}`" :style="child.active ? 'color: #179cff' : ''"
                  :className="child.active ? 'active-icon' : ''" />
                <span class="route-label" :class="child.active ? 'active' : ''">
                  {{ child.title }}
                </span>
              </div>
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <el-dialog
    :title="t('fields.redeemPoint')"
    v-model="redeemDialogVisible"
    width="580px"
    append-to-body
  >
    <p>
      {{ t('message.yourCurrentPoint') }}
      <b>{{ affInfo.point }}</b>
    </p>
    <p>{{ t('message.confirmRedeem') }}</p>

    <div class="redeemDialogActionButtons">
      <el-button size="normal" @click="redeemDialogVisible = false">
        {{ $t('fields.cancel') }}
      </el-button>
      <el-button
        size="normal"
        type="primary"
        @click="onRedeem"
        :disabled="affInfo.point <= 0"
      >
        {{ $t('fields.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import $ from 'jquery'
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
import { UserActionTypes } from '@/store/modules/user/action-types'
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
import { useStore } from '@/store'
import {
  getAffiliateBalance,
  getAffiliatePoint,
  getAffiliateInfo,
  redeemPoint,
} from '@/api/affiliate'
import { ElMessage } from 'element-plus'
import ForgetPasswordModal from '@/components/forgetpassword-modal/Index.vue'
import { getUnreadAnnouncementCount } from '@/api/affiliate-announcement'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const navigationData = ref([])
const redeemDialogVisible = ref(false)

const store = useStore()

const krwUrl = ref('https://dia.game')

const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)
const { setLanguage } = i18nStoreLanguage

const affInfo = reactive({
  affiliateCode: null,
  affiliateLevel: null,
  downlineAffiliate: 0,
  downlineMember: 0,
  commission: 0,
  revenueShare: 0,
  shareRatio: [],
  balance: 0,
  point: 0,
  unreadCount: 0,
})

const handleLanguage = () => {
  setLanguage(languageVal.value)
}

const setActiveNav = () => {
  const currentPath = route.path.substring(route.path.lastIndexOf('/'))
  navigationData.value.forEach(e => {
    e.menuShown = true
    e.children.forEach(c => {
      // due to the usage of <use> mechanism and svg-sprite-loader
      // referred icon is out of component scope
      // thus unable to style within component directly
      const iconEl = document.querySelector(`symbol#icon-${c.icon} > path`)
      const activeIconColor = '#f2c46f'
      const defaultIconColor = '#1e95ba'
      c.isMenuShow = true

      if (c.path === currentPath || c.path.endsWith(currentPath)) {
        c.active = true
        iconEl.style.fill = activeIconColor
      } else {
        c.active = false
        iconEl.style.fill = defaultIconColor
      }
    })
  })
}

const toggleExpansion = () => {
  if ($('.navigation').width()) {
    $('.navigation').animate({ width: 0 })
  } else {
    $('.navigation').animate({ width: 200 })
  }
}
const checkMenu = nav => {
  nav.menuShown = !nav.menuShown
  nav.children.forEach(child => {
    child.isMenuShow = !child.isMenuShow
  })
}

const changePassword = async formObj => {
  formObj.affId = store.state.user.id
  formObj.siteId = store.state.user.siteId
  await store.dispatch(UserActionTypes.ACTION_UPDATE_LOGIN, formObj)
}

const logout = async () => {
  await store.dispatch(UserActionTypes.ACTION_LOGOUT)
  router.push('/login')
}

const getNavigationData = () => {
  navigationData.value = [
    {
      title: t('menu.Dashboard'),
      label: 'Dashboard',
      display: false,
      path: '',
      children: [
        {
          path: '/personal/announcement',
          title: t('fields.systemAnnouncement'),
          label: 'systemAnnouncement',
          active: false,
          isMainNav: true,
          icon: 'speaker',
        },
        {
          path: '/dashboard',
          title: t('menu.Dashboard'),
          label: 'Dashboard',
          active: false,
          isMainNav: true,
          icon: 'home',
        },
        {
          path: '/downline/member',
          title: t('menu.Member'),
          label: 'Member',
          active: false,
          isMainNav: true,
          icon: 'squares',
        },
        {
          path: '/downline/affiliate',
          title: t('menu.Affiliate'),
          label: 'Affiliate',
          active: false,
          isMainNav: true,
          icon: 'affiliate',
        },
        {
          path: '/downline/game-record',
          title: t('menu.gameRecord'),
          label: 'Bet History',
          active: false,
          isMainNav: true,
          icon: 'clock',
        },
        {
          path: '/report/platform-summary',
          title: t('menu.platformSummary'),
          label: 'Platform Summary',
          active: false,
          isMainNav: true,
          icon: 'report',
        },
        {
          path: '/report/downline-summary',
          title: t('menu.downlineSummary'),
          label: 'Downline Summary',
          active: false,
          isMainNav: true,
          icon: 'report',
        },
        {
          path: '/affiliate/settlement',
          title: t('menu.Settlement Report'),
          label: 'Settlement Report',
          active: false,
          isMainNav: true,
          icon: 'money',
        },
        {
          path: '/personal/info',
          title: t('fields.personalInfo'),
          label: 'personalInfo',
          active: false,
          isMainNav: true,
          icon: 'user',
        },
      ],
    },
  ]
}
const onRedeem = async () => {
  await redeemPoint()
  ElMessage({ message: t('message.redeemSuccess'), type: 'success' })
  redeemDialogVisible.value = false
  const { data: affBal } = await getAffiliateBalance(store.state.user.id)
  affInfo.balance = affBal
  const { data: affPoint } = await getAffiliatePoint()
  affInfo.point = affPoint
}
onMounted(async () => {
  if (window.innerWidth < 768) {
    $('.navigation').animate({ width: 0 })
  } else {
    $('.navigation').animate({ width: 200 })
  }

  watch(
    () => route.path,
    async () => {
      setActiveNav()
      if (window.innerWidth < 768) {
        toggleExpansion()
      }
    }
  )

  getNavigationData()

  setActiveNav()

  const { data: affBal } = await getAffiliateBalance(store.state.user.id)
  affInfo.balance = affBal
  const { data: affPoint } = await getAffiliatePoint()
  affInfo.point = affPoint
  const { data: aff } = await getAffiliateInfo(store.state.user.id)
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field]
  })
  getUnreadAnnouncement()
})

const getUnreadAnnouncement = async() => {
  const { data: count } = await getUnreadAnnouncementCount(store.state.user.id)
  affInfo.unreadCount = count;
}

watch(languageVal, newVal => {
  getNavigationData()
  setActiveNav()
})
</script>

<style scoped lang="scss">
.expansionbtn {
  position: absolute;
  right: -35px;
  top: 30px;
  width: 30px;
  min-height: 30px;
  padding: 5px;
  z-index: 1;

  .hamburger-bars-img {
    aspect-ratio: 448 / 512;
    width: 20px;
  }
}

.sidebar {
  background: #000000;
  display: flex;
  flex-direction: column;
  line-height: 1rem;
  height: 100vh;

  .navigation {
    color: #fff;
    font-size: 1rem;
    overflow-y: auto;
    max-height: 100vh;
    width: 0px;

    .logo-section {
      background-size: 90% auto;
      width: 100%;
      height: 60px;
      padding: 6px 10px;
      background-color: #000000;
      text-align: center;
    }

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

    .route-title {
      padding: 12px 13px;
      display: flex;
      justify-content: space-between;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    }

    .row-item {
      font-family: 'NanumNeo';
      color: #fff;
      font-size: 13px;
      border-bottom: 1px solid #000000;

      background-color: #000000;
      padding: 12px 13px;
      box-sizing: border-box;
      cursor: pointer;
      position: relative;

      .icon-wrapper {
        display: flex;
        gap: 10px;
      }

      .balance-item {
        display: flex;
        justify-content: space-between;
        font-family: 'Jura';
      }
    }

    .name-and-logout {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name-wrapper {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .nickname {
          color: #fff;
          font-size: 10px;
        }
      }

      .action-wrapper {
        display: flex;
        gap: 10px;

        > div {
          align-items: center;
        }
      }
    }

    .route-wrapper {
      .route {
        color: #fff;
        text-decoration: none;
        font-size: 13px;
      }

      .route-content {
        display: flex;
        gap: 0.5rem;
        background-color: #000000;
        padding: 10px 10px 10px 20px;
      }

      &:last-child .route-title {
        border: none;
      }
    }
  }

  &.expanded {
    width: 100%;
    max-width: 200px;

    .navigation {
      width: 200px;
    }

    .route-wrapper {
      .route-content {
        display: flex;
        gap: 0.5rem;

        .route-label {
          font-family: 'NanumNeo';
        }
      }
    }
  }

  .route-container {
    height: 0px;
    overflow: hidden;

    &.show-menu {
      height: auto;
    }
  }

  .route-container.active .route-content {
    color: #f2c46f;
  }

  .mini-profile {
    padding: 12px 13px;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .name {
      display: flex;
      justify-content: center;
      background: lightgrey;
      padding: 5px;
      border-radius: 0.5rem;
      margin-bottom: 10px;
    }

    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;

      .key {
        text-align: left;
      }

      .value {
        text-align: right;
      }
    }
  }
}

.redeemDialogActionButtons {
  display: flex;
  justify-content: flex-end;
}
</style>
