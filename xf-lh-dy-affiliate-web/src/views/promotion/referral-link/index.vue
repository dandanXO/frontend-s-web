<template>
  <div class="roles-main">
    <el-card style="margin-top: 20px;">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.referralLink') }}</span>
        </div>
      </template>
      <el-card style="margin-top: 20px;">
        <div class="card-container">
          <div class="card-panel-description">
            <span style="font-size: 20px">
              {{ t('fields.link') }}
            </span>
            <a :href="link" target="_blank" style="color: #1fa8db">
              {{ link }}
            </a>
            <div class="card-panel-link-text"><qrcode-vue id="qrcode" :value="link" margin="2" hidden /></div>
          </div>

          <div class="btn-group">
            <el-button
              type="primary"
              @click="uiControl.tagDialogVisible = false"
            >
              防溢出安卓包
            </el-button>
            <span style="font-size: 12px; color: #afb3c8">
              点击构建最新版本APK下载地址
            </span>
          </div>

          <div class="btn-group">
            <el-dropdown trigger="click">
              <el-button
                type="primary"
                @click="uiControl.tagDialogVisible = false"
                style="width:100%"
              >
                <span>{{ $t('fields.copy') }}</span>
                <el-icon class="el-icon--right"><arrow-down-bold /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu style="width: inherit">
                  <el-dropdown-item>防封短链 (微信)</el-dropdown-item>
                  <el-dropdown-item>防封短链 (QQ)</el-dropdown-item>
                  <el-dropdown-item @click="copy(link)">长连接</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dropdown trigger="click">
              <el-button
                @click="submitTag()"
                style="margin-left: 0px; width: 100%; border-color: #409eff"
              >
                <span style="color: #409eff;">{{ $t('fields.download') }}</span>
                <el-icon class="el-icon--right" style="color: #409eff;">
                  <arrow-down-bold />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>防封二维码 (微信)</el-dropdown-item>
                  <el-dropdown-item>防封二维码 (QQ)</el-dropdown-item>
                  <el-dropdown-item @click="download()">长连接二维码</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { useStore } from '@/store'
import { nextTick, onMounted, reactive, ref } from '@vue/runtime-core'
import { getAffiliateInfo } from '../../../api/affiliate'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { ArrowDownBold } from '@element-plus/icons-vue'
import QrcodeVue from 'qrcode.vue'

const store = useStore()
// eslint-disable-next-line
const { t } = useI18n()
const link = ref('')
const appLink = ref('')
const affInfo = reactive({
  affiliateCode: null,
})

async function loadAffiliateInfo() {
  const { data: aff } = await getAffiliateInfo(store.state.user.id)
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field]
  })
  await loadReferralLink()
}

async function loadReferralLink() {
  if (store.state.user.siteId === 1 || store.state.user.siteId === '1') {
    link.value = 'https://xf1869.com/agent/' + affInfo.affiliateCode
    appLink.value = 'https://xf1869.com/app/agent/' + affInfo.affiliateCode
  } else if (store.state.user.siteId === 2 || store.state.user.siteId === '2') {
    link.value = 'https://www.dy1698.com/agent/' + affInfo.affiliateCode
    appLink.value = 'https://www.dy1698.com/app/agent/' + affInfo.affiliateCode
  } else if (store.state.user.siteId === 3 || store.state.user.siteId === '3') {
    link.value = 'https://www.jolly8858.com/agent/' + affInfo.affiliateCode
    appLink.value =
      'https://www.jolly8858.com/app/agent/' + affInfo.affiliateCode
  } else {
    link.value = ''
    appLink.value = ''
  }
  await nextTick()
}

function copy(text) {
  navigator.clipboard.writeText(text)
  ElMessage({ message: t('message.referralLinkCopied'), type: 'success' })
}

function download() {
  console.log(document.getElementById('qrcode'))
  const canvas = document.getElementById('qrcode').toDataURL('image/png')
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'blob'
  xhr.onload = function() {
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(xhr.response)
    a.download = 'Referral Link.png'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
  xhr.open('GET', canvas)
  xhr.send()
}

onMounted(() => {
  loadAffiliateInfo()
})
</script>

<style scoped>
.card-container {
  display: flex;
  gap: 10px;
}

.card-panel-description {
  width: 50%;
  font-weight: 700;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn-group {
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
