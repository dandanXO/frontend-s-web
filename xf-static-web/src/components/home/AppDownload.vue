<template>
  <div class="app-wrapper">
    <div class="app-wrapper__left"><img src="@/assets/home/app-phone.png" /></div>
    <div class="app-wrapper__right">
      <div class="top-bar">
        <div class="top-bar__item">
          <div class="item-icon"><img src="@/assets/home/app-1.png" /></div>
          <div class="item-txt">更便捷</div>
        </div>
        <div class="top-bar__item">
          <div class="item-icon"><img src="@/assets/home/app-2.png" /></div>
          <div class="item-txt">更快速</div>
        </div>
        <div class="top-bar__item">
          <div class="item-icon"><img src="@/assets/home/app-3.png" /></div>
          <div class="item-txt">更稳定</div>
        </div>
        <div class="top-bar__item">
          <div class="item-icon"><img src="@/assets/home/app-4.png" /></div>
          <div class="item-txt">更安全</div>
        </div>
      </div>
      <div class="bottom-bar">
        <div class="bottominner bottom-bar__left">
          <span class="bottom-bar__title">扫码下载APP</span>
          <span class="bottom-bar__qr">
            <VueQRCodeComponent :size="140" :text="downloadUrl" class="dl-frame" />
          </span>
          <span class="bottom-bar__bottxt">
            支持ios/Android
            <br />
            全部移动设备
          </span>
          <el-button
            @click="goToLink(`${downloadUrl}?url=${downloadUrl}&agentCode=`)"
            class="common-btn bottom-bar__btn"
          >
            <span style="color: #ffffff; width: 100%; height: 100%" class="download-url">立即下载</span>
          </el-button>
        </div>
        <div class="bottominner bottom-bar__rgt">
          <span class="bottom-bar__title">手机访问网页端</span>
          <span class="bottom-bar__qr">
            <VueQRCodeComponent :size="140" text="downloadUrl" class="dl-frame" />
          </span>
          <span class="bottom-bar__bottxt">
            <a href="downloadUrl" target="_blank">{{ downloadUrl }}</a>
          </span>
          <el-button @click="goToLink(downloadUrl)" class="common-btn bottom-bar__btn">
            <span style="color: #ffffff; width: 100%; height: 100%">直接访问</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VueQRCodeComponent from "vue-qrcode-component";
import { getAppDownloadUrlFromServer } from "@/api/index/site";

import { defineComponent, onMounted, ref } from "vue";

const downloadUrl = ref("");
const getAppDownloadUrl = () => {
  getAppDownloadUrlFromServer()
    .then((res) => {
      // alert(res);
      downloadUrl.value = res;
    })
    .catch((err) => {
      console.log(err);
      downloadUrl.value = "xf8578.app";
    });
};

const goToLink = (url) => {
  window.open(url, "_blank");
};

onMounted(() => {
  getAppDownloadUrl();
});
</script>
<style scoped lang="scss">
.app-wrapper {
  display: flex;
  gap: 10px;
  &__left {
    flex: 1;
    img {
      width: 100%;
    }
  }
  &__right {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;
    flex: 1;
    .top-bar {
      display: flex;
      width: 65%;
      margin: 0 auto;
      background: #202c47;
      padding: 10px 20px;
      border-radius: 12px;
      gap: 20px;
      justify-content: center;
      align-items: center;
      &__item {
        display: flex;
        gap: 5px;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        .item-icon {
          width: 32px;
          img {
            width: 100%;
          }
        }
        .item-txt {
          color: #b8b8b8;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
    .bottom-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70%;
      margin: 0 auto;
      gap: 20px;
      font-family: PingFang SC;
      &__left,
      &__rgt {
        padding: 30px 35px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        border-radius: 12px;
        color: #b8b8b8;
        background: #202c47;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        min-height: 360px;
        a {
          color: #32ceed;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
        }
      }
      &__title {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        font-family: PingFang SC;
      }
      &__qr {
        padding: 10px;
        border-radius: 12px;
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &__btn {
        background: linear-gradient(180deg, #32ceed 0%, #1c7587 100%);
        width: 100%;
        padding: 15px 30px;
        border-radius: 100px;
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
