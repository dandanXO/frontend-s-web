<template>
  <div class="container">
    <div class="header">
      <img src="../../assets/images/home/site-popout/icon-hot.png" alt="" />
      <span>热门活动</span>
    </div>
    <div class="content">
      <div class="left" id="right-items">
        <div
          class="left-item"
          :class="index === selectedItemIndex ? 'active' : ''"
          v-for="(popoutListItem, index) in popoutList"
          @click="selectRightSlide(index)"
          :id="`left-item-${index}`"
          :key="`left-item-${index}`"
        >
          <div class="title">{{ popoutListItem.title }}</div>
          <div class="period" v-if="popoutListItem.startTime && popoutListItem.endTime">
            {{ moment(popoutListItem.startTime).format("YYYY/MM/DD") }} -
            {{ moment(popoutListItem.endTime).format("YYYY/MM/DD") }}
          </div>
        </div>
      </div>
      <div class="right">
        <div v-if="selectedItem?.desktopImgUrl" class="banner-section">
          <swiper
            :spaceBetween="20"
            :loop="false"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            class="swiper-wrapper"
            :direction="'vertical'"
          >
            <swiper-slide v-for="(popoutListItem, i) in popoutList" :key="i">
              <div class="promo-banner-wrapper">
                <img
                  class="promo-banner"
                  @click="$emit('popup-click', selectedItem.path)"
                  :src="`${imgURL}${popoutListItem.desktopImgUrl}`"
                />
              </div>
            </swiper-slide>
          </swiper>
          <!-- <router-link :to="`/promotion?name=${selectedItem.path}`" class="check-details-btn">{{ $t('sitePopout.checkDetails') }}</router-link> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted, defineEmits } from "vue";
import { loadHomePopups } from "@/api/index/promo";
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";
// import { useRouter } from "vue-router";
import { uiStore } from "@/store/ui";

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";

defineEmits(["popup-click"]);

const $swiper = ref(null);
const swiperInterval = ref();

const onSwiper = (swiper) => {
  $swiper.value = swiper;
};

const nextSlide = () => {
  const newIndex = (() => {
    if (selectedItemIndex.value === popoutList.value.length - 1) {
      return 0;
    } else if (selectedItemIndex.value < popoutList.value.length) {
      return selectedItemIndex.value + 1;
    }
  })();

  document.getElementById(`left-item-${newIndex}`).scrollIntoView({
    behavior: "smooth", // 平滑滚动
    block: "center", // 元素滚动到视口的位置，可选值：'start', 'center', 'end', 'nearest'
    inline: "nearest" // 水平滚动位置
  });

  selectedItemIndex.value = newIndex;
};

const selectRightSlide = (index) => {
  selectedItemIndex.value = index;
  resetInterval();
};

const EDITION = {
  NORMAL: "NORMAL",
  SLOT: "SLOT"
};

const props = defineProps(["onShow"]);
// const router = useRouter();
const ui = uiStore();

const popoutList = ref([]);
const selectedItemIndex = ref();
const popupExpiryMap = ref({});

const selectedItem = computed(() =>
  popoutList.value.length > 0 ? popoutList.value?.[selectedItemIndex.value] : undefined
);
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

const onSlideChange = (_swiper) => {
  selectedItemIndex.value = _swiper.activeIndex;
};

onMounted(() => {
  try {
    popupExpiryMap.value = JSON.parse(localStorage.getItem("POPUP"));
  } catch {}

  let siteType = "main";
  switch (ui.edition) {
    case EDITION.SLOT:
      siteType = "slot";
  }
  loadHomePopups(siteType).then((res) => {
    if (res.code === 0) {
      const popupListData = res.data.filter((popup) => {
        if (popupExpiryMap.value && Object.keys(popupExpiryMap.value).includes(popup.path)) {
          const now = Date.now();
          const timestamp = now - popupExpiryMap.value[popup.path].lastSeen;
          const minutes = Math.floor(timestamp / (1000 * 60));

          if (popup.frequency === "EVERYDAY" && minutes <= 1440) {
            return false;
          }

          if (popup.frequency === "SESSION" && minutes <= 131107.2) {
            return false;
          }
        }

        return true;
      });

      popoutList.value = sessionStorage.getItem("POPUP") === "true" ? popupListData : [];

      if (Object.keys(popoutList.value).length > 0) {
        props.onShow();

        popoutList.value.forEach((popup) => {
          popupExpiryMap.value = {
            ...popupExpiryMap.value,
            [popup.path]: {
              lastSeen: Date.now(),
              frequency: popup.frequency
            }
          };
        });

        localStorage.setItem("POPUP", JSON.stringify(popupExpiryMap.value));
      }
      sessionStorage.removeItem("POPUP");

      if (res.data.length > 0) {
        selectedItemIndex.value = 0;

        if (!swiperInterval.value) {
          startInterval();
        }
      }
    }
  });
});

