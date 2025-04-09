<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.name')"
        />
        <el-input
          v-model="request.code"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.code')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
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
          @click="loadPrivilegeMatch"
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
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="id" :label="t('fields.id')" width="100" />
      <el-table-column prop="name" :label="t('fields.name')" width="200" />
      <el-table-column prop="alias" :label="t('fields.alias')" width="200" />

      <el-table-column
        prop="status"
        :label="t('fields.status')"
        min-width="150"
      />
      <el-table-column prop="site" :label="t('fields.site')" width="120" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')">
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
        :label="t('fields.operate')"
        align="right"
        v-if="hasPermission(['sys:privilege:update'])"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="showDialog(scope.row)"
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

  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="900px"
  >
    <el-form
      ref="matchForm"
      :model="matchForm"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item :label="t('fields.competitionMatching')" prop="params">
        <div v-for="(item, index) in param" :key="index">
          <el-input style="width: 470px " v-model="item.value" />

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
</template>

<script setup>
import { computed, onMounted, reactive, ref, nextTick } from 'vue'
import moment from 'moment'
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import {
  updatePrivilegeMatch,
  getPrivilegeMatch,
} from '../../../api/privilege-info'
import { getSiteListSimple } from '../../../api/site'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import JsonEditor from 'json-editor-vue3'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)

const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  status: [
    { key: 1, displayName: 'Open', value: 'OPEN' },
    { key: 2, displayName: 'Close', value: 'CLOSE' },
    { key: 3, displayName: 'Test', value: 'TEST' },
  ],
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const param = ref([])

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  code: null,
  status: null,
  siteId: null,
})

const matchForm = reactive({
  id: null,
  params: null,
})

function resetQuery() {
  request.name = null
  request.code = null
  request.status = null
  request.siteId = store.state.user.siteId
}

async function loadPrivilegeMatch() {
  page.loading = true
  const { data: ret } = await getPrivilegeMatch(request)
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
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function changePage(page) {
  request.current = page
  loadPrivilegeMatch()
}

function showDialog(privi) {
  uiControl.dialogVisible = true
  uiControl.dialogTitle = t('fields.competitionMatching')
  param.value = []
  nextTick(() => {
    matchForm.id = privi.id
    matchForm.params = privi.param

    param.value = []

    if (matchForm.params) {
      var paramJson = JSON.parse(matchForm.params)
      Object.entries(paramJson.competitionList).forEach(([key, value]) => {
        const json = {}
        json.key = key
        json.value = value
        param.value.push(json)
      })
      addParam()
    }
  })
}

function addParam() {
  param.value.push({
    key: '',
    value: '',
  })
}

function delParam(index) {
  param.value.splice(index, 1)
}

function constructParam() {
  const json = []
  var i = 0
  Object.values(param.value).forEach(item => {
    if (item.value !== "") {
      json[i] = item.value
      i++
    }
  })
  return JSON.stringify(json)
}

async function submit() {
  matchForm.params = constructParam()
  const scheduleFormCopy = { ...matchForm }
  await updatePrivilegeMatch(scheduleFormCopy)
  uiControl.dialogVisible = false
  await loadPrivilegeMatch()
  ElMessage({ message: t('message.editSuccess'), type: 'success' })
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadPrivilegeMatch()
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

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-input-number:deep(.el-input__inner) {
  text-align: left;
}

.full-screen {
  right: 20px !important;
}

.el-radio-button--mini .el-radio-button__inner {
  padding: 7px 10px !important;
}

.steps {
  margin-top: 20px;
  margin-bottom: 20px;
  justify-content: center;
}
</style>
