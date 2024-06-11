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
          v-model="request.domainType"
          size="small"
          value-key="id"
          :placeholder="t('fields.pleaseChoose')"
          filterable
          style="width: 200px; margin-left: 5px;"
          @focus="loadDomainTypes"
        >
          <el-option
            v-for="item in domainTypes.list"
            :key="item"
            :label="t('domainType.' + item)"
            :value="item"
          />
        </el-select>
        <el-select
          v-model="request.accessType"
          size="small"
          :placeholder="t('fields.accessType')"
          class="filter-item"
          style="width: 200px; margin-left: 5px;"
        >
          <el-option
            v-for="item in uiControl.accessTypes"
            :key="item.value"
            :label="item.label"
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
          v-permission="['sys:domain-access:create']"
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
          <el-input
            style="width: 300px"
            v-model="form.domain"
            :placeholder="t('fields.domain')"
          />
        </el-form-item>
        <el-form-item :label="t('fields.domainType')" prop="domainType">
          <el-select
            v-model="form.domainType"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @focus="loadDomainTypes"
          >
            <el-option
              v-for="item in domainTypes.list"
              :key="item"
              :label="t('domainType.' + item)"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('sitePlatform.accessType')" prop="accessType">
          <el-radio-group
            v-model="form.accessType"
            size="mini"
            style="width: 300px"
          >
            <el-radio-button label="WHITELIST">
              {{ t('fields.whitelist') }}
            </el-radio-button>
            <el-radio-button label="BLACKLIST">
              {{ t('fields.blacklist') }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.valueType')" prop="valueType">
          <el-radio-group
            v-model="form.valueType"
            size="mini"
            style="width: 300px"
          >
            <el-radio-button label="COUNTRY_CODE_LIST">
              {{ t('fields.countryCode') }}
            </el-radio-button>
            <el-radio-button label="IP_LIST">
              {{ t('fields.ipList') }}
            </el-radio-button>
            <el-radio-button label="IP_RANGE">
              {{ t('fields.ipRange') }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.valueType === 'COUNTRY_CODE_LIST'" :label="t('fields.country')" prop="value">
          <el-select
            v-model="form.value"
            multiple
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in countries.list"
              :key="item.countryCode"
              :label="t('country.' + item.countryName)"
              :value="item.countryCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.valueType === 'IP_RANGE'" :label="t('fields.ipRange')" prop="value">
          <el-input
            v-model="uiControl.ipRangeLower"
            style="width: 150px"
            :placeholder="t('fields.lower')"
          />
          <span style="margin: 0 10px;">-</span>
          <el-input
            v-model="uiControl.ipRangeUpper"
            style="width: 150px"
            :placeholder="t('fields.upper')"
          />
        </el-form-item>
        <el-form-item v-if="form.valueType === 'IP_LIST'" :label="t('fields.ip')" prop="value">
          <div class="flex gap-2 mt-4">
            <el-tag
              v-for="ip in uiControl.ipList"
              :key="ip"
              closable
              :disable-transitions="false"
              @close="removeIp(ip)"
              style="margin-right: 5px;"
            >
              {{ ip }}
            </el-tag>
          </div>
          <el-input
            v-if="uiControl.inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="w-20"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + New Tag
          </el-button>
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
        prop="domain"
        :label="t('fields.domain')"
        width="200"
      />
      <el-table-column
        prop="domainType"
        :label="t('fields.domainType')"
        width="150"
      >
        <template #default="scope">
          {{ t('domainType.' + scope.row.domainType) }}
        </template>
      </el-table-column>
      <el-table-column prop="accessType" :label="t('fields.accessType')" width="200">
        <template #default="scope">
          <el-tag v-if="scope.row.accessType === 'WHITELIST'" type="success">
            {{ t('fields.whitelist') }}
          </el-tag>
          <el-tag v-if="scope.row.accessType === 'BLACKLIST'" type="warning">
            {{ t('fields.blacklist') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="accessType" :label="t('fields.valueType')" width="200">
        <template #default="scope">
          <el-tag v-if="scope.row.valueType === 'COUNTRY_CODE_LIST'" type="success">
            {{ t('fields.country') }}
          </el-tag>
          <el-tag v-if="scope.row.valueType === 'IP_LIST'" type="success">
            {{ t('fields.ip') }}
          </el-tag>
          <el-tag v-if="scope.row.valueType === 'IP_RANGE'" type="success">
            {{ t('fields.ipRange') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="value"
        :label="t('fields.value')"
        width="200"
      />
      <el-table-column
        prop="createBy"
        :label="t('fields.updateBy')"
        width="200"
      />
      <el-table-column
        prop="createTime"
        :label="t('fields.updateTime')"
        align="center"
        min-width="180"
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
        :label="t('fields.operate')"
        align="right"
        fixed="right"
        width="200"
        v-permission="['sys:domain-access:update', 'sys:domain-access:del']"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="showEdit(scope.row)"
            v-permission="['sys:domain-access:update']"
          />
          <el-button v-permission="['sys:domain-access:del']" icon="el-icon-delete" size="mini" type="danger" style="margin-left: 10px" @click="removeSetting(scope.row.id)" />
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
  createDomainAccess,
  getDomainAccessList,
  updateDomainAccess,
  deleteDomainAccess
} from '../../../api/system-domain-access'
import { getSiteListSimple } from '../../../api/site'
import { getCountries } from '../../../api/country'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const inputValue = ref('')
const InputRef = ref(null)
const sitePlatformForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  inputVisible: false,
  accessTypes: [
    { value: "WHITELIST", label: t('fields.whitelist') },
    { value: "BLACKLIST", label: t('fields.blacklist') }
  ],
  ipList: [],
  ipRangeLower: null,
  ipRangeUpper: null,
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
  domainType: null,
  accessType: null,
})

const form = reactive({
  id: null,
  siteId: null,
  domain: null,
  domainType: null,
  accessType: null,
  valueType: null,
  value: null,
})

const formRules = reactive({
  domain: [required(t('message.validateDomainRequired'))],
  domainType: [required(t('message.validateDomainTypeRequired'))],
  accessType: [required(t('message.validateAccessTypeRequired'))],
  valueType: [required(t('message.validateValueTypeRequired'))],
  value: [required(t('message.validateValueRequired'))],
})

const sites = reactive({
  list: [],
})

const countries = reactive({
  list: [],
})

const domainTypes = reactive({
  list: [],
})

let chooseSitePlatform = []

const showInput = () => {
  uiControl.inputVisible = true
}

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

async function loadDomainAccess() {
  page.loading = true
  const { data: ret } = await getDomainAccessList(request)
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

async function loadCountries() {
  const { data: ret } = await getCountries()
  countries.list = ret
}

async function loadDomainTypes() {
  const { data: ret } = await getDomainTypes()
  domainTypes.list = ret
}

function changePage(page) {
  request.current = page
  loadDomainAccess()
}

const removeIp = ip => {
  uiControl.ipList.splice(uiControl.ipList.indexOf(ip), 1)
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    uiControl.ipList.push(inputValue.value)
  }
  uiControl.inputVisible = false
  inputValue.value = ''
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
      if (key === 'value' && sitePlatform.valueType === 'IP_LIST') {
        uiControl.ipList = sitePlatform.value.split(',')
      } else if (key === 'value' && sitePlatform.valueType === 'COUNTRY_CODE_LIST') {
        form.value = sitePlatform.value.split(',')
      } else if (key === 'value' && sitePlatform.valueType === 'IP_RANGE') {
        const arr = sitePlatform.value.split('-')
        uiControl.ipRangeLower = arr[0]
        uiControl.ipRangeUpper = arr[1]
      } else if (Object.keys(form).find(k => k === key)) {
        form[key] = sitePlatform[key]
      }
    }
  })
}

async function removeSetting(id) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteDomainAccess([id])
    await loadDomainAccess()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function create() {
  sitePlatformForm.value.validate(async valid => {
    if (valid) {
      await createDomainAccess(form)
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
      await updateDomainAccess(form)
      uiControl.dialogVisible = false
      await loadDomainAccess()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (form.valueType === 'IP_LIST') {
    form.value = uiControl.ipList.join(',')
  } else if (form.valueType === 'IP_RANGE') {
    form.value = uiControl.ipRangeLower + '-' + uiControl.ipRangeUpper
  } else if (form.valueType === 'COUNTRY_CODE_LIST') {
    form.value = form.value.join(',')
  }
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

onMounted(async () => {
  await loadSites()
  await loadCountries()
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
