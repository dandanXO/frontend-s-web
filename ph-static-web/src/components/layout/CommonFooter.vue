<template>
  <footer class="footer">
    <div class="top-footer">
      <ul class="ft-menu">
        <li>
          <router-link to="/about">
            <img src="../../assets/images/index/footer_logo.png" />
            About Jolly88
          </router-link>
        </li>
        <li>
          <router-link to="/about?id=data-collection"
            >Data Collection</router-link
          >
        </li>
        <li>
          <router-link to="/about?id=legal-grounds">Legal Grounds</router-link>
        </li>
        <li>
          <router-link to="/about?id=betting-rules">Betting Rules</router-link>
        </li>
        <li>
          <router-link to="/about?id=compensation">Compensation</router-link>
        </li>
        <li>
          <router-link class="footer-nav" to="/register">Join US</router-link>
        </li>

        <li>
          <router-link to="/about?id=responsible-gambling"
            >Responsible Gambling</router-link
          >
        </li>
      </ul>
    </div>
    <div class="flex-box flex-justify-center footer-nav-wrapper">
      <!-- <router-link class="footer-nav" to="/about?active=data-collection">
        Data Collection
      </router-link>
      <router-link class="footer-nav" to="/about?active=legal-grounds">
        Legal Grounds
      </router-link>
      <router-link class="footer-nav" to="/about">About US</router-link>
      <router-link class="footer-nav" to="/about?active=betting-rules">
        Betting Rules
      </router-link>
      <router-link class="footer-nav" to="/about?active=compensation">
        Compensation
      </router-link>
      <router-link class="footer-nav" to="/register">Join US</router-link>
      <router-link class="footer-nav" to="/about?active=responsible-gambling">
        Responsible Gambling
      </router-link> ->
      -->
    </div>
    <div class="txt-center footer-desc">
      <ul class="partners">
        <li>Partners:</li>
        <li v-for="logo in logos" :key="logo">
          <img
            :style="'height: ' + logo.height + 'px;'"
            :src="
              require('../../assets/images/common/logo/' + logo.name + '.png')
            "
          />
        </li>
      </ul>
      Jolly88 E-sports is the world's leading legal gaming company, it has an
      offshore gaming license issued by the Philippine government PAGCOR subject
      to it's supervision
    </div>
    <div class="txt-center flex-box flex-align-center mobile-footer">
      <router-link class="mobile-footer-item" to="/home">
        <img src="../../assets/images/index/menu/menu_home.png" />
        HOME
      </router-link>
      <router-link class="mobile-footer-item" to="/sport">
        <img src="../../assets/images/index/menu/menu_sport.png" />
        SPORTS
      </router-link>
      <router-link class="mobile-footer-item" to="/live-casino">
        <img src="../../assets/images/index/menu/menu_live_casino.png" />
        LIVE CASINO
      </router-link>
      <router-link class="mobile-footer-item" to="/vip">
        <img src="../../assets/images/index/menu/menu_vip.png" />
        VIP
      </router-link>
      <div
        class="mobile-footer-item"
        @click="showFootMenu"
        :class="footMenuVisible ? 'router-link-active' : ''"
      >
        <MoreOutlined />
        MORE
      </div>
      <div
        v-if="footMenuVisible"
        class="foot-menu-container"
        @click="footMenuClose"
      >
        <router-link class="foot-menu-item" to="/home">
          <div>HOME</div>
        </router-link>
        <router-link class="foot-menu-item" to="/e-sport">
          <!-- <img src="../../assets/images/index/menu/menu_e_sport.png" /> -->
          <div>E-SPORTS</div>
        </router-link>
        <router-link class="foot-menu-item" to="/sport">
          <!-- <img src="../../assets/images/index/menu/menu_sport.png" /> -->
          <div>SPORTS</div>
        </router-link>
        <router-link class="foot-menu-item" to="/live-casino">
          <!-- <img src="../../assets/images/index/menu/menu_live_casino.png" /> -->
          <div>LIVE CASINO</div>
        </router-link>
        <router-link class="foot-menu-item" to="/aviator">
          <!-- <img src="../../assets/images/index/menu/menu_fish.png" /> -->
          <div>FISHING</div>
        </router-link>
        <router-link class="foot-menu-item" to="/slot">
          <!-- <img src="../../assets/images/index/menu/menu_slots.png" /> -->
          <div>SLOTS</div>
        </router-link>
        <router-link class="foot-menu-item" to="/promotion">
          <!-- <img src="../../assets/images/index/menu/menu_promo.png" /> -->
          <div>PROMOTION</div>
        </router-link>
        <router-link class="foot-menu-item" to="/vip">
          <!-- <img src="../../assets/images/index/menu/menu_vip.png" /> -->
          <div>VIP</div>
        </router-link>
        <!-- <router-link class="foot-menu-item" to="/poker">
            <img src="../../assets/images/index/menu/menu_poker.png" />
            <div>POKER</div>
          </router-link> -->
      </div>
    </div>
    <div class="txt-center right-tools-wrapper">
      <div
        class="quick-item"
        @click.stop.prevent="
          openWindow(
            `https://csweb01.amv4xjcbd.com/?partnerId=8&lang=en&way=${regDevice}&token=${store.token}`,
            'Chat Server',
            350,
            650
          )
        "
      >
        <RiCustomerService2Fill />
      </div>
      <!-- <div class="quick-item" @click="router.push('/promotion?id=35')">
        <RiUserShared2Line />
      </div>
      <div class="right-qr">
        <!- <div class="close"><RiCloseFill /></div> ->
        <div class="line-text">LINE</div>
        <div class="qr-item">
          <img src="../../assets/images/common/gainfriends-qr.png" />
        </div>
        <span class="follow">@jolly88</span>
      </div> -->
    </div>
    <!-- <a-drawer
      placement="bottom"
      height="270px"
      :closable="false"
      :get-container="false"
      :visible="footMenuVisible"
      @close="footMenuClose"
    >
      <div class="foot-menu-container">
        <router-link class="foot-menu-item" to="/home">
          <img src="../../assets/images/index/menu/menu_home.png" />
          <div>HOME</div>
        </router-link>
        <router-link class="foot-menu-item" to="/e-sport">
          <img src="../../assets/images/index/menu/menu_e_sport.png" />
          <div>E-SPORTS</div>
        </router-link>
        <router-link class="foot-menu-item" to="/sport">
          <img src="../../assets/images/index/menu/menu_sport.png" />
          <div>SPORTS</div>
        </router-link>
        <router-link class="foot-menu-item" to="/live-casino">
          <img src="../../assets/images/index/menu/menu_live_casino.png" />
          <div>LIVE CASINO</div>
        </router-link>
        <router-link class="foot-menu-item" to="/aviator">
          <img src="../../assets/images/index/menu/menu_fish.png" />
          <div>FISHING</div>
        </router-link>
        <router-link class="foot-menu-item" to="/slot">
          <img src="../../assets/images/index/menu/menu_slots.png" />
          <div>SLOTS</div>
        </router-link>
        <router-link class="foot-menu-item" to="/promotion">
          <img src="../../assets/images/index/menu/menu_promo.png" />
          <div>PROMOTION</div>
        </router-link>
        <router-link class="foot-menu-item" to="/vip">
          <img src="../../assets/images/index/menu/menu_vip.png" />
          <div>VIP</div>
        </router-link>
        <!- <router-link class="foot-menu-item" to="/poker">
          <img src="../../assets/images/index/menu/menu_poker.png" />
          <div>POKER</div>
        </router-link> ->
        <router-link class="foot-menu-item" to="/promotion">
          <img src="../../assets/images/index/menu/menu_promo.png" />
          <div>PROMOTION</div>
        </router-link>
      </div>
    </a-drawer> -->
  </footer>
  <!-- 
  <RegisterModal ref="regModal" /> -->
