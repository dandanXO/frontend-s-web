<template>
  <div class="app-tutorial-container">
    <div class="top">
      <div class="row">
        <img data-aos="fade-right" class="phone-img" src="../assets/images/app-tutorial/phone.png" />
        <div class="right" data-aos="fade-left">
          <img class="logo" src="../assets/logo.png" />
          <div class="qr-code-row">
            <VueQRCodeComponent :size="216" :text="downloadUrl" class="qr-code" />
            <img class="text" src="../assets/images/app-tutorial/text.png" />
          </div>
          <!-- <button v-if="activeTab === 0" class="standard-button btn-color-blue" @click="() => {}">IOS安装指引</button>
                    <button v-else-if="activeTab === 1" class="standard-button btn-color-blue" @click="() => {}">安卓安装指引</button> -->
        </div>
      </div>
    </div>
    <div class="bottom" data-aos="fade-up">
      <div class="tabs">
        <div :class="`tab tab-left ${isDark ? 'color-B':''} ${activeTab === 0 ? (isDark ? 'dark-active':'active') : ''}`" @click="activeTab = 0">IOS教程</div>
        <div :class="`tab tab-right ${isDark ? 'color-B':''} ${activeTab === 1 ? (isDark ? 'dark-active':'active') : ''}`" @click="activeTab = 1">安卓教程</div>
      </div>
      <template v-if="isDark">
        <img
          data-aos="fade-in"
          v-if="activeTab === 0"
          class="ios-tutorial-img"
          src="../assets/images/app-tutorial/ios-tutorial-dark.png"
        />
        <img
          data-aos="fade-in"
          v-else-if="activeTab === 1"
          class="android-tutorial-img"
          src="../assets/images/app-tutorial/android-tutorial-dark.png"
        />
      </template>
      <template v-else>
        <img
          data-aos="fade-in"
          v-if="activeTab === 0"
          class="ios-tutorial-img"
          src="../assets/images/app-tutorial/ios-tutorial.png"
        />
        <img
          data-aos="fade-in"
          v-else-if="activeTab === 1"
          class="android-tutorial-img"
          src="../assets/images/app-tutorial/android-tutorial.png"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import VueQRCodeComponent from "vue-qrcode-component";
import { getAppDownloadUrlFromServer } from "@/api/index/site";
import { useDark } from "@vueuse/core";

const activeTab = ref(0);

const downloadUrl = ref("");

const isDark = useDark();

const getAppDownloadUrl = () => {
  getAppDownloadUrlFromServer()
    .then((res) => {
      downloadUrl.value = res.downloadPageUrl;
    })
    .catch((err) => {
      console.log(err);
      downloadUrl.value = "leihuo6.com";
    });
};

onMounted(() => {
  getAppDownloadUrl();
});
</script>

<style lang="scss">
.app-tutorial-container {
  background: url("../assets/images/app-tutorial/app-tutorial-bg.png") no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .top {
    padding: 50px;

    .row {
      display: flex;
      gap: 50px;

      .phone-img {
        aspect-ratio: 293 / 600;
        height: 600px;
      }

      .right {
        display: flex;
        flex-direction: column;
        gap: 50px;

        .logo {
          aspect-ratio: 300 / 120;
          width: 200px;
        }
      }
    }
  }

  .qr-code-row {
    display: flex;
    align-items: center;
    gap: 50px;

    .qr-code {
      background: #fff;
      padding: 15px;
      border-radius: 6px;
      width: 246px;
      height: 246px;
      box-shadow: 0px 0px 8px 0px #a9c9ea inset;
    }

    .text {
      aspect-ratio: 414 / 127;
      height: 100px;
    }
  }

  .standard-button {
    width: 220px;
    height: 53px;
    font-size: 24px;
    font-weight: 700;
    line-height: 30px;
  }

  .bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
    min-height: 1600px;
    gap: 50px;

    .tabs {
      display: flex;
      align-items: center;
      .color-B {
        color: #000;
      }
      .tab {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
        line-height: 30px;
        width: 318px;
        height: 74px;
        cursor: pointer;

        &:hover {
          filter: brightness(0.9);
        }
      }

      .tab-left {
        background: url("../assets/images/app-tutorial/tab-left.png") no-repeat center center;
        background-size: 100% 100%;

        &.active {
          background: url("../assets/images/app-tutorial/tab-left-active.png") no-repeat center center;
          background-size: 100% 100%;
          color: #fff;
        }
        &.dark-active {
          background: url("../assets/images/app-tutorial/tab-left-active.png") no-repeat center center;
          background-size: 100% 100%;
          color: #fff;
        }
      }

      .tab-right {
        background: url("../assets/images/app-tutorial/tab-right.png") no-repeat center center;
        background-size: 100% 100%;

        &.active {
          background: url("../assets/images/app-tutorial/tab-right-active.png") no-repeat center center;
          background-size: 100% 100%;
          color: #fff;
        }
        &.dark-active {
          background: url("../assets/images/app-tutorial/tab-right-active.png") no-repeat center center;
          background-size: 100% 100%;
          color: #fff;
        }
      }
    }

    .android-tutorial-img {
      height: 1500px;
      aspect-ratio: 1320 / 1551;
    }

    .ios-tutorial-img {
      height: 1500px;
      aspect-ratio: 1525 / 1598;
    }
  }
}
</style>
