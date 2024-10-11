<template>
  <div style="max-width: 1400px">
    <div class="platform-menu app">
      <template v-for="(det, idx) in platforms" :key="idx">
        <div class="appmeu-container">
          <div class="appmenu-img">
            <img
              :src="require('../../assets/app/appmenu_' + det.image + '.png')"
              alt=""
            />
          </div>
          <div>
            <div class="img-qr-title">{{ det.name }}APP</div>
            <div class="qrcode-bg">
            </div>
            <div class="img-desc">扫一扫下载{{ det.name }}APP</div>
            <div class="img-slogan">支持IOS & Android等全部移动设备</div>
            <a
              class="app-url"
              :href="`${downloadUrl}?url=${downloadUrl}&agentCode=`"
            >
              {{ downloadUrl }}
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import aos from "aos";
import { getAppDownloadUrlFromServer } from "@/api/index/site";

export default defineComponent({
  components: {
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
    }
    @media screen and (min-width: 1550px) {
      min-width: 300px;
    }
  }
  .img-qr-title {
    color: #333;
    font-size: 24px;
    margin-bottom: 5px;
  }
  .img-desc {
    color: #333;
    font-size: 16px;
    margin-top: 10px;
    white-space: nowrap;
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
</style>