const startInterval = () => {
  swiperInterval.value = setInterval(() => {
    nextSlide();
  }, 3000);
};

const resetInterval = () => {
  clearInterval(swiperInterval.value); // 清除当前的 interval
  startInterval(); // 重新开始一个新的 interval
};

onUnmounted(() => {
  clearInterval(swiperInterval.value);
});

watch(
  () => selectedItemIndex.value,
  () => {
    if ($swiper.value) {
      $swiper.value.slideTo(selectedItemIndex.value);
    }
  }
);
</script>

<style lang="scss">
.announcement-modal {
  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  // background-color: white;
  align-items: center;
  font-family: "PingFang SC";
  background: url("../../assets/images/home/site-popout/popout-bg2.png") no-repeat center center;
  background-size: 100% 100%;
  width: 904px;
  height: 550px;
  gap: 6px;
  padding: 25px 17px;
  // max-width: 50vw;
  aspect-ratio: 904 / 550;

  .header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
    background: #e8f0fd;
    color: #2792fd;
    height: 80px;
    border-radius: 8px;
    gap: 4px;
    position: relative;
  }

  .content {
    width: 100%;
    height: 100%;
    gap: 0;
    overflow: auto;
    display: grid;
    grid-template-columns: 2fr 1fr;
    padding: 0 15px;

    .left {
      flex: 2;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      height: 300px;
      overflow: auto;
      height: 100%;
      gap: 10px;
      order: 2;

      // &::-webkit-scrollbar {
      //   -webkit-appearance: none;
      //   width: 8px;
      //   background-color: #ededed;
      // }

      // &::-webkit-scrollbar-thumb {
      //   border-radius: 4px;
      //   background-color: #D1D1D1;
      //   border: 1px solid #808080;
      //   box-shadow: 0 0 1px rgba(255, 255, 255, .5);
      // }

      .left-item {
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 4% 10%;
        gap: 5px;
        font-weight: 700;
        min-height: 68px;
        background: url("../../assets/images/home/site-popout/list-item-bg.png") no-repeat center center;
        background-size: 100% 100%;
        // aspect-ratio: 300 / 100;

        .title {
          font-family: "PingFang SC";
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
          color: #414252;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
        }

        .period {
          font-family: "PingFang SC";
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: #414252;
        }

        &.active {
          background: url("../../assets/images/home/site-popout/list-item-bg-active.png") no-repeat center center;
          background-size: 100% 100%;

          .title {
            color: #2792fd;
          }
        }
      }
    }

    .right {
      position: relative;
      height: 100%;
      // border-radius: 15px;
      // border: 2px solid #2cbdff;
      overflow: hidden;
      flex: 5;
      text-align: right;

      .banner-section {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        // border: 1px solid #56a0eb5c;

        .promo-banner-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .promo-banner {
          width: 100%;
          height: auto;
          width: auto;
          height: auto;
          max-width: 100%;
        }
      }

      .check-details-btn {
        position: absolute;
        right: 5%;
        bottom: 5%;
        color: black;
        border: 1px solid black;
        padding: 1% 3%;
        border-radius: 5px;
        cursor: pointer;
        background-color: #e7e7e7;

        &:hover {
          background-color: #f2f2f2;
        }

        &:active {
          transform: translateY(2px);
        }
      }

      img {
        // width: 100%;
        height: 100%;
        // transform: scale(1.01);
        cursor: pointer;

        &:hover {
          filter: brightness(0.9);
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .container {
    width: 800px;
    height: 570px;

    // .content {
    //   grid-template-columns: 435px 265px;
    // }
  }
}

@media screen and (max-width: 800px) {
  .container {
    width: 600px;
    height: 500px;

    // .content {
    //   grid-template-columns: 335px 165px;
    // }
  }
}
.dark {
  .container {
    background: url("../../assets/images/home/site-popout/dark-popout-bg2.png") no-repeat center center !important;
    background-size: 100% 100% !important;
    .header {
      background: linear-gradient(180deg, rgba(179, 217, 255, 0.2) 0%, rgba(179, 217, 255, 0.2) 100%);
      color: #fff;
      font-family: YouSheBiaoTiHei;
    }
    .left-item {
      background: url("../../assets/images/home/site-popout/dark-list-item-bg.png") no-repeat center center !important;
      background-size: 100% 100% !important;
      margin: 0px 5px;

      .title {
        color: #ffffff99 !important;
      }
      .period {
        color: #ffffff99 !important;
      }

      &.active {
        background: url("../../assets/images/home/site-popout/dark-list-item-bg-active.png") no-repeat center center !important;
        background-size: 100% 100% !important;
        margin: 0px;
        .title {
          color: #fff !important;
        }
        .period {
          color: #fff !important;
        }
      }
    }
  }
}
</style>
