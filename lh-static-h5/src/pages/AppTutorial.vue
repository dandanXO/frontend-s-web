<template>
  <q-page>
    <div class="app-tutorial-container">
      <div class="top">
        <div class="row">
          <img class="phone-img" src="../assets/images/app-tutorial/phone.png" />
          <div class="right">
            <img class="logo" src="../assets/logo.png" />
            <div class="qr-code-row">
              <VueQRCodeComponent :size="100" :text="downloadUrl" class="qr-code" />
              <img class="text" src="../assets/images/app-tutorial/text.png" />
            </div>
            <!-- <button v-if="activeTab === 0" class="standard-button btn-color-blue" @click="() => {}">IOS安装指引</button>
            <button v-else-if="activeTab === 1" class="standard-button btn-color-blue" @click="() => {}">安卓安装指引</button> -->
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="tabs">
          <div :class="`tab tab-left ${activeTab === 0 ? 'active' : ''}`" @click="activeTab = 0">IOS教程</div>
          <div :class="`tab tab-right ${activeTab === 1 ? 'active' : ''}`" @click="activeTab = 1">安卓教程</div>
        </div>
        <img v-if="activeTab === 0" class="ios-tutorial-img" src="../assets/images/app-tutorial/ios-tutorial.png" />
        <img v-else-if="activeTab === 1" class="android-tutorial-img" src="../assets/images/app-tutorial/android-tutorial.png" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VueQRCodeComponent from "vue-qrcode-component";
import { api } from "boot/axios";

const activeTab = ref(0);

const downloadUrl = ref("");

const getAppDownloadUrl = () => {
  api
    .get("/app/getAppData?siteCode=lh1&appType=ALL_SITE")
    .then((res) => {
      // console.log(res);
      var downloadurl = res.data.downloadPageUrl;
      const affiliate= sessionStorage.getItem("AFFILIATE_CODE");
      downloadUrl.value= `${downloadurl}?agentCode=${affiliate}`;
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(() => {
  getAppDownloadUrl();
});
</script>

<style lang="scss">
.app-tutorial-container {
  background: url('../assets/images/app-tutorial/app-tutorial-bg.png') no-repeat top center;
  background-size: 100% auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .top {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 20px 0px;

    .row {
      display: flex;
      gap: 10px;

      .phone-img {
        aspect-ratio: 293 / 600;
        width: 150px;
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;

        .logo {
          aspect-ratio: 300 / 120;
          width: 130px;
        }
      }

    }
  }

  .qr-code-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    .qr-code {
      background: #fff;
      padding: 10px;
      border-radius: 6px;
      width: 120px;
      height: 120px;
      box-shadow: 0px 0px 8px 0px #a9c9ea inset;
    }

    .text {
      aspect-ratio: 414 / 127;
      width: 150px;
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
    gap: 10px;

    .tabs {
      display: flex;
      align-items: center;

      .tab {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 700;
        line-height: 30px;
        width: 180px;
        height: 50px;
        cursor: pointer;

        &:hover {
          filter: brightness(0.9);
        }
      }

      .tab-left {
        background: url('../assets/images/app-tutorial/tab-left.png') no-repeat center center;
        background-size: 100% 100%;

        &.active {
          background: url('../assets/images/app-tutorial/tab-left-active.png') no-repeat center center;
          background-size: 100% 100%;
          color: #fff;
        }
      }

      .tab-right {
        background: url('../assets/images/app-tutorial/tab-right.png') no-repeat center center;
        background-size: 100% 100%;

        &.active {
          background: url('../assets/images/app-tutorial/tab-right-active.png') no-repeat center center;
          background-size: 100% 100%;
          color: #fff;
        }
      }
    }

    .android-tutorial-img {
      width: 100%;
      aspect-ratio: 366 / 3084;
    }

    .ios-tutorial-img {
      width: 100%;
      aspect-ratio: 558 / 4878;
    }
  }
}
</style>
