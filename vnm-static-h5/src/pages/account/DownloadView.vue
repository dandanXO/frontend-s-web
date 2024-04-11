<template>
  <q-page class="download">
    <q-tabs class="download-tab" v-model="tab" align="justify">
      <q-tab name="android" label="安卓系统" />
      <q-tab name="apple" label="苹果系统" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="android">
        <div class="downloads">
          <div class="download-item q-my-sm" v-for="(dn, i) in androidItems" :key="i">
            <div class="imgtext">
              <img :src="require(`../../assets/images/download/${dn.icon}.png`)" />
              <div>
                <span class="title">{{ dn.title }}</span>
                <br />
                <span class="content">{{ dn.content }}</span>
              </div>
            </div>
            <div class="download-right">
              <div class="download-type">
                <img src="../../assets/images/download/icon-android.png" />
                Android
              </div>
              <a :href="dn.downloadLink" target="_blank">
                <img class="download-btn" src="../../assets/images/download/download-btn-bg.png" />
              </a>
            </div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="apple">
        <div class="downloads">
          <div class="download-item q-my-sm" v-for="(dn, i) in appleItems" :key="i">
            <div class="imgtext">
              <img :src="require(`../../assets/images/download/${dn.icon}.png`)" />
              <div>
                <span class="title">{{ dn.title }}</span>
                <br />
                <span class="content">{{ dn.content }}</span>
              </div>
            </div>
            <div class="download-right">
              <div class="download-type">
                <img src="../../assets/images/download/icon-apple.png" />
                iOS
              </div>
              <a :href="dn.downloadLink" target="_blank">
                <img class="download-btn" src="../../assets/images/download/download-btn-bg.png" />
              </a>
            </div>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { api } from "boot/axios";

const tab = ref("android");

const downloadUrl = ref("");

const androidItems = computed(() => {
  return [
    {
      icon: "lh-logo",
      title: "电竞+体育APP 安卓",
      content: "雷火亚洲第一电竞体育品牌",
      downloadLink: downloadUrl.value
    },
    {
      icon: "lh-logo",
      title: "电竞全网APP 安卓",
      content: "雷火亚洲第一电竞品牌",
      downloadLink: downloadUrl.value
    },
    {
      icon: "lh-logo",
      title: "电竞原生态APP 安卓",
      content: "雷火亚洲第一电竞品牌",
      downloadLink: downloadUrl.value
    },
    {
      icon: "icon-pt",
      title: "PT安卓版",
      content: "最火的老虎机平台",
      downloadLink: downloadUrl.value
    },
    {
      icon: "icon-ob",
      title: "欧博安卓版",
      content: "最经典的老虎机平台",
      downloadLink: downloadUrl.value
    },
    {
      icon: "icon-we",
      title: "WE真人 安卓版",
      content: "最火的老虎机平台",
      downloadLink: downloadUrl.value
    },
    {
      icon: "icon-bbin",
      title: "BBIN安卓版",
      content: "最火的老虎机平台",
      downloadLink: downloadUrl.value
    }
  ];
});

const appleItems = computed(() => {
  return [
    {
      icon: "lh-logo",
      title: "电竞+体育APP 安卓",
      content: "雷火亚洲第一电竞体育品牌",
      downloadLink: downloadUrl.value
    },
    {
      icon: "lh-logo",
      title: "电竞全网APP 安卓",
      content: "雷火亚洲第一电竞品牌",
      downloadLink: downloadUrl.value
    },
    {
      icon: "lh-logo",
      title: "电竞原生态APP 安卓",
      content: "雷火亚洲第一电竞品牌",
      downloadLink: downloadUrl.value
    }
  ];
});

const getAppDownloadUrl = () => {
  api
    .get("/app/getAppData?siteCode=vnm&appType=ALL_SITE")
    .then((res) => {
      // console.log(res);
      downloadUrl.value = res.data.downloadPageUrl
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(getAppDownloadUrl);
</script>
<style lang="scss">
.download {
  margin-top: 10px;

  .q-tabs {
    background: $white;
    width: $box-width;
    margin: 0 auto;
    padding: 15px 14px;
    border-radius: 10px;
    box-shadow: $shadow-bg;

    .q-tab__label {
      font-size: 1.2rem;
      color: $font-1;
    }

    .q-tabs__content {
      gap: 12px;
    }
  }

  .q-tab {
    aspect-ratio: 440/96;
    font-size: 1.2rem;
    flex: 1;
    width: calc(50% - 6px);
  }

  .q-tab__content {
    width: 100%;
  }

  .q-tab--active .q-tab__indicator {
    height: 0%;
  }

  .q-tab--active {
    background-image: url("../../assets/images/download/active-tab-bg.png");
    background-size: 100% 100%;

    .q-tab__label {
      color: $white;
    }
  }

  .q-tab--inactive {
    background-image: url("../../assets/images/download/inactive-tab-bg.png");
    background-size: 100% 100%;
  }

  .q-tab__label {
    z-index: 1;
  }

  .q-tab-panels {
    background: none;
    width: 100%;
    margin: 0px auto 30px;
  }

  .download-item {
    background: $white;
    box-shadow: 0px -4px 6px 0px #c3d4e6 inset;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto 14px;
    padding: 1rem 0.8rem;

    .title {
      color: $primary;
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .content {
      font-size: 1rem;
      color: $font-1;
      margin-top: 5px;
    }

    .imgtext {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      align-items: flex-start;

      img {
        width: 44px;
      }
    }

    .download-type {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: $font-1;
      font-size: 0.9rem;

      img {
        width: 20px;
      }
    }

    .download-btn {
      width: 90px;
      margin-top: 6px;
      margin-left: auto;
      display: block;
    }
  }
}
</style>
