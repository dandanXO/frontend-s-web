<template>
  <div style="max-width: 1400px">
    <div class="platform-menu app">
      <template v-for="(det, idx) in platforms" :key="idx">
        <div class="appmeu-container">
          <div class="appmenu-img">
            <img
              :src="require('../../assets/app/appmenu-3.png')"
              alt=""
            />
          </div>
          <div class="appmenu-desc">
            <div class="img-qr-title">综合客户端下载</div>
            <div class="img-desc">引领市场的卓越技术，自主研发了全套终端应用，让您畅享 Web,H5,更有iOS,Android原生APP，让您随时随地，娱乐 投注！</div>

            <div class="dl-wrapper">
              <VueQRCodeComponent :size="120" :text="downloadUrl" class="dl-frame" />
              <div class="link-desc">手机免费下载地址</div>
              <div class="link"><a :href="downloadUrl" target="_blank">{{ downloadUrl }}</a></div>
            </div>

            <!--            <a-->
            <!--              class="app-url"-->
            <!--              :href="`${downloadUrl}?url=${downloadUrl}&agentCode=`"-->
            <!--            >-->
            <!--              {{ downloadUrl }}-->
            <!--            </a>-->
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import aos from "aos";
// import VueQrious from "vue-qrious";
import { getAppDownloadUrlFromServer } from "@/api/index/site";
import VueQRCodeComponent from "vue-qrcode-component";

export default defineComponent({
  components: {
    VueQRCodeComponent
    // VueQrious
  },
  setup() {
    const appGame = ref(null);
    const platforms = ref([
      {
        code: "QZ",
        name: "全站",
        image: "qz",
        message:
          "全球首家一体化娱乐原生APP，尽显流畅、完美操作。海量体育、电竞顶尖赛事，真人娱乐、彩票投注及电子游艺等，最新最全娱乐项目尽在掌中体验扫码下载，即刻拥有！",
        link: "https://dy9367.app/",
        mobile: "https://dy9367.app/"
      }
    ]);
    const selectedPlat = ref(platforms.value[0].code);
    const clickPlat = (plat) => {
      selectedPlat.value = plat.code;
    };

    const openGame = (gameName, gameCode) => {
      appGame.value.open(gameName, "onlyPlatform", gameCode);
    };

    const downloadUrl = ref("");

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
      aos.refresh();
      getAppDownloadUrl();
    });
    return {
      platforms,
      selectedPlat,
      clickPlat,
      openGame,
      appGame,
      downloadUrl,
      getAppDownloadUrl
    };
  }
});
</script>

<style scoped lang="scss">
.download-img-container {
  padding: 5px 5px 0;
  background: #ffffff;
  width: 100px;
  margin: 0 auto;
  img {
    width: 100%;
  }
}

.appmeu-container {
  display: flex;
  gap: 10px;
  align-items: center;

  .appmenu-img {
    img {
      display: block;
      width: 100%;
      max-width: 350px;
    }
    @media screen and (min-width: 1550px) {
      min-width: 300px;
    }
  }
  .img-qr-title {
    color: #7A80A1;
    font-size: 28px;
  }
  .img-desc {
    color:#A4AABB;
    font-size: 16px;
  }

  .img-slogan {
    color: #666;
    font-size: 12px;
    margin-top: 5px;
    white-space: nowrap;
  }
  .app-url {
    color: #3b9be5;
  }
}
.platform-menu.app {
  .header-menu-title {
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 9px;
  }
  .qrcode-scan-txt {
    color: #5a758e;
    margin-top: 12px;
  }
  .qrcode-scan-support {
    color: #666;
    margin: 6px 0 3px;
  }
  .download-url {
    width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    font-size: 18px;
    color: #3b9be5;
    text-decoration: none;
  }
}

.appmenu-desc{
  width: 500px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.dl-wrapper {
  width: 40%;
  max-width: 180px;
}

.dl-frame {
  background-image: url(../../assets/home/download/qr-frame.png);
  background-position: center center;
  background-size: 100% 100%;
  padding: 40px 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.qr-wrapper,
.dl-wrapper {
  // border-radius: 0.875rem;
  // background: #e3f5ff;
  // text-align: center;
  // padding: 0.5rem 1rem;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // gap: 3px;

  div {
    text-align: center;
  }

  canvas {
    text-align: center;
  }

  .link-desc {
    color: #7a80a1;
    font-family: PingFang SC;
    font-size: 1rem;
    font-weight: 400;
    line-height: 116.5%; /* 1.165rem */
    margin: 0.25rem 0;
  }

  .link {
    color: #468cff;
    font-family: PingFang SC;
    font-size: 0.75rem;
    text-align: center;
    margin:0 auto;
    font-weight: 400;
    line-height: 116.5%; /* 1.165rem */

  }
}

.qr-wrapper {
}
.dl-wrapper {
}

.dark {
  .img-desc,
  .link-desc {
    color: #A0BCD6;
  }

  .dl-frame {
    background-image: url(../../assets/home/download/qr-frame-dark.png);
  }
}
</style>
