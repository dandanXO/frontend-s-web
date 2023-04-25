<template>
  <header class="header-container" :class="scroll > 40 ? 'on-scrolled' : ''">
    <div class="top-nav-wrapper">
      <div class="top-nav">
        <div class="left-hamb">
          <div
            class="hamburger"
            @click="showMobileMenu"
            :class="isMenuActive ? 'active' : ''"
          >
            <RiMenuLine v-if="!isMenuActive" />
            <RiCloseLine v-if="isMenuActive" />
          </div>
          <div class="logo">
            <router-link to="/home">
              <img src="../../assets/logo.png" />
            </router-link>
          </div>
        </div>
        <div
          class="header-menu-container mobile-menu-hide"
          :class="isMenuActive ? 'active' : ''"
        >
          <ul class="header-menu-list">
            <li
              class="header-menu-item"
              v-for="nav in navigations"
              :key="nav.name"
            >
              <router-link
                :to="nav.path"
                class="header-nav"
                @mouseover="hoveredMenu = nav.code"
                :class="
                  nav.code === 'Sports'
                    ? 'hvr-icon-up'
                    : '' || nav.code === 'E-sports'
                    ? 'hvr-icon-spin'
                    : '' || nav.code === 'Home'
                    ? 'hvr-icon-circle'
                    : ''
                "
              >
                <svg
                  class="home-icon"
                  v-if="nav.code === 'Home'"
                  width="22"
                  height="22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path class="blue" d="M3 8v9h15v-9L11,3z" />
                </svg>
                <div class="poker-icon" v-else-if="nav.code === 'Poker'">
                  <div class="pokercards">
                    <div class="pokercard one">A</div>
                    <div class="pokercard two">A</div>
                    <div class="pokercard five">A</div>
                  </div>
                </div>
                <RiBilliardsLine
                  class="hvr-icon"
                  v-if="nav.code === 'E-sports'"
                />
                <div
                  class="livecasino-icon hvr-icon"
                  v-if="nav.code === 'Live Casino'"
                >
                  <span>$</span>
                </div>

                <RiBasketballLine
                  class="hvr-icon"
                  v-if="nav.code === 'Sports'"
                />
                <RiCoinsLine class="hvr-icon" v-if="nav.code === 'Promotion'" />
                <RiVipCrownLine
                  class="hvr-icon vip-icon"
                  v-if="nav.code === 'VIP'"
                />
                <RiVipCrown2Line
                  class="hvr-icon vip-icon hov"
                  v-if="nav.code === 'VIP'"
                /><RiTeamLine
                  class="hvr-icon"
                  v-if="nav.code === 'Affiliates'"
                />

                <RiSmartphoneLine class="hvr-icon" v-if="nav.code === 'APP'" />

                <RiTeamLine
                  class="hvr-icon"
                  v-if="nav.code === 'บริษัทในเครือ'"
                />

                <div class="slot-icon hvr-icon" v-if="nav.code === 'Slots'">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div
                  class="fish-icon hvr-icon"
                  v-if="nav.code === 'Fishing'"
                ></div>

                {{ nav.name }}
              </router-link>
              <div
                class="submenu"
                v-if="nav.hasSub"
                :class="{ active: hoveredMenu === nav.code }"
                @mouseleave="hoveredMenu = ''"
              >
                <div class="inner-side-menu" v-if="nav.code === 'E-sports'">
                  <router-link
                    v-for="(sub, a) in nav.submenu"
                    :key="a"
                    :to="`/e-sport`"
                  >
                    <div class="inner-sub">
                      <img
                        :src="
                          require(`../../assets/images/common/submenu/esport-${sub.icon}.png`)
                        "
                      />
                      <div class="text">
                        <span> {{ sub.code }} </span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="inner-side-menu" v-if="nav.code === 'Sports'">
                  <router-link
                    v-for="(sub, a) in nav.submenu"
                    :key="a"
                    :to="`/sport`"
                  >
                    <div class="inner-sub">
                      <img
                        :src="
                          require(`../../assets/images/common/submenu/sport-${sub.icon}.png`)
                        "
                      />
                      <div class="text">
                        <span> {{ sub.code }} </span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="inner-slot-menu" v-if="nav.code === 'Slots'">
                  <router-link
                    v-for="(sub, a) in nav.submenu"
                    :key="a"
                    :to="`/slot?plat=${sub.code}`"
                  >
                    <div class="slots-sub">
                      <img
                        :src="
                          require(`../../assets/images/common/logo/${sub.icon}.png`)
                        "
                      />
                    </div>
                  </router-link>
                </div>
                <div class="inner-bottom-menu" v-if="nav.code === 'Fishing'">
                  <router-link
                    v-for="(sub, a) in nav.submenu"
                    :key="a"
                    :to="`/aviator?plat=${sub.code}`"
                  >
                    <div class="inner-sub">
                      <img
                        :src="
                          require(`../../assets/images/common/submenu/fish-${sub.icon}.png`)
                        "
                      />
                      <div class="text">
                        <span> {{ sub.code }} </span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div
                  class="inner-bottom-menu"
                  v-if="nav.code === 'Live Casino'"
                >
                  <span
                    @click="
                      playGame(sub.name, sub.code, sub.gameCode, sub.status)
                    "
                    v-for="(sub, a) in nav.submenu"
                    :key="a"
                  >
                    <div class="inner-sub">
                      <img
                        :src="
                          require(`../../assets/images/games/liveCasino/${sub.icon}.png`)
                        "
                      />
                      <div class="text">
                        <span> {{ sub.gameName }} </span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="login-box" v-if="!token">
          <router-link class="common-btn login-btn" to="/login"
            >Login</router-link
          >
          <router-link class="common-btn outline" to="/register">
            Join us
          </router-link>
        </div>
        <div class="login-box" v-else>
          <router-link class="common-btn" to="/center/top-up">
            Deposit
          </router-link>

          <div class="login-box mobile-menu-hide">
            <div class="header-balance">₱ {{ balance.toFixed(2) }}</div>
            <div class="viewmail"></div>
            <div class="dropdown-container viewmail">
              <a @click="trigger" @blur="trigger">
                <RiListSettingsLine />
              </a>
              <div
                class="abs-menu desktop"
                :class="triggerMenu ? 'show' : 'hide'"
              >
                <ul>
                  <li>
                    <router-link
                      to="/center/personal"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiUser5Line />
                      Personal
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/center/withdraw"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiBankCardLine />
                      Quick Withdraw
                    </router-link>
                  </li>
                  <!-- <li>
                    <router-link
                      to="/center/transfer"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiWallet3Line />
                      Quick Transfer
                    </router-link>
                  </li> -->

                  <li>
                    <router-link
                      to="/center/mailbox"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiMailLine />
                      Mailbox
                    </router-link>
                  </li>
                  <li>
                    <a
                      @click="onLogout"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <div class="logout">Logout</div>
                    </a>
                  </li>
                </ul>
              </div>
              <div
                class="abs-menu mobile"
                :class="triggerMenu ? 'show' : 'hide'"
              >
                <div class="user-data">
                  <div class="vip-badge">
                    <img
                      v-if="vip === 'VIP1'"
                      src="../../assets/images/vip/badge/badge-1.png"
                    />
                    <img
                      v-if="vip === 'VIP2'"
                      src="../../assets/images/vip/badge/badge-2.png"
                    />
                    <img
                      v-if="vip === 'VIP3'"
                      src="../../assets/images/vip/badge/badge-3.png"
                    />
                    <img
                      v-if="vip === 'VIP4'"
                      src="../../assets/images/vip/badge/badge-4.png"
                    />
                    <img
                      v-if="vip === 'VIP5'"
                      src="../../assets/images/vip/badge/badge-5.png"
                    />
                    <img
                      v-if="vip === 'VIP6'"
                      src="../../assets/images/vip/badge/badge-6.png"
                    />
                    <img
                      v-if="vip === 'VIP7'"
                      src="../../assets/images/vip/badge/badge-7.png"
                    />
                  </div>
                  <div class="user-info">
                    <div class="nickname">{{ nickName }}</div>
                    <div class="bal">
                      {{ store.currency.value }} {{ balance.toFixed(2) }}
                    </div>
                  </div>
                </div>
                <ul>
                  <li>
                    <router-link
                      to="/center/top-up"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiWallet3Line />
                      Deposit
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/center/withdraw"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiBankCardLine />
                      Quick Withdraw
                    </router-link>
                  </li>
                  <!-- <li>
                    <router-link
                      to="/center/transfer"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiExchangeDollarLine />
                      Quick Transfer
                    </router-link>
                  </li> -->
                  <li>
                    <router-link
                      to="/center/transit-record"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiShieldFlashLine />
                      Transit Record
                    </router-link>
                  </li>

                  <div class="divider"></div>
                  <li>
                    <router-link
                      to="/center/personal"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiUser5Line />
                      Personal Information
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/center/withdrawbank"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiBankLine />
                      Withdraw Bank Card
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/center/mailbox"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiMailLine />
                      ข้อความ
                    </router-link>
                  </li>
                  <!-- <li>
                    <router-link
                      to="/center/voucher-code"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiCoupon3Line />
                      รหัส Voucher
                    </router-link>
                  </li> -->
                  <li>
                    <router-link
                      to="/center/share"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiShareBoxLine />
                      Share
                    </router-link>
                  </li>
                  <div class="divider"></div>
                  <li>
                    <a
                      @click="onLogout"
                      class="flex-box flex-align-center account-menu-item"
                    >
                      <RiLogoutCircleLine />Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GameModal ref="casinoGame"></GameModal>
    </div>
  </header>
