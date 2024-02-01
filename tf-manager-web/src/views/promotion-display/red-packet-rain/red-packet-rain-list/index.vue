<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.memberName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.memberName')"
        />
        <el-select
          v-model="request.data"
          size="small"
          :placeholder="t('fields.data')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in dataList.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px; margin-left: 5px;"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadRedPacketRain"
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
          v-permission="['sys:red:packet:rain:add']"
          @click="showDialog()"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-refresh"
          size="mini"
          type="primary"
          v-permission="['sys:red:packet:rain:random']"
          @click="random"
        >
          {{ t('fields.randomMember') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="memberName" :label="t('fields.memberName')" />
      <el-table-column prop="prize" :label="t('fields.bonus')" />
      <el-table-column prop="date" :label="t('fields.date')" />
      <el-table-column type="title" :label="t('fields.action')">
        <template #default="scope">
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:red:packet:rain:delete']"
            v-if="scope.row.memberId === '0'"
            @click="removeRedPacketRain(scope.row)"
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
    width="580px"
  >
    <el-form
      ref="redPacketRainForm"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item :label="t('fields.memberName')" prop="memberName">
        <el-input v-model="form.memberName" style="width: 350px" />
      </el-form-item>
      <el-form-item :label="t('fields.bonus')" prop="prize">
        <el-input v-model="form.prize" style="width: 350px" maxlength="11" />
      </el-form-item>

      <el-form-item :label="t('fields.date')" prop="date">
        <el-date-picker
          v-model="form.date"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetime"
        />
      </el-form-item>

      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="createRedPacketRain">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {
  getRedPacketRain,
  deleteRedPacketRain,
  addRedPacketRain,
  randomMember,
} from '../../../../api/privilege-red-packet-rain'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import { required, size, numericOnly } from '../../../../utils/validate'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const privilegeId = reactive({
  id: route.query.id
});
const dataList = reactive({
  list: [
    {
      id: '1',
      name: t('fields.onlyReal'),
    },
    {
      id: '2',
      name: t('fields.onlyFake'),
    },
  ],
})

const shortcuts = getShortcuts(t)
const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const redPacketRainForm = ref(null)
const form = reactive({
  memberName: null,
  prize: null,
  date: null,
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

function resetQuery() {
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.memberName = null
  request.data = null
}
const request = reactive({
  size: 20,
  current: 1,
  recordTime: [defaultStartDate, defaultEndDate],
  memberName: null,
  data: null,
})

const page = reactive({
  pages: 0,
  records: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: t('fields.add'),
})

async function showDialog() {
  if (redPacketRainForm.value) {
    redPacketRainForm.value.resetFields()
  }
  uiControl.dialogVisible = true
}

function changePage(page) {
  request.current = page
  loadRedPacketRain()
}

const formRules = reactive({
  memberName: [
    required(t('message.validateLoginNameRequired')),
    size(6, 12, t('message.length6To12')),
  ],
  prize: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  date: [required(t('message.validateDateRequired'))],
})

async function removeRedPacketRain(redPacket) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteRedPacketRain(redPacket.id, privilegeId.id)
    await loadRedPacketRain()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function loadRedPacketRain() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  const { data: ret } = await getRedPacketRain(query, privilegeId.id)
  page.pages = ret.pages
  page.records = ret.records
}

function createRedPacketRain() {
  redPacketRainForm.value.validate(async valid => {
    if (valid) {
      await addRedPacketRain(form, privilegeId.id)
      uiControl.dialogVisible = false
      await loadRedPacketRain()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

async function random() {
  await randomMember(privilegeId.id)
  ElMessage({ message: t('message.addSuccess'), type: 'success' })
  await loadRedPacketRain()
}

onMounted(async () => {
  await loadRedPacketRain()
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
