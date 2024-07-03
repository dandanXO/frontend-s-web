<template>
  <nav class="sidebar" :class="isExpanded ? 'expanded' : ''" style="position: relative;">
    <el-button type="primary" class="expansionbtn" circle @click="toggleExpansion">
      <ArrowLeftBold style="width: 10px" v-if="isExpanded" />
      <ArrowRightBold style="width: 10px" v-if="!isExpanded" />
    </el-button>
    <el-button type="plain" class="mobilehamburg" @click="toggleExpansion">
      <Fold style="width: 20px" v-if="isExpanded" />
      <Expand style="width: 20px" v-if="!isExpanded" />
    </el-button>
    <div class="navigation">
      <div class="logo-section">
      </div>
      <div class="row-item">
        <div class="name-and-logout">
          <div class="name-wrapper">
            <div class="name">{{ store.state.user.name }}</div>
            <div class="nickname">{{ store.state.user.name }}</div>
          </div>
          <div class="action-wrapper">
            <svg-icon :icon-class="'lock'" />
            <svg-icon :icon-class="'logout'" :title="$t('common.logout')" @click="logout" />
          </div>
        </div>
      </div>
      <div class="row-item route-title">
        <div class="icon-wrapper">
          <svg-icon :icon-class="'right'" />
          <span>유저사이트</span>
        </div>
      </div>
      <div v-for="nav in navigationData" :key="nav.id" :class="`route-wrapper ${nav.active ? 'active' : ''}`">
        <div v-if="nav.display && isExpanded" class="route-title row-item" @click="checkMenu(nav)">
          {{ nav.title }}
          <ArrowUpBold style="width: 10px" v-if="nav.menuShown" />
          <ArrowDownBold style="width: 10px" v-if="!nav.menuShown" />
        </div>
        <div v-for="child in nav.children" :key="child.id"
          :class="`route-container ${child.active ? 'active' : ''} ${child.isMenuShow ? 'show-menu' : ''}`">
          <template v-if="(parseInt(store.state.user.siteId) === 10) ? (child.path === '/commission-info' ? false : true)
            : (child.path === '/rebate' ? false : true)">
            <RouterLink :to="nav.path + child.path" class="route" v-if="child.isMainNav">
              <div class="route-content" :style="!isExpanded && child.icon === 'speech-bubbles'
                ? 'margin-top: 50px'
                : ''
                ">
                <svg-icon :icon-class="`${child.icon}`" :style="child.active ? 'color: #179cff' : ''"
                  :className="child.active ? 'active-icon' : ''" />
                <span class="route-label" :class="child.active ? 'active' : ''" v-if="isExpanded">
                  {{ child.title }}
                </span>
              </div>
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  ArrowLeftBold,
  ArrowRightBold,
  ArrowUpBold,
  ArrowDownBold,
  Expand,
  Fold
} from '@element-plus/icons-vue'
import { UserActionTypes } from "@/store/modules/user/action-types";
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
import { useStore } from '@/store'
import { getAffiliateBalance, getAffiliateCommissionBalance, getAffiliateInfo } from '@/api/affiliate';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const navigationData = ref([]);
const mainNavigationData = [
  'Dashboard',
  'Transfer',
  'Settlement Report',
  'commissionInfo',
  'Referral Link',
  'contactUs',
  'Daily Detail',
  'Daily Summary',
]
const isExpanded = ref(true)
const store = useStore()
let affBalance = 0
let commBalance = 0

const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)

const affInfo = reactive({
  affiliateCode: null,
  affiliateLevel: null,
  downlineAffiliate: 0,
  downlineMember: 0,
  commission: 0,
  revenueShare: 0,
  shareRatio: [],
})

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
      if (c.path === currentPath) {
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
  isExpanded.value = !isExpanded.value
  if (!isExpanded.value) {
    navigationData.value.forEach(item => {
      item.children.forEach(childItem => {
        childItem.isMenuShow = false
        childItem.isMainNav = false
        mainNavigationData.forEach(matchingItem => {
          if (matchingItem === childItem.label) {
            childItem.isMainNav = true
          }
        })
      })
    })
  } else {
    navigationData.value.forEach(item => {
      item.children.forEach(childItem => {
        childItem.isMainNav = true
      })
    })
  }
}
const checkMenu = nav => {
  nav.menuShown = !nav.menuShown
  nav.children.forEach(child => {
    child.isMenuShow = !child.isMenuShow
  })
}

const logout = async () => {
  await store.dispatch(UserActionTypes.ACTION_LOGOUT);
  router.push("/kr/login");
}

