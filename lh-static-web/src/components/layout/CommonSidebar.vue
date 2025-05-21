<template>
  <div class="sticky-sidebar" @mouseleave="customerHovered = false">
    <div class="additional-info-items" v-if="customerHovered">
      <div class="additional-info-item" @click.stop.prevent="store.openLiveChat()">
        <img src="../../assets/images/home/sticky-sidebar/cs-icon.svg" />
        <span style="margin-left: 5px">
          官网客服
          <img width="20px" height="20px" src="../../assets/home/24-hours-line.svg" class="icon-24h" />
        </span>
      </div>
      <a class="additional-info-item" @click.stop.prevent="goToLiveChatPromo()">
        <!-- <img src="../../assets/images/home/sticky-sidebar/email-icon.svg" /> -->
        <img style="margin-right: 8px" src="@/components/hotpromo/officialGift/img/voxis.svg" />
        <span style="margin-left: 5px">专属客服</span>
      </a>
      <!--      <div class="additional-info-item">-->
      <!--        <img src="../../assets/images/home/sticky-sidebar/phone-icon.svg" />-->
      <!--        <span style="margin-left: 5px"><span class="customer_phone">+85281701071</span></span>-->
      <!--      </div>-->
    </div>
    <div class="sticky-sidebar-items">
      <div class="sticky-sidebar-item" @click="handleDarkModeClick">
        <img v-if="isDark" src="@/assets/images/home/sticky-sidebar/light-mode-icon.svg" />
        <img v-else src="@/assets/images/home/sticky-sidebar/dark-mode-icon.svg" />
        <div>{{ isDark ? "白天" : "夜间" }}模式</div>
      </div>
      <!-- <router-link to="/promotion" class="sticky-sidebar-item" @mouseover="customerHovered = false">
        <img src="../../assets/images/home/sticky-sidebar/hot-promo-icon.svg" />
        <div>热门活动</div>
      </router-link> -->
      <div class="sticky-sidebar-item" @mouseover="customerHovered = true">
        <img src="../../assets/images/home/sticky-sidebar/cs-icon.svg" />
        <div>客服中心</div>
      </div>
      <div @mouseover="customerHovered = false">
        <router-link to="/app" class="sticky-sidebar-item">
          <img src="../../assets/images/home/sticky-sidebar/app-dl-icon.svg" />
          <div>APP 下载</div>
        </router-link>
      </div>
      <div @mouseover="customerHovered = false" class="sticky-sidebar-item" @click="scrollToTop">
        <img src="../../assets/images/home/sticky-sidebar/back-top-icon.svg" />
        <div>返回顶部</div>
      </div>
    </div>
  </div>

  <GameModal ref="gameMenu" />

  <div
    class="rocket-wrapper domain-wrapper"
    v-if="showDomain"
    :class="'show-domain'"
    :style="{ top: domainPosition.top + 'px', left: domainPosition.left + 'px' }"
    @mousedown="startDragging('domain', $event)"
  >
    <div>
      <div class="close-btn" @click="hideDomain()">X</div>

      <el-carousel
        height="110px"
        :indicator-position="floatDomain.length > 1 ? 'outside' : 'none'"
        arrow="never"
        :autoplay="true"
        :interval="3000"
      >
        <el-carousel-item v-for="(game, i) in floatDomain" :key="i">
          <div @click="openLink(game.code)" class="rocket-container">
            <div class="rocket">
              <img :src="`${imgURL}/promo/${game.icon}`" />
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>

  <div
    class="rocket-wrapper"
    v-if="showRocket"
    :class="'show-rocket'"
    :style="{ top: rocketPosition.top + 'px', left: rocketPosition.left + 'px' }"
    @mousedown="startDragging('rocket', $event)"
  >
    <div>
      <div class="close-btn" @click="hideRocket()">X</div>
      <!-- <div class="rocket-container" @click="openGame('TFGaming', 'TFGaming', '20')">
        <div class="rocket">
          <img :src="`${imgURL}/game/${game.icon}`" />
        </div>
      </div> -->
      <el-carousel
        height="130px"
        :indicator-position="gamePromo.length > 1 ? 'outside' : 'none'"
        arrow="never"
        :autoplay="true"
        :interval="3000"
      >
        <el-carousel-item v-for="(game, i) in gamePromo" :key="i">
          <div @click="openGame(game.platform, game.platform, game.code)" class="rocket-container">
            <div class="rocket"><img :src="`${imgURL}/game/${game.icon}`" /></div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>

  <div
    class="rocket-wrapper-float"
    v-if="showFloatPromo"
    :class="'show-promo'"
    :style="{ top: promoPosition.top + 'px', left: promoPosition.left + 'px' }"
    @mousedown="startDragging('promo', $event)"
  >
    <div style="position: relative">
      <div class="close-btn" @click="hideFloatPromo()">X</div>
      <!-- <div @click="gotoPromo(currentPromo.code)" class="rocket-container">
          <div class="rocket">
            <img :src="`${imgURL}/promo/${currentPromo.icon}`" />
          </div>
        </div> -->
      <el-carousel
        class="float-carousel"
        height="180px"
        :indicator-position="floatPromo.length > 1 ? 'outside' : 'none'"
        arrow="never"
        :autoplay="true"
        :interval="3000"
      >
        <el-carousel-item v-for="(promo, i) in floatPromo" :key="i">
          <div @click="gotoPromo(promo.code)" class="rocket-container-float">
            <div class="rocket">
              <img :src="`${imgURL}/promo/${promo.icon}`" />
              <span v-if="promo.showTime" class="promo-remaining-time">
                {{ floatPromoRemainingTime[i] }}
              </span>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, onBeforeUnmount, watch } from "vue";
