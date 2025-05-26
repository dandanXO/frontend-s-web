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
          v-model="request.objectType"
          size="small"
          :placeholder="t('fields.type')"
          class="filter-item"
          style="width: 150px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.objectType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="request.objectValue"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.value')"
        />
        <el-select
          clearable
          v-model="request.isActive"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 150px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.statusType"
            :key="item.key"
            :label="t('fields.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px; margin-left: 5px;"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadRegisterBlacklist"
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
          v-permission="['sys:register-blacklist:add']"
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
      :close-on-press-escape="false"
    >
      <el-form
        ref="formRef"
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
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.type')" prop="objectType">
          <el-select
            v-model="form.objectType"
            size="small"
            :placeholder="t('fields.type')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in uiControl.objectType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.value')" prop="objectValue">
          <el-input v-model="form.objectValue" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.reason')" prop="reason">
          <el-input type="textarea" rows="3" v-model="form.reason" style="width: 350px" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item :label="t('fields.expirationTime')" prop="expirationTime">
          <el-date-picker
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.expirationTime"
            style="width: 350px;"
          />
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
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="objectType" :label="t('fields.type')" min-width="120" />
      <el-table-column prop="objectValue" :label="t('fields.value')" min-width="150" />
      <el-table-column prop="reason" :label="t('fields.reason')" min-width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="status" :label="t('fields.status')" min-width="150">
        <template #default="scope">
          <el-switch
            v-model="scope.row.active"
            size="mini"
            :active-value="true"
            :inactive-value="false"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeRegisterBlacklistStatus(scope.row.id, scope.row.active)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="expirationTime" :label="t('fields.expirationTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.expirationTime === null">-</span>
          <span
            v-else
            v-formatter="{data: scope.row.expirationTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column><el-table-column prop="createTime" :label="t('fields.createTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-else
            v-formatter="{data: scope.row.createTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="150">
        <template #default="scope">
          <span v-if="scope.row.createBy === null">-</span>
          <span v-else>{{ scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-else
            v-formatter="{data: scope.row.updateTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateBy === null">-</span>
          <span v-else>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:register-blacklist:update']) || hasPermission(['sys:register-blacklist:del']) )"
        min-width="120"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:register-blacklist:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:register-blacklist:del']"
            @click="removeBlacklist(scope.row.id)"
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
import moment from 'moment'
import { formatInputTimeZone } from '@/utils/format-timeZone'
import { getShortcuts } from '@/utils/datetime'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { required } from '@/utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getRegisterBlacklist,
  createRegisterBlacklist,
  updateRegisterBlacklist,
  deleteRegisterBlacklist,
  updateRegisterBlacklistState
} from '@/api/register-blacklist';
import { getSiteListSimple } from '@/api/site'
import { hasRole, hasPermission } from '@/utils/util'
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const formRef = ref(null)

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  objectType: [
    { key: 1, displayName: "IP", value: "IP" },
    { key: 2, displayName: "SID", value: "SID" }
  ],
  statusType: [
    { key: 1, displayName: 'open', value: true },
    { key: 2, displayName: 'close', value: false },
  ],
})

const shortcuts = getShortcuts(t)
const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
let timeZone = null

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  objectType: null,
  objectValue: null,
  isActive: null,
  createTime: [defaultStartDate, defaultEndDate]
})

const form = reactive({
  id: null,
  siteId: null,
  objectType: null,
  objectValue: null,
  reason: null,
  expirationTime: null
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  objectType: [required(t('message.validateTypeRequired'))],
  objectValue: [required(t('message.validateValueRequired'))],
  reason: [required(t('message.validateReasonRequired'))]
})

const sites = reactive({
  list: [],
})

function resetQuery() {
  request.siteId = site.value ? site.value.id : sites.list[0].id;
  request.objectType = null
  request.objectValue = null
  request.isActive = null
  request.createTime = [defaultStartDate, defaultEndDate]
}

async function loadRegisterBlacklist() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = sites.list.find(e => e.id === request.siteId).timeZone
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = JSON.parse(JSON.stringify(request.createTime))
      query.createTime[0] = formatInputTimeZone(
        query.createTime[0],
        timeZone,
        'start'
      )
      query.createTime[1] = formatInputTimeZone(
        query.createTime[1],
        timeZone,
        'end'
      )
      query.createTime = query.createTime.join(',')
    }
  }
  const { data: ret } = await getRegisterBlacklist(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

function changePage(page) {
  request.current = page
  loadRegisterBlacklist()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.add')
    form.id = null
    form.objectType = null
    form.objectValue = null
    form.reason = null
    form.expirationTime = null
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.edit')
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

function create() {
  formRef.value.validate(async valid => {
    if (valid) {
      await createRegisterBlacklist(form)
      uiControl.dialogVisible = false
      await loadRegisterBlacklist()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  formRef.value.validate(async valid => {
    if (valid) {
      await updateRegisterBlacklist(form)
      uiControl.dialogVisible = false
      await loadRegisterBlacklist()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeBlacklist(id) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    await deleteRegisterBlacklist(id)
    await loadRegisterBlacklist()
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

async function changeRegisterBlacklistStatus(id, status) {
  await updateRegisterBlacklistState(id, status)
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  await loadRegisterBlacklist()
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
  await loadRegisterBlacklist();
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