const getNavigationData = () => {
  if (parseInt(store.state.user.siteId) === 5) {
    navigationData.value = [
      {
        title: t('menu.Daily Report'),
        label: 'Daily Report',
        display: false,
        path: '/report',
        children: [
          {
            path: '/daily-detail',
            title: t('menu.Daily Detail'),
            label: 'Daily Detail',
            active: false,
            isMainNav: true,
            icon: 'report',
          },
          {
            path: '/daily-summary',
            title: t('menu.Daily Summary'),
            label: 'Daily Summary',
            active: false,
            isMainNav: true,
            icon: 'report',
          },
        ],
      },
    ]
  } else {
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
          {
            path: '/affiliate',
            title: t('menu.Affiliate'),
            label: 'Affiliate',
            active: false,
            isMainNav: true,
            icon: 'affiliate',
          },
          {
            path: '/summary',
            title: t('menu.AffiliateSummary'),
            label: 'Affiliate Summary',
            active: false,
            isMainNav: true,
            icon: 'report',
          },
          {
            path: '/game-record',
            title: t('menu.Bet Record'),
            label: 'Bet Record',
            active: false,
            isMainNav: true,
            icon: 'clock',
          },
        ],
      },
      {
        title: t('menu.financeCentre'),
        display: true,
        path: '/affiliate',
        children: [
          {
            path: '/bank-card',
            title: t('menu.Bind Bank Cards'),
            label: 'Bind Bank Cards',
            active: false,
            isMainNav: true,
            icon: 'money-bag',
          },
          {
            path: '/withdraw',
            title: t('fields.affiliateWithdraw'),
            label: 'withdrawRecord',
            active: false,
            isMainNav: true,
            icon: 'form-w-pencil',
          },
          {
            path: '/transfer',
            title: t('menu.Transfer'),
            label: 'Transfer',
            active: false,
            isMainNav: true,
            icon: 'users',
          },
          {
            path: '/deposit',
            title: t('menu.Deposit'),
            label: 'Deposit',
            active: false,
            isMainNav: true,
            icon: 'wallet',
          },
          {
            path: '/finance',
            title: t('menu.Finance Report'),
            label: 'Finance Report',
            active: false,
            isMainNav: true,
            icon: 'report',
          },
          {
            path: '/settlement',
            title: t('menu.Settlement Report'),
            label: 'Settlement Report',
            active: false,
            isMainNav: true,
            icon: 'money',
          },
          {
            path: '/rebate',
            title: t('menu.Rebate Report'),
            label: 'Rebate Report',
            active: false,
            isMainNav: true,
            icon: 'monitor',
          },
          {
            path: '/credit-flow',
            title: t('fields.creditFlow'),
            label: 'creditFlow',
            active: false,
            isMainNav: true,
            icon: 'ledger',
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
          {
            path: '/referral-material',
            title: t('menu.Referral Material'),
            label: 'Referral Material',
            active: false,
            isMainNav: true,
            icon: 'photo',
          },
          {
            path: '/channel-pack',
            title: t('menu.Channel Pack'),
            label: 'Channel Pack',
            active: false,
            isMainNav: true,
            icon: 'folder',
          },
        ],
      },
      {
        title: t('menu.Personal Center'),
        label: 'Personal Center',
        display: true,
        path: '/personal',
        children: [
          {
            path: '',
            title: t('fields.personalInfo'),
            label: 'personalInfo',
            active: false,
            isMainNav: true,
            icon: 'user',
          },
          {
            path: '/announcement',
            title: t('fields.systemAnnouncement'),
            label: 'systemAnnouncement',
            active: false,
            isMainNav: true,
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
}
onMounted(async () => {
  if (window.innerWidth < 768) {
    isExpanded.value = false
  } else {
    isExpanded.value = true
  }
  watch(
    () => route.path,
    async () => {
      setActiveNav()
      if (isExpanded.value && window.innerWidth < 768) {
        toggleExpansion()
      }
    }
  )

  getNavigationData()

  setActiveNav()
  if (parseInt(store.state.user.siteId) === 10) {
    const { data: affBal } = await getAffiliateBalance(store.state.user.id);
    affBalance = affBal
    const { data: commBal } = await getAffiliateCommissionBalance(store.state.user.id);
    commBalance = commBal
    const { data: aff } = await getAffiliateInfo(store.state.user.id)
    Object.keys({ ...aff }).forEach(field => {
      affInfo[field] = aff[field]
    })
  }
})

watch(languageVal, newVal => {
  getNavigationData()
  setActiveNav()
})
</script>

<style scoped lang="scss">
.sidebar {
  background: #344151;
  display: flex;
  flex-direction: column;
  line-height: 1rem;


  &.expanded {
    width: 100%;
    max-width: 200px;

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

  .expansionbtn {
    position: absolute;
    right: -10px;
    width: 30px;
    min-height: 30px;
    padding: 5px;
    top: -10px;
  }

  .mobilehamburg {
    display: none;
    position: fixed;
    left: 10px;
    top: 10px;
    padding: 0;
    border: 0;
    margin-left: 0;

    &:hover,
    &:focus {
      background: unset;
    }
  }

  .navigation {
    color: #fff;
    font-size: 1rem;

    .logo-section {
      display: flex;
      background: url('../../assets/images/kr/kr-logo-long.png') no-repeat center center;
      background-size: contain;
      width: 100%;
      height: 60px;
      background-color: #192226;
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #ffffff;
    }

    &::-webkit-scrollbar {
      width: 5px;
      background-color: #ffffff;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #98c0fc;
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

      background-color: #344151;
      padding: 12px 13px;
      box-sizing: border-box;
      cursor: pointer;
      position: relative;

      .icon-wrapper {
        display: flex;
        gap: 10px;
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
          color: #b7b1b5;
          font-size: 10px;
        }
      }

      .action-wrapper {
        display: flex;
        gap: 10px;

        >div {
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
        background-color: #252e3b;
        padding: 10px 10px 10px 20px;
      }

      &:last-child .route-title {
        border: none;
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

@media (max-width: 992px) {
  .sidebar {
    .expansionbtn {
      right: -35px;
      top: -35px;
      display: none;
    }

    .mobilehamburg {
      display: block;
    }
  }

  .navbar .avatar-container {
    display: none;
  }
}
</style>
