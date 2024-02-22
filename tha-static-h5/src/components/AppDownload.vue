<template>
    <div class="app-download" v-if="isShowDownload && store.getAppDownloadUrl()">
        <div class="left">
            <img class="headicon" width="60" src="../assets/logo.png" />
        </div>
        <div class="right">
            <a :href="store.getAppDownloadUrl()" target="_blank" class="app-download-btn">
                Download App
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

const close = () => {
    isShowDownload.value = false;
    sessionStorage.setItem("DOWNLOAD_POPUP", "1");
}

onMounted(() => {
    let downloadPopup = sessionStorage.getItem("DOWNLOAD_POPUP");
    
    if (downloadPopup) {
        isShowDownload.value = false;
    }
})

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
    background: linear-gradient(90deg, #CF027D 0%, #FF6370 100%), linear-gradient(94.81deg, #FB3CA9 7.45%, #FFA9AB 95.9%);
    .left,
    .right {
        display: flex;
        align-items: center;
        justify-content: center;
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
        border: 1px solid #ffa9ab;
        background: linear-gradient(90deg, #CF027D 0%, #FF6370 100%), linear-gradient(94.81deg, #FB3CA9 7.45%, #FFA9AB 95.9%);
        color: #fff;
        font-size: 12px;
        white-space: nowrap;
        border-radius: 20px;
        padding: 5px 15px;
    }
}
</style>