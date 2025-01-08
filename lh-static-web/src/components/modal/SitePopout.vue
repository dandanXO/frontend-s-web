<template>
  <div class="container">
    <div class="header">
      <img src="../../assets/images/home/site-popout/icon-hot.png" alt="">
      <span>热门活动</span>
    </div>
    <div class="content">
      <div class="left">
        <div
          class="left-item"
          :class="index === selectedItemIndex ? 'active' : ''"
          v-for="(popoutListItem, index) in popoutList"
          @click="selectedItemIndex = index"
        >
          <div class="title">{{ popoutListItem.title }}</div>
          <div class="period" v-if="popoutListItem.displayStartTime && popoutListItem.displayEndTime">
            {{ moment(popoutListItem.displayStartTime).format("DD/MM/YYYY") }} -
            {{ moment(popoutListItem.displayEndTime).format("DD/MM/YYYY") }}
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
            <swiper-slide v-for="(popoutListItem, index) in popoutList">
              <div class="promo-banner-wrapper">
                <img
                  class="promo-banner"
                  @click="onClickPopoutImg(`/promotion?name=${selectedItem.path}`)"
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
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { loadHomePopups } from "@/api/index/promo";
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";
import { useRouter } from "vue-router";
import { uiStore } from "@/store/ui";


import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";

const $swiper = ref(null);
const swiperInterval = ref();

const onSwiper = (swiper) => {
  $swiper.value = swiper;
};

const nextSlide = () => {
  const newIndex = (() => {
    if(selectedItemIndex.value === (popoutList.value.length - 1)) {
      return 0;
    } else if(selectedItemIndex.value < popoutList.value.length) {
      return selectedItemIndex.value + 1;
    }
  })();
  
  selectedItemIndex.value = newIndex;
}

const EDITION = {
  NORMAL: "NORMAL",
  SLOT: "SLOT"
};

const router = useRouter();
const ui = uiStore();

const popoutList = ref([]);
const selectedItemIndex = ref();

const selectedItem = computed(() =>
  popoutList.value.length > 0 ? popoutList.value?.[selectedItemIndex.value] : undefined
);
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

const onClickPopoutImg = (path) => {
  router.push(path);
};

onMounted(() => {
  let siteType = "main";
  switch (ui.edition) {
    case EDITION.SLOT:
      siteType = "slot";
  }
  loadHomePopups(siteType).then((res) => {
    if (res.code === 0) {
      popoutList.value = res.data;

      if (res.data.length > 0) {
        selectedItemIndex.value = 0;

        if(!swiperInterval.value) {
          swiperInterval.value = setInterval(() => {
            nextSlide();
          },3000);
        }
      }
    }
  });
});

onUnmounted(() => {
  clearInterval(swiperInterval.value);
})

watch(() => selectedItemIndex.value, () => {
  if($swiper.value) {
    $swiper.value.slideTo(selectedItemIndex.value);
  }
})
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
  width: 1131px;
  height: 687px;
  gap: 16px;
  padding: 45px;

  .header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
    background: #E8F0FD;
    color: #2792FD;
    height: 70px;
    border-radius: 8px;
    gap: 4px;
    position: relative;
  }

  .content {
    width: 100%;
    height: 100%;
    gap: 10px;
    overflow: auto;
    display: grid;
    grid-template-columns: 689px 342px;

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
        padding: 6%;
        font-weight: 700;
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
        border: 1px solid #56a0eb5c;

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
    margin-top: 35%;

    .content {
      grid-template-columns: 435px 265px;
    }
  }
}

@media screen and (max-width: 800px) {
  .container {
    width: 600px;
    height: 500px;
    margin-top: 50%;

    .content {
      grid-template-columns: 335px 165px;
    }
  }
}
</style>
