<template>
  <nav class="sidebar" :class="isExpanded ? 'expanded': ''" style="position: relative;">

    <el-button type="primary" class="expansionbtn" circle @click="toggleExpansion">
      <ArrowLeftBold style="width: 10px" v-if="isExpanded" />
      <ArrowRightBold style="width: 10px" v-if="!isExpanded" />
    </el-button>
    <el-button type="plain" class="mobilehamburg" @click="toggleExpansion">
      <Fold style="width: 20px" v-if="isExpanded" />
      <Expand style="width: 20px" v-if="!isExpanded" />
    </el-button>
    <div class="navigation">
      <div
        v-for="nav in navigationData"
        :key="nav.id"
        :class="`route-wrapper ${nav.active ? 'active' : ''}`"
      >
        <div v-if="nav.display && isExpanded" class="route-title" @click="checkMenu(nav)">{{ nav.title }}
          <ArrowUpBold style="width: 10px" v-if="nav.menuShown" />
          <ArrowDownBold style="width: 10px" v-if="!nav.menuShown" /></div>
        <div
          v-for="child in nav.children"
          :key="child.id"
          :class="`route-container ${child.active ? 'active' : ''}`"
          :style="child.isMenuShow ? 'height: auto;' : 'height: 0px; overflow:hidden'"
        >
          <RouterLink :to="nav.path + child.path" class="route" v-if="child.isMainNav">
            <div class="route-content" :style="!isExpanded && child.icon === 'speech-bubbles' ? 'margin-top: 50px': ''">
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
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeftBold, ArrowRightBold, ArrowUpBold, ArrowDownBold, Expand, Fold } from '@element-plus/icons-vue'

const { t } = useI18n()
const route = useRoute()
const navigationData = ref([
  {
    title: t('首页'),
    display: false,
    path: '',
    children: [
      {
        path: '/dashboard',
        title: '首页',
        active: false,
        isMainNav: true,
        icon: 'home',
      },
    ],
  },
  {
    title: '下级信息',
    display: true,
    path: '/downline',
    children: [
      {
        path: '/member',
        title: '会员管理',
        active: false,
        isMainNav: true,
        icon: 'squares',
      },
      {
        path: '/affiliate',
        title: '代理管理',
        active: false,
        isMainNav: true,
        icon: 'squares',
      },
      {
        path: '/game-record',
        title: '游戏记录',
        active: false,
        isMainNav: true,
        icon: 'clock',
      },
    ],
  },
  {
    title: '财务中心',
    display: true,
    path: '/affiliate',
    children: [
      {
        path: '/bank-card',
        title: '绑定银行卡',
        active: false,
        isMainNav: true,
        icon: 'money-bag',
      },
      {
        path: '/withdraw-request',
        title: '提款申请',
        active: false,
        isMainNav: true,
        icon: 'form-w-pencil',
      },
      {
        path: '/transfer',
        title: '代理代存',
        active: false,
        isMainNav: true,
        icon: 'users',
      },
      {
        path: '/deposit',
        title: '额度充值',
        active: false,
        isMainNav: true,
        icon: 'wallet',
      },
      {
        path: '/finance',
        title: '财务报表',
        active: false,
        isMainNav: true,
        icon: 'report',
      },
      {
        path: '/settlement',
        title: '佣金报表',
        active: false,
        isMainNav: true,
        icon: 'money',
      },
      {
        path: '/credit-flow',
        title: '账变明细',
        active: false,
        isMainNav: true,
        icon: 'ledger',
      },
    ],
  },
  {
    title: '推广中心',
    display: true,
    path: '/promotion',
    children: [
      {
        path: '/referral-link',
        title: '推广链接',
        active: false,
        isMainNav: true,
        icon: 'link',
      },
      {
        path: '/referral-material',
        title: '推广素材',
        active: false,
        isMainNav: true,
        icon: 'photo',
      },
      {
        path: '/channel-pack',
        title: '渠道打包',
        active: false,
        isMainNav: true,
        icon: 'folder',
      },
    ],
  },
  {
    title: '个人中心',
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
        path: '/announcement',
        title: '系统通告',
        active: false,
        isMainNav: true,
        icon: 'speaker',
      },
      {
        path: '/commission-info',
        title: '佣金说明',
        active: false,
        isMainNav: true,
        icon: 'money-bag',
      },
      {
        path: '/contact-us',
        title: '联系我们',
        active: false,
        isMainNav: true,
        icon: 'speech-bubbles',
      },
    ],
  },
])
const mainNavigationData = ['首页', '代理代存', "佣金报表", "佣金说明", "推广链接", "联系我们"];
const isExpanded = ref(true)

const setActiveNav = () => {
  const currentPath = route.path.substring(route.path.lastIndexOf('/'))
  navigationData.value.forEach(e => {
    e.menuShown = true
    e.children.forEach(c => {
      // due to the usage of <use> mechanism and svg-sprite-loader
      // referred icon is out of component scope
      // thus unable to style within component directly
      const iconEl = document.querySelector(`symbol#icon-${c.icon} > path`);
      const activeIconColor = '#3f8cff';
      const defaultIconColor = '#7D8592';
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
    navigationData.value.forEach((item) => {
      item.children.forEach((childItem) => {
        childItem.isMenuShow = true
        childItem.isMainNav = false;
        mainNavigationData.forEach((matchingItem) => {
          if (matchingItem === childItem.title) {
            childItem.isMainNav = true;
            console.log('we got a hit');
          }
        });
      });
    });
  } else {
    navigationData.value.forEach((item) => {
      item.children.forEach((childItem) => {
        childItem.isMainNav = true;
      });
    });
  }
}
const checkMenu = (nav) => {
  nav.menuShown = !nav.menuShown
  nav.children.forEach(child => {
    child.isMenuShow = !child.isMenuShow
  });
}
onMounted(() => {
  watch(
    () => route.path,
    async () => {
      setActiveNav()
      if (isExpanded.value && window.innerWidth < 768) {
        toggleExpansion()
      }
    }
  )
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
    position:absolute;
    right: -10px;
    width: 30px;
    min-height: 30px;
    padding: 5px;
    top: -10px;
  }
  .mobilehamburg {
    display: none;
    position:fixed;
    left: 10px;
    top: 10px;
    padding: 0;
    border: 0;
    margin-left: 0;
    &:hover, &:focus {
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
      color: #7D8592;
      text-decoration: none;
    }
  }

  .navigation {
    font-size: 1rem;
    &::-webkit-scrollbar-track
    {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      background-color: #ffffff;
    }
    &::-webkit-scrollbar
    {
      width: 5px;
      background-color: #ffffff;
    }
    &::-webkit-scrollbar-thumb
    {
      background-color: #98c0fc;
    }

    .route-title {
      margin: 1rem;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
    }

    .route-title:has(~.active) {
      color: #3F8CFF;
    }

    .route-wrapper {
      // padding: 0.5rem 0 0.5rem 0;
      padding: 0;
      font-family: PFMed;

      .route {
        color: #7D8592;
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
    color: #3F8CFF;
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
