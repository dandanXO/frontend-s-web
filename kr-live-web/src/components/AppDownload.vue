<template>
  <div class="app-download" v-if="isShowDownload && store.getAppDownloadUrl()">
    <div class="left">
      <img class="headicon" width="60" src="../assets/logo.png" />
      <div class="name-and-rating">
        <span class="name">City8</span>
        <q-rating class="rating" v-model="ratingScore" size="1em" color="irange" readonly />
      </div>
    </div>
    <div class="right">
      <a :href="store.getAppDownloadUrl()" target="_blank" class="app-download-btn">
        {{ $t("lang.download_app") }}
      </a>
      <q-icon name="close" @click="close" />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { userStore } from "stores/index";

const store = userStore();
const isShowDownload = ref(true);
const ratingScore = ref(5);

const close = () => {
  isShowDownload.value = false;
  sessionStorage.setItem("DOWNLOAD_POPUP", "1");
};

onMounted(() => {
  let downloadPopup = sessionStorage.getItem("DOWNLOAD_POPUP");

  if (downloadPopup) {
    isShowDownload.value = false;
  }
});
</script>
<style lang="scss" scoped>
.app-download {
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  height: 45px;
  box-shadow: 0px 4px 4px 0px rgba(4, 0, 48, 0.15);
  background: #900000;
  .left,
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name-and-rating {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
  }

  .q-icon {
    font-size: 25px;
    color: #fff;
    margin-left: 5px;
  }

  .headicon {
    width: 60px;
  }

  .app-download-btn {
    border: 1px solid #a95658;
    background: linear-gradient(90deg, #bd2424 0%, #670c0c 100%);
    color: #fff;
    font-size: 12px;
    white-space: nowrap;
    border-radius: 20px;
    padding: 5px 15px;
  }
}
</style>
