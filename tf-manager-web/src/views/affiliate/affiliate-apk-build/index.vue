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
        <el-table-column prop="loginName" :label="t('fields.loginName')">
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
          prop="affiliateCode"
          :label="t('fields.affiliateCode')"
        >
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">
              {{ scope.row.affiliateCode }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="affiliateStatus"
          :label="t('fields.affiliateStatus')"
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
        >
          <template #default="scope">
            <span v-if="scope.row.buildStatus === null">-</span>
            <span v-if="scope.row.buildStatus !== null">
              {{ t(`affiliateApk.status.${scope.row.buildStatus}`) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('affiliateApk.latestVersion')">
          {{ latestVersion !== undefined ? latestVersion : '-' }}
        </el-table-column>
        <el-table-column :label="t('fields.operate')">
          <template #default="scope">
            <el-button
              size="mini"
              type="success"
              v-if="
                hasPermission(['sys:affapk:build']) &&
                  scope.row.buildStatus !== 'IN_QUEUE' &&
                  scope.row.buildStatus !== 'IN_PROGRESS' &&
                  latestVersion !== null && latestVersion !== undefined
              "
              v-permission="['sys:affapk:build']"
              @click="build(scope.row.id)"
            >
              {{ t('affiliateApk.buildApk') }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="
                hasPermission(['sys:affapk:build']) &&
                  scope.row.buildStatus === 'IN_QUEUE'
              "
              v-permission="['sys:affapk:build']"
              @click="cancel(scope.row.id)"
            >
              {{ t('fields.cancel') }}
            </el-button>
            <el-button
              size="mini"
              type="success"
              v-if="hasPermission(['sys:affapk:update'])"
              v-permission="['sys:affapk:update']"
              @click="showDialog(scope.row)"
            >
              {{ t('fields.edit') }}
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
      :title="t('affiliateApk.editParam')"
      v-model="uiControl.dialogVisible"
    >
      <el-form ref="paramForm" :model="form" :rules="formRules" @submit.prevent>
        <el-form-item :label="t('fields.param')" prop="extraParams">
          <div v-for="(item, index) in param" :key="index">
            <el-input
              style="width: 170px; margin-top: 5px;"
              v-model="item.key"
            />
            :
            <el-input style="width: 170px " v-model="item.value" />
            <el-button
              v-if="index === param.length - 1"
              icon="el-icon-plus"
              size="mini"
              type="primary"
              style="margin-left: 20px"
              @click="addParam()"
              plain
            >
              {{ t('fields.add') }}
            </el-button>
            <el-button
              icon="el-icon-remove"
              size="mini"
              type="danger"
              style="margin-left: 20px"
              @click="delParam(index)"
              plain
            >
              {{ t('fields.delete') }}
            </el-button>
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
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// import { required } from '../../../utils/validate'
import { hasPermission } from '../../../utils/util'
// import { useStore } from '../../../store'
import { useI18n } from 'vue-i18n'
import {
  queryAffiliate,
  buildApk,
  editParam,
  getLatestVersion,
  cancelBuild,
} from '../../../api/affiliate-apk'

const { t } = useI18n()
const table = ref(null)
const param = ref([])
const latestVersion = ref('-')
const uiControl = reactive({
  dialogVisible: false,
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
  siteCode: 'IND',
})

const form = reactive({
  id: null,
  extraParams: null,
})

function resetQuery() {
  request.loginName = null
  request.affiliateCode = null
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
  uiControl.dialogVisible = true
  form.id = item.id
  param.value = []
  if (item.extraParams) {
    Object.entries(JSON.parse(item.extraParams)).forEach(([key, value]) => {
      const json = {}
      json.key = key
      json.value = value
      param.value.push(json)
    })
  }
  addParam()
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
  form.extraParams = constructParam()
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

onMounted(async () => {
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

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}
</style>
