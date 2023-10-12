<template>
  <div class="roles-main">
    <el-card>
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.referralLink') }}</span>
        </div>
      </template>
      <div class="card-panel-description">
        <div class="card-panel-link-text">{{ $t('fields.referralCode') }}</div>
        <span style="font-size: 20px">
          {{ affInfo.affiliateCode }}
        </span>
      </div>

      <div class="card-panel-description">
        <div class="card-panel-link-text">{{ $t('fields.link') }}</div>
        <a :href="link" target="_blank" style="color: #1fa8db">{{ link }}</a>
      </div>

      <!-- <div class="card-panel-description">
        <div class="card-panel-link-text">{{ $t('fields.appLink') }}</div>
        <a :href="link" target="_blank" style="color: #1fa8db">{{ appLink }}</a>
      </div> -->

      <div class="card-panel-description">
        <div class="card-panel-link-text"><qrcode-vue id="qrcode" :value="link" margin="2" /></div>
        <div class="btn-group">
          <el-button
            icon="el-icon-copy-document"
            size="large"
            type="primary"
            @click="copy(link)"
          >
            {{ $t('fields.copy') }}
          </el-button>
          <el-button
            icon="el-icon-download"
            size="large"
            type="success"
            @click="download()"
          >
            {{ $t('fields.download') }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import QrcodeVue from 'qrcode.vue'
import { nextTick, onMounted, reactive, ref } from '@vue/runtime-core'
import { getAffiliateInfo } from "../../../api/affiliate";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
const store = useStore();
// eslint-disable-next-line
const { t } = useI18n();
const link = ref("");
const appLink = ref("");
const affInfo = reactive({
  affiliateCode: null
});

async function loadAffiliateInfo() {
  const { data: aff } = await getAffiliateInfo(store.state.user.id);
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field];
  });
  await loadReferralLink();
}

async function loadReferralLink() {
  if (store.state.user.siteId === 1 || store.state.user.siteId === "1") {
    link.value = "https://xf1869.com/agent/" + affInfo.affiliateCode;
    appLink.value = "https://xf1869.com/app/agent/" + affInfo.affiliateCode;
  } else if (store.state.user.siteId === 2 || store.state.user.siteId === "2") {
    link.value = "https://www.dy1698.com/agent/" + affInfo.affiliateCode;
    appLink.value = "https://www.dy1698.com/app/agent/" + affInfo.affiliateCode;
  } else if (store.state.user.siteId === 3 || store.state.user.siteId === "3") {
    link.value = "https://www.jolly8858.com/agent/" + affInfo.affiliateCode;
    appLink.value = "https://www.jolly8858.com/app/agent/" + affInfo.affiliateCode;
  } else {
    link.value = "";
    appLink.value = "";
  }
  await nextTick();
}

function copy(text) {
  navigator.clipboard.writeText(text);
  ElMessage({ message: t('message.referralLinkCopied'), type: "success" });
};

function download() {
  const canvas = document.getElementById("qrcode").toDataURL("image/png");
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function () {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response);
    a.download = 'Referral Link.png';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  xhr.open('GET', canvas);
  xhr.send();
}

onMounted(() => {
  loadAffiliateInfo();
})
</script>

<style scoped>.box-card i {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  border-radius: 5px;
  padding: 10px;
  width: 80px;
  height: 80px;
}

.card-panel-description {
  font-weight: 700;
  margin-left: 0;
  display: flex;
}

.card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
  text-align: right;
}

.card-panel-description .card-panel-link-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 20px;
  margin-right: 20px;
}

.card-panel-description .card-panel-num {
  font-size: 20px;
  float: right;
}

.btn-group {
  margin-top: 25px;
}
</style>
