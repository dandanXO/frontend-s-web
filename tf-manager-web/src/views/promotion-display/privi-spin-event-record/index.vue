<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 100px;"
          default-first-option
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.loginName')"
        />
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input
          v-model="request.bonusName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.name')"
        />
        <el-input
          v-model="request.code"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.code')"
        />
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="margin-left: 5px; width: 200px;"
        >
          <el-option
            v-for="item in uiControl.statusTypes"
            :key="item.key"
            :label="t('spinEventStatus.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRecords()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:privi:spin-event-record:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">

      <el-table :data="page.records" ref="table"
                v-loading="page.loading"
                row-key="id"
                size="mini"
                :resizable="true"
                highlight-current-row
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.loginName === null">-</span>
            <span v-if="scope.row.loginName !== null">{{ scope.row.loginName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bonus" :label="t('fields.bonus')" min-width="100" />
        <el-table-column prop="bonusName" :label="t('fields.name')" min-width="100" />
        <el-table-column prop="status" :label="t('fields.status')" min-width="100">
          <template #default="scope">
            {{ t('spinEventStatus.'+scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="recordTime" :label="t('fields.recordTime')" min-width="200">
          <template #default="scope">
            <span v-if="scope.row.recordTime === null">-</span>
            <!-- eslint-disable -->
            <span
              v-if="scope.row.recordTime !== null"
              v-formatter="{
                data: scope.row.recordTime,
                timeZone: timeZone,
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
      <el-pagination class="pagination"
                     @current-change="changePage"
                     layout="prev, pager, next"
                     :page-size="request.size"
                     :page-count="page.pages"
                     :current-page="request.current"
      />
    </el-card>
  </div>
  <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="priviSpinEventForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId" :readonly="uiControl.dialogType == 'EDIT'">
          <el-select
            v-model="form.siteId"
            :placeholder="t('fields.site')"
            style="width: 350px;"
            filterable
            default-first-option
            @change="loadFormSelect"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input @focus="handleSelect" v-model="form.loginName" style="width: 350px" :readonly="uiControl.dialogType == 'EDIT'" />
        </el-form-item>
        <el-form-item :label="t('fields.privilegeCode')" prop="code" :readonly="uiControl.dialogType == 'EDIT'">
          <el-input
            v-model="form.code"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item :label="t('fields.bonus')" prop="bonus" :readonly="uiControl.dialogType == 'EDIT'">
          <el-input
            v-model="form.bonus"
            style="width: 350px"
            maxlength="11"
            @keypress="restrictDecimalInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.giftName')" prop="bonusName"  :readonly="uiControl.dialogType == 'EDIT'">
          <el-input
            v-model="form.bonusName"
            style="width: 350px"
            maxlength="11"
            @keypress="restrictDecimalInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.spinCount')" prop="spinCount"  :readonly="uiControl.dialogType == 'EDIT'">
          <el-input
            v-model="form.spinCount"
            style="width: 350px"
            maxlength="11"
            @keypress="restrictDecimalInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-select
            v-model="form.status"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="margin-left: 5px; width: 200px;"
          >
            <el-option
              v-for="item in uiControl.statusTypes"
              :key="item.key"
              :label="t('spinEventStatus.' + item.displayName)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button
            :loading="isBtnLoading"
            type="primary"
            @click="submit"
          >
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getSiteListSimple } from "../../../api/site";
import { getShortcuts } from "@/utils/datetime";
import moment from "moment";
import { formatInputTimeZone } from '@/utils/format-timeZone'
import { addPriviSpinEventRecord, getPriviSpinEventRecordList, updatePriviSpinEventRecord } from "../../../api/privi-spin-event-record";
import { ElMessage } from "element-plus";
let timeZone = null

const { t } = useI18n();

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const siteList = reactive({
  list: []
});

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

const priviSpinEventForm = ref(null)
const isBtnLoading = ref(false)

const uiControl = reactive({
  messageVisible: false,
  dialogTitle: "",
  dialogVisible: false,
  dialogType: null,
  statusTypes: [
    { key: 1, displayName: "SYSTEM", value: "SYSTEM" },
    { key: 2, displayName: "USER_EXCHANGE", value: "USER_EXCHANGE" },
    { key: 3, displayName: "CLAIMED", value: "CLAIMED" },
    { key: 4, displayName: "PENDING", value: "PENDING" }
  ],
});

const request = reactive({
  size: 30,
  current: 1,
  loginName: null,
  recordTime: [convertStartDate(new Date()), convertDate(new Date())],
  bonusName: null,
  siteId: null,
  code: null,
  status: null,
});

const form = reactive({
  id: null,
  siteId: null,
  memberId: null,
  loginName: null,
  bonus: 0,
  bonusName: null,
  code: null,
  spinCount: 0,
})

function resetQuery() {
  request.loginName = null;
  request.bonusName = null;
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = JSON.parse(JSON.stringify(request.recordTime))
      query.recordTime[0] = formatInputTimeZone(
        query.recordTime[0],
        timeZone,
        'start'
      )
      query.recordTime[1] = formatInputTimeZone(
        query.recordTime[1],
        timeZone,
        'end'
      )
      query.recordTime = query.recordTime.join(',')
    }
  }

  return query
}

async function showDialog(type) {
  if (type === 'CREATE') {
    if (priviSpinEventForm.value) {
      priviSpinEventForm.value.resetFields()
      // adjustRollover.importedSelectedItem = null
      // adjustRollover.selectedItem = null
      // form.rollover = undefined
    }
    uiControl.dialogTitle = t('fields.addPriviSpinEventRecord')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editPriviSpinEventRecord')
  }
  // form.rollover = undefined
  // form.sendSummary = null
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(spinRecord) {
  showDialog('EDIT')

  nextTick(() => {
    for (const key in spinRecord) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = spinRecord[key]
      }
    }
  })
}

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (form.amount !== null && form.amount.toString().indexOf('.') > -1) {
    if (charCode === 46) {
      event.preventDefault()
    }
  }
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    createAdd()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

function createAdd() {
  priviSpinEventForm.value.validate(async valid => {
    isBtnLoading.value = true;
    form.id = null;
    form.memberId = null;

    try {
      if (valid) {
        await addPriviSpinEventRecord(form);
        uiControl.dialogVisible = false;
        await loadRecords();
        ElMessage({ message: t('message.addSuccess'), type: 'success' });
      }
    } catch (error) {
      console.log(error);
    } finally {
      isBtnLoading.value = false;
    }
  });
}

function edit() {
  priviSpinEventForm.value.validate(async valid => {
    if (valid) {
      await updatePriviSpinEventRecord(form)
      uiControl.dialogVisible = false
      await loadRecords()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function loadRecords() {
  page.loading = true;
  const query = checkQuery()
  const { data: ret } = await getPriviSpinEventRecordList(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadRecords();
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id
});
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

:deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}
</style>
