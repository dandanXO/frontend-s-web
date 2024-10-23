<template>
  <div class="container">
    <q-carousel
      class="site-popout-carousel"
      v-model="selectedItemIndex"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      navigation
      control-color="blue"
    >
      <q-carousel-slide
        :name="index"
        class="column no-wrap flex-start"
        v-for="(popoutListItem, index) in popoutList"
        :key="index"
      >
        <div class="content">
          <div class="right">
            <div v-if="selectedItem?.desktopImgUrl">
              <img
                @click="onClickPopoutImg(`/promotion?name=${selectedItem.path}`)"
                :src="`${imgURL}${selectedItem.desktopImgUrl}`"
              />
            </div>
          </div>
          <div class="left">
            <div class="left-item active">
              <div class="title">{{ popoutListItem.title }}</div>
              <div class="period" v-if="popoutListItem.displayStartTime && popoutListItem.displayEndTime">
                {{ moment(popoutListItem.displayStartTime).format("DD/MM/YYYY") }} -
                {{ moment(popoutListItem.displayEndTime).format("DD/MM/YYYY") }}
              </div>
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
  <img @click="props.closePopout" class="close-btn" src="../../assets/images/home/site-popout/close-btn.png" />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { api } from "boot/axios";
import moment from "moment";
import { useRouter } from "vue-router";
import { EDITION } from "src/constant/edition";

import { useUI } from "src/stores/ui";
const ui = useUI();
const router = useRouter();
const props = defineProps(["closePopout"]);
const popoutList = ref([]);
const selectedItemIndex = ref();
const selectedItem = computed(() =>
  popoutList.value.length > 0 ? popoutList.value?.[selectedItemIndex.value] : undefined
);
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

const onClickPopoutImg = (path) => {
  router.push(path);
  props.closePopout();
};

onMounted(() => {
  let siteType;
  switch (ui.edition) {
    case EDITION.SLOT:
      siteType = "slot";
      break;
    case EDITION.NORMAL:
      siteType = "main";
      break;
    default:
    // siteType = "HOME";
  }
  api.get(`/member/site-popout-list?siteType=${siteType}`).then((res) => {
    if (res.code === 0) {
      popoutList.value = res.data;

      if (res.data.length > 0) {
        selectedItemIndex.value = 0;
      }
    }
  });
});
</script>

<style lang="scss">
.announcement-modal {
  .el-dialog__body {
    padding: 0 !important;
  }
}

.site-popout-carousel {
  background: transparent;
  height: 100%;
  width: 100%;
  .q-carousel__slides-container {
    height: 100% !important;
  }
  .q-carousel__control {
    bottom: 5vw !important;
  }

  .q-carousel__navigation-icon--inactive {
    color: #bcc9e5 !important;
  }
}
</style>

<style lang="scss" scoped>
.close-btn {
  margin: 3% auto;
  display: flex;
  height: 35px;
}

.container {
  display: flex;
  flex-direction: column;
  // background-color: white;
  align-items: center;
  font-family: "SF Pro";
  background: url("../../assets/images/home/site-popout/popout-bg.png") no-repeat center center;
  justify-content: center;
  background-size: contain;
  transform: scale(0.9);

  // aspect-ratio: 644 / 837;
  // padding: 10% 2%;
  // min-height: 490px;

  height: 65vh;
  max-height: 420px;
  margin: auto;
  @media (max-width: 430px) {
    max-height: 440px;
  }
  @media (max-width: 414px) {
    max-height: 430px;
  }
  @media (max-width: 390px) {
    max-height: 420px;
  }
  @media (max-width: 375px) {
    max-height: 410px;
  }

  .header {
    border-bottom: 1px solid black;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1rem;
    visibility: hidden;
  }

  .content {
    // display: grid;
    // grid-template-rows: 1fr auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    padding-top: 30px;
    .left {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      width: 95%;
      // max-width: 300px;
      // margin: 0 auto 25px;
      margin: 0 auto 2vw;
      justify-content: center;
      align-items: center;

      .left-item {
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 3% 5%;
        font-weight: 700;
        background: url("../../assets/images/home/site-popout/list-item-bg.png") no-repeat center center;
        background-size: 100% 100%;
        // aspect-ratio: 300 / 50;
        width: 100%;
        max-width: 300px;

        .title {
          font-family: "SF Pro";
          color: #2792fd;
          font-size: 16px;
          font-weight: 700;
          line-height: 30px;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .period {
          font-family: "SF Pro";
          color: #414252;
          font-size: 14px;
          font-weight: 400;
          line-height: 25px;
        }

        &.active {
          background: url("../../assets/images/home/site-popout/list-item-bg-active.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }

    .right {
      position: relative;
      height: 100%;
      > div {
        text-align: center;
        height: 60vw;
        max-height: 240px;
        width: 100%;
        img {
          // height: 100%;
          width: unset;
          height: 100%;
          border-radius: 18px;
          border: 2px solid #36afe3;
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
        cursor: pointer;
        // height: 100%;
        &:hover {
          filter: brightness(0.9);
        }
      }
    }
  }
}
</style>