</template>

<script lang="js">
import { RiCustomerService2Fill } from "vue-remix-icons"
import {
  MoreOutlined
} from "@ant-design/icons-vue";
import { ref, defineComponent } from "vue";
import { useRouter } from "vue-router"
import { userStore } from "@/store"
import { getDevice } from "@/utils/utils";
// import RegisterModal from "@/components/modal/RegisterModal";
export default defineComponent({
  components: {
    MoreOutlined,
    RiCustomerService2Fill
  },
  name: "CommonFooter",
  setup() {
    const router = useRouter();
    const isLINEshow = ref(true)
    const regModal = ref(null);
    const logos = ref([
      {
        name: 'JOKER'
      }
      // {
      //   name: 'SA',
      //   height: '18'
      // },
      // {
      //   name: 'YGG'
      // },
      // {
      //   name: 'KA'
      // },
      // {
      //   name: 'SLOTXO'
      // },
      // {
      //   name: 'PG'
      // },
      // {
      //   name: 'SP'
      // },
    ]);
    const footMenuVisible = ref(false);
    const showFootMenu = () => {
      footMenuVisible.value = !footMenuVisible.value
    };
    const openModal = () => {
      regModal.value.open('register');
    }
    const footMenuClose = () => {
      footMenuVisible.value = false;
    };
    const backTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
    const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
      var left = (screen.width - popupWinWidth) * 2;
      var top = (screen.height - popupWinHeight) / 4;
      // console.log(top)
      window.open(pageURL, pageTitle,
                    'resizable=yes, width=' + popupWinWidth
                    + ', height=' + popupWinHeight + ', top='
                    + top + ', left=' + left);
    }
    const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
    const store = userStore();
    return {
      footMenuVisible,
      showFootMenu,
      footMenuClose,
      backTop,
      openModal,
      regModal,
      logos,
      openWindow,
      regDevice,
      store,
      isLINEshow,
      router
    }
  },
});
</script>