import { userStore } from "@/store";
import { getAppDownloadUrlFromServer, getFloatingItems, getLoggedInFloatingItems } from "@/api/index/site";
import { uiStore } from "@/store/ui";
import { useDark, useLocalStorage } from "@vueuse/core";
import GameModal from "@/components/modal/GameModal.vue";
import { useNotify } from "@/hooks/notify";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
import moment from "moment";

import { storeToRefs } from "pinia";
export default defineComponent({
  components: {
    GameModal
  },
  setup() {
    const notify = useNotify();
    const route = useRoute();
    const router = useRouter();
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value;
    const customerHovered = ref(false);
    const scrollToTop = () => {
      window.scroll({ behavior: "smooth", left: 0, top: 0 });
    };
    const store = userStore();
    const ui = uiStore();
    const isDark = useDark();
    const { memberType } = storeToRefs(store);
    const handleDarkModeClick = () => (isDark.value = !isDark.value);

    const gameMenu = ref(null);
    const openGame = (gameName, platType, gameCode, scrollingState) => {
      if (!isDragging.value && clickAllowed.value) {
        gameMenu.value.open(gameName, platType, gameCode, scrollingState);
      }
    };

    const downloadUrl = ref("");
    const getAppDownloadUrl = () => {
      getAppDownloadUrlFromServer()
        .then((res) => {
          downloadUrl.value = res.downloadPageUrl;
          ui.downloadUrl = downloadUrl.value;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const showRocket = ref(false);
    const showDomain = ref(false);
    const hideRocket = () => {
      showRocket.value = false;
      rocketPosition.value = { top: window.innerHeight - 300, left: window.innerWidth - 320 };
    };
    const openLink = (link) => {
      if (!isDragging.value && clickAllowed.value) {
        if (link) {
          if (link.indexOf(",") > -1) {
            const splitLink = link.split(",");
            const randomIndex = Math.floor(Math.random() * splitLink.length);
            window.open(splitLink[randomIndex], "_blank");
          } else {
            window.open(link, "_blank");
          }
        }
      }
    };

    const showFloatPromo = ref(false);
    const hideFloatPromo = () => {
      showFloatPromo.value = false;
      promoPosition.value = { top: window.innerHeight - 300, left: window.innerWidth - 320 };
      domainPosition.value = { top: window.innerHeight - 300, left: window.innerWidth - 360 };
    };
    const floatPromo = [];
    const floatPromoRemainingTime = ref([]);
    const gamePromo = [];
    const floatDomain = [];
    const initFloating = () => {
      floatPromo.value = [];
      gamePromo.value = [];
      const api = store.token ? getLoggedInFloatingItems : getFloatingItems;
      api().then((res) => {
        if (res.code === 0) {
          res.data.forEach((element) => {
            if (element.type === "PROMO") {
              floatPromo.push(element);
              showFloatPromo.value = true;
            }
            if (element.type === "GAME") {
              gamePromo.push(element);
              showRocket.value = true;
            }
            if (element.type === "DOMAIN") {
              floatDomain.push(element);
              showDomain.value = true;
            }
          });
          checkFloatPromo();
          updatePromo(); // Initially update the displayed promo
          updatePromoRemainingTime();
          // Update the displayed promo every 5 seconds
          setInterval(updatePromo, 3000);

          setInterval(updatePromoRemainingTime, 1000);
        } else {
          notify.error(res.message);
        }
      });
    };
    const checkFloatPromo = () => {
      if (gamePromo.length === 0) {
        promoPosition.value = { top: window.innerHeight - 300, left: window.innerWidth - 320 };
      }
      if (showRocket.value === false) {
        domainPosition.value = { top: window.innerHeight - 320, left: window.innerWidth - 260 };
      }
    };

    const hideDomain = () => {
      showDomain.value = false;
      domainPosition.value = { top: window.innerHeight - 320, left: window.innerWidth - 260 };
    };

    const domainPosition = ref({ top: window.innerHeight - 430, left: window.innerWidth - 240 });
    const rocketPosition = ref({ top: window.innerHeight - 300, left: window.innerWidth - 320 });
    const promoPosition = ref({ top: window.innerHeight - 320, left: window.innerWidth - 320 });
    const isDragging = ref(false);
    const clickAllowed = ref(true);
    const shiftX = ref(0);
    const shiftY = ref(0);
    const currentElement = ref(null);
    const startDragging = (element, event) => {
      currentElement.value = element;
      const rect = event.target.getBoundingClientRect();
      shiftX.value = event.clientX - rect.left;
      shiftY.value = event.clientY - rect.top;
      isDragging.value = false;
      clickAllowed.value = true;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", stopDragging);

      // Change cursor to dragging
      document.body.style.cursor = "pointer";
      event.target.style.cursor = "pointer";
    };
    const onMouseMove = (event) => {
      isDragging.value = true;
      clickAllowed.value = false;
      if (isDragging.value) {
        if (currentElement.value === "rocket") {
          rocketPosition.value.left = event.clientX - shiftX.value;
          rocketPosition.value.top = event.clientY - shiftY.value;
        } else if (currentElement.value === "promo") {
          promoPosition.value.left = event.clientX - shiftX.value;
          promoPosition.value.top = event.clientY - shiftY.value;
        } else if (currentElement.value === "domain") {
          domainPosition.value.left = event.clientX - shiftX.value;
          domainPosition.value.top = event.clientY - shiftY.value;
        }
      }
    };
    const stopDragging = () => {
      isDragging.value = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDragging);

      setTimeout(() => {
        clickAllowed.value = true;
      }, 1000); // Delay of 1 second
      // Reset cursor to default
      document.body.style.cursor = "default";
    };
    const currentPromo = ref(null);
    const currentPromoIndex = ref(0);
    const gotoPromo = (code) => {
      if (!isDragging.value && clickAllowed.value) {
        router.push(`/promotion?name=${code}`);
      }
    };

    const updatePromo = () => {
      currentPromo.value = floatPromo[currentPromoIndex.value];
      currentPromoIndex.value = (currentPromoIndex.value + 1) % floatPromo.length;
    };
    const updatePromoRemainingTime = () => {
      floatPromoRemainingTime.value = floatPromo.map((promo) => {
        let result = "00:00:00";
        if (promo?.endTime) {
          // console.log(promo.endTime);
          const now = moment(Date.now());
          const endTime = moment(promo?.endTime);
          const totalSeconds = endTime.diff(now, "seconds");
          if (totalSeconds > 0) {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            result = `${`${hours}`.padStart(2, 0)}:${`${minutes}`.padStart(2, 0)}:${`${seconds}`.padStart(2, 0)}`;
          }
        }
        return result;
      });

      // console.log(floatPromoRemainingTime.value);
    };

    const goToLiveChatPromo = () => {
      const currentRoute = router.currentRoute.value;
      if (store.vip !== "") {
        const currentName = currentRoute.query.name;
        if (currentRoute.path === "/promotion" && currentName !== "lh-official-gift") {
          router.push(`/promotion?name=lh-official-gift`).then(() => {
            window.location.reload();
          });
        } else {
          router.push(`/promotion?name=lh-official-gift`);
        }
      } else {
        ElMessageBox.alert("请登录后再操作", "系统提示", {
          center: true,
          confirmButtonText: "确认",
          showClose: false,
          buttonSize: "large"
        }).then(() => {
          store.loginPageVisible = true;
          // router.push("/login");
          // emits("open-login-dialog");
        });
        // ElMessageBox.alert("暂未开放", {
        //   autofocus: false,
        //   center: true,
        //   confirmButtonText: "确认",
        //   showClose: false,
        //   buttonSize: "large",
        //   closeOnClickModal: true
        // });
        // return;
      }
    };

    onMounted(() => {
      getAppDownloadUrl();
      initFloating();
      document.addEventListener("mouseup", stopDragging);
    });

    watch(
      () => store.token,
      () => {
        if (store.token) {
          initFloating();
        }
      }
    );
    watch(
      () => route.query.name,
      (newName) => {
        if (newName && newName.includes('page-vip')) {
          router.push('/vip');
        }
      }
    );
    onBeforeUnmount(() => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDragging);
    });

    return {
      updatePromoRemainingTime,
      floatPromoRemainingTime,
      store,
      customerHovered,
      scrollToTop,
      downloadUrl,
      isDark,
      handleDarkModeClick,
      gameMenu,
      openGame,
      showRocket,
      rocketPosition,
      domainPosition,
      hideRocket,
      startDragging,
      showFloatPromo,
      promoPosition,
      hideFloatPromo,
      imgURL,
      floatPromo,
      openLink,
      hideDomain,
      showDomain,
      gamePromo,
      floatDomain,
      currentPromo,
      currentPromoIndex,
      gotoPromo,
      clickAllowed,
      isDragging,
      goToLiveChatPromo,
      ElMessageBox,
      memberType
    };
  }
});
</script>

