<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.mediaDesc"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.mediaDesc')"
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
            v-for="item in uiControl.settingStatus"
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
          @click="loadMediaDisplaySettings"
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
          v-permission="['sys:media-display-settings:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:media-display-settings:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:media-display-settings:del']"
          @click="removeLimit()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
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
        ref="settingsForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="170px"
      >

        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @change="handleChangeSite"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.mediaDesc')" prop="mediaDesc">
          <el-input v-model="form.mediaDesc" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.mediaUrl')" prop="mediaUrl">
          <el-input v-model="form.mediaUrl" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.displayUrl')" prop="displayUrl">
          <el-select
            v-model="form.displayUrl"
            size="small"
            :placeholder="t('fields.displayUrl')"
            class="filter-item"
            style="width: 120px;margin-left: 5px"
          >
            <el-option
              v-for="item in uiControl.displayLocation"
              :key="item.key"
              :label="t('displayLocation.' + item.displayName)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.mode')" prop="mode">
          <el-select
            v-model="form.mode"
            size="small"
            :placeholder="t('fields.mode')"
            class="filter-item"
            style="width: 120px;margin-left: 5px"
          >
            <el-option
              v-for="item in uiControl.mode"
              :key="item.key"
              :label="t('mode.' + item.displayName)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.autoplay')" prop="autoplay">
          <el-select
            v-model="form.autoplay"
            size="small"
            :placeholder="t('fields.autoplay')"
            class="filter-item"
            style="width: 120px;margin-left: 5px"
          >
            <el-option
              v-for="item in uiControl.autoplayStatus"
              :key="item.key"
              :label="t('autoplayStatus.' + item.displayName)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-select
            v-model="form.status"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="width: 120px;margin-left: 5px"
          >
            <el-option
              v-for="item in uiControl.settingStatus"
              :key="item.key"
              :label="t('common.status.' + item.displayName)"
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
      <el-table-column prop="mediaDesc" :label="t('fields.mediaDesc')" min-width="150" />
      <el-table-column prop="mediaUrl" :label="t('fields.mediaUrl')" width="200" />
      <el-table-column prop="displayUrl" :label="t('fields.displayUrl')" width="100">
        <template #default="scope">
          {{ t('displayLocation.'+scope.row.displayUrl) }}
        </template>
      </el-table-column>
      <el-table-column prop="mode" :label="t('fields.mode')" width="150">
        <template #default="scope">
          <el-tag
            size="mini"
          >
            {{ t('mode.'+scope.row.mode) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="autoplay" :label="t('fields.autoplay')" :min-width="50">
        <template #default="scope">
          <el-tag
            v-if="scope.row.autoplay === 'ON'"
            type="success"
            size="mini"
          >
            {{ t('autoplayStatus.'+scope.row.autoplay) }}
          </el-tag>
          <el-tag
            v-if="scope.row.autoplay === 'OFF'"
            type="danger"
            size="mini"
          >
            {{ t('autoplayStatus.'+scope.row.autoplay) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" :min-width="50">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'TEST'" size="mini">
            {{ t('common.status.'+scope.row.status) }}
          </el-tag>
          <el-tag
            v-if="scope.row.status === 'OPEN'"
            type="success"
            size="mini"
          >
            {{ t('common.status.'+scope.row.status) }}
          </el-tag>
          <el-tag
            v-if="scope.row.status === 'CLOSE'"
            type="danger"
            size="mini"
          >
            {{ t('common.status.'+scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
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
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:media-display-settings:update']) || hasPermission(['sys:media-display-settings:del']) )"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:media-display-settings:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:media-display-settings:del']"
            @click="removeLimit(scope.row)"
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
    <!-- <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.DownloadManager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSiteMediaDisplaySettingsRecords, createSiteMediaDisplaySettings, updateSiteMediaDisplaySettings, deleteSiteMediaDisplaySettings } from "../../../api/site-media-display-settings";
import { getSiteListSimple } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const settingsForm = ref(null)

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
  messageVisible: false,
  editVisible: false,
  dialogVisible2: false,
  displayLocation: [
    { key: 1, displayName: 'HOMEPAGE', value: 'HOMEPAGE' },
    { key: 2, displayName: 'PROMO_PAGE', value: 'PROMO_PAGE' },
    { key: 3, displayName: 'DEPOSIT_PAGE', value: 'DEPOSIT_PAGE' },
    { key: 4, displayName: 'WITHDRAW_PAGE', value: 'WITHDRAW_PAGE' },
    { key: 5, displayName: 'PERSONAL_CENTRE', value: 'PERSONAL_CENTRE' },
  ],
  mode: [
    { key: 1, displayName: 'STATIC', value: 'STATIC' },
    { key: 2, displayName: 'DYNAMIC', value: 'DYNAMIC' },
  ],
  autoplayStatus: [
    { key: 1, displayName: 'ON', value: 'ON' },
    { key: 2, displayName: 'OFF', value: 'OFF' },
  ],
  settingStatus: [
    { key: 1, displayName: 'OPEN', value: 'OPEN' },
    { key: 2, displayName: 'CLOSE', value: 'CLOSE' },
    { key: 3, displayName: 'TEST', value: 'TEST' },
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
  mediaDesc: null,
  status: null,
})

const form = reactive({
  id: null,
  siteId: null,
  mediaDesc: '',
  mediaUrl: '',
  displayUrl: '',
  mode: '',
  autoplay: '',
  status: '',
})

const formRules = reactive({
  mediaDesc: [required(t('message.validateMediaDescRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  mediaUrl: [required(t('message.validateMediaUrlRequired'))],
  displayUrl: [required(t('message.validateDisplayUrlRequired'))],
  mode: [required(t('message.validateStatusRequired'))],
  autoplay: [required(t('message.validateStatusRequired'))],
  status: [required(t('message.validateStatusRequired'))],
})

const sites = reactive({
  list: [],
})

let chooseMember = []

function resetQuery() {
  request.loginName = null
  request.siteId = site.value ? site.value.id : null;
}

function handleSelectionChange(val) {
  chooseMember = val
  if (chooseMember.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseMember.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadMediaDisplaySettings() {
  page.loading = true
  const { data: ret } = await getSiteMediaDisplaySettingsRecords(request)
  page.pages = ret.pages
  // ret.records.forEach(data => {
  //   data.timeZone = store.state.user.sites.find(e => e.siteName === data.siteName) !== undefined
  //     ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
  //     : null
  // });
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

function changePage(page) {
  request.current = page
  loadMediaDisplaySettings()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (settingsForm.value) {
      settingsForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addGame')
    uiControl.editVisible = false;
    form.id = null
    form.mediaDesc = ''
    form.mediaUrl = ''
    form.displayUrl = ''
    form.status = ''
    form.autoplay = ''
    form.mode = ''
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editGame')
    uiControl.editVisible = true
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(limit) {
  showDialog('EDIT')

  nextTick(() => {
    for (const key in limit) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = limit[key]
    }
  })
}

function create() {
  settingsForm.value.validate(async valid => {
    if (valid) {
      await createSiteMediaDisplaySettings(form)
      uiControl.dialogVisible = false
      await loadMediaDisplaySettings()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  settingsForm.value.validate(async valid => {
    if (valid) {
      await updateSiteMediaDisplaySettings(form)
      uiControl.dialogVisible = false
      await loadMediaDisplaySettings()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeLimit(limit) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (limit) {
      await deleteSiteMediaDisplaySettings([limit.id])
    } else {
      await deleteSiteMediaDisplaySettings(chooseMember.map(u => u.id))
    }
    await loadMediaDisplaySettings()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

function handleChangeSite(value) {
  form.siteId = value
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
  await loadMediaDisplaySettings();
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

.info-table{
  width:100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 18px;
}

</style>
<style lang="scss">
.info-table td{
  padding: 10px 5px;
}
</style>
