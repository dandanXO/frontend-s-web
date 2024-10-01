<template>
    <div v-if="isH5 && isShowDownload" class="app-download">
        <div class="left">
            <q-icon name="close" @click="closeTopBox" />
            <img class="headicon" width="60" src="../assets/logo.png" />
        </div>
        <div class="right">
            <a :href="`${downloadUrl}`" target="_blank" class="app-download-btn">
                Download App
            </a>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { Platform } from "quasar";
import { api } from "boot/axios";
import { userStore } from "stores/index";

const store = userStore();
const isH5 = ref(false);
const isShowDownload = ref(true);
const downloadUrl = ref("");

const getAppDownloadUrl = () => {
    api
        .get("/config/appDownloadUrl")
        .then((res) => {
            downloadUrl.value = res.data + "?origin=" + location.host;
        })
        .catch((err) => {
            downloadUrl.value = "https://p4w.app/" + "?origin=" + location.host;
        });
};

const closeTopBox = () => {
    isH5.value = false;
    store.hasClosedDL = true;
    sessionStorage.setItem("DOWNLOAD_POPUP", "1");
};

const checkPlatform = () => {
    //Is iOS Webclip App || Is Android Apk
    if (
        (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) ||
        (Platform.is.android && Platform.is.capacitor)
    ) {
        isH5.value = false;
    } else {
        isH5.value = true;
    }

    let downloadPopup = sessionStorage.getItem("DOWNLOAD_POPUP");
    if (downloadPopup) {
        isShowDownload.value = false;
    }
};

onMounted(() => {
    getAppDownloadUrl();
    checkPlatform();
});

</script>
<style lang="scss" scoped>
.app-download {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    height: 40px;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(4, 0, 48, 0.15);

    .left,
    .right {
        display: flex;
        align-items: center;
        justify-content: center;

        .app-download-btn {
            font-family: 'Baloo Regular';
            font-weight: 400;
        }
    }

    .q-icon {
        font-size: 20px;
        color: #000;
    }

    .headicon {
        width: 60px;
    }

    .app-download-btn {
        color: #000;
        font-weight: 700;
        font-size: 16px;
        white-space: nowrap;

        &.q-btn {
            box-shadow: none;
        }
    }
}

.body--dark {
    .app-download {
    background: #141d26;
    box-shadow: 0px 4px 4px 0px rgba(4, 0, 48, 0.15);


    .q-icon {
      color: #999;
    }

    .app-download-btn {
      color: #fff;
    }
  }
}
</style>
