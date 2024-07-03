<template>
  <div class="download">
    <q-tabs v-model="tab" indicator-color="white" align="justify">
      <q-tab name="android" label="安卓系统" />
      <q-tab name="apple" label="苹果系统" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="android">
        <div class="downloads">
          <div class="download-item q-my-sm q-mb-md" v-for="(dn, i) in androidItems" :key="i">
            <div class="imgtext">
              <img :src="require(`../../assets/download/${dn.icon}.png`)" />
              <div class="textcont">
                {{ dn.title }}
                <br />
                <span class="dn-content">{{ dn.content }}</span>
              </div>
            </div>
            <a @click="openDownloadAppLink(dn.downloadLink)">
              <img class="svg" src="~assets/download/download-2-fill.svg" />
            </a>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="apple">
        <div class="downloads">
          <div class="download-item q-my-sm q-mb-md" v-for="(dn, i) in appleItems" :key="i">
            <div class="imgtext">
              <img :src="require(`../../assets/download/${dn.icon}.png`)" />
              <div class="textcont">
                {{ dn.title }}
                <br />
                <span class="dn-content">{{ dn.content }}</span>
              </div>
            </div>
            <a @click="openDownloadAppLink(dn.downloadLink)">
              <img class="svg" src="~assets/download/download-2-fill.svg" />
            </a>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";

import { userStore } from "stores/index";

const store = userStore();
const tab = ref("android");

const downloadUrl = ref("");

const openDownloadAppLink = (link) => {
  const affiliate = sessionStorage.getItem("AFFILIATE_CODE");
  if (affiliate) {
    const theurl = `${link}?agentCode=${affiliate}`;
    window.open(theurl, "_blank");
  } else {
    window.open(link, "_blank");
  }
};

const androidItems = computed(() => {
  return [
    {
      icon: "dy",
      title: "东赢全站APP",
      content: "安全便捷，支持各大平台游戏",
      downloadLink: downloadUrl.value
    }
  ];
});

const appleItems = computed(() => {
  return [
    {
      icon: "dy",
      title: "东赢全站APP",
      content: "安全便捷，支持各大平台游戏",
      downloadLink: downloadUrl.value
    }
  ];
});

// const androidItems = [
//   {
//     icon: "dy",
//     title: "东赢全站APP",
//     content: "安全便捷，支持各大平台游戏",
//     downloadLink: "https://dy232.app/?url=m.dyvip1.com&agentCode=",
//   },
//   {
//     icon: "dy",
//     title: "东赢电竞APP",
//     content: "电竞原生态APP,覆盖世界各地电竞赛事",
//     downloadLink: "https://dyvip52esport.app/?url=m.dyvip1.com&agentCode=",
//   },
//   {
//     icon: "dy",
//     title: "东赢体育APP",
//     content: "所有赛事 一网打尽 方便快捷 安全稳定",
//     downloadLink: "https://dygames.app/?url=m.dyvip1.com&agentCode=",
//   },
//   // {
//   //   icon: "pt",
//   //   title: "PT安卓APP",
//   //   content: "最火的老虎机平台",
//   //   downloadLink: "http://m.ld176988.com/download.html",
//   // },
// ];

// const appleItems = [
//   {
//     icon: "dy",
//     title: "东赢全站APP",
//     content: "安全便捷，支持各大平台游戏",
//     downloadLink: "https://dy232.app/?url=m.dyvip1.com&agentCode=",
//   },
//   {
//     icon: "dy",
//     title: "东赢电竞APP",
//     content: "电竞原生态APP,覆盖世界各地电竞赛事",
//     downloadLink: "https://dyvip52esport.app/?url=m.dyvip1.com&agentCode=",
//   },
//   {
//     icon: "dy",
//     title: "东赢体育APP",
//     content: "所有赛事 一网打尽 方便快捷 安全稳定",
//     downloadLink: "https://dygames.app/?url=m.dyvip1.com&agentCode=",
//   },
// ];

const getAppDownloadUrl = () => {
  store.getAppDownloadUrl().then((url) => {
    downloadUrl.value = url;
  });
};

onMounted(getAppDownloadUrl);
</script>
<style lang="scss">
.download {
  .q-tabs {
    width: 95%;
    margin: 10px auto;
    color: #757575;
    border: 1px solid #0078e953;
    padding: 2px;
    border-radius: 50px;
  }
  .q-tab {
    min-height: 40px;
  }
  .q-tab__content {
    width: 100%;
  }
  .q-tab--active {
    color: #0078e9;
    border: 1px solid #0078e9;
    border-radius: 50px;
    overflow: hidden;
  }
  .q-tab--active .q-tab__indicator {
    height: 100%;
    background: #dbf0ff;
  }
  .q-tab__label {
    z-index: 1;
    font-weight: 600;
  }
  .q-tab-panels {
    background: none;
    padding: 0px;
    margin: 20px auto;
  }
  .q-tab-panel {
    padding: 10px;
  }
  .download-item {
    background: #ffffff;
    box-shadow: 0px 0px 30px -15px #000;
    border-radius: 15px;
    padding: 10px;
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    .imgtext {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      align-items: flex-start;
      img {
        width: 60px;
        background: #68bcec20;
        border-radius: 15px;
        padding: 10px;
      }
      .textcont {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
    }
    a {
      background: #0089ed10;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      svg,
      img.svg {
        fill: #0078e9;
        width: 18px;
      }
    }
    .download {
      width: 120px;
      margin-left: auto;
      display: block;
    }
    .dn-content {
      color: #343a4080;
    }
  }
}
</style>
