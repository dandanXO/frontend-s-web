<template>
  <div class="download-page">
    <img src="../assets/images/download/header.png" />
    <button v-if="!ui.deferredPrompt || isPwaInstalled" class="button" @click="handlePlayClick">Play</button>
    <button v-else-if="btnStatus === 'downloading'" class="button">Downloading... {{ currentDelay }}s left</button>
    <button v-else class="button" @click="handleInstallClick">Install</button>
    <img src="../assets/images/download/footer.png" />
  </div>
</template>
<script setup>
import { useUI } from "src/stores/ui";
import { computed, onMounted, ref } from "vue";

const DOWNLOAD_DELAY = 10;
const REDIRECT_INFO = {
  url: "https://b9game0.com/register"
};

const ui = useUI();

const isPwaInstalled = ref(localStorage.getItem("pwaInstall"));
const currentDelay = ref(DOWNLOAD_DELAY);
const btnStatus = ref("pending");

const origin = computed(() => window.location.origin);
const isInPwa = computed(
  () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
);

const handleInstallClick = async () => {
  if (ui.deferredPrompt) {
    btnStatus.value = "downloading";
    handleDownloadDelay();
    const { outcome } = await ui.deferredPrompt.prompt();
    if (outcome === "accepted") {
      localStorage.setItem("pwaInstall", "1");
      localStorage.setItem("pwaData", JSON.stringify(REDIRECT_INFO));
      console.log("User accepted the A2HS prompt");
    }
  } else {
    console.log("no prompt");
  }
};

const handleDownloadDelay = () => {
  setTimeout(() => {
    if (--currentDelay.value) {
      handleDownloadDelay();
    } else {
      btnStatus.value = "finished";
      currentDelay.value = DOWNLOAD_DELAY;
    }
  }, 1000);
};

const checkPwaInstall = async () => {
  if (!window.navigator.getInstalledRelatedApps) return;
  const installedPwaApp = await window.navigator.getInstalledRelatedApps();
  installedPwaApp.forEach((app) => {
    if (app.platform === "webapp" && app.url === window.location.origin) {
      isPwaInstalled.value = true;
    }
  });
};

const checkPwaInstallSuccess = () => {
  window.addEventListener("appinstalled", () => {
    isPwaInstalled.value = true;
    ui.deferredPrompt = null;
  });
};

const handlePlayClick = () => {
  const redirectInfo = JSON.parse(localStorage.getItem("pwaData"));
  window.location.replace(redirectInfo.url);
};

onMounted(() => {
  checkPwaInstall();
  checkPwaInstallSuccess();
  if (isInPwa.value) {
    const redirectInfo = JSON.parse(localStorage.getItem("pwaData"));
    window.location.replace(redirectInfo.url);
  }
});
</script>

<style scoped lang="scss">
.download-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-size: cover;
  min-height: 100%;
  width: 100%;
  padding: 50px 0;

  img {
    max-width: 100%;
  }

  .button {
    background: linear-gradient(180deg, #13a89e 0%, #8cc63f 100%);
    border: none;
    width: 100%;
    padding: 9px 0;
    font-weight: 700;
    text-decoration: none;
  }
}
</style>
