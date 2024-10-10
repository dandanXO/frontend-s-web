<template>
  <div class="sticky-sidebar" @mouseleave="customerHovered = false">
    <div class="additional-info-items" v-if="customerHovered">
      <div class="additional-info-item" @click.stop.prevent="store.openLiveChat()">
        <img src="../../assets/images/home/sticky-sidebar-headphone-icon.png" />
        <span>CSKH 24/7</span>
      </div>
      <div class="additional-info-item">
        <img src="../../assets/images/home/sticky-sidebar-mail-icon.png" />
        <span style="margin-left: 5px">vnsupport@tf88.com</span>
      </div>
      <div class="additional-info-item">
        <img src="../../assets/images/home/sticky-sidebar-telegram-icon.png" />
        <span style="margin-left: 5px">@TF88_CS</span>
      </div>
    </div>
    <div class="sticky-sidebar-items">
      <router-link to="/promotion" class="sticky-sidebar-item" @mouseover="customerHovered = false">
        <img class="icon" src="../../assets/images/home/sticky-sidebar-hot-promo-icon.png" />
        <div class="label">{{ $t("stickySidebar.hotPromotions") }}</div>
      </router-link>
      <div class="sticky-sidebar-item" @mouseover="customerHovered = true">
        <img class="icon" src="../../assets/images/home/sticky-sidebar-cs-icon.png" />
        <div class="label">{{ $t("stickySidebar.customerService") }}</div>
      </div>
      <div @mouseover="customerHovered = false">
        <router-link to="/app" class="sticky-sidebar-item">
          <img class="icon" src="../../assets/images/home/sticky-sidebar-app-dl-icon.png" />
          <div class="label">{{ $t("stickySidebar.appDownload") }}</div>
        </router-link>
      </div>
      <div @mouseover="customerHovered = false" class="sticky-sidebar-item" @click="scrollToTop">
        <img class="icon" src="../../assets/images/home/sticky-sidebar-back-top-icon.png" />
        <div class="label">{{ $t("stickySidebar.backToTop") }}</div>
      </div>
    </div>
    <div class="red-envelope" v-if="store && store.token && isRedPacketShow" @click="getRedEnvelope">
      <img src="../../assets/home/redpacket.png" />
    </div>

    <GameModal ref="gameMenu" />
    <div class="rocket-wrapper" v-if="showRocket" :class="'show-rocket'"
      :style="{ top: rocketPosition.top + 'px', left: rocketPosition.left + 'px' }"
      @mousedown="startDragging('rocket', $event)">
      <div>
        <div class="close-btn" @click="hideRocket()">X</div>
        <!-- <div class="rocket-container" @click="openGame('TFGaming', 'TFGaming', '20')">
        <div class="rocket">
          <img :src="`${imgURL}/game/${game.icon}`" />
        </div>
      </div> -->
        <el-carousel height="100px" :indicator-position="gamePromo.length > 1 ? 'outside' : 'none'" arrow="never"
          :autoplay="true" :interval="3000">
          <el-carousel-item v-for="(game, i) in gamePromo" :key="i">
            <div @click="openGame(game.platform, game.platform, game.code)" class="rocket-container">
              <div class="rocket"><img :src="`${imgURL}/game/${game.icon}`" /></div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div class="rocket-wrapper" v-if="showFloatPromo" :class="'show-promo'"
      :style="{ top: promoPosition.top + 'px', left: promoPosition.left + 'px' }"
      @mousedown="startDragging('promo', $event)">
      <div style="position: relative">
        <div class="close-btn" @click="hideFloatPromo()">X</div>
        <el-carousel height="130px" :indicator-position="floatPromo.length > 1 ? 'outside' : 'none'" arrow="never"
          :autoplay="true" :interval="3000">
          <el-carousel-item v-for="(promo, i) in floatPromo" :key="i">
            <div @click="gotoPromo(promo.code)" class="rocket-container">
              <div class="rocket"><img :src="`${imgURL}/promo/${promo.icon}`" /></div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<script>
import { defineAsyncComponent, defineComponent, onMounted, ref } from "vue";
import { userStore } from "@/store";
import { getRedEnvelopeFromServer, getFloatingItems } from "@/api/index/site";
import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

const GameModal = defineAsyncComponent(() => import('@/components/modal/GameModal.vue'));

