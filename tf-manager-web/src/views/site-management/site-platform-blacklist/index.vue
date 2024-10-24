<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.platform"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          filterable
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.statusType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadSitePlatformBlacklist"
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
      <div class="btn-group" v-if="!hasRole(['SUB_TENANT'])">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:sitePlatformBlacklist:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:sitePlatformBlacklist:del']"
          @click="removeSitePlatformBlacklist()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:sitePlatformBlacklist:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
      :close-on-press-escape="false"
    >
      <el-form
        ref="gameForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @change="handleChangeSite"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.platform')" prop="platform">
          <el-select
            clearable
            v-model="form.platform"
            size="small"
            :placeholder="t('fields.platform')"
            class="filter-item"
            style="width: 350px"
            filterable
          >
            <el-option
              v-for="item in platforms.list"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input v-model="form.loginName" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-select
            clearable
            v-model="form.status"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in uiControl.statusTypeCreate"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
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
      <el-table-column
        type="selection"
        width="55"
        v-if="!hasRole(['SUB_TENANT'])"
      />
      <el-table-column prop="siteName" :label="t('fields.site')" width="150" />
      <el-table-column prop="platform" :label="t('fields.platform')" min-width="180" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="150" />
      <el-table-column prop="status" :label="t('fields.status')" min-width="150" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{data: scope.row.updateTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:sitePlatformBlacklist:update']) || hasPermission(['sys:sitePlatformBlacklist:del']) )"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:sitePlatformBlacklist:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:sitePlatformBlacklist:del']"
            @click="removeSitePlatformBlacklist(scope.row)"
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
    <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.DownloadManager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createSitePlatformBlacklist,
  deleteSitePlatformBlacklist,
  getSitePlatformBlacklist,
  updateSitePlatformBlacklist,
  getExport,
  preCheckForCreate,
} from '../../../api/site-platform-blacklist'
import { getSiteListSimple } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import moment from 'moment'
import { getPlatformsBySite } from "../../../api/platform";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const gameForm = ref(null)

let chooseGame = []

const platforms = reactive({
  list: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  imageDialogVisible: false,
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
  imageSelectionVisible: false,
  messageVisible: false,
  statusType: [
    { key: 'ALL', displayName: 'ALL', value: 'ALL' },
    { key: 'ENABLE', displayName: 'ENABLE', value: 'ENABLE' },
    { key: 'DISABLED', displayName: 'DISABLED', value: 'DISABLED' },
    { key: 'TEST', displayName: 'TEST', value: 'TEST' },
  ],
  statusTypeCreate: [
    { key: 'ENABLE', displayName: 'ENABLE', value: 'ENABLE' },
    { key: 'DISABLED', displayName: 'DISABLED', value: 'DISABLED' },
    { key: 'TEST', displayName: 'TEST', value: 'TEST' },
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
  loginName: null,
  platform: null,
  status: 'ALL',
  siteId: null,
  requestBy: null,
  requestTime: null,
})
const form = reactive({
  id: null,
  siteId: null,
  siteName: null,
  loginName: null,
  platform: null,
  status: null,
})

const formRules = reactive({
  loginName: [required(t('message.validateLoginNameRequired'))],
  platform: [required(t('message.validatePlatformRequired'))],
  status: [required(t('message.validateStatusRequired'))],
})

const sites = reactive({
  list: [],
})
function resetQuery() {
  request.siteId = site.value ? site.value.id : sites.list[0].id;
  request.loginName = null
  request.platform = null;
  request.status = 'ALL';
}

const memberForm = reactive({
  loginName: null,
  siteId: null,
})

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadSearchPlatforms() {
  const { data: ret } = await getPlatformsBySite(request.siteId)

  platforms.list = [{ id: 0, code: "ALL", name: "ALL" }];
  ret.forEach(p => {
    platforms.list.push({ id: p.id, code: p.code, name: p.name });
  })
}

function changePage(page) {
  request.current = page
  loadSitePlatformBlacklist()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (gameForm.value) {
      gameForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addBlacklist')
    form.id = null
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editBlacklist')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(blacklist) {
  showDialog('EDIT')

  nextTick(() => {
    for (const key in blacklist) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = blacklist[key]
    }
  })
}

function handleSelectionChange(val) {
  chooseGame = val
  if (chooseGame.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseGame.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadSitePlatformBlacklist() {
  page.loading = true
  if (request.status === "ALL") {
    request.status = null;
  }
  if (request.platform === "ALL") {
    request.platform = null;
  }
  const { data: ret } = await getSitePlatformBlacklist(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    console.log(sites.list);
    data.siteName = sites.list[0].siteName;
    data.timeZone = store.state.user.sites.find(e => e.siteName === data.siteName) !== undefined
      ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
      : null
  });
  page.records = ret.records
  page.loading = false
}

function create() {
  gameForm.value.validate(async valid => {
    if (valid) {
      await createSitePlatformBlacklist(form)
      uiControl.dialogVisible = false
      await loadSitePlatformBlacklist()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  gameForm.value.validate(async valid => {
    if (valid) {
      await updateSitePlatformBlacklist(form)
      uiControl.dialogVisible = false
      await loadSitePlatformBlacklist()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeSitePlatformBlacklist(blacklist) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (blacklist) {
      await deleteSitePlatformBlacklist([blacklist.id])
    } else {
      await deleteSitePlatformBlacklist(chooseGame.map(u => u.id))
    }
    await loadSitePlatformBlacklist()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function submit() {
  memberForm.siteId = form.siteId;
  memberForm.loginName = form.loginName;

  const { data: ret } = await preCheckForCreate(memberForm)
  if (ret.loginName === form.loginName) {
    if (uiControl.dialogType === 'CREATE') {
      create()
    } else if (uiControl.dialogType === 'EDIT') {
      edit()
    }
  }
}

function handleChangeSite(value) {
  form.siteId = value
}

async function requestExportExcel() {
  request.requestBy = store.state.user.name;
  request.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await getExport(request);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = sites.list[0].id;
  }
  form.siteId = request.siteId
  await loadSearchPlatforms()
  await loadSitePlatformBlacklist();
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
.grid-container {
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  transition: transform 0.5s;
}

.grid-item .el-image:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.grid-item.selected {
  box-shadow: 0 4px 8px rgba(12, 20, 242, 0.12), 0 0 6px rgba(12, 20, 242, 0.12);
  border: 1px solid blue;
}

.image-info {
  margin: 10px;
}

.image-info .el-row {
  margin-top: 10px;
}

.preview {
  width: 200px;
  height: 200px;
}

.smallPreview {
  width: 100px;
  height: 100px;
}
</style>
