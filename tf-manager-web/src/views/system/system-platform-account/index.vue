<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          clearable
          v-model="request.platformId"
          size="small"
          :placeholder="t('fields.platformCode')"
          class="filter-item"
          style="width: 200px; margin-left: 5px"
          @focus="loadPlatforms"
          filterable
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.id"
            :label="item.code"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="margin-left: 5px;"
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
          @click="loadPlatfromAccount"
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
      width="650px"
    >
      <el-form
        ref="sitePlatformForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-row>
          <el-form-item :label="t('fields.platformCode')" prop="platformId">
            <el-col>
              <el-select
                v-model="form.platformId"
                value-key="id"
                :placeholder="t('fields.pleaseChoose')"
                style="width: 350px"
                filterable
                @focus="loadPlatforms"
              >
                <el-option
                  v-for="item in platforms.list"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
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
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.name')" prop="name">
            <el-col>
              <el-input
                type="text"
                v-model="form.name"
                style="width: 190px; white-space: pre-line"
              />
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.status')" prop="status">
            <el-col>
              <el-radio-group
                v-model="form.status"
                size="small"
                style="width: 300px"
              >
                <el-radio-button label="OPEN">{{ t('common.status.OPEN') }}</el-radio-button>
                <el-radio-button label="CLOSE">{{ t('common.status.CLOSE') }}</el-radio-button>
                <el-radio-button label="TEST">{{ t('common.status.TEST') }}</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.walletType')" prop="walletType">
            <el-select
              v-model="form.walletType"
              size="small"
              :placeholder="t('fields.walletType')"
              class="filter-item"
              style="width: 190px"
            >
              <el-option
                v-for="item in uiControl.wallet"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.needRegister')" prop="needRegister">
            <el-switch
              v-model="form.needRegister"
              active-color="#409EFF"
              inactive-color="#F56C6C"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.isSeamlessTransfer')" prop="isSeamlessTransfer">
            <el-switch
              v-model="form.isSeamlessTransfer"
              active-color="#409EFF"
              inactive-color="#F56C6C"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            :label="t('fields.nextActivationTime')"
            prop="nextActivationTime"
          >
            <el-date-picker
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              v-model="form.nextActivationTime"
              style="width: 190px"
            />
            <!-- :disabled-date="disabledActivationTime" -->
          </el-form-item>
        </el-row>
        <el-row>
          <!-- <el-form-item label="Get Bet Time" prop="nextGetBetStartTime">
            <el-date-picker
              v-model="dateTimeVal"
              type="datetimerange"
              range-separator=":"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              :clearable="false"
              @change="changeDatetimeSelection()"
            />
          </el-form-item> -->
          <el-form-item
            :label="t('fields.nextGetBetStartTime')"
            prop="nextGetBetStartTime"
          >
            <el-col :span="5">
              <el-date-picker
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                v-model="form.nextGetBetStartTime"
                style="width: 190px"
              />
            </el-col>
            <!-- :disabled-date="disabledStartDate" -->
          </el-form-item>

          <el-form-item
            :label="t('fields.nextGetBetEndTime')"
            prop="nextGetBetEndTime"
          >
            <el-col :span="5">
              <el-date-picker
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                v-model="form.nextGetBetEndTime"
                style="width: 190px"
              />
              <!-- :disabled-date="disabledEndDate" -->
            </el-col>
          </el-form-item>
        </el-row>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            type="number"
            v-model="form.sequence"
            :min="0"
            :controls="false"
            style="width: 190px; white-space: pre-line"
          />
        </el-form-item>
        <el-form-item :label="t('fields.nextGetBetPage')" prop="nextGetBetPage">
          <el-input-number
            type="number"
            v-model="form.nextGetBetPage"
            :min="0"
            :controls="false"
            style="width: 190px; white-space: pre-line"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.nextGetBetIndex')"
          prop="nextGetBetIndex"
        >
          <el-input
            type="text"
            v-model="form.nextGetBetIndex"
            style="width: 190px; white-space: pre-line"
          />
        </el-form-item>
        <el-form-item :label="t('fields.rate')" prop="rate">
          <el-input-number
            type="number"
            :min="0"
            :controls="false"
            v-model="form.rate"
            style="width: 190px; white-space: pre-line"
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
            :rows="20"
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
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="platformName"
        :label="t('fields.platformName')"
        width="200"
      />
      <el-table-column prop="name" :label="t('fields.name')" width="200" />
      <!--      <el-table-column prop="nextActivationTime" :label="t('fields.nextActivationTime')" width="180">-->
      <!--        <template #default="scope">-->
      <!--          <span v-if="scope.row.nextActivationTime === null">-</span>-->
      <!--          <span-->
      <!--            v-if="scope.row.nextActivationTime !== null"-->
      <!--            v-formatter="{data: scope.row.nextActivationTime, timeZone: scope.row.timeZone, type: 'date'}"-->
      <!--          />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="nextGetBetStartTime" :label="t('fields.nextGetBetStartTime')" width="200">-->
      <!--        <template #default="scope">-->
      <!--          <span v-if="scope.row.nextGetBetStartTime === null">-</span>-->
      <!--          <span-->
      <!--            v-if="scope.row.nextGetBetStartTime !== null"-->
      <!--            v-formatter="{data: scope.row.nextGetBetStartTime, timeZone: scope.row.timeZone, type: 'date'}"-->
      <!--          />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="nextGetBetEndTime" :label="t('fields.nextGetBetEndTime')" width="200">-->
      <!--        <template #default="scope">-->
      <!--          <span v-if="scope.row.nextGetBetEndTime === null">-</span>-->
      <!--          <span-->
      <!--            v-if="scope.row.nextGetBetEndTime !== null"-->
      <!--            v-formatter="{data: scope.row.nextGetBetEndTime, timeZone: scope.row.timeZone, type: 'date'}"-->
      <!--          />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="nextGetBetPage" :label="t('fields.nextGetBetPage')" width="150" />-->
      <el-table-column
        prop="walletType"
        :label="t('fields.walletType')"
        width="150"
      />
      <!-- <el-table-column prop="status" :label="t('fields.status')" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'OPEN'" type="success">
            OPEN
          </el-tag>
          <el-tag v-if="scope.row.status === 'CLOSE'" type="danger">
            CLOSE
          </el-tag>
          <el-tag v-if="scope.row.status === 'TEST'">TEST</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="status" :label="t('fields.status')" min-width="200">
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.status"
            size="mini"
            @change="changePlatformAccountStatus(scope.row.id, scope.row.status)"
          >
            <el-radio-button label="OPEN">{{ t('common.status.OPEN') }}</el-radio-button>
            <el-radio-button label="CLOSE">{{ t('common.status.CLOSE') }}</el-radio-button>
            <el-radio-button label="TEST">{{ t('common.status.TEST') }}</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="needRegister"
        :label="t('fields.needRegister')"
        width="120"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.needRegister"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="
              changeAccountNeedRegister(scope.row.id, scope.row.needRegister)
            "
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        fixed="right"
        width="120"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="showEdit(scope.row)"
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
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import { required, checkJson } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import {
  createPlatformAccount,
  getPlatformAccount,
  updatePlatformAccount,
  updateAccountNeedRegister,
  updatePlatformAccountState,
} from '../../../api/system-platform-account'
import { getPlatformNames } from '../../../api/platform'
import moment from 'moment'
import { useStore } from '../../../store'
import { useI18n } from 'vue-i18n'
import { getSiteListSimple } from '../../../api/site'
import JsonEditor from 'json-editor-vue3'
import { TENANT } from '../../../store/modules/user/action-types'

