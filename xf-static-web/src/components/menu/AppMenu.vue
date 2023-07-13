<template>
  <div>
    <div class="platform-menu app">
      <div class="platform-box">
        <img
          :src="require('../../assets/app/header_nav_app.png')"
          style="width: 205px"
        />
      </div>
      <div>
        <h3 class="header-menu-title">全站APP</h3>
        <!-- <div id="headerAllQrcode" class="download-img-container"><img src="../../assets/app/download.png" /></div> -->
        <vue-qrious :value="`https://${downloadUrl}`" />
        <p class="qrcode-scan-txt">扫一扫下载全站APP</p>
        <p class="qrcode-scan-support">支持IOS &amp; Android等全部移动设备</p>
        <a
          id="headerAllHref"
          :href="`https://${downloadUrl}?url=${downloadUrl}&amp;agentCode=`"
          class="download-url"
        >
          <!-- xf9866.app -->
          {{ downloadUrl }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import aos from "aos";
import VueQrious from "vue-qrious";
import { getAppDownloadUrlFromServer } from "@/api/index/site";

export default defineComponent({
  components: {
    VueQrious
  },
  setup() {
    const appGame = ref(null);
    // const platforms = ref([
    //     {
    //         code: "QZ",
    //         name: "全站",
    //         image: "qz",
    //         message:
    //             "全球首家一体化娱乐原生APP，尽显流畅、完美操作。海量体育、电竞顶尖赛事，真人娱乐、彩票投注及电子游艺等，最新最全娱乐项目尽在掌中体验扫码下载，即刻拥有！",
    //         link: "https://dy9367.app/",
    //         mobile: "https://dy9367.app/",
    //     },
    //     // {
    //     //     code: "DJ",
    //     //     name: "电竞",
    //     //     image: "dj",
    //     //     message:
    //     //         "独立电竞APP，原生态开发，提供业界最多的赛事玩法和最佳水位，竞技视频同步直播，盘口信息准确无误，界面投注一目了然，极速尽享！",
    //     //     link: "https://xwesport.app",
    //     //     mobile: "https://dybet1.com",
    //     // },
    //     // {
    //     //     code: "TY",
    //     //     name: "体育",
    //     //     image: "ty",
    //     //     message:
    //     //         "独立体育APP，原生态开发，高赔率 玩法多 提供业界最多的赛事玩法和最佳水位，竞技视频同步直播，盘口信息准确无误，界面投注一目了然，极速尽享！",
    //     //     link: "https://dygames.app",
    //     //     mobile: "https://dygames.app",
    //     // },
    // ]);
    // const selectedPlat = ref(platforms.value[0].code);
    // const clickPlat = (plat) => {
    //     selectedPlat.value = plat.code;
    // };

    const openGame = (gameName, gameCode) => {
      appGame.value.open(gameName, "onlyPlatform", gameCode);
    };

    const downloadUrl = ref("");

    const getAppDownloadUrl = () => {
      getAppDownloadUrlFromServer()
        .then((res) => {
          //   console.log(res);
          downloadUrl.value = res.data;
        })
        .catch((err) => {
          console.log(err);
          downloadUrl.value = "xf9866.app";
        });
    };

    onMounted(() => {
      aos.refresh();
      getAppDownloadUrl();
    });
    return {
      // platforms,
      // selectedPlat,
      // clickPlat,
      openGame,
      appGame,
      getAppDownloadUrl,
      downloadUrl
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
.platform-menu.app {
  .header-menu-title {
    color: #d4e2fa;
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
