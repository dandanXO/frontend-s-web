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
            v-for="item in list.site"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="request.reasonType"
          size="small"
          :placeholder="t('fields.reasonType')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in list.reasonTypes"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadReasons"
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
          v-permission="['sys:adjustment-reason:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:adjustment-reason:delete']"
          @click="removeCard()"
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
      width="800px"
    >
      <el-form
        ref="bankForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.adjustmentReasonType')" prop="reasonType">
          <el-select
            clearable
            v-model="form.reasonType"
            size="small"
            :placeholder="t('fields.adjustmentReasonType')"
            class="filter-item"
            style="width: 490px; margin-bottom: 10px"
          >
            <el-option
              v-for="item in list.reasonTypes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.adjustmentReason')" prop="reason">
          <el-input
            clearable
            v-model="form.reason"
            size="small"
            :placeholder="t('fields.adjustmentReason')"
            class="filter-item"
            style="width: 490px; margin-bottom: 10px"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="list.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" v-if="!hasRole(['SUB_TENANT'])" />
      <el-table-column prop="reasonType" :label="t('fields.reasonType')" />
      <el-table-column prop="reason" :label="t('fields.reason')" />
      <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:adjustment-reason:update'])">
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  getReasons,
  getReasonTypes,
  createReason,
  updateReason,
  deleteReasons,
} from '../../../api/site-adjustment-reason'
import { getSiteListSimple } from '../../../api/site'
import { required } from '../../../utils/validate'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const bankForm = ref(null)

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
})

const request = reactive({
  siteId: null,
  reasonType: null,
})

const form = reactive({
  id: null,
  siteId: null,
  reasonType: null,
  reason: null
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  reasonType: [required(t('message.validateReasonTypeRequired'))],
  reason: [required(t('message.validateReasonRequired'))],
})

const list = reactive({
  site: [],
  reasonTypes: [],
  records: [],
})

let chooseCard = []

function resetQuery() {
  request.reasonType = null
  request.siteId = site.value ? site.value.id : null
}

function handleSelectionChange(val) {
  chooseCard = val
  if (chooseCard.length === 0) {
    uiControl.removeBtn = true
  } else if (chooseCard.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (bankForm.value) {
      bankForm.value.resetFields()
      form.id = null
    }
    form.siteId = site.value ? site.value.id : null
    uiControl.dialogTitle = t('fields.addAdjustmentReason')
  } else {
    uiControl.dialogTitle = t('fields.editAdjustmentReason')
    if (bankForm.value) {
      bankForm.value.resetFields()
    }
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(banner) {
  showDialog('EDIT')

  nextTick(() => {
    for (const key in banner) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = banner[key]
      }
    }
    console.log(form)
  })
}

async function loadReasons() {
  const { data: ret } = await getReasons(request)
  list.records = ret
  console.log(list.records);
}

async function loadReasonTypes() {
  const { data: ret } = await getReasonTypes()
  list.reasonTypes = ret
}

function create() {
  bankForm.value.validate(async valid => {
    if (valid) {
      await createReason(form)
      uiControl.dialogVisible = false
      await loadReasons()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  bankForm.value.validate(async valid => {
    if (valid) {
      await updateReason(form)
      uiControl.dialogVisible = false
      await loadReasons()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeCard(card) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (card) {
      await deleteReasons([card.id])
    } else {
      await deleteReasons(chooseCard.map(u => u.id))
    }
    await loadReasons()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else {
    edit()
  }
}

async function loadSite() {
  const { data: ret } = await getSiteListSimple()
  list.site = ret
}

onMounted(async() => {
  await loadSite()
  await loadReasonTypes()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = list.site.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = list.site[0];
  }
  request.siteId = site.value.id;
  await loadReasons()
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

i.el-icon-circle-check {
  color: green;
  margin-left: 5px;
}

i.el-icon-circle-close {
  color: red;
  margin-left: 5px;
}
</style>
