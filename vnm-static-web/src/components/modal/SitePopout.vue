<template>
  <div class="container">
    <div class="header">{{ $t("sitePopout.sitePopout") }}</div>
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
        <div v-if="selectedItem?.desktopImgUrl">
          <img
            @click="onClickPopoutImg(`/promotion?name=${selectedItem.path}`)"
            :src="`${imgURL}${selectedItem.desktopImgUrl}`"
          />
          <!-- <router-link :to="`/promotion?name=${selectedItem.path}`" class="check-details-btn">{{ $t('sitePopout.checkDetails') }}</router-link> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getSitePopoutList } from "@/api/personal/common";
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";
import { useRouter } from "vue-router";
import { uiStore } from "@/store/ui";
import { EDITION } from "@/constant/edition";

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
  getSitePopoutList(siteType).then((res) => {
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
</style>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  // background-color: white;
  align-items: center;
  font-family: "PingFang SC";
  background: url("../../assets/images/home/site-popout/popout-bg.png") no-repeat center center;
  // background-size: 100% 100%;
  // aspect-ratio: 1826 / 1156;
  // padding: 8% 5% 0% 5%;
  padding: 8% 4% 5% 4%;
  background-size: 100% 100%;
  width: 830px;

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
    display: none;
  }

  .content {
    // display: grid;
    // grid-template-columns: 1.5fr 2fr;
    // grid-template-columns: 0.7fr 1.7fr;
    width: 100%;
    height: 100%;
    min-height: 300px;
    max-height: 400px;
    gap: 10px;
    display: flex;
    overflow: auto;

    .left {
      flex: 2;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      height: 300px;
      overflow: auto;
      height: 100%;
      gap: 10px;

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
          font-family: "SF Pro";
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
          color: #414252;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .period {
          font-family: "SF Pro";
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
      max-width: 475px;
      flex: 5;

      text-align: right;
      > div {
        width: 100%;
        height: 100%;
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
        border-radius: 18px;
        border: 2px solid #36afe3;
        max-height: 390px;

        &:hover {
          filter: brightness(0.9);
        }
      }
    }
  }
}
</style>
