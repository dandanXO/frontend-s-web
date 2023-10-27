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
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadSetting"
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
          v-permission="['sys:emailsetting:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:emailsetting:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:emailsetting:del']"
          @click="removeSetting()"
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
    >
      <el-form
        ref="settingForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteName"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @change="handleChangeSite"
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
        <el-form-item :label="t('fields.host')" prop="host">
          <el-input v-model="form.host" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.port')" prop="port">
          <el-input-number
            type="number"
            v-model.number="form.port"
            :min="0"
            style="width: 350px"
            @keypress="restrictInput($event)"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('fields.user')" prop="user">
          <el-input v-model="form.user" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.password')" prop="password">
          <el-input v-model="form.password" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.from')" prop="fromEmail">
          <el-input v-model="form.fromEmail" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.param')" prop="param">
          <el-input
            type="textarea"
            v-model="form.param"
            :rows="15"
            style="width: 350px; white-space: pre-line"
            placeholder="{'abc':'xyz'}"
            @change="json"
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
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        type="selection"
        width="55"
        v-if="!hasRole(['SUB_TENANT'])"
      />
      <el-table-column prop="siteName" :label="t('fields.site')" width="150" />
      <el-table-column prop="host" :label="t('fields.host')" min-width="200" />
      <el-table-column prop="port" :label="t('fields.port')" width="100" />
      <el-table-column prop="user" :label="t('fields.user')" width="200" />
      <el-table-column prop="fromEmail" :label="t('fields.from')" width="200" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{data: scope.row.updateTime, timeZone: scope.row.siteTimeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:emailsetting:update']) || hasPermission(['sys:emailsetting:del']) )"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:emailsetting:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:emailsetting:del']"
            @click="removeSetting(scope.row)"
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
import { checkJson, required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createEmailSetting,
  deleteEmailSetting,
  getEmailSetting,
  updateEmailSetting,
} from '../../../api/email-setting'
import { getSiteListSimple } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const settingForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  name: null,
  platform: null,
  siteId: null,
})

const form = reactive({
  id: null,
  siteId: null,
  host: null,
  port: null,
  user: null,
  password: null,
  fromEmail: null,
  param: null,
  siteName: null,
})

const formRules = reactive({
  host: [required(t('message.validateHostRequired'))],
  port: [required(t('message.validatePortRequired'))],
  user: [required(t('message.validateUsernameRequired'))],
  password: [required(t('message.validatePasswordRequired'))],
  fromEmail: [required(t('message.validateEmailRequired'))],
  param: [
    required(t('message.validateParamRequired')),
    { validator: checkJson, trigger: 'blur' },
  ],
})

const sites = reactive({
  list: [],
})

let chooseSetting = []

function resetQuery() {
  request.siteId = site.value ? site.value.id : null;
}

function handleSelectionChange(val) {
  chooseSetting = val
  if (chooseSetting.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseSetting.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadSetting() {
  page.loading = true
  const { data: ret } = await getEmailSetting(request)
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
  loadSetting()
}

function json() {
  if (form.param) {
    nextTick(() => {
      form.param = JSON.stringify(JSON.parse(form.param), null, 2)
    })
  }
}
function showDialog(type) {
  if (type === 'CREATE') {
    if (settingForm.value) {
      settingForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addEmailSetting')
    form.id = null
    form.siteName = null
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editEmailSetting')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(setting) {
  showDialog('EDIT')
  if (!setting) {
    setting = chooseSetting[0]
  }
  nextTick(() => {
    for (const key in setting) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = setting[key]
    }
  })
}

function create() {
  settingForm.value.validate(async valid => {
    if (valid) {
      await createEmailSetting(form)
      uiControl.dialogVisible = false
      await loadSetting()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  settingForm.value.validate(async valid => {
    if (valid) {
      await updateEmailSetting(form)
      uiControl.dialogVisible = false
      await loadSetting()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeSetting(setting) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (setting) {
      await deleteEmailSetting([setting.id])
    } else {
      await deleteEmailSetting(chooseSetting.map(u => u.id))
    }
    await loadSetting()
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
  }
  await loadSetting();
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