const store = useStore()
const { t } = useI18n()
const sitePlatformForm = ref(null)
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  wallet: [
    { key: 1, name: 'TRANSFER', value: 'TRANSFER' },
    { key: 2, name: 'SEAMLESS', value: 'SEAMLESS' },
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
  platformId: null,
  siteId: null,
})

const form = reactive({
  id: null,
  platformId: null,
  siteId: null,
  name: null,
  param: null,
  status: null,
  walletType: null,
  needRegister: null,
  sequence: null,
  nextActivationTime: null,
  nextGetBetStartTime: null,
  nextGetBetEndTime: null,
  nextGetBetIndex: null,
  nextGetBetPage: null,
  rate: null,
  isSeamlessTransfer: null,
})

// const dateTimeVal = ref([])

const formRules = reactive({
  platformId: [required(t('message.validatePlatformNameRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  name: [required(t('message.validateNameRequired'))],
  param: [
    required(t('message.validateParamRequired')),
    { validator: checkJson, trigger: 'blur' },
  ],
  status: [required(t('message.validateStatusRequired'))],
  walletType: [required(t('message.validateWalletTypeRequired'))],
  needRegister: [required(t('message.validateNeedRegisterRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  nextActivationTime: [
    required(t('message.validateNextActivationTimeRequired')),
  ],
  nextGetBetStartTime: [required(t('message.validateNextGetBetStartTime'))],
  nextGetBetEndTime: [required(t('message.validateNextGetBetEndTime'))],
  nextGetBetPage: [required(t('message.validateNextGetBetPage'))],
  rate: [required(t('message.validateRateRequired'))],
  isSeamlessTransfer: [required(t('message.validateIsSeamlessTransferRequired'))],
})

const platforms = reactive({
  list: [],
})

const sites = reactive({
  list: [],
})

// const platformAccounts = reactive({
//   list: []
// })

function resetQuery() {
  request.siteId = sites.list[0].id
  request.platformId = null
}

// function disabledActivationTime(time) {
//   if (form.nextActivationTime !== null) {
//     const changedDate = form.nextActivationTime.replace(/(..)\/(..)\/(....)/, '$3-$2-$1')
//     var date = new Date(changedDate)
//     return (
//       time.getTime() <= moment(Date.now()).subtract(1, 'days') ||
//       time.getTime() >= moment(date).subtract(1, 'days')
//     )
//   }
//   return time.getTime() <= moment(Date.now()).subtract(1, 'days')
// }

// function disabledStartDate(time) {
//   if (form.nextGetBetStartTime !== null) {
//     const changedDate = form.nextGetBetStartTime.replace(/(..)\/(..)\/(....)/, '$3-$2-$1')
//     var date = new Date(changedDate)
//     return (
//       time.getTime() <= moment(Date.now()).subtract(1, 'days') ||
//       time.getTime() >= moment(date).subtract(1, 'days')
//     )
//   }
//   return time.getTime() <= moment(Date.now()).subtract(1, 'days')
// }

// function disabledEndDate(time) {
//   if (form.nextGetBetEndTime !== null) {
//     const changedDate = form.nextGetBetEndTime.replace(/(..)\/(..)\/(....)/, '$3-$2-$1')
//     var date = new Date(changedDate)
//     return time.getTime() <= date.getTime()
//   }
// //   return time.getTime() <= Date.now()
// }

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

async function loadPlatfromAccount() {
  page.loading = true
  const { data: ret } = await getPlatformAccount(request)
  page.pages = ret.pages
  page.records = ret.records
  ret.records.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.id === data.siteId) !== undefined
        ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
        : null
  })
  page.loading = false
}

async function loadPlatforms() {
  const { data: ret } = await getPlatformNames()
  platforms.list = ret.sort((a, b) => a.name.localeCompare(b.name));
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function changeAccountNeedRegister(id, needRegister) {
  await updateAccountNeedRegister(id, needRegister)
}

// function changeDatetimeSelection() {
//   const startDate = dateTimeVal.value.at(0)
//   const endDate = dateTimeVal.value.at(1)
//   form.nextGetBetStartTime = startDate.toString()
//   form.nextGetBetEndTime = endDate.toString()
//   console.log(form)
//   console.log(dateTimeVal.value)
// }

function changePage(page) {
  request.current = page
  loadPlatfromAccount()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (sitePlatformForm.value) {
      sitePlatformForm.value.resetFields()
    }
    form.id = null
    form.status = '1'
    const date = convertDate(new Date())
    form.needRegister = true
    form.nextGetBetStartTime = date
    form.nextGetBetEndTime = date
    form.nextActivationTime = date
    form.isSeamlessTransfer = false
    // dateTimeVal.value = [new Date(), new Date()]
    uiControl.dialogTitle = t('fields.addPlatformAccount')
    editorValue = ''
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editPlatformAccount')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true

  nextTick(() => {
    removeJsonEditorElement()
  })
}

function showEdit(platformAccount) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in platformAccount) {
      if (Object.keys(form).find(k => k === key)) {
        if (key === 'nextGetBetStartTime' || key === 'nextGetBetEndTime') {
          form[key] = String(platformAccount[key]).slice(0, 10)
        }

        form[key] = platformAccount[key]
        if (key === 'param') {
          editorValue = JSON.parse(form[key])
        }
        console.log('form[key] 2 : ', form[key])
      }
    }
    // dateTimeVal.value = [form.nextGetBetStartTime, form.nextGetBetEndTime]
    form.param = JSON.stringify(JSON.parse(form.param), null, 2)
  })
}

function create() {
  sitePlatformForm.value.validate(async valid => {
    if (valid) {
      await createPlatformAccount(form)
      uiControl.dialogVisible = false
      await loadPlatfromAccount()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  sitePlatformForm.value.validate(async valid => {
    if (valid) {
      console.log(form)
      await updatePlatformAccount(form)
      uiControl.dialogVisible = false
      await loadPlatfromAccount()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

function json() {
  if (form.param) {
    nextTick(() => {
      form.param = JSON.stringify(JSON.parse(form.param), null, 2)
    })
  }
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

async function changePlatformAccountStatus(id, status) {
  await updatePlatformAccountState(id, status)
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  await loadPlatfromAccount()
}

onMounted(async () => {
  await loadSites()
  request.siteId = sites.list[0].id
  site.value = sites.list[0]
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadPlatfromAccount()
  await loadPlatforms()
})
</script>

<style rel="stylesheet/scss" lang="scss">
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
