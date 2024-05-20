<template>
  <div class="sticky-sidebar" @mouseleave="customerHovered = false">
    <div class="additional-info-items" v-if="customerHovered">
      <div class="additional-info-item" @click.stop.prevent="store.openLiveChat()">
        <img src="../../assets/images/home/sticky-sidebar-headphone-icon.png" />
        <span>24小时在线客服</span>
      </div>
      <div class="additional-info-item">
        <img src="../../assets/images/home/sticky-sidebar-mail-icon.png" />
        <span style="margin-left: 5px">cs@lh8080.com</span>
      </div>
      <div class="additional-info-item">
        <img src="../../assets/images/home/sticky-sidebar-phone-icon.png" />
        <span style="margin-left: 5px"><span class="customer_phone">+85281701071</span></span>
      </div>
    </div>
    <div class="sticky-sidebar-items">
      <div
        v-if="store.memberType === 'TEST' || store.memberType === 'PROMO_TEST'"
        class="sticky-sidebar-item"
        @click="handleDarkModeClick"
      >
        <img src="@/assets/images/home/sticky-sidebar-dark-mode-icon.png" />
        <div>{{ isDark ? "白天" : "黑暗" }}模式</div>
      </div>
      <router-link to="/promotion" class="sticky-sidebar-item" @mouseover="customerHovered = false">
        <img src="../../assets/images/home/sticky-sidebar-hot-promo-icon.png" />
        <div>热门活动</div>
      </router-link>
      <div class="sticky-sidebar-item" @mouseover="customerHovered = true">
        <img src="../../assets/images/home/sticky-sidebar-cs-icon.png" />
        <div>客服中心</div>
      </div>
      <div @mouseover="customerHovered = false">
        <router-link to="/app" class="sticky-sidebar-item">
          <img src="../../assets/images/home/sticky-sidebar-app-dl-icon.png" />
          <div>APP下载</div>
        </router-link>
      </div>
      <div @mouseover="customerHovered = false" class="sticky-sidebar-item" @click="scrollToTop">
        <img src="../../assets/images/home/sticky-sidebar-back-top-icon.png" />
        <div>返回顶部</div>
      </div>
    </div>
  </div>

  <GameModal ref="gameMenu" />
  <div class="rocket-wrapper" v-if="showRocket" :class="store.token && store.memberType === 'TEST' && 'show-rocket'">
    <div class="close-btn" @click="hideRocket()">X</div>
    <div class="rocket-container" @click="openGame('TFGaming', 'TFGaming', '20')">
      <div class="rocket"><img src="../../assets/images/home/rocket.png" /></div>
      <div class="blue-smoke"><img src="../../assets/images/home/blue-smoke.svg" /></div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import { userStore } from "@/store";
import { getAppDownloadUrlFromServer } from "@/api/index/site";
import { uiStore } from "@/store/ui";
import { useDark } from "@vueuse/core";
import GameModal from "@/components/modal/GameModal.vue";

export default defineComponent({
  components: { GameModal },
  setup() {
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
      gameMenu.value.open(gameName, platType, gameCode, scrollingState);
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

    const showRocket = ref(true);
    const hideRocket = () => {
      showRocket.value = false;
    };

    onMounted(() => {
      getAppDownloadUrl();
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
      hideRocket
    };
  }
});
</script>

<style scoped lang="scss">
// rocket animation
.rocket-wrapper {
  position: fixed;
  top: 180px;
  right: -50px;
  z-index: 280;
  transition: all 0.3s;
  cursor: pointer;
  display: none;

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
    margin-left: 24px;
  }

  .rocket-container {
    position: relative;
    animation: fly 3s linear infinite;
    display: flex;
    flex-direction: column;

    // &::after {
    //   content: "";
    //   position: absolute;
    //   bottom: -30px;
    //   left: 50%;
    //   transform: translateX(-50%);
    //   width: 20px;
    //   height: 40px;
    //   background: radial-gradient(circle, rgb(192, 192, 192) 0%, rgba(0, 0, 0, 0) 70%);
    //   animation: smoke 0.5s linear infinite;
    // }
  }
  .rocket {
    transform: rotate(10deg);
    z-index: 282;

    img {
      display: block;
      width: 100px;
    }
  }
  .blue-smoke {
    margin-left: -135px;
    margin-top: -2px;
    transform: rotate(-10deg);
    animation: smokeMove 0.5s linear infinite;
    z-index: 281;
    img {
      display: block;
      width: 200px;
    }
  }
}

@keyframes rocketMove {
  0%,
  100% {
    transform: rotate(-10deg) translateY(-50px) scale(0.85);
  }

  70% {
    transform: rotate(10deg) translateY(50px) scale(1);
  }
}

@keyframes smokeMove {
  0%,
  100% {
    opacity: 1;
    transform: rotate(-10deg);
  }

  70% {
    opacity: 0.5;
    transform: rotate(-10deg);
  }
}

@keyframes fly {
  0% {
    bottom: -100px;
    transform: translateX(-50%) rotate(0deg) scale(1);
  }
  25% {
    bottom: 30%;
    transform: translateX(-50%) rotate(2deg) scale(0.95);
  }
  50% {
    bottom: 60%;
    transform: translateX(-50%) rotate(-2deg) scale(1);
  }
  75% {
    bottom: 90%;
    transform: translateX(-50%) rotate(2deg) scale(0.95);
  }
  100% {
    bottom: 110%;
    transform: translateX(-50%) rotate(0deg) scale(1);
  }
}

@keyframes smoke {
  0% {
    opacity: 0.7;
    transform: translate(-50%, 0) scale(1);
  }
  50% {
    opacity: 0.4;
    transform: translate(-50%, -50px) scale(1.5);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -100px) scale(2);
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
  gap: 15px;
  padding: 15px;
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
    @include content-block-dark;

    .sticky-sidebar-item {
      color: $color-white;
    }
  }

  .additional-info-items {
    @include content-block-dark;

    .additional-info-item {
      color: $color-white;

      &:hover {
        background: rgba($font-1-dark, 10%);
      }
    }
  }
}
</style>
