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
        <el-select
          clearable
          v-model="request.platformId"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 200px; margin-left: 5px"
          @focus="loadPlatforms"
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadSitePlatform"
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
        <el-form-item :label="t('fields.platformName')" prop="platformId">
          <el-select
            v-model="form.platformId"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @focus="loadPlatforms"
            @change="changePlatform($event)"
          >
            <el-option
              v-for="item in platforms.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group
            v-model="form.status"
            size="mini"
            style="width: 300px"
          >
            <el-radio-button label="OPEN">OPEN</el-radio-button>
            <el-radio-button label="CLOSE">CLOSE</el-radio-button>
            <el-radio-button label="TEST">TEST</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.platformAccount')" prop="platformAccountId">
          <el-select
            filterable
            v-model="form.platformAccountId"
            size="small"
            :placeholder="t('fields.platformAccount')"
            class="filter-item"
            no-data-text="No data. empty platform name "
            style="width: 200px; margin-left: 5px"
          >
            <el-option
              v-for="item in filteredPlatformAcc"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
      <el-table-column prop="siteName" :label="t('fields.siteName')" width="200" />
      <el-table-column prop="platformName" :label="t('fields.platformName')" width="200" />
      <el-table-column prop="platformAccountName" :label="t('fields.platformAccount')" width="200" />
      <el-table-column prop="status" :label="t('fields.status')" width="200">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'OPEN'" type="success">
            OPEN
          </el-tag>
          <el-tag v-if="scope.row.status === 'CLOSE'" type="danger">
            CLOSE
          </el-tag>
          <el-tag v-if="scope.row.status === 'TEST'">TEST</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="200" />
      <el-table-column
        prop="createTime"
        :label="t('fields.createTime')"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              formatter: 'YYYY/MM/DD HH:mm:ss',
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="right" fixed="right" width="200">
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
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import {
  createSitePlatform,
  getSitePlatforms,
  updateSitePlatform,
} from '../../../api/site-platform'
import { getSiteListSimple } from '../../../api/site'
import { getPlatformNames } from '../../../api/platform'
import { getPlatformAccountList } from '../../../api/system-platform-account'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const sitePlatformForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
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
  platformId: null,
})

const form = reactive({
  id: null,
  siteId: null,
  platformId: null,
  status: null,
  platformAccountId: null,
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  platformId: [required(t('message.validatePlatformNameRequired'))],
  status: [required(t('message.validateStatusRequired'))],
  platformAccountId: [required(t('message.validatePlatformAccountRequired'))],
})

const sites = reactive({
  list: [],
})

const platforms = reactive({
  list: [],
})

const platformAccounts = reactive({
  list: [],
})

let chooseSitePlatform = []

const filterPlatformAccVal = ref('')

const filteredPlatformAcc = computed(() => {
  // eslint-disable-next-line
  let filter = filterPlatformAccVal.value
  return platformAccounts.list.filter(p => p.platformId === Number(filter))
})

function resetQuery() {
  request.siteId = site.value ? site.value.id : null
  request.platformId = null
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
// TODO filter platform account list by platform id
function changePlatform(event) {
  filterPlatformAccVal.value = event
  form.platformAccountId = ''
}

async function loadSitePlatform() {
  page.loading = true
  const { data: ret } = await getSitePlatforms(request)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadPlatforms() {
  const { data: ret } = await getPlatformNames()
  platforms.list = ret
}

async function loadPlatformAccounts() {
  const { data: ret } = await getPlatformAccountList()
  platformAccounts.list = ret
}

function changePage(page) {
  request.current = page
  loadSitePlatform()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (sitePlatformForm.value) {
      sitePlatformForm.value.resetFields()
      filterPlatformAccVal.value = ''
    }
    form.id = null
    form.status = '1'
    form.showTransfer = true
    uiControl.dialogTitle = t('fields.addSitePlatform')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editSitePlatform')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(sitePlatform) {
  showDialog('EDIT')
  if (!sitePlatform) {
    sitePlatform = chooseSitePlatform[0]
  }
  nextTick(() => {
    for (const key in sitePlatform) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = sitePlatform[key]
      }
    }
    filterPlatformAccVal.value = form.platformId
  })
}

function create() {
  sitePlatformForm.value.validate(async valid => {
    if (valid) {
      await createSitePlatform(form)
      uiControl.dialogVisible = false
      await loadSitePlatform()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  sitePlatformForm.value.validate(async valid => {
    if (valid) {
      await updateSitePlatform(form)
      uiControl.dialogVisible = false
      await loadSitePlatform()
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

onMounted(async() => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadSitePlatform()
  await loadPlatforms()
  await loadPlatformAccounts()
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
