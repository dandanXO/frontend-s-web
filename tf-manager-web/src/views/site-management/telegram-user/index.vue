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
          v-model="request.telegramUsername"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.telegramUsername')"
        />
        <el-input
          v-model="request.alias"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.alias')"
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
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('telegram.userStatus.'+item.value)"
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
          v-permission="['sys:telegram-user:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:telegram-user:del']"
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
            :disabled="uiControl.dialogType === 'APPROVE'"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.telegramUsername')" prop="telegramUsername">
          <el-input :disabled="uiControl.dialogType === 'APPROVE'" v-model="form.telegramUsername" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.alias')" prop="alias">
          <el-input v-model="form.alias" style="width: 350px" />
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
      <el-table-column prop="telegramUsername" :label="t('fields.telegramUsername')" width="250" />
      <el-table-column prop="alias" :label="t('fields.alias')" width="250" />
      <el-table-column prop="status" :label="t('fields.status')" width="250">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'PENDING_CONNECT'" size="mini">
            {{ t('telegram.userStatus.'+scope.row.status) }}
          </el-tag>
          <el-tag
            v-if="scope.row.status === 'ACTIVE'"
            type="success"
            size="mini"
          >
            {{ t('telegram.userStatus.'+scope.row.status) }}
          </el-tag>
          <el-tag
            v-if="scope.row.status === 'PENDING_VERIFY'"
            type="warning"
            size="mini"
          >
            {{ t('telegram.userStatus.'+scope.row.status) }}
          </el-tag>
          <el-tag
            v-if="scope.row.status === 'STOPPED'"
            type="info"
            size="mini"
          >
            {{ t('telegram.userStatus.'+scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission('sys:telegram-user:approve') || hasPermission(['sys:telegram-user:del']) )"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'PENDING_VERIFY'"
            icon="el-icon-circle-check"
            size="mini"
            type="success"
            v-permission="['sys:telegram-user:approve']"
            @click="showApprove(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:telegram-user:del']"
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
import { getUsers, addUser, deleteUser, approveUser } from "../../../api/telegram";
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
  status: [
    { key: 1, displayName: 'pendingConnect', value: 'PENDING_CONNECT' },
    { key: 2, displayName: 'pendingVerify', value: 'PENDING_VERIFY' },
    { key: 3, displayName: 'active', value: 'ACTIVE' },
    { key: 4, displayName: 'stopped', value: 'STOPPED' },
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
  status: null,
  telegramUsername: null,
  alias: null,
})

const form = reactive({
  siteId: null,
  telegramUsername: null,
  alias: null,
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  telegramUsername: [required(t('message.validateTelegramUsernameRequired'))],
  alias: [required(t('message.validateAliasRequired'))],
})

const sites = reactive({
  list: [],
})

let chooseMember = []

function resetQuery() {
  request.telegramUsername = null
  request.alias = null
  request.status = null
  request.siteId = site.value ? site.value.id : sites.list[0].id;
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
  const { data: ret } = await getUsers(request)
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
  } else if (type === 'APPROVE') {
    uiControl.dialogTitle = t('fields.approve')
    uiControl.editVisible = true
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function create() {
  settingsForm.value.validate(async valid => {
    if (valid) {
      await addUser(form)
      uiControl.dialogVisible = false
      await loadMediaDisplaySettings()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
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
      await deleteUser([limit.id])
    } else {
      await deleteUser(chooseMember.map(u => u.id))
    }
    await loadMediaDisplaySettings()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function showApprove(limit) {
  console.log(limit)
  showDialog('APPROVE')
  nextTick(() => {
    for (const key in limit) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = limit[key]
    }
  })
}

function approve() {
  settingsForm.value.validate(async valid => {
    if (valid) {
      await approveUser(form)
      uiControl.dialogVisible = false
      await loadMediaDisplaySettings()
      ElMessage({ message: t('message.success'), type: 'success' })
    }
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'APPROVE') {
    approve()
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
