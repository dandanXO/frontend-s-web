<template>
  <a-modal v-model:visible="visible" centered :footer="null" :width="400" :style="{ padding: '13px 17px' }">
    <div class="download-app-content-wrapper">
      <span class="download-app-title">{{ $t("layout.header.downloadAppModal.title") }}</span>
      <div class="download-app-qr-code-wrapper">
        <vue-qrcode-component v-if="downloadUrl" :size="200" :text="downloadUrl" />
        <a-spin v-else />
      </div>
      <div class="download-app-description">
        {{ $t("layout.header.downloadAppModal.description") }}
        <ri-qr-scan2-line />
      </div>
    </div>
  </a-modal>
</template>
<script setup>
import { getDownloadAppUrl } from "@/api/index/common";
import { onMounted, ref } from "vue";
import VueQrcodeComponent from "vue-qrcode-component";
import { RiQrScan2Line } from "vue-remix-icons";

const visible = defineModel();

const downloadUrl = ref("");

const getUrl = () => {
  getDownloadAppUrl()
    .then((res) => {
      if (res.code === 0) downloadUrl.value = res.data.url;
    })
    .catch(() => {});
};

onMounted(() => {
  if (!downloadUrl.value) getUrl();
});

defineExpose({ getUrl });
</script>
<style scoped lang="scss">
.download-app-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #8c968f;

  .download-app-title {
    font-size: 18px;
    line-height: 20.92px;
    text-align: center;
    color: #fff;
  }

  .download-app-qr-code-wrapper {
    background-color: #fff;
    padding: 8px;
    border-radius: 4px;
  }

  .download-app-description {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: 18px;
    font-weight: 500;
    line-height: 20.92px;

    svg {
      fill: currentColor;
      max-width: 32px;
    }
  }
}
</style>