</template>

<script lang="js">

import "vue3-carousel/dist/carousel.css";
import { defineComponent, onMounted, onUnmounted, ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { userStore } from "@/store";
import GameModal from "@/components/modal/GameModal";
import { RiBilliardsLine, RiBasketballLine, RiCoinsLine, RiVipCrownLine, RiVipCrown2Line, RiWallet3Line, RiUser5Line, RiBankCardLine, RiBankLine, RiMailLine,
RiShieldFlashLine, RiMenuLine, RiCloseLine, RiLogoutCircleLine, RiShareBoxLine, RiListSettingsLine, RiTeamLine, RiSmartphoneLine } from 'vue-remix-icons'
import { useRoute } from "vue-router";

export default defineComponent({
  name: "CommonHeader",
  components: {
    GameModal,
  RiBilliardsLine
, RiBasketballLine, RiCoinsLine, RiVipCrownLine, RiVipCrown2Line, RiWallet3Line, RiUser5Line, RiBankCardLine,RiBankLine, RiMailLine,
RiShieldFlashLine, RiMenuLine, RiCloseLine, RiLogoutCircleLine, RiShareBoxLine, RiListSettingsLine, RiTeamLine, RiSmartphoneLine
 },
  data: () => ({
    // carousel settings
    navigations: [
      { code: "Home", name: "Home", path: "/home" },
      { code: "E-sports", name: "E-sports", path: "/e-sport", hasSub: true,
      submenu: [{
        code: "Jolly 88",
        icon: "jolly88"
      }] },
      { code: "Sports", name: "Sports", path: "/sport", icon: require('../../assets/images/index/menu/menu_sport.png'), hasSub: true,
      submenu: [{
        code: "Jolly 88",
        icon: "jolly88"
      }]},
      { code: "Slots", name: "Slots", path: "/slot", icon: require('../../assets/images/index/menu/menu_slots.png'), hasSub: true,
      submenu: [{
        code: "JILI",
        icon: "JILI"
      },{
        code: "FC",
        icon: "FC"
      },{
        code: "CQ9",
        icon: "CQ9"
      },{
        code: "JDB",
        icon: "JDB"
      },{
        code: "KA",
        icon: "KA"
      },{
        code: "RICH88",
        icon: "RICH88"
      },{
        code: "PS",
        icon: "PS"
      }]},
      // { code: "Live Casino", name: "Live Casino", path: "/live-casino", icon: require('../../assets/images/index/menu/menu_live_casino.png'), hasSub: true,
      // submenu: [{
      //   code: "Evo",
      //   icon: "live4_01",
      //   name: "Evolution",
      //   status: "NORMAL",
      //   gameName: "EVO",
      // },
      // {
      //   code: "AWC",
      //   icon: "live1_1",
      //   name: "AE Sexy",
      //   status: "NORMAL",
      //   gameName: "AE Sexy",
      //   gameCode: "MX-LIVE-001",
      // },
      // // {
      // //   code: "WM",
      // //   icon: "live2_01",
      // //   name: "WM Casino",
      // //   status: "NORMAL",
      // //   gameName: "WM",
      // // },
      // {
      //   code: "EZUGI",
      //   icon: "live3_01",
      //   name: "Ezugi",
      //   status: "NORMAL",
      //   gameName: "EZUGI",
      // },] },
      { code: "Fishing", name: "Fishing", path: "/aviator", icon: require('../../assets/images/index/menu/menu_fish.png'), hasSub: true,
      submenu: [{
        code: "JILI",
        icon: "JILI"
      },{
        code: "FC",
        icon: "FC"
      },{
        code: "CQ9",
        icon: "CQ9"
      },{
        code: "JDB",
        icon: "JDB"
      },{
        code: "KA",
        icon: "KA"
      },{
        code: "YL",
        icon: "YL"
      }] },
      // { code: "Poker", name: "Poker", path: "/poker" },
      { code: "Promotion", name: "Promotion", path: "/promotion", icon: require('../../assets/images/index/menu/menu_promo.png') },
      { code: "Affiliates", name: "Affiliates", path: "/affiliate" },
      { code: "APP", name: "APP", path: "/getapp" },
      { code: "VIP", name: "VIP", path: "/vip", icon: require('../../assets/images/index/menu/menu_vip.png') },

    ]
  }),
  setup() {
    const casinoGame = ref(null);
    function playGame(gameName, platformCode, gameCode, status) {
      casinoGame.value.open(gameName, platformCode, gameCode, status);
    }
    const store = userStore();
    const { token } = storeToRefs(store);
    const isMenuActive = ref(false)
    const triggerMenu = ref(null)
    onMounted(() => {
      if (store.token) {
        store.getBalance();
      }
        getBalance()
      window.addEventListener('scroll', onScroll)

    });
    const getBalance = () => {
        setInterval(function(){ if (store.token) { store.getBalance() } }, 20000);
    }
    onUnmounted(() => window.removeEventListener('resize', onScroll))
    const balance = computed(() => {
      return store.balance;
    });
    const vip = computed(() => { return store.vip; });
    const nickName = computed(() => { return store.nickName; });

    const onLogout = () => {
      store.memberLogout().then(() => {
        location.reload();
      });
    };
    const trigger = () => {
      triggerMenu.value = !triggerMenu.value
      if (triggerMenu.value === true) {
        isMenuActive.value = false;
      }
    };
    let windowScroll = ref(window.scrollY)
    // var $animation_elements = document.getElementsByClassName("mod-slide");
    // var $window = window;

    const onScroll = () => {
      windowScroll.value = window.scrollY
    };

    const route = useRoute();
      watch(
        () => route.name,
        () => {
          isMenuActive.value = false;
          triggerMenu.value = false;
        }
      );
    const scroll = computed(() => windowScroll.value)

    var showMobileMenu = () => {
      isMenuActive.value = !isMenuActive.value
      if (isMenuActive.value === true) {
        triggerMenu.value = false;
      }
    }
    const hoveredMenu = ref('')
    return {
      onLogout,
      getBalance,
      balance,
      token,
      mailValue: 0,
      scroll,
      triggerMenu,
      trigger,
      showMobileMenu,
      isMenuActive,
      vip,
      nickName,
      store,
      hoveredMenu,
      playGame,
      casinoGame
    };
  }
});
</script>
<style scoped lang="scss">
.hamburger {
  display: none;
}
$navigation-height: 55px;
$link-color: #ff6600;
.header-container {
  &.on-scrolled {
    background: rgb(43 43 75 / 80%);
  }
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 999;
  background: #23263c;
  transition: all 0.3s ease;
  .top-nav-wrapper {
    padding: 20px 0;
    max-width: 1450px;
    width: 95%;
    margin: 0 auto;
    .top-nav {
      display: flex;
      justify-content: space-between;
    }
  }
  .logo {
    display: inline-block;
    vertical-align: middle;
    height: calc($navigation-height - 10px);
    img {
      display: block;
      height: 100%;
    }
  }

  // header
  .header-menu-container {
    display: inline-block;
    vertical-align: middle;
    // ul
    .header-menu-list {
      display: flex;
      font-size: 1.2rem;
      margin: 0 2rem;
      padding: 0;
      // li
      .header-menu-item {
        // a
        .header-nav {
          &.hvr-icon-circle {
            position: relative;
            &:before,
            &:after {
              content: "";
              background: linear-gradient(#000000, transparent);
              position: absolute;
              width: 0;
              height: 10px;
              left: 10px;
              border-radius: 100%;
            }
            &:after {
              transform: rotateZ(44deg);
            }
          }
          @keyframes rotate {
            0% {
              border: 10px solid #23263c;
              border-left: 10px solid transparent;
            }
            30% {
              transform: rotateZ(360deg);
            }
            60% {
              border: 10px solid #23263c;
              border-left: 10px solid transparent;
            }
            70% {
              border-top: 10px solid transparent;
            }
            80% {
              border-right: 10px solid transparent;
            }
            90% {
              border: 10px solid transparent;
            }
            100% {
              transform: rotateZ(720deg);
            }
          }

          .vip-icon {
            &.hov {
              display: none;
            }
          }
          .livecasino-icon {
            transition: all 0.5s ease-in;
            border: 1px solid #ffffff;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            border: 3px dotted #ffffff;
            font-size: 10px;
            text-align: center;
            margin-right: 6px;
            line-height: 13px;
          }
          .poker-icon {
            padding-left: 5px;
            .pokercards {
              // Outer wrapper for all cards
              position: relative; // Get control of the positioning
              height: 18px; // height of each card
              width: 15px; //width of each card
              margin-right: 10px;
              font-size: 10px; //size of number
              line-height: 5px; //affects vert position of number
              font-weight: bold; //font weight
              .pokercard {
                transition: all 0.5s ease-in;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #ffffff;
                // Common styles for all cards
                position: absolute; //Position all cards on top of each other
                width: 100%; //Expand to fill the parent's width
                height: 100%; //Expand to fill the parent's height
                border: 1px solid #ffffff; //card border width and color
                background: #23263c;
                border-radius: 3px; //corner radius
                box-shadow: -2px 2px 3px rgba(0, 0, 0, 0.3); //Drop shadow position, size and color

                &.one {
                  transform: translate(-5px, 0px) rotate(-10deg);
                }
                &.two {
                }
                &.five {
                  transform: translate(-2px, 0px) rotate(10deg);
                }
              }
            }
          }
          .fish-icon {
            transition: all 0.5s ease-in;

            margin-right: 10px;
            display: flex;
            align-items: center;
            &:before {
              content: "";
              border-top: 5px solid transparent;
              border-bottom: 5px solid transparent;
              border-left: 5px solid white;
              display: inline-block;
            }
            &:after {
              content: "";
              display: inline-block;
              border-radius: 50%;
              width: 15px;
              height: 10px;
              background: #ffffff;
            }
          }
          .slot-icon {
            transition: all 0.2s ease-in;
            font-size: 8px;
            line-height: 10px;
            font-weight: bold;
            margin-right: 8px;
            position: relative;
            border: 0.5px solid #ffffff;
            padding: 2px;

            span {
              border: 0.2px solid #ffffff;
              width: 8px;
              text-align: center;
              display: inline-block;
              &:before {
                content: "7";
              }
              &:first-child {
                border-right: 0;
              }
              &:last-child {
                border-left: 0;
              }
            }
          }
          position: relative;
          padding: 10px;
          display: block;
          color: #ffffff;
          transition: all 0.3s ease-out;
          font-size: 0.8rem;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 20px;
            filter: brightness(1) invert(1);
          }
          svg {
            width: 20px;
            margin-right: 5px;
            fill: #ffffff;
          }

          @keyframes offset {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes fill-green {
            to {
              fill: #78be20;
              stroke: transparent;
            }
          }
          svg.home-icon {
            width: 22px;
            height: 22px;
          }
          path {
            stroke-width: 0.5;
            stroke-dasharray: 3212;
            stroke-dashoffset: 3212;
            fill: transparent;
          }
          svg path {
            fill: none;
            stroke: #ffffff;
            stroke-width: 2;
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            -webkit-animation: dash 10s linear forwards;
            animation: dash 10s linear forwards;
          }
          @-webkit-keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
          &:hover {
            svg path {
              stroke: #ff6600;
            }
            .blue {
              stroke: #ff6600;
              animation: offset 10s linear forwards, fill-blue 1s 1s forwards;
            }

            // background-image: linear-gradient(to right, #de4545, #db7e42);
            // -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;

            // &.hvr-icon-circle {
            //   &:before {
            //     animation: rotate 4s;
            //   }
            //   &:after {
            //     animation: rotate 4s;
            //   }
            // }

            .vip-icon {
              display: none;
              &.hov {
                display: block;
              }
            }
            color: $link-color;
            svg {
              fill: $link-color;
            }
            .livecasino-icon {
              transform: rotateY(360deg);
              border-color: $link-color;
            }
            .poker-icon {
              .pokercards {
                .pokercard {
                  border: 1px solid #ff6600;
                  color: #ff6600;
                  &.one {
                    transform: translate(-5px, 0px) rotate(-10deg);
                  }
                  &.two {
                  }
                  &.five {
                    transform: translate(5px, 0px) rotate(10deg);
                  }
                }
              }
            }

            .slot-icon {
              border-color: $link-color;

              span {
                border-color: $link-color;
                &:first-child {
                  &::before {
                    animation-delay: 0.2s;
                  }
                }
                &:nth-child(2) {
                  &::before {
                    animation-delay: 0.4s;
                  }
                }
                &:before {
                  animation: spin 5s;
                }
              }
            }
            .fish-icon {
              animation: animateFish 3s;
              &:before,
              &:after {
                border-left-color: $link-color;
              }
              &:after {
                background: $link-color;
              }
              &:before {
              }
            }
          }
          @-webkit-keyframes spin {
            1% {
              content: "1";
            }
            2% {
              content: "2";
            }
            3% {
              content: "3";
            }
            4% {
              content: "4";
            }
            5% {
              content: "5";
            }
            6% {
              content: "6";
            }
            7% {
              content: "7";
            }
          }

          @-webkit-keyframes animateFish {
            0% {
              transform: translateY(-5px) scale(0.4);
            }
            20% {
              transform: translateX(10px) translateY(-6px) scale(0.4);
            }
            30% {
              transform: translateX(10px) translateY(-5px) scale(0.4);
            }
            50% {
              transform: translateX(10px) translateY(-6px) rotateY(180deg)
                scale(0.6);
            }
            80% {
              transform: translateX(-5px) translateY(-5px) rotateY(180deg)
                scale(0.4);
            }
            90% {
              transform: translateX(-10px) translateY(0px) scale(1);
            }

            100% {
              transform: translateX(0) rotateY(0deg) scale(1);
            }

            // 50% {
            //   transform: translateY(-3px);
            //   transform: translateX(10px);
            // }
            // 80% {
            //   transform: translateY(-5px);
            // }
            // 100% {
            //   transform: rotateY(180deg);

            //   transform: translateY(-3px);
            // }
          }
          @keyframes shine {
            100% {
              background: #434343;
            }
          }

          &.router-link-active {
            color: $link-color;
            svg {
              fill: $link-color;
            }
            svg path {
              stroke: #ff6600;
            }
            .livecasino-icon {
              transform: rotateY(360deg);
              border-color: $link-color;
            }
            .poker-icon {
              .pokercards {
                .pokercard {
                  background: #23263c;
                  color: $link-color;
                  border-color: $link-color;
                }
              }
            }
            .slot-icon {
              border-color: $link-color;
              span {
                border-color: $link-color;
              }
            }
            .fish-icon {
              &:before,
              &:after {
                border-left-color: $link-color;
              }
              &:after {
                background: $link-color;
              }
            }
          }
          // &::after {
          //   content: "";
          //   position: absolute;
          //   width: 40px;
          //   height: 40px;
          //   top: 0;
          //   right: 0px;
          //   left: 0px;
          //   background: transparent;
          //   margin: auto;
          //   bottom: 0px;
          //   display: inline-block;
          //   transition: all 1s ease-out;
          // }
          // &:hover {
          //   opacity: 1;
          //   &::after {
          //     transform: rotate(500deg);
          //     border: 1px solid #ffffff;
          //     background: transparent;
          //     display: inline-block;
          //   }
          // }
          // &.router-link-active {
          //   opacity: 1;
          //   color: #1bcef1;
          //   &:after {
          //     border: 0;
          //     border: 1px solid #1bcef1;
          //     background: transparent;
          //     color: #1bcef1;
          //     display: inline-block;
          //     transform: rotate(20deg);
          //   }
          // }
        }
      }
    }
    .submenu {
      position: fixed;
      // background: linear-gradient(180deg, #000000 50%, #23263cc0 50%);
      background: #2b2b4b;
      top: 55px;
      left: 0;
      right: 0;
      transition: height 0.2s ease-out;
      height: 0px;
      overflow: hidden;
      width: 100%;
      margin-top: 25px;
      min-width: 1460px;
      &.active {
        height: 200px;
      }
      .inner-slot-menu {
        max-width: 1450px;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 40px 0;
        margin: 10px auto;
        padding: 10px;
        .slots-sub {
          margin: 0 auto;
          padding: 10px;
          border-radius: 10px;
          height: 60px;
          text-align: center;
          cursor: pointer;
          img {
            height: 100%;
          }
          &:hover {
            background: #23263c;
            box-shadow: inset 0px 0px 10px #565696;
          }
        }
      }
      .inner-side-menu {
        display: flex;
        gap: 10px;
        max-width: 1450px;
        margin: 0 auto;
        width: 100%;
        justify-content: space-around;
        align-items: center;
        height: 100%;
        .inner-sub {
          cursor: pointer;
          margin: 0 auto;
          padding: 10px;
          border-radius: 10px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: #ffffff;
          gap: 10px;

          &:hover {
            color: #ff6600;
          }
          img {
            height: 100%;
          }
          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            font-size: 20px;
            gap: 0px;
            font-weight: bold;
          }
        }
      }

      .inner-bottom-menu {
        display: flex;
        gap: 10px;
        max-width: 1450px;
        margin: 0 auto;
        width: 100%;
        justify-content: space-around;
        align-items: center;
        height: 100%;
        .inner-sub {
          cursor: pointer;
          margin: 0 auto;
          padding: 10px;
          height: 170px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: #ffffff;

          &:hover {
            color: #ff6600;
          }
          img {
            height: 100%;
          }
          .text {
            font-size: 18px;
            display: flex;
            gap: 10px;
            font-weight: bold;
          }
        }
      }
    }
  }
  .login-box {
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
    color: #ffffff;
    gap: 10px;
    .header-balance {
      padding: 10px;
    }
    a {
      color: #ffffff;
    }
    .avatar {
      width: 35px;
      height: 35px;
      background: #d2d2d2;
      border-radius: 50%;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      .anticon {
        display: inline-block;
        vertical-align: middle;
        background: #000000;
        border-radius: 100%;
        font-size: 8px;
        padding: 2px;
      }
    }
    .viewmail {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-size: 20px;
      svg {
        width: 30px;
        fill: #ffffff;
        display: block;
      }

      .mailValue {
        position: absolute;
        text-align: center;
        height: 9px;
        display: flex;
        align-items: center;
        font-size: 16px;
        width: 9px;
        right: 8px;
        top: 6px;
        background: #c23442;
        border-radius: 50%;
      }
    }
    .login-btn {
      color: #ffffff;
      font-weight: bold;
    }
    // .header-btn {
    //   padding: 8px 20px;
    //   font-size: 16px;
    //   color: #1bcef1;
    //   background-color: #0f1b29;
    //   border: 1px solid #1bcef1;
    //   line-height: 16px;
    //   &.register {
    //     background: #1bcef1;
    //     color: #173342;
    //   }
    // }

    .dropdown-container {
      position: relative;

      .abs-menu {
        position: absolute;
        width: 200px;
        right: -20px;
        top: 50px;
        box-shadow: 0 0 30px -10px #000000;
        background: #2b2b4b;
        border-radius: 10px;
        padding: 10px 15px;
        &.mobile {
          display: none;
        }
        &.desktop {
          display: none;
          &.show {
            display: block;
          }
        }
        ul {
          margin: 0;
          padding: 0;
        }
        li {
          a {
            font-size: 14px;
            padding: 5px 0px;
            display: block;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: #ffffff;
            transition: all 0.3s ease-in;
            &:hover {
              color: $link-color;
              // .icon {
              //   filter: brightness(100%) sepia(100) saturate(100) hue-rotate(324deg);
              //   transform: rotate(10deg);
              // }
              .remixicon {
                transform: scale(1.1);
                fill: #ff6600;
              }
            }
            // .anticon {
            //   font-size: 23px;
            //   margin-right: 10px;
            // }
            // .icon {
            //   margin-right: 10px;
            // }

            .remixicon {
              width: 30px;
              margin-right: 10px;
              fill: #ffffff;
            }
            .logout {
              padding: 8px;
              border: 1px solid #a6a6a6;
              border-radius: 4px;
              display: block;
              width: 100%;
              margin-top: 10px;
              text-align: center;
              &:hover {
                border: 1px solid #ff6600;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
$menu-height: 65px;
@media (max-width: 768px) {
  .mobile-menu-hide {
    display: none;
  }
  .hamburger {
    display: inline-block;
    width: 30px;
    margin-right: 10px;
    margin-left: -3px;
    vertical-align: middle;
    cursor: pointer;
    svg {
      fill: #ff6600;
      display: block;
    }
  }
  .header-container {
    //  padding: 10px;
    .login-box {
      .common-btn {
        padding: 5px 10px;
        min-width: 80px;
      }
      .header-balance {
        display: none;
      }
    }
    .header-menu-container {
      position: absolute;
      left: -250px;
      background: #2b2b4b;
      top: $menu-height;
      width: 100%;
      width: 250px;
      height: calc(100vh - $menu-height);
      overflow: auto;
      transition: all 0.3s ease-in-out;
      .desktop-hide {
        display: block;
      }
      &.active {
        left: 0px;
        display: block;
      }
      img {
        width: 100%;
      }
      .header-menu-list {
        flex-direction: column;
        margin: 15px 0;
        .header-menu-item {
          .divider {
            width: 100%;
            height: 4px;
            background-color: #2c2842;
          }
          .icons {
            width: 20px;
            margin-right: 10px;
          }
          .header-nav {
            padding: 20px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            svg {
              fill: #ffffff;
              width: 30px;
              margin-right: 10px;
              display: block;
            }
            .livecasino-icon {
              width: 23px;
              height: 23px;
              line-height: 16px;
            }
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    $abs-width: 250px;
    .header-container {
      .submenu {
        display: none;
      }
      .top-nav-wrapper {
        padding: 10px 0;
        // padding: 10px;
        // display: flex;
        // justify-content: space-between;
        // gap: 10px;
      }
      .login-box {
        .header-balance {
          display: none;
        }
        .dropdown-container {
          position: unset;
          .abs-menu {
            &.desktop {
              display: none;
              &.show {
                display: none;
              }
            }
            &.mobile {
              min-height: calc(100vh - 50px);
              .divider {
                width: 100%;
                background-color: #23263c;
                height: 1px;
              }
              width: 0px;
              display: none;
              right: -20px;
              top: 58px;
              border: 0;
              border-radius: 0;
              background: #2b2b4b;
              ul {
                max-height: calc(100vh - 200px);
                overflow: scroll;

                li {
                  a {
                    padding: 10px 20px;
                  }
                }
              }
              &.show {
                display: block;
                transition: all 0.3s ease-in-out;
                transition-delay: 0.1s;
                width: $abs-width;
                right: 0;
                top: $menu-height;
                padding: 0;
                bottom: 0;
                overflow: auto;
              }
              .user-data {
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                background: #23263c;
                // flex-direction: column;
                gap: 10px;
                // .vip-level {
                //   background: rgba(255, 255, 255, 0.6);
                //   line-height: 20px;
                //   font-size: 14px;
                //   padding: 5px 10px;
                //   border-radius: 30px;
                //   font-weight: bold;

                //   img {
                //     display: none;
                //   }
                // }
                .vip-badge {
                  flex: 1;
                  img {
                    width: 100%;
                  }
                }
                .user-info {
                  display: flex;
                  flex: 2;
                  flex-direction: column;
                  align-content: center;
                  justify-content: flex-start;
                  .bal {
                    color: #ffffff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 400px) {
  .header-container {
    .logo {
      width: 45px;
      overflow: hidden;
    }
  }
}
</style>
