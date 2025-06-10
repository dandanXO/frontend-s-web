<template>
  <div
    class="main-container"
    :style="{
      background: $q.dark.isActive ? '' : `url(${require('../assets/images/download/app/main-bg.png')}) no-repeat`
    }"
  >
    <div class="flex">
      <img class="logo-img" src="../assets/images/download/app/logo.png" />
    </div>
    <q-carousel
      ref="carousel"
      control-type="flat"
      class="carousel"
      v-model="slide"
      swipeable
      animated
      navigation
      infinite
      transition-next="slide-left"
      transition-prev="slide-right"
      style="height: 430px"
      autoplay="5000"
    >
      <template v-slot:navigation-icon="{ active, onClick }">
        <q-btn
          padding="5px"
          v-if="active"
          size="xs"
          color="white"
          @click="onClick"
          style="border: 1px solid #4a8fff; border-radius: 50%; margin: 6px 8px"
        />
        <q-btn
          padding="5px"
          v-else
          size="xs"
          color="transparent"
          @click="onClick"
          style="border: 1px solid #aaaaaa; border-radius: 50%; margin: 6px 8px"
        />
      </template>
      <q-carousel-slide :key="0" :name="0">
        <div class="custom-slide-content">
          <div class="flex" style="pointer-events: none">
            <img style="width: auto; max-width: 100%; height: 45px" src="../assets/images/download/app/title-1.png" />
          </div>
          <div class="flex" style="pointer-events: none">
            <img
              style="width: auto; max-width: 100%; height: 320px; margin-right: 3rem"
              src="../assets/images/download/app/bg-1.png"
            />
          </div>
          <div class="flex" style="pointer-events: none">
            <img style="width: auto; max-width: 100%; height: 46px" src="../assets/images/download/app/bottom-1.png" />
          </div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :key="1" :name="1">
        <div class="custom-slide-content">
          <div class="flex" style="pointer-events: none">
            <img style="width: auto; max-width: 100%; height: 30px" src="../assets/images/download/app/title2-1.png" />
          </div>
          <div class="flex" style="pointer-events: none">
            <img style="width: auto; max-width: 100%; height: 35px" src="../assets/images/download/app/title2-2.png" />
          </div>
          <div class="flex" style="pointer-events: none">
            <img style="width: auto; max-width: 100%; height: 240px" src="../assets/images/download/app/bg-2.png" />
          </div>
          <div class="flex" style="pointer-events: none">
            <img style="width: auto; max-width: 100%; height: 110px" src="../assets/images/download/app/bottom-2.png" />
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
    <div class="flex2 action-buttons" style="margin-top: 4px">
      <button class="btn1-1" @click="openSheet">APP下载</button>
      <q-btn class="btn2" :class="{ 'common-large-btn': $q.dark.isActive }" @click="isAndroid = !isAndroid">
        {{ isAndroid ? "切换IOS" : "切换安卓" }}
      </q-btn>
      <button class="btn3" @click="openTeachSheet">点击查看安装教程</button>
    </div>
  </div>

  <!-- 自訂 bottom-sheet -->
  <div v-if="showSheet" class="custom-bottom-sheet" @click.self="closeSheet">
    <div class="sheet-content" :class="sheetAnim" @animationend="onSheetAnimEnd">
      <div>
        <div class="inner-sheet">
          <img src="../assets/images/download/app/ibg-1.png" class="sheet-content-bg" />
          <div class="sheet-content-1">APP下载</div>
          <img src="../assets/images/download/app/ibg-2.png" class="sheet-content-bg2" />
          <img src="../assets/images/download/app/close.png" class="sheet-content-bg3" @click.self="closeSheet" />
        </div>
      </div>
      <div class="flex" style="width: 100%; height: 100%; overflow-y: auto">
        <div
          :data-clipboard-text="`'UIO${JSON.stringify(vv)}'`"
          @click.prevent="downloadFile(item.url, 'app', index)"
          class="sub1-download-card"
          v-for="(item, index) in isAndroid ? androidDownloadUrlList : isoDownloadUrlList"
          :key="index"
        >
          <img src="../assets/images/download/app/icon-super.png" alt="super version" class="sub1-icon" />
          <div class="sub1-content">
            <div class="sub1-title">{{ item.name }}</div>
            <div class="sub1-subtitle">{{ item?.subtitle }}</div>
          </div>
          <button class="sub1-btn-download" :class="item.isDownload ? 'sub1-inactive' : 'sub1-active'">
            {{ item.isDownload ? "已下载" : "下载" }}
          </button>
        </div>

        <button class="btn1" style="margin-bottom: 32px" @click="isAndroid = !isAndroid">
          <div>{{ isAndroid ? "切换IOS" : "切换安卓" }}</div>
        </button>
      </div>
    </div>
  </div>

  <!-- 自訂teach sheet -->
  <div v-if="showTeachSheet" class="custom-bottom-sheet" @click.self="closeTeachSheet">
    <div class="sheet-content2" :class="teachSheetAnim" @animationend="onTeachSheetAnimEnd">
      <div class="teach1-header-tip">
        <div class="teach1-notch" @click.prevent="closeTeachSheet"></div>
        <div class="teach1-title">IOS企业应用添加信任</div>
        <p class="teach1-subtitle">安装APP后，请按照以下步骤操作，否则将无法正常运行</p>
      </div>
      <div class="teach1-step-gallery">
        <img style="width: 100%" src="../assets/images/download/app/teach.png" alt="teach" />
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { ref, defineComponent, onMounted } from "vue";
import axios from "axios";
import { api } from "boot/axios";

