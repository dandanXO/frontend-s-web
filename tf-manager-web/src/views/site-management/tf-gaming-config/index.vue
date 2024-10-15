<template>
  <div class="roles-main">
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="700px"
    >
      <el-form
        ref="configForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.code')" prop="code">
          <el-input v-model="form.code" style="width: 350px;" readonly />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="c in uiControl.status"
              :label="c.value"
              :key="c.key"
              v-model="form.status"
            >
              {{ c.displayName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.startHour')" prop="startHour">
          <el-input-number
            v-model="form.startHour"
            style="width: 145px"
            :min="0"
            :max="23"
            :controls="false"
          />
        </el-form-item>
        <el-form-item :label="t('fields.endHour')" prop="endHour">
          <el-input-number
            v-model="form.endHour"
            style="width: 145px"
            :min="0"
            :max="23"
            :controls="false"
          />
        </el-form-item>
        <el-form-item label="VIP" prop="vips">
          <el-checkbox
            v-model="checkboxes.vip.checkAll"
            :indeterminate="checkboxes.vip.isIndeterminate"
            @change="handleVIPCheckAllChange"
          >
            {{ t('fields.checkall') }}
          </el-checkbox>
          <el-checkbox-group
            v-model="selectedVIPs.vipChecked"
            @change="handleCheckedChange('VIP')"
            style="width: 300px"
          >
            <el-checkbox v-for="v in vipList.list" :label="v.id" :key="v.id">
              {{ v.name }}
            </el-checkbox>
          </el-checkbox-group>
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
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="code" :label="t('fields.code')" />
      <el-table-column prop="status" :label="t('fields.status')">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'OPEN'" type="success">
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === 'CLOSE'" type="danger">
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === 'TEST'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startHour" :label="t('fields.startHour')" />
      <el-table-column prop="endHour" :label="t('fields.endHour')" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="hasPermission(['sys:tf-gaming-config:edit'])"
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
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import {
  updateConfig,
  getConfigList,
} from '../../../api/tf-gaming-config'
import { getVipList } from '../../../api/vip'
import { getSiteListSimple } from '../../../api/site'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const configForm = ref(null)
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
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

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  code: null,
  status: null,
  siteId: null,
})

const form = reactive({
  id: null,
  code: null,
  status: 'OPEN',
  startHour: null,
  endHour: null,
  vips: null,
  siteId: null,
})

const formRules = reactive({
  code: [required(t('message.validateCodeRequired'))],
  status: [required(t('message.validateStatusRequired'))],
  startHour: [required(t('message.validateStartTimeRequired'))],
  endHour: [required(t('message.validateEndTimeRequired'))],
  vips: [required(t('message.validateVIPRequired'))],
})

const vipList = reactive({
  list: [],
})
const paymentTypeList = reactive({
  list: [],
})

const selectedVIPs = reactive({ vipChecked: [] })
const selectedPayTypes = reactive({ payTypeChecked: [] })
const selectedBonusDays = reactive({ bonusDaysChecked: [] })

const checkboxes = reactive({
  paymentType: {
    checkAll: ref(false),
    isIndeterminate: ref(false),
  },
  vip: {
    checkAll: ref(false),
    isIndeterminate: ref(false),
  },
  bonusDays: {
    checkAll: ref(false),
    isIndeterminate: ref(false),
  },
})

function handleCheckedChange(type) {
  if (type === 'VIP') {
    form.vips = JSON.stringify(selectedVIPs.vipChecked.join(','))
  } else if (type === 'PAYTYPE') {
    form.payTypes = JSON.stringify(selectedPayTypes.payTypeChecked.join(','))
  } else if (type === 'BONUSDAYS') {
    form.bonusDays = JSON.stringify(
      selectedBonusDays.bonusDaysChecked.join(',')
    )
  }
  handleIndividualCheckChange()
}

const handleVIPCheckAllChange = val => {
  selectedVIPs.vipChecked = []
  if (val) {
    vipList.list.forEach(vip => {
      selectedVIPs.vipChecked.push(vip.id)
    })
  }
  handleCheckedChange('VIP')
}

async function getVipBySiteId(siteId) {
  await loadVips()
  vipList.list = vipList.list.filter(vip => vip.siteId === siteId)
}

async function loadConfigList() {
  page.loading = true
  const { data: ret } = await getConfigList(request.siteId)
  console.log(ret);
  ret.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.id === data.siteId) !== undefined
        ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
        : null
  })
  page.records = ret
  page.loading = false
}

async function loadVips() {
  const { data: vip } = await getVipList()
  vipList.list = vip
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function showDialog(type) {
  uiControl.dialogTitle = t('fields.editConfig')
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function showEdit(config) {
  form.id = config.id
  form.siteId = config.siteId
  form.code = config.code
  form.status = config.status
  form.startHour = config.startHour
  form.endHour = config.endHour
  form.vips = config.vipIds
  selectedVIPs.vipChecked = config.vipIds.split(",").map(Number)
  console.log(selectedVIPs)
  showDialog('EDIT')
  await getVipBySiteId(config.siteId)
}

function handleCategoryChange(selectedList, checkboxData, dataList) {
  const selectedCount = selectedList.filter(el => dataList.includes(el)).length
  const listCount = dataList.length
  checkboxData.checkAll = selectedCount === listCount
  checkboxData.isIndeterminate = selectedCount > 0 && selectedCount < listCount
}

function handleIndividualCheckChange() {
  const vipIds = [...new Set(vipList.list.map(el => el.id))]
  handleCategoryChange(selectedVIPs.vipChecked, checkboxes.vip, vipIds)
  const paymentCodes = [...new Set(paymentTypeList.list.map(el => el.code))]
  handleCategoryChange(
    selectedPayTypes.payTypeChecked,
    checkboxes.paymentType,
    paymentCodes
  )
  const bonusDays = [...new Set(uiControl.day.map(el => el.value))]
  handleCategoryChange(
    selectedBonusDays.bonusDaysChecked,
    checkboxes.bonusDays,
    bonusDays
  )
}

function edit() {
  configForm.value.validate(async valid => {
    if (valid) {
      form.vipIds = form.vips.replace(/['"]+/g, '')
      await updateConfig(form)
      uiControl.dialogVisible = false
      await loadConfigList()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  edit()
}

onMounted(async () => {
  await loadSites()
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadConfigList()
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
</style>
