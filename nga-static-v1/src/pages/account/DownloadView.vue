<template>
  <div class="download">
    <q-tabs v-model="tab" active-color="white" indicator-color="bright" align="justify">
      <q-tab name="android" label="安卓系统" />
      <q-tab name="apple" label="苹果系统" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="android">
        <div class="downloads">
          <div class="download-item q-my-sm" v-for="(dn, i) in androidItems" :key="i">
            <div class="imgtext">
              <!-- <img :src="require(`../../assets/download/${dn.icon}.png`)" /> -->
              <div>
                {{ dn.title }}
                <br />
                {{ dn.content }}
              </div>
            </div>
            <a :href="dn.downloadLink" target="_blank">
              <!-- <img
                class="download"
                src="../../assets/download/btn_download.png"
              /> -->
            </a>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="apple">
        <div class="downloads">
          <div class="download-item q-my-sm" v-for="(dn, i) in appleItems" :key="i">
            <div class="imgtext">
              <!-- <img :src="require(`../../assets/download/${dn.icon}.png`)" /> -->
              <div>
                {{ dn.title }}
                <br />
                {{ dn.content }}
              </div>
            </div>
            <a :href="dn.downloadLink" target="_blank">
              <!-- <img
                class="download"
                src="../../assets/download/btn_download.png"
              /> -->
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

// const androidItems = [
//   {
//     icon: "xf",
//     title: "兴發全站",
//     content: "安全便捷，支持各大平台游戏",
//     downloadLink: downloadUrl.value
//   }
//   // {
//   //   icon: "pt",
//   //   title: "PT 安卓版",
//   //   content: "最火的老虎机平台",
//   //   downloadLink: "http://m.ld176988.com/download.html",
//   // }
// ];

const androidItems = computed(() => {
  return [
    {
      icon: "xf",
      title: "兴發全站",
      content: "安全便捷，支持各大平台游戏",
      downloadLink: downloadUrl.value
    }
  ];
});

const appleItems = computed(() => {
  return [
    {
      icon: "xf",
      title: "兴發全站",
      content: "安全便捷，支持各大平台游戏",
      downloadLink: downloadUrl.value
    }
  ];
});

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

// return {
//   getAppDownloadUrl,
//   downloadUrl
// };
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
    background: #212534;
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
  }
}
</style>