<style scoped lang="scss">
/* rocket animation */
.rocket-wrapper {
  position: fixed;
  z-index: 666;

  transition: all 0.3s;
  display: none;
  width: 100px;
  height: 100px;
  user-select: none; /* Disable text selection */

  &.show-promo {
    display: block;
  }

  &.domain-wrapper {
    height: auto;
    width: 155px;

    .rocket {
      img {
        display: block;
        width: 155px;
        cursor: pointer;
      }
    }
  }

  &.show-rocket {
    display: block;
  }

  &.show-domain {
    display: block;
  }

  &:hover {
    filter: brightness(0.9);
  }

  .close-btn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #333333;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
    cursor: pointer;
  }
  .rocket-container-float {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .rocket {
    pointer-events: none;
    user-select: none;
    img {
      display: block;
      width: 180px;
      cursor: pointer;
    }
    .promo-remaining-time {
      position: absolute;
      bottom: 16%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 32px;
      font-weight: bold;
      color: #444;
      // color: #eaff00;
      // text-shadow: 2px 2px 0px #00000040;
    }
  }
}
.rocket-wrapper-float {
  position: fixed;
  z-index: 666;

  transition: all 0.3s;
  display: none;
  width: 160px;
  user-select: none; /* Disable text selection */

  &.show-promo {
    display: block;
  }

  &.domain-wrapper {
    height: auto;
    width: 155px;

    .rocket {
      img {
        display: block;
        width: 155px;
        cursor: pointer;
      }
    }
  }

  &.show-rocket {
    display: block;
  }

  &.show-domain {
    display: block;
  }

  &:hover {
    filter: brightness(0.9);
  }

  .close-btn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #333333;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
    cursor: pointer;
  }
  .rocket-container-float {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .rocket {
    pointer-events: none;
    user-select: none;
    img {
      display: block;
      width: 100%;
      cursor: pointer;
    }
    .promo-remaining-time {
      position: absolute;
      bottom: 20%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      font-weight: bold;
      color: #444;
      // color: #eaff00;
      // text-shadow: 2px 2px 0px #00000040;
    }
  }

  :deep(.el-carousel__indicators) {
    bottom: -8px;
  }
}

