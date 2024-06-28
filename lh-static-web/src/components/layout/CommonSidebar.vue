<template>
  <div class="sticky-sidebar" @mouseleave="customerHovered = false">
    <div class="additional-info-items" v-if="customerHovered">
      <div class="additional-info-item" @click.stop.prevent="store.openLiveChat()">
        <img src="../../assets/images/home/sticky-sidebar/cs-icon.svg" />
        <span>24小时在线客服</span>
      </div>
      <div class="additional-info-item">
        <img src="../../assets/images/home/sticky-sidebar/email-icon.svg" />
        <span style="margin-left: 5px">cs@lh8080.com</span>
      </div>
      <div class="additional-info-item">
        <img src="../../assets/images/home/sticky-sidebar/phone-icon.svg" />
        <span style="margin-left: 5px"><span class="customer_phone">+85281701071</span></span>
      </div>
    </div>
    <div class="sticky-sidebar-items">
      <div
        v-if="store.memberType === 'TEST' || store.memberType === 'PROMO_TEST'"
        class="sticky-sidebar-item"
        @click="handleDarkModeClick"
      >
        <img v-if="isDark" src="@/assets/images/home/sticky-sidebar/light-mode-icon.svg" />
        <img v-else src="@/assets/images/home/sticky-sidebar/dark-mode-icon.svg" />
        <div>{{ isDark ? "白天" : "黑暗" }}模式</div>
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
          <div>APP下载</div>
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
      <el-carousel height="130px" :indicator-position="gamePromo.length > 1 ? 'outside' : 'none'" arrow="never" :autoplay="true" :interval="3000">
        <el-carousel-item v-for="(game, i) in gamePromo" :key="i">
            <div @click="openGame(game.platform, game.platform, game.code)" class="rocket-container">
              <div class="rocket"><img :src="`${imgURL}/game/${game.icon}`" /></div>
            </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>

    <div
      class="rocket-wrapper"
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
        <el-carousel height="130px"  :indicator-position="floatPromo.length > 1 ? 'outside' : 'none'" arrow="never" :autoplay="true" :interval="3000">
          <el-carousel-item v-for="(promo, i) in floatPromo" :key="i">
              <div @click="gotoPromo(promo.code)" class="rocket-container">
                <div class="rocket"><img :src="`${imgURL}/promo/${promo.icon}`" /></div>
              </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
</template>
<script>
import { defineComponent, onMounted, ref, onBeforeUnmount, watch } from "vue";
import { userStore } from "@/store";
import { getAppDownloadUrlFromServer, getFloatingItems } from "@/api/index/site";
import { uiStore } from "@/store/ui";
import { useDark, useLocalStorage } from "@vueuse/core";
import GameModal from "@/components/modal/GameModal.vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  components: {
    GameModal
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value
    const customerHovered = ref(false);
    const scrollToTop = () => {
      window.scroll({ behavior: "smooth", left: 0, top: 0 });
    };
    const store = userStore();
    const ui = uiStore();
    const isDark = useDark();

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
    const hideRocket = () => {
      showRocket.value = false;
      promoPosition.value = {top: window.innerHeight - 200, left: window.innerWidth - 220}
    };
    const showFloatPromo = ref(false);
    const hideFloatPromo = () => {
      showFloatPromo.value = false;
    };
    const floatPromo = ([]);
    const gamePromo = ([]);
    const initFloating = () => {
      floatPromo.value = [];
      gamePromo.value = [];
      getFloatingItems().then((res) => {
        if (res.code === 0) {
          res.data.forEach(element => {
            if (element.type === 'PROMO') {
              floatPromo.push(element);
              showFloatPromo.value = true;
            }
            if (element.type === 'GAME') {
              gamePromo.push(element)
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
      })
    }
    const checkFloatPromo = () => {
      if (gamePromo.length === 0) {
        promoPosition.value = {top: window.innerHeight - 200, left: window.innerWidth - 220}
      }
    }

    const rocketPosition = ref({ top: window.innerHeight - 200, left: window.innerWidth - 220 });
    const promoPosition = ref({ top: window.innerHeight - 320, left: window.innerWidth - 220 });
    const isDragging = ref(false);
    const clickAllowed = ref(true);
    const shiftX = ref(0);
    const shiftY = ref(0);
    const currentElement = ref(null);
    const startDragging = (element, event) => {
      currentElement.value = element
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
    }
    const onMouseMove = (event) => {
      isDragging.value = true;
      clickAllowed.value = false;
      if (isDragging.value) {
        if (currentElement.value === 'rocket') {
          rocketPosition.value.left = event.clientX - shiftX.value;
          rocketPosition.value.top = event.clientY - shiftY.value;
        } else if (currentElement.value === 'promo') {
          promoPosition.value.left = event.clientX - shiftX.value;
          promoPosition.value.top = event.clientY - shiftY.value;
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
    const currentPromo = ref(null)
    const currentPromoIndex = ref(0);
    const gotoPromo = (code) => {
      if (!isDragging.value && clickAllowed.value) {
        router.push(`/promotion?name=${code}`)
      }
    }
    const updatePromo = () => {
      currentPromo.value = floatPromo[currentPromoIndex.value];
      currentPromoIndex.value = (currentPromoIndex.value + 1) % floatPromo.length;
    };
    onMounted(() => {
      getAppDownloadUrl();
      if ((store.token)) {
        initFloating();
      }
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
      downloadUrl,
      isDark,
      handleDarkModeClick,
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
      gotoPromo,
      clickAllowed,
      isDragging
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
  user-select: none; /* Disable text selection */

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
  align-items: center;
  padding: 20px 0px;
  background: #fff;
  height: min-content;
  border-radius: 25px;

  .additional-info-item {
    display: flex;
    align-items: center;
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
  gap: 28px;
  padding: 15px;
  background: #ffffff;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  box-shadow: 0px 0px 8px 0px #00000038;

  > :first-child {
    padding-bottom: 15px;
    border-bottom: 1px solid #7A80A14D;
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
  bottom: 60px;
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
}

.dark {
  .sticky-sidebar-items {
    background: linear-gradient(180deg, #2A2E3B 0%, #1F3342 100%);

    > :first-child {
      border-color: #FFFFFF1A;
    }

    .sticky-sidebar-item {
      color: $color-white;

      &:hover {
        color: $active-color-dark;
      }

      img {
        filter: $active-color-dark-filter;
      }
    }
  }

  .additional-info-items {
    background: linear-gradient(180deg, #2A2E3B 0%, #1F3342 100%);

    .additional-info-item {
      color: $color-white;

      &:hover {
        background: rgba($font-1-dark, 10%);
      }

      img {
        filter: $active-color-dark-filter;
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
</style>
