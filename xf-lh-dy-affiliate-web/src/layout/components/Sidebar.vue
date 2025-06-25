<template>
  <nav
    class="sidebar"
    :class="isExpanded ? 'expanded' : ''"
    style="position: relative;"
  >
    <el-button
      type="primary"
      class="expansionbtn"
      circle
      @click="toggleExpansion"
    >
      <ArrowLeftBold style="width: 10px" v-if="isExpanded" />
      <ArrowRightBold style="width: 10px" v-if="!isExpanded" />
    </el-button>
    <el-button type="plain" class="mobilehamburg" @click="toggleExpansion">
      <Fold style="width: 20px" v-if="isExpanded" />
      <Expand style="width: 20px" v-if="!isExpanded" />
    </el-button>
    <div class="navigation">
      <div class="mini-profile" v-if="(parseInt(store.state.user.siteId) === 10) && isExpanded">
        <div class="name">
          <svg-icon
            icon-class="user"
            style="margin-right: 5px"
          />
          {{ store.state.user.name }}
        </div>
        <el-row justify="space-between">
          <el-col :span="6"> {{ t('fields.recommenderCode') }} </el-col>
          <el-col :span="6" style="flex: none"> {{ affInfo.affiliateCode }} </el-col>
        </el-row>
        <el-row justify="space-between">
          <el-col :span="8"> {{ t('fields.rebateWallet') }} </el-col>
          <el-col :span="4" style="flex: none"> {{ affBalance }} </el-col>
        </el-row>
        <el-row justify="space-between">
          <el-col :span="6"> {{ t('fields.commissionWallet') }} </el-col>
          <el-col :span="6" style="flex: none"> {{ commBalance }} </el-col>
        </el-row>
      </div>
      <RouterLink to="/affiliate/withdraw" class="route" v-if="(parseInt(store.state.user.siteId) === 10) && isExpanded">
        <div class="route-content">
          <svg-icon
            icon-class="money-bag"
          />
          <span style="color:grey">
            {{ t('fields.affiliateWithdraw') }}
          </span>
        </div>
      </RouterLink>
      <div
        v-for="nav in navigationData"
        :key="nav.id"
        :class="`route-wrapper ${nav.active ? 'active' : ''}`"
      >
        <div
          v-if="nav.display && isExpanded"
          class="route-title"
          @click="checkMenu(nav)"
        >
          {{ nav.title }}
          <ArrowUpBold style="width: 10px" v-if="nav.menuShown" />
          <ArrowDownBold style="width: 10px" v-if="!nav.menuShown" />
        </div>
        <div
          v-for="child in nav.children"
          :key="child.id"
          :class="`route-container ${child.active ? 'active' : ''}`"
          :style="
            child.isMenuShow ? 'height: auto;' : 'height: 0px; overflow:hidden'
          "
        >
          <template
            v-if="(parseInt(store.state.user.siteId) === 10)
              ? (child.path === '/commission-info' ? false : true)
              : (child.path === '/rebate' ? false : true)
            "
          >
            <RouterLink
              :to="nav.path + child.path"
              class="route"
              v-if="child.isMainNav"
            >
              <div
                class="route-content"
                :style="
                  !isExpanded && child.icon === 'speech-bubbles'
                    ? 'margin-top: 50px'
                    : ''
                "
              >
                <svg-icon
                  :icon-class="`${child.icon}`"
                  :style="child.active ? 'color: #179cff' : ''"
                  :className="child.active ? 'active-icon' : ''"
                />
                <span :class="child.active ? 'active' : ''" v-if="isExpanded">
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
  Fold,
} from '@element-plus/icons-vue'
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
import { useStore } from '@/store'
import { getAffiliateBalance, getAffiliateCommissionBalance, getAffiliateInfo } from '@/api/affiliate';

