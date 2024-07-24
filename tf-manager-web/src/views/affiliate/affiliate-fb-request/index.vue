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
          v-model="request.url"
          size="small"
          style="width: 200px;margin-left: 5px"
          :placeholder="t('fields.affiliateFBRequestUrl')"
        />
        <el-input
          v-model="request.fbId"
          size="small"
          style="width: 200px;margin-left: 5px"
          :placeholder="t('fields.fbid')"
        />
        <el-select
          v-if="hasRole(['ADMIN'])"
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAffiliateFBRequests()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:affiliate-fb-request:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">
            {{ t('fields.affiliateFBRequestList') }}
          </span>
        </div>
      </template>

      <el-dialog
        :title="uiControl.dialogTitle"
        v-model="uiControl.dialogVisible"
        append-to-body
        width="680px"
      >
        <el-form
          v-if="uiControl.dialogType === 'CREATE'"
          ref="memberForm"
          :model="form"
          :rules="formRules"
          :inline="true"
          size="small"
          label-width="220px"
        >
          <el-form-item :label="t('fields.site')" prop="siteId">
            <el-select
              v-model="form.siteId"
              size="small"
              :placeholder="t('fields.site')"
              class="filter-item"
              style="width: 400px"
              @focus="loadSites"
            >
              <el-option
                v-for="item in siteList.list"
                :key="item.id"
                :label="item.siteName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.loginName')" prop="loginName">
            <el-input
              v-model="form.loginName"
              style="width: 400px;"
              maxlength="13"
            />
          </el-form-item>
          <el-form-item :label="t('fields.fbid')" prop="fbId">
            <el-input
              v-model="form.fbId"
              style="width: 400px;"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item :label="t('fields.affiliateFBRequestUrl')" prop="url">
            <el-input
              v-model="form.url"
              style="width: 400px;"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item :label="t('fields.fbToken')" prop="token">
            <el-input
              v-model="form.token"
              style="width: 400px;"
              maxlength="100"
            />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button type="primary" @click="addAffiliateFBRequest">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
        <el-form
          v-if="uiControl.dialogType === 'EDIT'"
          ref="memberForm"
          :model="form"
          :rules="formRules"
          :inline="true"
          size="small"
          label-width="220px"
        >
          <el-form-item :label="t('fields.site')" prop="siteId">
            <el-select
              v-model="form.siteId"
              size="small"
              :placeholder="t('fields.site')"
              class="filter-item"
              style="width: 400px"
              disabled
            >
              <el-option
                v-for="item in siteList.list"
                :key="item.id"
                :label="item.siteName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.loginName')" prop="loginName">
            <el-input
              v-model="form.loginName"
              style="width: 400px;"
              maxlength="11"
              disabled
            />
          </el-form-item>
          <el-form-item :label="t('fields.fbid')" prop="fbId">
            <el-input
              v-model="form.fbId"
              style="width: 400px;"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item :label="t('fields.affiliateFBRequestUrl')" prop="url">
            <el-input
              v-model="form.url"
              style="width: 400px;"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item :label="t('fields.fbToken')" prop="token">
            <el-input
              v-model="form.token"
              style="width: 400px;"
              maxlength="100"
            />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button type="primary" @click="editAffiliateFBRequest">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
      </el-dialog>
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
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          width="180"
        />
        <el-table-column prop="url" :label="t('fields.affiliateFBRequestUrl')" width="200" />
        <el-table-column prop="fbId" :label="t('fields.fbid')" width="200" />
        <el-table-column
          prop="createBy"
          :label="t('fields.createBy')"
          width="200"
        />
        <el-table-column
          prop="createTime"
          :label="t('fields.createTime')"
          width="200"
        >
          <template #default="scope">
            <span v-if="scope.row.createTime === null">-</span>
            <span
              v-if="scope.row.createTime !== null"
              v-formatter="{
                data: scope.row.createTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="right"
          fixed="right"
          v-if="
            !hasRole(['SUB_TENANT']) &&
              (hasPermission(['sys:affiliate-fb-request:update']) ||
                hasPermission(['sys:affiliate-fb-request:del']))
          "
        >
          <template #default="scope">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="success"
              v-permission="['sys:affiliate-fb-request:update']"
              @click="showEdit(scope.row)"
            />
            <el-button
              icon="el-icon-remove"
              size="mini"
              type="danger"
              v-permission="['sys:affiliate-fb-request:del']"
              @click="removeAffiliateFBRequest(scope.row.id)"
            />
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
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { required } from '../../../utils/validate'
import {
  getAffiliateFBRequests,
  createAffiliateFBRequest,
  delAffiliateFBRequest,
  updateAffiliateFBRequest,
} from '../../../api/affiliate-fb-request'
import { getSiteListSimple } from '../../../api/site'
import { hasPermission, hasRole } from '../../../utils/util'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const memberForm = ref(null)
const table = ref(null)
const siteList = reactive({
  list: [],
})
let timeZone = null

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
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
  url: null,
  fbId: null,
  siteId: null,
})

const form = reactive({
  id: null,
  siteId: null,
  loginName: null,
  url: null,
  token: null,
  fbId: null,
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  loginName: [required(t('message.validateAffiliateNameRequired'))],
  url: [required(t('message.validateFbUrlRequired'))],
  token: [required(t('message.validateFbTokenRequired'))],
  fbId: [required(t('message.validateFbIdRequired'))],
})

function resetQuery() {
  request.loginName = null
  request.url = null
  request.fbId = null
  request.siteId = siteList.list[0].id
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

async function loadAffiliateFBRequests() {
  page.loading = true
  const query = checkQuery()
  let result = {}
  result = await getAffiliateFBRequests(query)

  page.pages = result.data.pages
  page.records = result.data.records
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadAffiliateFBRequests()
  }
}

function showEdit(affiliateFBRequest) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in affiliateFBRequest) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = affiliateFBRequest[key]
      }
    }
  })
}

function showDialog(type) {
  if (type === 'CREATE') {
    form.id = null
    form.siteId = siteList.list[0].id
    form.loginName = null
    form.url = null
    form.fbId = null
    form.token = null
    uiControl.dialogTitle = t('fields.add')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.edit')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function addAffiliateFBRequest() {
  memberForm.value.validate(async valid => {
    if (valid) {
      await createAffiliateFBRequest(form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
      await loadAffiliateFBRequests()
    }
  })
}

function editAffiliateFBRequest() {
  memberForm.value.validate(async valid => {
    if (valid) {
      await updateAffiliateFBRequest(form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
      if (page.records.length !== 0) {
        await loadAffiliateFBRequests()
      }
    }
  })
}

async function removeAffiliateFBRequest(id) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await delAffiliateFBRequest(id)
    await loadAffiliateFBRequests()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

onMounted(async () => {
  await loadSites()
  request.siteId = siteList.list[0].id
  await loadAffiliateFBRequests()
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