.additional-info-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0px;
  background: #fff;
  height: min-content;
  border-radius: 25px;
  z-index: 1001;

  .additional-info-item {
    display: flex;
    align-items: center;
    color: #424f72;
    gap: 10px;
    cursor: pointer;
    padding: 10px 25px;
    width: 100%;

    &:hover {
      background-color: #e5f5ff;
    }

    img {
      width: 23px;
    }
  }
}

.sticky-sidebar-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 28px;
  padding: 15px;
  background: #ffffff;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  box-shadow: 0px 0px 8px 0px #00000038;

  > :first-child {
    padding-bottom: 15px;
    border-bottom: 1px solid #7a80a14d;
  }

  .sticky-sidebar-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #000;
    gap: 5px;
    cursor: pointer;

    &:hover {
      color: #4e93ff;
      img {
        filter: brightness(1.05);
      }
    }
  }
}

.sticky-sidebar {
  position: fixed;
  right: 0;
  bottom: 60px;
  z-index: 777;
  display: flex;
  flex-direction: row;
  background: transparent;
  border-radius: 6px 0 0 6px;
  -webkit-transition: right 0.3s ease-out;
  transition: right 0.3s ease-out;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.dark {
  .sticky-sidebar-items {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);

    > :first-child {
      border-color: #ffffff1a;
    }

    .sticky-sidebar-item {
      color: $color-white;

      &:hover {
        // color: rgb(83, 83, 83);
      }

      img {
        filter: brightness(0) invert(1);
      }
    }
  }

  .additional-info-items {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);

    .additional-info-item {
      color: $color-white;

      &:hover {
        background: rgba($font-1-dark, 10%);
      }

      img {
        filter: brightness(0) invert(1);
      }
    }
  }

  .rocket-wrapper {
    .close-btn {
      border-color: $font-3-dark;
      color: $font-3-dark;
    }
  }
}

.icon-24h {
  width: 16px;
  margin-top: -2px;
  margin-left: 3px;
  position: absolute;
  // fill: #a3a3a3;
}

:deep(.el-carousel__indicators) {
  display: flex;
}
// .float-carousel {
//   :deep(.el-carousel__indicators) {
//     width: 100% !important;
//   }
//   :deep(.el-carousel__indicator) {
//     padding-left: 2px;
//     padding-right: 2px;
//   }
// }
</style>