<style scoped lang="scss">
.footer {
  color: #ffffff;
  background: #23263c;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .top-footer {
    width: 100%;
    background: #23263c;
    box-shadow: 0px 0px 9px 1px rgba(17, 9, 0, 0.5);
    ul {
      max-width: 1400px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 30px auto;
      padding: 0;
      width: 95%;
      li {
        a {
          display: inline-block;
          color: #ffffff;
          img {
            margin-right: 10px;
          }
          &:hover {
            color: #db7e42;
          }
        }
      }
    }
  }
  .footer-nav-wrapper {
    // font-size: 16px;
    // padding-top: 6px;
    // margin-bottom: 6px;
    // .footer-nav {
    //   padding: 0 15px;
    //   color: #ffffff;
    // }
    img {
      width: 90px;
    }
  }
  .footer-desc {
    // padding-bottom: 12px;
    text-align: left;
    font-size: 14px;
    color: #ffffff;
    max-width: 1400px;
    width: 95%;
    margin: 10px auto;
    .partners {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin: 10px auto;
      padding: 0;
      li {
        &:first-of-type {
          padding: 5px 0px;
        }
        padding: 5px 20px;
        img {
          width: 100%;
          height: 25px;
        }
      }
    }
  }
  .mobile-footer {
    display: none;
    background: #1f1f1f;
    .mobile-footer-item {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      color: #898989;
      width: 20%;
      padding: 10px;
      font-size: 10px;
      font-weight: bold;
      flex-direction: column;
      img {
        width: 30px;
        filter: grayscale(1) brightness(1);
        margin-bottom: 5px;
      }
      .anticon {
        font-size: 25px;
        margin-bottom: 5px;
      }
      &.router-link-active {
        color: #ff7b00;
        img {
          filter: hue-rotate(205deg) saturate(5);
        }
      }
    }

    .foot-menu-container {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 65px;
      background: #000000;
      display: flex;
      flex-direction: column;
      height: calc(100vh - 65px);
      justify-content: space-around;
      a {
        color: #ff7b00;
      }
    }
  }
  .right-tools-wrapper {
    position: fixed;
    right: 0;
    top: 50%;
    width: 100px;
    padding: 5px;
    height: auto;
    background-image: linear-gradient(to right, #de4545, #db7e42);

    border-bottom-left-radius: 50px;
    border-top-left-radius: 50px;
    z-index: 99;
    .right-qr {
      background: #2b2b4b;
      box-shadow: inset 0px 0px 5px 0px #000000;
      border-radius: 10px;
      padding: 5px;
    }
    .close {
      width: 20px;
      position: absolute;
      top: 10px;
      left: 10px;
      svg {
        fill: #ffffff;
        width: 100%;
      }
    }
    .qr-item {
      .line-text {
        font-size: 20px;
        margin: 0 auto;
        margin-left: 5px;
        color: #ffffff;
        font-weight: bold;
      }
      // padding: 10px;
      // border-radius: 10px 10px 0 0;
      overflow: hidden;
      img {
        width: 100%;
      }
      .follow {
        color: #ffffff;
        margin-top: 10px;
        font-weight: bold;
      }
    }
    .quick-item {
      padding: 10px;
      width: 80px;
      height: 80px;
      background: #2b2b4b;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: inset 0px 0px 5px 0px #000000;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 5px;
      // img {
      //   width: 32px;
      //   margin-bottom: 6px;
      // }
      svg {
        width: 40px;
        fill: #db7c42;
        display: block;
        height: 40px;
      }
    }
  }
  // .right-qr-wrapper {
  //   position: fixed;
  //   right: 0;
  //   top: 60%;
  //   width: 100px;
  //   padding: 5px;
  //   background-image: linear-gradient(to right, #de4545, #db7e42);
  //   border-radius: 10px 0 0 10px;
  //   .line-text {
  //     font-size: 20px;
  //     margin: 0 auto;
  //     margin-left: 5px;
  //     color: #23263c;
  //     font-weight: bold;
  //   }
  //   .close {
  //     width: 20px;
  //     position: absolute;
  //     top: 10px;
  //     left: 10px;
  //     svg {
  //       fill: #ffffff;
  //       width: 100%;
  //     }
  //   }
  //   .follow {
  //     color: #23263c;
  //     margin-top: 10px;
  //     font-weight: bold;
  //   }
  //   .quick-item {
  //     padding: 5px;
  //     img { width: 100%;}
  //   }
  // }
}
</style>
<style scoped lang="scss">
.footer :deep(.ant-drawer-bottom) {
  .ant-drawer-content-wrapper {
    border-top: 1px solid #1bcef1;
    .ant-drawer-content {
      background-color: #11131f;
      .foot-menu-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-row-gap: 30px;
        text-align: center;
        .foot-menu-item {
          color: $color-primary;
          > img {
            width: 70px;
            height: 70px;
          }
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    min-height: 0;
    .footer-nav-wrapper,
    .footer-desc,
    .right-tools-wrapper {
      display: none;
    }
    .top-footer {
      display: none;
    }
    .mobile-footer {
      display: none;
      justify-content: stretch;
      width: 100%;
    }
  }
}
</style>