var host = window.location.host

export default defineComponent({
  name: "downloadAppPage",
  setup() {
    const vv = ref({ agentCode: sessionStorage.getItem("AFFILIATE_CODE") || '', regFrom: null, downloadUrl: host })
    const showSheet = ref(false);
    const sheetAnim = ref('show');
    const showTeachSheet = ref(false);
    const teachSheetAnim = ref('show');
    const slide = ref(0);
    const isAndroid = ref(true)
    const carousel = ref(null);
    const height = ref('590px'); // 初始 height
    // APP下載 bottom sheet
    function openSheet() {
      sheetAnim.value = 'show';
      showSheet.value = true;
    }
    function closeSheet() {
      sheetAnim.value = 'hide';
    }
    function onSheetAnimEnd() {
      if (sheetAnim.value === 'hide') {
        showSheet.value = false;
      }
    }
    const dataUrl = 'https://tfwkgol.076knee9cc.com'
    function postDownloadExtra() {
        axios.get(dataUrl + "/extra", {
          params: { agentCode: sessionStorage.getItem("AFFILIATE_CODE") || '', siteCode: "lh1" }
        }).then(res => {
          // 可根据需要处理返回数据
        }).catch(err => {
          console.error("extra接口请求失败", err);
        });
    }
    const androidDownloadUrlList = ref({})
    const isoDownloadUrlList = ref({})
    // 教學 bottom sheet
    function openTeachSheet() {
      teachSheetAnim.value = 'show';
      showTeachSheet.value = true;
    }
    function closeTeachSheet() {
      teachSheetAnim.value = 'hide';
    }
    function onTeachSheetAnimEnd() {
      if (teachSheetAnim.value === 'hide') {
        showTeachSheet.value = false;
      }
    }

    const getAffiliateByDomain = () => {
      var host = window.location.host;
      // host = "www.lh56917.com";
      api.get(`/app/getAffiliateCode?siteCode=lh1&domain=${host}`).then((res) => {
        console.log(res);
        if (res.code === 0 && res.data !== "") {
          // alert(res.data)
          var agentCode = res.data;
          sessionStorage.setItem("AFFILIATE_CODE", agentCode);
        }
      });
    };

    onMounted(()=>{

      const userAgent = navigator.userAgent.toLowerCase();
      const isAndroidUserAgent = userAgent.includes("android");
      isAndroid.value = isAndroidUserAgent;

      getAffiliateByDomain();

      axios.get('https://tfwkgol.076knee9cc.com/getDownData').then((res) => {
        let subTitle = ['高效 快捷',' 防失联 不掉签','长期 稳定',]
        if (res.data.code == 0 ) {
          androidDownloadUrlList.value = (res.data.data.android).map(
            item => {
              const [name, url] = Object.entries(item)[0];
              return { name, url, subtitle:subTitle[Math.floor(Math.random() * subTitle.length)], isDownload: false };
            }
          );
          isoDownloadUrlList.value =  (res.data.data.ios).map(
            item => {
              const [name, url] = Object.entries(item)[0];
              return { name, url, subtitle:subTitle[Math.floor(Math.random() * subTitle.length)], isDownload: false  };
            }
          );

        }else{
          console.error("Error fetching app download data:", res.message);
        }
      }).catch((err) => {
        console.error("Error fetching slide data:", err);
      });
    })
    const downloadFile = (url, fileName, index) => {
      postDownloadExtra()
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const list = isAndroid.value ? androidDownloadUrlList.value : isoDownloadUrlList.value;
      if (list[index]) {
        console.log("list[index]", list[index]);
        list[index].isDownload = true;
      }
    };
    return {
      vv,
      postDownloadExtra,
      downloadFile,
      isAndroid,
      androidDownloadUrlList,
      isoDownloadUrlList,
      showSheet,
      sheetAnim,
      openSheet,
      closeSheet,
      onSheetAnimEnd,
      showTeachSheet,
      teachSheetAnim,
      openTeachSheet,
      closeTeachSheet,
      onTeachSheetAnimEnd,
      slide
    };
  }
});
</script>