export default defineComponent({
  components: {
    GameModal
  },
  setup() {
    const customerHovered = ref(false);
    const scrollToTop = () => {
      window.scroll({ behavior: "smooth", left: 0, top: 0 });
    };
    const store = userStore();
    const router = useRouter();

    const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value;

    const getRedEnvelope = () => {
      router.push("/promotion?name=phongbao-lixi2/9");
    };

    const isRedPacketShow = ref(false);
    const isPacketChecked = ref(null);
    const getCheckRedPacket = () => {
      isPacketChecked.value = setInterval(() => {
        if (store && store.token) {
          getRedEnvelopeFromServer()
            .then((res) => {
              clearInterval(isPacketChecked.value);
              console.log(res);
              if (res.code === 0) {
                isRedPacketShow.value = res.data.nowIsRain;
              }
            })
            .catch((err) => {
              clearInterval(isPacketChecked.value);
            });
        }
      }, 10000);
    };

    const gameMenu = ref(null);
    const openGame = (gameName, platType, gameCode, scrollingState) => {
      gameMenu.value.open(gameName, platType, gameCode, scrollingState);
    };
    const showRocket = ref(false);
    const hideRocket = () => {
      showRocket.value = false;
      promoPosition.value = { top: window.innerHeight - 200, left: window.innerWidth - 220 };
    };
    const showFloatPromo = ref(false);
    const hideFloatPromo = () => {
      showFloatPromo.value = false;
    };
    const floatPromo = [];
    const gamePromo = [];
    const initFloating = () => {
      floatPromo.value = [];
      gamePromo.value = [];
      getFloatingItems().then((res) => {
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
          });
          checkFloatPromo();
          updatePromo(); // Initially update the displayed promo
          // Update the displayed promo every 5 seconds
          setInterval(updatePromo, 3000);
        } else {
          ElMessage.error(res.message);
        }
      });
    };
    const checkFloatPromo = () => {
      if (gamePromo.length === 0) {
        promoPosition.value = { top: window.innerHeight - 200, left: window.innerWidth - 220 };
      }
    };

    const rocketPosition = ref({ top: window.innerHeight - 200, left: window.innerWidth - 220 });
    const promoPosition = ref({ top: window.innerHeight - 320, left: window.innerWidth - 220 });
    const isDragging = ref(false);
    const shiftX = ref(0);
    const shiftY = ref(0);
    const currentElement = ref(null);
    const startDragging = (element, event) => {
      currentElement.value = element;
      const rect = event.target.getBoundingClientRect();
      shiftX.value = event.clientX - rect.left;
      shiftY.value = event.clientY - rect.top;
      isDragging.value = true;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", stopDragging);

      // Change cursor to dragging
      document.body.style.cursor = "pointer";
      event.target.style.cursor = "pointer";
    };
    const onMouseMove = (event) => {
      if (isDragging.value) {
        if (currentElement.value === "rocket") {
          rocketPosition.value.left = event.clientX - shiftX.value;
          rocketPosition.value.top = event.clientY - shiftY.value;
        } else if (currentElement.value === "promo") {
          promoPosition.value.left = event.clientX - shiftX.value;
          promoPosition.value.top = event.clientY - shiftY.value;
        }
      }
    };
    const stopDragging = () => {
      isDragging.value = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDragging);

      // Reset cursor to default
      document.body.style.cursor = "default";
    };
    const currentPromo = ref(null);
    const currentPromoIndex = ref(0);
    const gotoPromo = (code) => {
      router.push(`/promotion?name=${code}`);
    };
    const updatePromo = () => {
      currentPromo.value = floatPromo[currentPromoIndex.value];
      currentPromoIndex.value = (currentPromoIndex.value + 1) % floatPromo.length;
    };

    onMounted(() => {
      getCheckRedPacket();
      initFloating();
    });
    return {
      store,
      customerHovered,
      scrollToTop,
      getRedEnvelope,
      isRedPacketShow,
      gameMenu,
      openGame,
      showRocket,
      rocketPosition,
      hideRocket,
      startDragging,
      showFloatPromo,
      promoPosition,
      hideFloatPromo,
      imgURL,
      floatPromo,
      gamePromo,
      currentPromo,
      currentPromoIndex,
      gotoPromo
    };
  }
});
</script>

<style scoped lang="scss">
/* rocket animation */
.rocket-wrapper {
  position: fixed;
  z-index: 999;
  // bottom: 220px;
  // right: 0px;
  transition: all 0.3s;
  display: none;
  width: 100px;
  height: 100px;
  user-select: none;
  /* Disable text selection */

  &.show-promo {
    display: block;
  }

  &.show-rocket {
    display: block;
  }

  &:hover {
    filter: brightness(0.9);
  }

  .close-btn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: #aaaaaa;
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

  .rocket {
    pointer-events: none;
    user-select: none;

    img {
      display: block;
      width: 100px;
      cursor: pointer;
    }
  }
}

.additional-info-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0px;
  background: #fff;
  height: min-content;
  border-radius: 25px;

  .additional-info-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    color: #424f72;
    gap: 10px;
    cursor: pointer;
    padding: 10px 25px;

    &:hover {
      background-color: #e5f5ff;
    }
  }
}

.sticky-sidebar-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 10px 5px;
  background: #ffffff;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  box-shadow: 0px 0px 8px 0px #00000038;

  .sticky-sidebar-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #000;
    gap: 5px;
    cursor: pointer;

    &:hover {
      img {
        filter: brightness(1.05);
      }

      color: #4e93ff;
    }
  }
}

.sticky-sidebar {
  position: fixed;
  right: 0;
  bottom: 200px;
  z-index: 300;
  display: flex;
  flex-direction: row;
  background: transparent;
  border-radius: 6px 0 0 6px;
  -webkit-transition: right 0.3s ease-out;
  transition: right 0.3s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;


  @media (max-width: 768px) {

    .sticky-sidebar-items {
      gap: 5px;
      padding: 5px;

      .sticky-sidebar-item {
        .label {
          font-size: 10px;
        }

        .icon {
          width: 40px;
        }
      }
    }
  }
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-10px);
  }

  50% {
    transform: translateX(10px);
  }

  75% {
    transform: translateX(-10px);
  }

  100% {
    transform: translateX(0);
  }
}

.red-envelope {
  width: 150px;
  height: 150px;
  cursor: pointer;
  margin-right: 94px;
  position: absolute;
  right: -70px;
  bottom: -185px;
  animation: shake 1s ease-in-out infinite;
  animation-delay: 2s;

  img {
    width: 100%;
  }
}

@keyframes tilt-shaking {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(5deg);
  }

  50% {
    transform: rotate(0eg);
  }

  75% {
    transform: rotate(-5deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@keyframes shake-with-pause {
  0% {
    transform: translateX(0);
  }

  10% {
    transform: translateX(-10px);
  }

  20% {
    transform: translateX(10px);
  }

  30% {
    transform: translateX(-10px);
  }

  40% {
    transform: translateX(10px);
  }

  50% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(0);
  }
}

.red-envelope {
  animation: tilt-shaking 1s infinite;
}
</style>