const { t } = useI18n()
const route = useRoute()
const navigationData = ref([])
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
      const activeIconColor = '#3f8cff'
      const defaultIconColor = '#7D8592'
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
// const toggleExpansion = () => {
//   isExpanded.value = !isExpanded.value
//   if (mainNavigationData && navigationData.value) {
//     navigationData.value.forEach((navItem, i) => {
//       navItem.children[i].isMainNav = true
//     })
//     mainNavigationData.forEach((item) => {
//     // Assuming navigationData is an array of objects with a 'title' property
//       const foundItem = navigationData.value.find((navItem) => navItem.title === item);
//       if (foundItem && !isExpanded.value) {
//         foundItem.value = foundItem
//         navigationData.value.forEach((navItem, i) => {
//           navItem.children[i].isMainNav = false
//           if (navItem.children[i].title === foundItem.children[i].title) {
//             navItem.children[i].isMainNav = true
//           }
//         })
//       }
//     });
//   }
// }
const toggleExpansion = () => {
  isExpanded.value = !isExpanded.value
  if (!isExpanded.value) {
    navigationData.value.forEach(item => {
      item.children.forEach(childItem => {
        childItem.isMenuShow = true
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
const getNavigationData = () => {
  if (parseInt(store.state.user.siteId) === 5 || parseInt(store.state.user.siteId) === 28) {
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
            path: '/own-summary',
            title: t('menu.AffiliateOwnSummary'),
            label: 'Affiliate Own Summary',
            active: false,
            isMainNav: true,
            icon: 'report',
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
          // {
          //   path: '/withdraw-request',
          //   title: t('menu.Bank Withdrawal'),
          //   label: 'Bank Withdrawal',
          //   active: false,
          //   isMainNav: true,
          //   icon: 'form-w-pencil',
          // },
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
          // {
          //   path: '/vip',
          //   title: 'VIP专享',
          //   active: false,
          //   icon: 'link',
          // },
          // {
          //   path: '/overflow',
          //   title: '溢出申请',
          //   active: false,
          //   icon: 'form',
          // },
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
  // watch(isExpanded, () => {
  //   if (mainNavigationData && navigationData.value) {
  //     mainNavigationData.forEach((item) => {
  //     // Assuming navigationData is an array of objects with a 'title' property
  //       const foundItem = navigationData.value.find((navItem) => navItem.title === item);
  //       if (foundItem && !isExpanded.value) {
  //         foundItem.value = foundItem
  //         navigationData.value.forEach((navItem, i) => {
  //           navItem.children[i].isMainNav = false
  //           console.log(navItem.children[i].title)
  //           console.log(foundItem.children)
  //           if (navItem.children[i].title === foundItem.children[i].title) {
  //             navItem.children[i].isMainNav = true
  //           }
  //         })
  //       }
  //     });
  //   }
  // })
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
  background: white;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  &.expanded {
    width: 90%;
    max-width: 250px;
    .route-wrapper {
      padding: 0.5rem 0 0.5rem 0;
      .route-container.active {
        border-right: 5px solid #3f8cff;
      }
      .route-content {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem 2rem 0.5rem 0.5rem;
        margin: 0px 10px;
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
  .home {
    display: flex;
    gap: 0.5rem;
    margin: 0 0 0 2rem;

    svg {
      width: 1.5rem;
    }

    span {
      font-size: 1.25rem;
    }
  }

  .route-wrapper-home {
    margin: 0 0 1rem 0;

    .route {
      color: #7d8592;
      text-decoration: none;
    }
  }

  .navigation {
    font-size: 1rem;
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
      margin: 1rem;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
    }

    .route-title:has(~ .active) {
      color: #3f8cff;
    }

    .route-wrapper {
      // padding: 0.5rem 0 0.5rem 0;
      padding: 0;
      font-family: PFMed;

      .route {
        color: #7d8592;
        text-decoration: none;
        font-size: 16px;
      }

      .route-content {
        display: flex;
        padding: 10px;
        margin: 0 10px;

        svg {
          width: 2rem;
        }
      }
    }
  }

  .route-container.active {
  }

  .route-container.active .route-content {
    background-color: #ecf3ff;
    border-radius: 0.5rem;
    color: #3f8cff;
  }
  .mini-profile {
    margin: 5px 20px;
    .name {
      display: flex;
      justify-content: center;
      background: lightgrey;
      padding: 5px;
      border-radius: 0.5rem;
      margin-bottom: 10px;
    }
  }
  .route-content {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 2rem 0.5rem 0.5rem;
    margin: 0px 10px;
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
