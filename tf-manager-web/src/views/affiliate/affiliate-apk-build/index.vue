<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px;"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.affiliateCode"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.affiliateCode')"
        />
        <!--        <el-select-->
        <!--          v-model="request.siteCode"-->
        <!--          size="small"-->
        <!--          :placeholder="t('fields.site')"-->
        <!--          class="filter-item"-->
        <!--          style="width: 120px; margin-left: 5px"-->
        <!--        >-->
        <!--          <el-option-->
        <!--            v-for="item in list.sites"-->
        <!--            :key="item.siteCode"-->
        <!--            :label="item.siteName"-->
        <!--            :value="item.siteCode"-->
        <!--          />-->
        <!--        </el-select>-->
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAffiliates()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button size="mini" type="success" @click="buildAll">
          {{ t('affiliateApk.buildAllApk') }}
        </el-button>
        <el-button size="mini" type="danger" @click="cancelAll">
          {{ t('fields.cancelAll') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.affiliateList') }}</span>
        </div>
      </template>
      <el-table
        :data="page.records"
        ref="table"
        v-loading="page.loading"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" width="250">
          <template
            #default="scope"
            v-if="hasPermission(['sys:affiliate:detail'])"
          >
            <router-link :to="`details/${scope.row.id}?site=${scope.row.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="alias"
          :label="t('fields.alias')"
          width="250"
        >
          <template #default="scope">
            {{ scope.row.alias !== null ? scope.row.alias : scope.row.loginName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="affiliateCode"
          :label="t('fields.affiliateCode')"
          width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">
              {{ scope.row.affiliateCode }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.site')" prop="site" width="150" />
        <el-table-column
          prop="affiliateStatus"
          :label="t('fields.affiliateStatus')"
          width="120"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.affiliateStatus === 'APPLY'" size="mini">
              {{ t('affiliate.status.APPLY') }}
            </el-tag>
            <el-tag
              v-if="scope.row.affiliateStatus === 'NORMAL'"
              type="success"
              size="mini"
            >
              {{ t('affiliate.status.NORMAL') }}
            </el-tag>
            <el-tag
              v-if="scope.row.affiliateStatus === 'DISABLE'"
              type="danger"
              size="mini"
            >
              {{ t('affiliate.status.DISABLE') }}
            </el-tag>
            <el-tag
              v-if="scope.row.affiliateStatus === null"
              type="info"
              size="mini"
            >
              -
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="currentVersion"
          :label="t('affiliateApk.currentVersion')"
          width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.currentVersion === null">-</span>
            <span v-if="scope.row.currentVersion !== null">
              {{ scope.row.currentVersion }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="buildStatus"
          :label="t('affiliateApk.buildStatus')"
          width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.buildStatus === null">-</span>
            <span v-if="scope.row.buildStatus !== null">
              {{ t(`affiliateApk.status.${scope.row.buildStatus}`) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('affiliateApk.latestVersion')" width="120">
          {{ latestVersion !== undefined ? latestVersion : '-' }}
        </el-table-column>
        <el-table-column :label="t('fields.operate')">
          <template #default="scope">
            <el-button
              size="mini"
              type="success"
              v-if="
                hasPermission(['sys:affiliate:affapk:build']) &&
                  scope.row.buildStatus !== 'IN_QUEUE' &&
                  scope.row.buildStatus !== 'IN_PROGRESS' &&
                  latestVersion !== null && latestVersion !== undefined
              "
              v-permission="['sys:affiliate:affapk:build']"
              @click="build(scope.row.id)"
            >
              {{ t('affiliateApk.buildApk') }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="
                hasPermission(['sys:affiliate:affapk:build']) &&
                  (scope.row.buildStatus === 'IN_QUEUE' || scope.row.buildStatus === 'IN_PROGRESS')
              "
              v-permission="['sys:affiliate:affapk:build']"
              @click="cancel(scope.row.id)"
            >
              {{ t('fields.cancel') }}
            </el-button>
            <el-button
              size="mini"
              type="success"
              v-if="hasPermission(['sys:affiliate:affapk:update'])"
              v-permission="['sys:affiliate:affapk:update']"
              @click="showDialog(scope.row)"
            >
              {{ t('fields.edit') }}
            </el-button>
            <el-button
              size="mini"
              type="success"
              v-if="scope.row.fileUrl !== null && scope.row.buildStatus === 'SUCCESS'"
              @click="downloadFile(scope.row.fileUrl)"
            >
              {{ t('fields.download') }}
            </el-button>
            <el-button
              size="mini"
              type="primary"
              v-if="scope.row.fileUrl !== null && scope.row.buildStatus === 'SUCCESS'"
              @click="downloadQRCode(scope.row.fileUrl)"
            >
              {{ t('fields.downloadQRCode') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changePage"
        layout="prev, pager, next"
        :page-size="request.size"
        :page-count="page.pages"
        :current-page="request.current"
      />
    </el-card>
    <el-dialog
      :title="t('affiliateApk.editParam')+ ': ' + loginName"
      v-model="uiControl.dialogVisible"
    >
      <el-form ref="paramForm" :model="form" :rules="formRules" @submit.prevent>
        <el-form-item prop="extraParams">
          <el-switch
            v-model="uiControl.showParamFormat"
            class="mb-2"
            inactive-text="Key Value"
            active-text="Json"
            inactive-value="key-value"
            active-value="json"
            @change="syncParam"
          />
          <div v-if="uiControl.showParamFormat === 'key-value'">
            <div v-for="(item, index) in param" :key="index" style="display: flex; align-items: center; margin-top: 5px; gap: 5px;">
              <el-input
                style="flex: 3;"
                v-model="item.key"
              />
              <span style="margin: 0 5px;">:</span>
              <el-input style="flex: 6;" v-model="item.value" />
              <div style="flex: 1; display: flex; justify-content: flex-end; gap: 5px;">
                <el-button
                  v-if="index === param.length - 1"
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  @click="addParam()"
                  plain
                >
                  {{ t('fields.add') }}
                </el-button>
                <el-button
                  icon="el-icon-remove"
                  size="mini"
                  type="danger"
                  @click="delParam(index)"
                  plain
                >
                  {{ t('fields.delete') }}
                </el-button>
              </div>

            </div>
          </div>
          <div v-else>
            <el-input
              v-model="form.jsonParams"
              style="width: 350px"
              autosize="true"
              type="textarea"
              :rows="15"
            />
          </div>
        </el-form-item>
      </el-form>

      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ $t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="submit()">
          {{ $t('fields.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed, h } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { hasPermission } from '../../../utils/util'
import { useI18n } from 'vue-i18n'
import {
  queryAffiliate,
  buildApk,
  editParam,
  getLatestVersion,
  cancelBuild,
  buildAllApk,
  cancelAllApk
} from '../../../api/affiliate-apk'
// import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
// import { saveAs } from 'file-saver'
import QRCode from 'qrcode'

const { t } = useI18n()
const table = ref(null)
const param = ref([])
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const latestVersion = ref('-')
const uiControl = reactive({
  dialogVisible: false,
  showParamFormat: 'key-value',
})
const list = reactive({
  sites: [],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  loginName: null,
  affiliateCode: null,
  siteCode: null,
  siteId: null
})

const form = reactive({
  id: null,
  extraParams: null,
  jsonParams: null,
})

const loginName = ref(null)

function resetQuery() {
  request.loginName = null
  request.affiliateCode = null
  request.siteCode = site.value ? site.value.siteCode : null
  request.siteId = store.state.user.siteId
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  return query
}

async function loadAffiliates() {
  page.loading = true
  uiControl.searchDialogVisible = false
  const query = checkQuery()
  const result = await queryAffiliate(query)
  page.pages = result.data.pages
  page.records = result.data.records
  page.loading = false
  await loadLatestVersion()
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadAffiliates()
  }
}

function showDialog(item) {
  form.id = item.id
  param.value = []
  loginName.value = item.loginName
  if (item.extraParams) {
    Object.entries(JSON.parse(item.extraParams)).forEach(([key, value]) => {
      const json = {}
      json.key = key
      json.value = value
      param.value.push(json)
    })
  }
  addParam()
  form.jsonParams = item.extraParams === null ? "{}" : JSON.stringify(
    JSON.parse(item.extraParams),
    undefined,
    2
  )
  uiControl.dialogVisible = true
}

function addParam() {
  param.value.push({
    key: '',
    value: '',
  })
}

function delParam(index) {
  param.value.splice(index, 1);
}

async function submit() {
  if (uiControl.showParamFormat === 'key-value') {
    form.extraParams = constructParam()
  } else {
    form.extraParams = JSON.stringify(
      JSON.parse(form.jsonParams)
    )
  }
  await editParam(form.id, form.extraParams)
  uiControl.dialogVisible = false
  await loadAffiliates()
  ElMessage({ message: t('message.editSuccess'), type: 'success' })
}

function constructParam() {
  const json = {};
  Object.values(param.value).forEach((item) => {
    if (item.key) {
      json[item.key] = item.value;
    }
  });
  return JSON.stringify(json);
}

function syncParam() {
  if (uiControl.showParamFormat === 'json') {
    form.jsonParams = JSON.stringify(
      JSON.parse(constructParam()),
      undefined,
      2
    )
  } else {
    // json to key-value and add to param
    const json = JSON.parse(form.jsonParams)
    param.value = []
    Object.entries(json).forEach(([key, value]) => {
      param.value.push({
        key,
        value,
      })
    })
  }
}

async function loadLatestVersion() {
  const { data: ret } = await getLatestVersion(request.siteCode)
  latestVersion.value = ret
}

async function build(id) {
  await buildApk(id)
  ElMessage({ message: t('message.buildIsInQueue'), type: 'success' })
  await loadAffiliates()
}

async function cancel(id) {
  await cancelBuild(id)
  ElMessage({ message: t('message.cancelSuccess'), type: 'success' })
  await loadAffiliates()
}

async function buildAll() {
  page.loading = true
  const query = checkQuery()
  await buildAllApk(query)
  ElMessage({ message: t('message.buildIsInQueue'), type: 'success' })
  await loadAffiliates()
}

async function cancelAll() {
  page.loading = true
  const query = checkQuery()
  await cancelAllApk(query)
  ElMessage({ message: t('message.cancelSuccess'), type: 'success' })
  await loadAffiliates()
}

async function loadSites() {
  // const { data: ret } = await getSiteListSimple()
  list.sites = store.state.user.sites
}

const downloadFile = (url) => {
  if (url) {
    window.open(url, '_blank');
  } else {
    console.error('Download URL is empty');
  }
};

const downloadQRCode = async (url) => {
  if (url) {
    try {
      // 生成二维码数据URL
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2
      })

      // 显示二维码弹窗
      ElMessageBox({
        title: t('fields.downloadQRCode'),
        message: h('img', { src: qrDataUrl, style: 'display: block; margin: 0 auto;' }),
        customClass: 'qrcode-dialog',
        showConfirmButton: false,
        closeOnClickModal: true
      })
    } catch (error) {
      console.error('生成二维码失败:', error)
      ElMessage.error(t('message.qrCodeGenerateFailed'))
    }
  } else {
    console.error('下载URL为空')
    ElMessage.error(t('message.downloadUrlEmpty'))
  }
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = list.sites.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id
    request.siteCode = site.value.siteCode;
  } else {
    site.value = list.sites.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
    request.siteCode = site.value.siteCode;
  }

  await loadAffiliates()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

.qrcode-dialog {
  .el-message-box__content {
    padding: 20px;
  }
}

:deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}
</style>
