<template>
  <nav class="sidebar expanded" style="position: relative;">
    <!-- <div class="expansionbtn" @click="toggleExpansion">
      <img class="hamburger-bars-img" src="@/assets/images/home/hamburger-bars.png" />
    </div> -->
    <div class="navigation">
      <a :href="krwUrl" target="_blank">
        <div class="logo-section" />
      </a>
      <div class="row-item">
        <el-select
          class="lang-container right-menu-item"
          placeholder=""
          v-model="languageVal"
          @change="handleLanguage"
          size="small"
        >
          <el-option key="1" value="en">en</el-option>
          <el-option key="5" value="kr">kr</el-option>
        </el-select>
      </div>
      <div class="row-item">
        <div class="name-and-logout">
          <div class="name-wrapper">
            <div class="name">{{ store.state.user.name }}</div>
            <div class="nickname">{{ store.state.user.name }}</div>
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
      <div class="row-item" style="cursor: auto">
        <div class="balance-item">
          <span>{{ t('statsHeader.myMoney') }}</span>
          <span>{{ Math.floor(affInfo.balance) }}</span>
        </div>
        <div
          class="balance-item"
          style="margin-top: 10px"
        >
          <span>{{ t('statsHeader.myPoint') }}</span>
          <span>
            <button @click="redeemDialogVisible = true"> {{ t('fields.redeemConvert') }}</button>
          </span>
          <span>{{ Math.floor(affInfo.point) }}</span>
        </div>
      </div>
      <div class="route-wrapper">
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
      </div>
      <div class="row-item route-title">
        <div class="icon-wrapper">
          <a
            :href="krwUrl"
            target="_blank"
            style="display:flex;align-items: center;gap:6px;"
          >
            <svg-icon :icon-class="'right'" />
            <span>유저사이트</span>
          </a>
        </div>
      </div>
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
                <!-- <svg-icon :icon-class="`${child.icon}`" :style="child.active ? 'color: #179cff' : ''"
                  :className="child.active ? 'active-icon' : ''" /> -->
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
  router.push('/kr/login')
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
          path: '/dashboard',
          title: t('menu.Dashboard'),
          label: 'Dashboard',
          active: false,
          isMainNav: true,
          icon: 'home',
        },
      ],
    },
    {
      title: t('menu.Downline Info'),
      label: 'Downline',
      display: true,
      path: '/downline',
      children: [
        {
          path: '/member',
          title: t('menu.Member'),
          label: 'Member',
          active: false,
          isMainNav: true,
          icon: 'squares',
        },
        // {
        //   path: '/member-tree',
        //   title: t('menu.MemberTree'),
        //   label: 'Member Tree',
        //   active: false,
        //   isMainNav: true,
        //   icon: 'branch',
        // },
        {
          path: '/affiliate',
          title: t('menu.Affiliate'),
          label: 'Affiliate',
          active: false,
          isMainNav: true,
          icon: 'affiliate',
        },
        // {
        //   path: '/summary',
        //   title: t('menu.AffiliateSummary'),
        //   label: 'Affiliate Summary',
        //   active: false,
        //   isMainNav: true,
        //   icon: 'report',
        // }
      ],
    },
    {
      title: t('menu.BetManagement'),
      label: 'Bet Management',
      display: true,
      path: '/bet-management',
      children: [
        {
          path: '/live-bet-history',
          title: t('menu.LiveBetHistory'),
          label: 'Bet History LIVE',
          active: false,
          isMainNav: true,
          icon: 'clock',
        },
        {
          path: '/slot-bet-history',
          title: t('menu.SlotBetHistory'),
          label: 'Bet History SLOT',
          active: false,
          isMainNav: true,
          icon: 'clock',
        },
        {
          path: '/sport-bet-history',
          title: t('menu.SportBetHistory'),
          label: 'Bet History SPORT',
          active: false,
          isMainNav: true,
          icon: 'clock',
        },
        {
          path: '/minigame-bet-history',
          title: t('menu.MiniGameBetHistory'),
          label: 'Bet History Mini Game',
          active: false,
          isMainNav: true,
          icon: 'clock',
        },
      ],
    },

    // {
    //   title: t('menu.SettlementManagement'),
    //   label: 'Settlement Management',
    //   display: true,
    //   path: '',
    //   children: [
    //
    //     // {
    //     //   path: '/statistics-by-member',
    //     //   title: t('menu.StatisticsByMember'),
    //     //   active: false,
    //     //   isMainNav: true,
    //     //   icon: 'clock',
    //     // },
    //     // {
    //     //   path: '/settlement-by-casino-slot-vendor',
    //     //   title: t('menu.SettlementByCasinoSlotVendor'),
    //     //   label: 'Settlement By Casino / Slot Vendor',
    //     //   active: false,
    //     //   isMainNav: true,
    //     //   icon: 'clock',
    //     // },
    //   ],
    // },
    {
      title: t('menu.financeCentre'),
      display: true,
      path: '',
      children: [
        {
          path: '/settlement-management/monthly-step-by-step-settlement',
          title: t('menu.MonthlyStepByStep'),
          label: 'Monthly Step By Step',
          active: false,
          isMainNav: true,
          icon: 'clock',
        },
        {
          path: '/settlement-management/deposit-withdraw-management',
          title: t('menu.DepositWithdrawManagement'),
          label: 'DepositWithdrawManagement',
          active: false,
          isMainNav: true,
          icon: 'clock',
        },
        {
          path: '/affiliate/bank-card',
          title: t('menu.Bind Bank Cards'),
          label: 'Bind Bank Cards',
          active: false,
          isMainNav: true,
          icon: 'money-bag',
        },
        {
          path: '/affiliate/withdraw',
          title: t('fields.affiliateWithdraw'),
          label: 'withdrawRecord',
          active: false,
          isMainNav: true,
          icon: 'form-w-pencil',
        },
        {
          path: '/affiliate/transfer',
          title: t('menu.Transfer'),
          label: 'Transfer',
          active: false,
          isMainNav: true,
          icon: 'users',
        },
        {
          path: '/affiliate/deposit',
          title: t('menu.Deposit'),
          label: 'Deposit',
          active: false,
          isMainNav: true,
          icon: 'wallet',
        },
        {
          path: '/affiliate/finance',
          title: t('menu.Finance Report'),
          label: 'Finance Report',
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
        // {
        //   path: '/rebate',
        //   title: t('menu.Rebate Report'),
        //   label: 'Rebate Report',
        //   active: false,
        //   isMainNav: true,
        //   icon: 'monitor',
        // },
        {
          path: '/settlement-management/commission-history-list',
          title: t('menu.CommissionHistoryList'),
          label: 'CommissionHistoryList',
          active: false,
          isMainNav: true,
          icon: 'clock',
        },
        {
          path: '/affiliate/credit-flow',
          title: t('fields.creditFlow'),
          label: 'creditFlow',
          active: false,
          isMainNav: true,
          icon: 'ledger',
        },
        {
          path: '/settlement-management/member-point-record-list',
          title: t('menu.MemberPointRecord'),
          label: 'MemberPointRecord',
          active: false,
          isMainNav: true,
          icon: 'clock',
        },
      ],
    },
    {
      title: t('menu.Referral Centre'),
      display: true,
      path: '/promotion',
      children: [
        {
          path: '/referral-link',
          title: t('menu.Referral Link'),
          label: 'Referral Link',
          active: false,
          isMainNav: true,
          icon: 'link',
        },
        // {
        //   path: '/referral-material',
        //   title: t('menu.Referral Material'),
        //   label: 'Referral Material',
        //   active: false,
        //   isMainNav: true,
        //   icon: 'photo',
        // },
        // {
        //   path: '/channel-pack',
        //   title: t('menu.Channel Pack'),
        //   label: 'Channel Pack',
        //   active: false,
        //   isMainNav: true,
        //   icon: 'folder',
        // },
      ],
    },
    {
      title: t('menu.Personal Center'),
      label: 'Personal Center',
      display: true,
      path: '/personal',
      children: [
        {
          path: '/info',
          title: t('fields.personalInfo'),
          label: 'personalInfo',
          active: false,
          isMainNav: true,
          icon: 'user',
        },
        {
          path: '/inquiry',
          title: t('fields.inquiry'),
          label: 'inquiry',
          active: false,
          isMainNav: true,
          icon: 'email',
        },
        {
          path: '/message',
          title: t('fields.message'),
          label: 'message',
          active: false,
          isMainNav: true,
          icon: 'message',
        },
        {
          path: '/announcement',
          title: t('fields.systemAnnouncement'),
          label: 'systemAnnouncement',
          active: false,
          isMainNav: false,
          icon: 'speaker',
        },
        {
          path: '/commission-info',
          title: t('commissionInfo.commissionInfo'),
          label: 'commissionInfo',
          active: false,
          isMainNav: true,
          icon: 'commission',
        },
        {
          path: '/contact-us',
          title: t('menu.contactUs'),
          label: 'contactUs',
          active: false,
          isMainNav: true,
          icon: 'speech-bubbles',
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
  background: #344151;
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
      display: flex;
      background: url('../../assets/logo-diamond.svg') no-repeat center center;
      background-size: 90% auto;
      width: 100%;
      height: 60px;
      padding: 6px 10px;
      background-color: #192226;
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
      border-bottom: 1px solid #4d5a6a;

      background-color: $primary-500;
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
        background-color: $primary-700;
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
