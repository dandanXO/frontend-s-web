<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.domain"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.domain')"
        />
        <el-select
          v-model="request.domainMainType"
          size="small"
          :placeholder="t('fields.domainType')"
          class="filter-item"
          style="width: 200px; margin-left: 5px;"
        >
          <el-option
            v-for="item in uiControl.domainMainTypes"
            :key="item"
            :label="t('domain.domainMainType.' + item)"
            :value="item"
          />
        </el-select>
        <el-select
          v-if="request.domainMainType === 'FRONTEND'"
          v-model="request.domainType"
          size="small"
          :placeholder="t('fields.subType')"
          class="filter-item"
          style="width: 200px; margin-left: 5px;"
        >
          <el-option
            v-for="item in uiControl.domainFrontendTypes"
            :key="item.value"
            :label="t('domain.domainFrontendType.' + item.value)"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-if="request.domainMainType === 'BACKEND'"
          v-model="request.domainBackendType"
          size="small"
          :placeholder="t('fields.subType')"
          class="filter-item"
          style="width: 200px; margin-left: 5px;"
        >
          <el-option
            v-for="item in uiControl.domainBackendTypes"
            :key="item.value"
            :label="t('domain.domainBackendType.' + item.value)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadDomainAccess"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:site-domain:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="sitePlatformForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.siteName')" prop="siteId">
          <el-select
            v-model="form.siteId"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @focus="loadSites"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.domain')" prop="domain">
          <el-select v-model="form.http" size="small" style="width: 100px;">
            <el-option
              v-for="item in uiControl.httpTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            style="width: 300px"
            v-model="form.domain"
            :placeholder="t('fields.domain')"
          />
        </el-form-item>
        <el-form-item :label="t('fields.domainType')" prop="domainType">
          <el-select
            v-model="form.domainMainType"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in uiControl.domainMainTypes"
              :key="item"
              :label="t('domain.domainMainType.' + item)"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.subType')" prop="domainType" v-if="form.domainMainType === 'FRONTEND'">
          <el-select
            v-model="form.domainType"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in uiControl.domainFrontendTypes"
              :key="item.value"
              :label="t('domain.domainFrontendType.' + item.value)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.subType')" prop="domainBackendType" v-else>
          <el-select
            v-model="form.domainBackendType"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in uiControl.domainBackendTypes"
              :key="item.value"
              :label="t('domain.domainBackendType.' + item.value)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="domainStatus">
          <el-switch
            v-model="form.domainStatus"
            active-value="ACTIVE"
            inactive-value="INACTIVE"
            :active-text="t('fields.active')"
            :inactive-text="t('fields.inactive')"
          />
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input
            type="textarea"
            style="width: 300px"
            v-model="form.remark"
            :placeholder="t('fields.remark')"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submit">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="siteId" :label="t('fields.site')">
        <template #default="scope">
          {{ getSiteName(scope.row.siteId) }}
        </template>
      </el-table-column>
      <el-table-column prop="domain" :label="t('fields.domain')" width="200" />
      <el-table-column
        prop="domainType"
        :label="t('fields.domainType')"
        width="150"
      >
        <template #default="scope">
          {{ t('domain.domainMainType.' + scope.row.domainType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="domainSubType"
        :label="t('fields.subType')"
        width="150"
      >
        <template #default="scope">
          <span v-if="scope.row.domainType === 'FRONTEND'">{{ t('domain.domainFrontendType.' + scope.row.domainSubType) }} </span>
          <span v-else>{{ t('domain.domainBackendType.' + scope.row.domainSubType) }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="domainStatus" :label="t('fields.status')" width="100">
        <template #default="scope">
          <el-tag
            v-if="scope.row.domainStatus === 'ACTIVE'"
            type="success"
            size="mini"
          >
            {{ t('fields.active') }}
          </el-tag>
          <el-tag
            v-else
            type="danger"
            size="mini"
          >
            {{ t('fields.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createBy"
        :label="t('fields.updateBy')"
        width="150"
      />
      <el-table-column
        prop="createTime"
        :label="t('fields.updateTime')"
        align="center"
        width="200"
      >
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="t('fields.remark')" width="300" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        fixed="right"
        width="200"
        v-permission="['sys:site-domain:update', 'sys:site-domain:del']"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="showEdit(scope.row)"
            v-permission="['sys:site-domain:update']"
          />
          <el-button
            v-permission="['sys:site-domain:del']"
            icon="el-icon-delete"
            size="mini"
            type="danger"
            style="margin-left: 10px"
            @click="removeSetting(scope.row.id)"
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
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getDomainTypes,
  createSiteDomain,
  getSiteDomains,
  updateSiteDomain,
  deleteSiteDomain,
} from '../../../api/domain'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const sitePlatformForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  inputVisible: false,
  domainMainTypes: [
    { value: 'FRONTEND', label: t('fields.frontend') },
    { value: 'BACKEND', label: t('fields.backend') },
  ],
  domainFrontendTypes: [
    { value: 'LANDING', label: t('fields.landing') },
    { value: 'DOWNLOAD', label: t('fields.download') },
    { value: 'AFFILIATE', label: t('fields.affiliate') },
    { value: 'HOME', label: t('fields.home') },
    { value: 'MANAGER', label: t('fields.manager') },
  ],
  domainBackendTypes: [
    { value: 'API', label: t('fields.download') },
    { value: 'AFFILIATE', label: t('fields.affiliate') },
    { value: 'MANAGER', label: t('fields.manager') },
  ],
  domainStatus: [
    { value: 'ACTIVE', label: t('fields.active') },
    { value: 'INACTIVE', label: t('fields.inactive') },
  ],
  httpTypes: [
    { value: 'http://', label: 'http' },
    { value: 'https://', label: 'https' },
  ],
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  domain: null,
  domainMainType: null,
  domainType: null,
  domainBackendType: null,
  domainStatus: null,
})

const form = reactive({
  id: null,
  siteId: null,
  domain: null,
  http: "https://",
  domainMainType: null,
  domainType: null,
  domainBackendType: null,
  domainStatus: null,
  remark: null,
})

const subtypeValidator = async (rule, value, callback) => {
  if (form.domainMainType === 'FRONTEND') {
    if (form.domainType === null) {
      callback(new Error(t('message.validateDomainSubTypeRequired')))
    } else {
      callback()
    }
  } else {
    if (form.domainBackendType === null) {
      callback(new Error(t('message.validateDomainSubTypeRequired')))
    } else {
      callback()
    }
  }
}

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  domain: [required(t('message.validateDomainRequired'))],
  domainMainType: [required(t('message.validateDomainMainTypeRequired'))],
  domainType: [subtypeValidator],
  domainBackendType: [subtypeValidator],
  domainStatus: [required(t('message.validateStatusRequired'))],
})

const sites = reactive({
  list: [],
})

let chooseSitePlatform = []

function resetQuery() {
  request.siteId = site.value ? site.value.id : sites.list[0].id
  request.domain = null
  request.domainMainType = null
  request.domainType = null
  request.domainBackendType = null
}

function handleSelectionChange(val) {
  chooseSitePlatform = val
  if (chooseSitePlatform.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseSitePlatform.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadDomainAccess() {
  page.loading = true
  const { data: ret } = await getSiteDomains(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.id === data.siteId) !== undefined
        ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
        : null
  })
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

function getSiteName(siteId) {
  return sites.list.find(s => s.id === siteId).siteName
}

async function loadDomainTypes() {
  const { data: ret } = await getDomainTypes()
  uiControl.domainMainTypes = ret.domainMainType
  uiControl.domainFrontendType = ret.domainFrontendType
  uiControl.domainBackendType = ret.domainBackendType
  uiControl.domainStatus = ret.domainStatus
}

function changePage(page) {
  request.current = page
  loadDomainAccess()
}

function clearInput() {
  uiControl.ipList = []
  uiControl.ipRangeLower = null
  uiControl.ipRangeUpper = null
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (sitePlatformForm.value) {
      sitePlatformForm.value.resetFields()
    }
    form.id = null
    clearInput()
    uiControl.dialogTitle = t('fields.add')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.edit')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(sitePlatform) {
  clearInput()
  showDialog('EDIT')
  if (!sitePlatform) {
    sitePlatform = chooseSitePlatform[0]
  }
  nextTick(() => {
    for (const key in sitePlatform) {
      if (key === 'domainType' && sitePlatform.domainType === 'FRONTEND') {
        form.domainMainType = sitePlatform[key]
        form.domainType = sitePlatform.domainSubType
      } else if (key === 'domainType' && sitePlatform.domainType === 'BACKEND') {
        form.domainMainType = sitePlatform[key]
        form.domainBackendType = sitePlatform.domainSubType
      } else if (key !== 'domain') {
        form[key] = sitePlatform[key]
      }
    }
  })

  const http = sitePlatform.domain.split('://')[0] + '://'
  const domain = sitePlatform.domain.split('://')[1]
  form.http = http
  form.domain = domain
}

async function removeSetting(id) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteSiteDomain([id])
    await loadDomainAccess()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function create() {
  sitePlatformForm.value.validate(async valid => {
    if (valid) {
      await createSiteDomain(form)
      uiControl.dialogVisible = false
      await loadDomainAccess()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  sitePlatformForm.value.validate(async valid => {
    if (valid) {
      var arr = form.gameType
      if (form.followType === 'NEW') {
        form.gameType = arr.toString()
      } else if (form.followType === 'FOLLOW') {
        form.gameType = null
      }
      await updateSiteDomain(form)
      uiControl.dialogVisible = false
      await loadDomainAccess()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  form.domain = form.http + form.domain
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

onMounted(async () => {
  await loadSites()
  await loadDomainTypes()
  request.siteId = sites.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName)
    request.siteId = site.value.id
  }
  await loadDomainAccess()
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