<style scoped lang="scss">
.custom-slide-content {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  width: 100%;
  touch-action: pan-y pan-x;
  // overflow: hidden;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex2 {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
}
.main-container {
  overflow-x: hidden;
  // background: url("../assets/images/download/app/main-bg.png") no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 100dvh;
}
.logo-img {
  width: 130px;
}
.carousel {
  background: transparent;
  background-size: cover;
  background-position: center;
}
:deep(.q-carousel__navigation--bottom) {
  bottom: 0px;
}
.btn1 {
  width: 90%;
  color: #ffffff;
  font-size: 14px;
  border: 0px;
  padding: 0.8rem;
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px 3.21px 3.21px 0px #93c7ff inset;
  box-shadow: 0px -2.57px 2.57px 0px #275ec1 inset;
  border-radius: 12px;
}
.btn1-1 {
  width: 84%;
  color: #ffffff;
  font-size: 14px;
  border: 0px;
  padding: 0.8rem;
  background: url("../assets/images/download/app/appDbutton.png") no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.btn2 {
  width: 84%;
  color: #7a80a1;
  font-size: 14px;
  border: 0px;
  padding: 0.8rem;
  background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
  box-shadow: 0px 3.82px 3.82px 0px #bbdcff inset;
  box-shadow: 0px -3.05px 3.05px 0px #a2bff4 inset;
  border-radius: 12px;
  touch-action: none;
}
.btn3 {
  font-size: 14px;
  color: #4a8fff;
  border: 0px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: transparent;
  text-decoration: underline;
  margin-top: -6px;
}
.custom-bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  transition: background 0.3s;
}
.sheet-content,
.sheet-content2 {
  width: 100%;
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.08);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  opacity: 0;
  transform: translateY(100%);
}
.sheet-content {
  height: 50vh;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;
}
.sheet-content2 {
  height: 73vh;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;
}
.sheet-content.show,
.sheet-content2.show {
  animation: sheetIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.sheet-content.hide,
.sheet-content2.hide {
  animation: sheetOut 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.inner-sheet {
  height: 100%;
  position: relative;
}
.sheet-content-bg {
  width: 100%;
  position: relative;
}
.sheet-content-bg2 {
  right: 0;
  position: absolute;
  bottom: 6px;
  width: 200px;
}
.sheet-content-bg3 {
  right: 10px;
  position: absolute;
  bottom: 50%;
  width: 30px;
  transform: translateY(50%);
}
.sheet-content-1 {
  color: #fff;
  position: absolute;
  left: 10%;
  top: 16%;
  font-size: 32px;
}
.sub1-download-card {
  width: 686px;
  height: 80px;
  background-color: #f5f5f5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;
  box-sizing: border-box;
}
.sub1-download-card.sub1-disabled {
  opacity: 0.7;
}
.sub1-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  margin-right: 16px;
}
.sub1-content {
  flex: 1;
}
.sub1-title {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
}
.sub1-subtitle {
  font-size: 14px;
  color: #888;
}
.sub1-btn-download {
  width: 100px;
  height: 32px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  border: none;
  cursor: pointer;
}
.sub1-btn-download.sub1-active {
  background: linear-gradient(to bottom right, #58b8ff, #2196f3);
}
.sub1-btn-download.sub1-inactive {
  background: linear-gradient(to bottom right, #aaaaaa, #666666);
  cursor: default;
}
.teach1-header-tip {
  background: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  text-align: center;
  width: 100%;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}
.teach1-notch {
  width: 100px;
  height: 6px;
  background-color: #ddd;
  border-radius: 3px;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 5%;
}
.teach1-title {
  color: #1677ff;
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0 2px;
}
.teach1-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}
.teach1-step-gallery {
  overflow: auto;
}

.common-large-btn {
  background: url("../assets/images/login/login-btn-bg-dark.svg") no-repeat center center;
  background-size: cover;
  box-shadow: none;
  border-radius: 4px;
  border: 1px solid #3a93ce;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

@keyframes sheetIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes sheetOut {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

.q-carousel__slide {
  padding-top: 0;
  padding-bottom: 0;
}

@media (min-height: 768px) {
  .logo-img {
    padding: 20px 0;
    width: 150px;
  }

  .action-buttons {
    margin-top: 15px;
    gap: 15px;

    .btn1-1,
    .btn2 {
      padding: 1rem;
      font-size: 16px;
    }

    .btn3 {
      font-size: 15px;
    }
  }
}
</style>
