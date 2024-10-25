<template>
  <div class="download-page">
    <a v-if="!ui.deferredPrompt || isPwaInstalled" style="width: 100%" :href="origin" target="_blank">
      <button class="button">Play</button>
    </a>
    <button v-else class="button" @click="handleInstallClick">Install</button>
  </div>
</template>
<script setup>
import { useUI } from "src/stores/ui";
import { computed, onMounted, ref } from "vue";

const ui = useUI();

const isPwaInstalled = ref(false);

const origin = computed(() => window.location.origin);

const handleInstallClick = () => {
  if (ui.deferredPrompt) {
    ui.deferredPrompt.prompt();
    ui.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      ui.deferredPrompt = null;
    });
  } else {
    console.log("no prompt");
  }
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

onMounted(() => {
  checkPwaInstall();
  checkPwaInstallSuccess();
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
