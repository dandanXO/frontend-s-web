<template>
  <div class="customer-right" :style="!customerHovered ? 'right: -170px;' : 'right: 0;'">
    <div class="customer-right-logo">
      <div class="hot-activity customer-div">
        <router-link to="/promotion">
          <RiPaletteLine />
          <div style="margin-top: 15px">热门活动</div>
        </router-link>
      </div>
      <div
        class="customer-center customer-div"
        @mouseover="customerHovered = true"
        @mouseleave="customerHovered = false"
      >
        <RiCustomerServiceLine />
        <div style="margin-top: 15px">客服中心</div>
        <div class="customer-right-content">
          <div class="customer-content" @click.stop.prevent="store.openLiveChat()">
            <RiCustomerServiceFill />
            <span>24小时在线客服</span>
          </div>
          <!--<div class="content-line"></div>
                  <div class="customer-qq">
                      <div class="remixicon-qq-fill"></div>
                      <span style="margin-left: 2px;">QQ号：<span class="customer_qq_number">2853531804</span></span>
                  </div>-->
          <div class="content-line"></div>
          <div class="customer-email">
            <RiMailFill />
            <span style="margin-left: 5px">cs@xf969.com</span>
          </div>
          <!--          <div class="content-line"></div>-->
          <!--          <div class="customer-num">-->
          <!--            <RiPhoneFill />-->
          <!--            <span style="margin-left: 5px">-->
          <!--              <span class="customer_phone">852-81929166</span>-->
          <!--            </span>-->
          <!--          </div>-->
        </div>
      </div>
      <div class="app-download customer-div">
        <router-link to="/app">
          <RiDownloadCloudLine />
          <div class="remixicon-download-cloud-line"></div>
          <div style="margin-top: 15px">APP下载</div>
        </router-link>
      </div>
      <div class="back-top customer-div" @click="scrollToTop">
        <RiRocketLine />
        <div class="remixicon-rocket-line"></div>
        <div style="margin-top: 15px">返回顶部</div>
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
import {
  RiPaletteLine,
  RiCustomerServiceLine,
  RiCustomerServiceFill,
  RiMailFill,
  RiPhoneFill,
  RiDownloadCloudLine,
  RiRocketLine
} from "vue-remix-icons";
import { userStore } from "@/store";
import { getAppDownloadUrlFromServer, getFloatingItems, getLoggedInFloatingItems } from "@/api/index/site";
import { uiStore } from "@/store/ui";
import { useLocalStorage } from "@vueuse/core";
import GameModal from "@/components/modal/GameModal.vue";
import { useNotify } from "@/hooks/notify";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import moment from "moment";

import { storeToRefs } from "pinia";
export default defineComponent({
  components: {
    RiPaletteLine,
    RiCustomerServiceLine,
    RiCustomerServiceFill,
    RiMailFill,
    RiPhoneFill,
    RiDownloadCloudLine,
    RiRocketLine,
    GameModal
  },
  setup() {
    const notify = useNotify();
    const router = useRouter();
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value;
    const customerHovered = ref(false);
    const scrollToTop = () => {
      window.scroll({ behavior: "smooth", left: 0, top: 0 });
    };
    const store = userStore();
    const ui = uiStore();
    const { memberType } = storeToRefs(store);

    const gameMenu = ref(null);
    const openGame = (gameName, platType, gameCode, scrollingState) => {
      if (!isDragging.value && clickAllowed.value) {
        gameMenu.value.open(gameName, platType, gameCode, scrollingState);
      }
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

    onMounted(() => {
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
    onBeforeUnmount(() => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDragging);
    });

    return {
      store,
      customerHovered,
      scrollToTop,
      floatPromoRemainingTime,
      gameMenu,
      updatePromoRemainingTime,
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

:deep(.el-carousel__indicators) {
  display: flex;
}

:deep(.el-carousel__item){
  background-color: transparent !important;
}

.customer-right {
  position: fixed;
  bottom: 50px;
  width: 240px;
  z-index: 99;
  display: flex;
  flex-direction: row;
  // background: #e4eefe;
  background: #222a34;
  border-radius: 6px 0 0 6px;
  -webkit-transition: right 0.3s ease-out;
  transition: right 0.3s ease-out;
}

.customer-right .customer-right-logo {
  width: 75px;
  font-size: 12px;
  line-height: 1px;
  color: #4080ff;
  border-radius: 6px 0 0 6px;
  // background-color: #fcfcfc;
  background-color: #222a34;
  box-shadow: 2px 3px 10px 0 rgba(61, 60, 60, 0.28);
}

.customer-right .customer-right-content {
  width: 170px;
  height: 264px;
  // background-color: #e4edff;
  background-color: #222a34;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 12px;
  line-height: 22px;
  // color: #74a1f4;
  position: absolute;
  left: 75px;
  top: -66px;
}

.customer-right-logo .customer-div {
  width: 75px;
  height: 66px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  position: relative;
}

.customer-right-logo .customer-div:hover {
  color: #32ceed !important;

  a {
    color: #32ceed !important;
  }

  svg {
    fill: #32ceed !important;
  }
}

.customer-right-content .customer-content {
  width: 134px;
  height: 28px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-image: linear-gradient(36deg, #1e293f 1%, #29585a 100%), linear-gradient(#000, #000);
  background-blend-mode: normal, normal;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 1px;
  color: #fff;
  margin: 50px auto 22px;
}

.customer-right .customer-right-content .content-line {
  height: 2px;
  width: 150px;
  background-color: #3d8183;
  margin: 0 auto;
}

.customer-right-content .customer-email,
.customer-right-content .customer-qq {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0px;
}

.customer-right-content .customer-num {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px 0;
}

.customer-right .customer-div.active {
  background-color: #1d212e;
  color: #fff;
}

.customer-right .back-top {
  padding-bottom: 15px;
}

.customer-right .customer-div svg {
  width: 22px;
  fill: #ffffff;
}

.customer-right .customer-div svg.ri-customer-service-fill {
  fill: #ffffff;
}

.customer-right .customer-right-logo .customer-div a {
  color: #3d8183;
  text-align: center;
  text-decoration: none;
}
.customer-right .customer-right-logo .customer-div {
  color: #3d8183;
  text-align: center;
  text-decoration: none;
}
.customer-right .customer-right-content svg {
  fill: #ffffff;
}
</style>
