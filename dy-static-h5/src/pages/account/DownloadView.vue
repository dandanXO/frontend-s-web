<template>
  <div class="download">
    <q-tabs
      v-model="tab"
      active-color="white"
      indicator-color="bright"
      align="justify"
    >
      <q-tab name="android" label="安卓系统" />
      <q-tab name="apple" label="苹果系统" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="android">
        <div class="downloads">
          <div
            class="download-item q-my-sm"
            v-for="(dn, i) in androidItems"
            :key="i"
          >
            <div class="imgtext">
              <img :src="require(`../../assets/download/${dn.icon}.png`)" />
              <div>
                {{ dn.title }}<br />
                <span class="dn-content">{{ dn.content }}</span>
              </div>
            </div>
            <a :href="dn.downloadLink" target="_blank">
              <img
                class="download"
                src="../../assets/download/btn_download.png"
              />
            </a>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="apple">
        <div class="downloads">
          <div
            class="download-item q-my-sm"
            v-for="(dn, i) in appleItems"
            :key="i"
          >
            <div class="imgtext">
              <img :src="require(`../../assets/download/${dn.icon}.png`)" />
              <div>
                {{ dn.title }}<br />
                <span class="dn-content">{{ dn.content }}</span>
              </div>
            </div>
            <a :href="dn.downloadLink" target="_blank">
              <img
                class="download"
                src="../../assets/download/btn_download.png"
              />
            </a>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { api } from "boot/axios";

const tab = ref("android");

const downloadUrl = ref("");

const androidItems = computed(() => {
  return [
    {
      icon: "dy",
      title: "东赢全站APP",
      content: "安全便捷，支持各大平台游戏",
      downloadLink: downloadUrl.value
    }
  ];
})

const appleItems = computed(() => {
  return [
    {
      icon: "dy",
      title: "东赢全站APP",
      content: "安全便捷，支持各大平台游戏",
      downloadLink: downloadUrl.value
    }
  ];
})

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
  api
    .get("/config/appDownloadUrl")
    .then((res) => {
      // console.log(res);
      downloadUrl.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(getAppDownloadUrl);
</script>
<style lang="scss">
.download {
  .q-tabs {
    background: rgba(113, 125, 146, 0.2);
    width: 100%;
    margin: 0 auto;
  }
  .q-tab {
    min-height: 40px;
  }
  .q-tab__content {
    width: 100%;
  }
  .q-tab--active .q-tab__indicator {
    height: 100%;
  }
  .q-tab__label {
    z-index: 1;
  }
  .q-tab-panels {
    background: none;
    padding: 10px;
  }
  .download-item {
    background: #ffffff;
    padding: 10px;
    .imgtext {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      align-items: flex-start;
      img {
        width: 40px;
      }
    }
    .download {
      width: 120px;
      margin-left: auto;
      display: block;
    }
    .dn-content {
      color: #8f8f94;
    }
  }
}
</style>
