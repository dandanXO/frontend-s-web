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
          v-permission="['sys:smssetting:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:smssetting:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:smssetting:del']"
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
        <el-form-item :label="t('fields.type')" prop="type">
          <el-input v-model="form.type" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.signName')" prop="signName">
          <el-input v-model="form.signName" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.secretId')" prop="secretId">
          <el-input v-model="form.secretId" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.secretKey')" prop="secretKey">
          <el-input v-model="form.secretKey" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.appId')" prop="appId">
          <el-input v-model="form.appId" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.templateId')" prop="templateId">
          <el-input v-model="form.templateId" style="width: 350px" />
        </el-form-item>
        <el-form-item
          :label="t('fields.country')"
          prop="country"
        >
          <el-select
            v-model="form.country"
            multiple
            :placeholder="t('fields.country')"
            style="width: 350px"
            @focus="loadCountries()"
          >
            <el-option
              v-for="item in countries.list"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.priority')" prop="priority">
          <el-input-number
            v-model="form.priority"
            style="width: 350px;"
            :min="1"
            :max="100"
            @keypress="restrictInput($event)"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('fields.param')" prop="param">
          <JsonEditor
            class="editor"
            v-model="editorValue"
            currentMode="code"
            :modeList="[]"
            @update:modelValue="updataModel"
          />
          <el-input
            type="hidden"
            v-model="form.param"
            :rows="15"
            style="width: 350px; white-space: pre-line"
            placeholder="{'abc':'xyz'}"
            @change="json"
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
      <el-table-column
        type="selection"
        width="55"
        v-if="!hasRole(['SUB_TENANT'])"
      />
      <el-table-column prop="siteName" :label="t('fields.site')" width="120" />
      <el-table-column
        prop="type"
        :label="t('fields.type')"
        min-width="100"
      />
      <el-table-column
        prop="signName"
        :label="t('fields.signName')"
        min-width="100"
      />
      <el-table-column
        prop="secretId"
        :label="t('fields.secretId')"
        min-width="150"
      />
      <el-table-column prop="appId" :label="t('fields.appId')" width="150" />
      <el-table-column
        prop="templateId"
        :label="t('fields.templateId')"
        width="150"
      />
      <el-table-column
        prop="country"
        :label="t('fields.country')"
        width="150"
      />
      <el-table-column
        prop="priority"
        :label="t('fields.priority')"
        width="120"
      />
      <!-- <el-table-column
        prop="status"
        :label="t('fields.status')"
        width="150"
      >
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.status"
            size="mini"
            style="width: 300px"
            @change="updateState(scope.row.id, scope.row.status)"
          >
            <el-radio-button label="OPEN">OPEN</el-radio-button>
            <el-radio-button label="CLOSE">CLOSE</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="status"
        :label="t('fields.status')"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="OPEN"
            inactive-value="CLOSE"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="updateState(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        :label="t('fields.updateTime')"
        width="150"
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
      <el-table-column
        prop="updateBy"
        :label="t('fields.updateBy')"
        width="150"
      />
      <el-table-column
        :label="t('fields.operate')"
        width="120"
        align="right"
        v-if="
          !hasRole(['SUB_TENANT']) &&
            (hasPermission(['sys:smssetting:update']) ||
              hasPermission(['sys:smssetting:del']))
        "
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:smssetting:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:smssetting:del']"
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
  createSmsSetting,
  deleteSmsSetting,
  getSmsSetting,
  updateSmsSetting,
  updateStatus,
  getCountryCode
} from '../../../api/sms-setting'
import { getSiteListSimple } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import JsonEditor from 'json-editor-vue3'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const settingForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
  status: [
    { key: 1, displayName: 'OPEN', value: 'OPEN' },
    { key: 2, displayName: 'CLOSE', value: 'CLOSE' },
  ]
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
  type: null,
  signName: null,
  secretId: null,
  secretKey: null,
  appId: null,
  templateId: null,
  param: null,
  siteName: null,
  country: null,
  priority: null
})

const formRules = reactive({
  type: [required(t('message.validateTypeRequired'))],
  signName: [required(t('message.validateSignNameRequired'))],
  secretId: [required(t('message.validateSecretIdRequired'))],
  secretKey: [required(t('message.validateSecretKeyRequired'))],
  appId: [required(t('message.validateAppIdRequired'))],
  templateId: [required(t('message.validateTemplateIdRequired'))],
  param: [
    required(t('message.validateParamRequired')),
    { validator: checkJson, trigger: 'blur' },
  ],
  country: [required(t('message.validateCountryRequired'))],
  priority: [required(t('message.validatePriorityRequired'))]
})

const sites = reactive({
  list: [],
})

const countries = reactive({
  list: [],
})

let chooseSetting = []

function resetQuery() {
  request.siteId = site.value ? site.value.id : sites.list[0].id
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
  const { data: ret } = await getSmsSetting(request)
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
    uiControl.dialogTitle = t('fields.addSmsSetting')
    form.id = null
    form.siteName = null
    editorValue = ''
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editSmsSetting')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true

  nextTick(() => {
    removeJsonEditorElement()
  })
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
      if (key === 'param') {
        editorValue = JSON.parse(form[key])
      }

      if (form[key] && key === 'country') {
        form[key] = setting[key].split(',')
      }
    }
  })
}

function create() {
  settingForm.value.validate(async valid => {
    if (valid) {
      if (form.country !== null && form.country.length > 0) {
        if (form.country.length === 1) {
          form.country = form.country[0]
        } else {
          form.country = form.country.join(",")
        }
      }
      await createSmsSetting(form)
      uiControl.dialogVisible = false
      await loadSetting()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  settingForm.value.validate(async valid => {
    if (valid) {
      if (form.country !== null && form.country.length > 0) {
        if (form.country.length === 1) {
          form.country = form.country[0]
        } else {
          form.country = form.country.join(",")
        }
      }
      await updateSmsSetting(form)
      uiControl.dialogVisible = false
      await loadSetting()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeSetting(setting) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (setting) {
      await deleteSmsSetting([setting.id])
    } else {
      await deleteSmsSetting(chooseSetting.map(u => u.id))
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

let editorValue = ref({})

const updataModel = val => {
  form.param = JSON.stringify(val, null, 2)
  editorValue = val
}

function removeJsonEditorElement() {
  const classesToRemove = [
    'jsoneditor-poweredBy',
    'jsoneditor-sort',
    'jsoneditor-transform',
    'jsoneditor-undo',
    'jsoneditor-redo',
    'jsoneditor-repair',
  ]
  classesToRemove.forEach(className => {
    const elements = document.getElementsByClassName(className)
    Array.from(elements).forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })
  })
}

async function loadCountries() {
  const { data: ret } = await getCountryCode()
  countries.list = ret
}

function restrictInput(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

async function updateState(id, status) {
  await updateStatus(id, status);
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  await loadSetting();
}

onMounted(async () => {
  await loadSites()
  await loadCountries()
  request.siteId = sites.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName)
    request.siteId = site.value.id
  }
  await loadSetting()
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

.full-screen {
  right: 20px !important;
}
</style>
