<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 250px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
        />
        <el-select
          clearable
          v-model="request.winStatus"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="margin-left: 5px; width: 150px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t(`lottery.status.${item.displayName}`)"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.winPrize"
          size="small"
          :placeholder="t('fields.prizeLevel')"
          class="filter-item"
          style="margin-left: 5px; width: 150px"
        >
          <el-option
            v-for="item in uiControl.prizeLevel"
            :key="item.key"
            :label="t(`lottery.prizeLevel.${item.displayName}`)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadRecords()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          @click="showDialog(true)"
        >
          {{ t('fields.addFakeLotteryRecord') }}
        </el-button>
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          @click="showDialog(false)"
        >
          {{ t('fields.addMemberLotteryRecord') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.lotteryRecordList') }}</span>
        </div>
      </template>

      <el-table
        :data="page.records"
        ref="table"
        v-loading="page.loading"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          min-width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.alias === null">
              {{ scope.row.loginName }}
            </span>
            <span v-else>
              {{ scope.row.alias }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          :label="t('fields.selectedNumber')"
          min-width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.number === null">-</span>
            <span v-if="scope.row.number !== null">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="winStatus"
          :label="t('fields.status')"
          min-width="120"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.winStatus === 'WIN'"
              type="success"
              size="mini"
            >
              {{ scope.row.winStatus }}
            </el-tag>
            <el-tag
              v-if="scope.row.winStatus === 'LOSS'"
              type="danger"
              size="mini"
            >
              {{ scope.row.winStatus }}
            </el-tag>
            <el-tag
              v-if="scope.row.winStatus === 'BET'"
              type="warning"
              size="mini"
            >
              {{ scope.row.winStatus }}
            </el-tag>
            <el-tag v-if="scope.row.winStatus === null" type="info" size="mini">
              -
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="recordTime"
          :label="t('fields.recordTime')"
          min-width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.winPrize !== null"> {{ t(`lottery.prizeLevel.${scope.row.winPrize}`) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="recordTime"
          :label="t('fields.recordTime')"
          min-width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.recordTime === null">-</span>
            <span v-if="scope.row.recordTime !== null">
              {{ scope.row.recordTime }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="resultTime"
          :label="t('fields.resultTime')"
          min-width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.resultTime === null">-</span>
            <span v-if="scope.row.resultTime !== null">
              {{ scope.row.resultTime }}
            </span>
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
    </el-card>
  </div>
  <el-dialog
    :title="t('fields.addMemberLotteryRecord')"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="580px"
  >
    <el-form
      ref="lotteryForm"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item :label="t('fields.recordTime')" prop="recordTime">
        <el-date-picker
          v-model="form.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          :placeholder="t('fields.recordTime')"
          style="margin-left: 5px;width: 150px"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item :label="t('fields.memberName')" prop="memberName">
        <el-input v-model="form.memberName" style="width: 350px" />
      </el-form-item>
      <el-form-item :label="t('fields.number')" prop="number">
        <el-input
          v-model="form.number"
          style="width: 350px;"
          @keypress="restrictInput"
        />
      </el-form-item>
      <el-form-item :label="t('fields.promoCode')" prop="promoCode">
        <el-select
          v-model="form.promoCode"
          size="small"
          :placeholder="t('fields.promoCode')"
          class="filter-item"
          style="margin-left: 5px; width: 150px"
        >
          <el-option
            v-for="item in privi"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="addLotteryRecord">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
  <el-dialog
    :title="t('fields.addFakeLotteryRecord')"
    v-model="uiControl.fakeDialogVisible"
    append-to-body
    width="580px"
  >
    <el-form
      ref="fakeLotteryForm"
      :model="fakeForm"
      :rules="fakeFormRules"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item :label="t('fields.recordTime')" prop="recordTime">
        <el-date-picker
          v-model="fakeForm.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          :placeholder="t('fields.recordTime')"
          style="margin-left: 5px;width: 150px"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item :label="t('fields.memberName')" prop="memberName">
        <el-input v-model="fakeForm.memberName" style="width: 350px" />
      </el-form-item>
      <el-form-item :label="t('fields.number')" prop="number">
        <el-input
          v-model="fakeForm.number"
          style="width: 350px;"
          @keypress="restrictInput"
        />
      </el-form-item>
      <el-form-item :label="t('fields.promoCode')" prop="promoCode">
        <el-select
          v-model="fakeForm.promoCode"
          size="small"
          :placeholder="t('fields.promoCode')"
          class="filter-item"
          style="margin-left: 5px; width: 150px"
        >
          <el-option
            v-for="item in privi"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="addLotteryRecord">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { getUefaLotteryRecords, getUefaLotteryPrivilege, addRecord, addFakeRecord } from '../../../../api/privilege-lottery'
import { getMemberBalanceByLoginNameSite } from "../../../../api/member";
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { required } from "../../../../utils/validate";

const { t } = useI18n()
const lotteryForm = ref(null)
const fakeLotteryForm = ref(null)
const uiControl = reactive({
  status: [
    { key: 1, displayName: 'BET', value: 'BET' },
    { key: 2, displayName: 'WIN', value: 'WIN' },
    { key: 3, displayName: 'LOSS', value: 'LOSS' },
  ],
  prizeLevel: [
    { key: 1, displayName: 'FIRST_PRIZE', value: 'FIRST_PRIZE' },
    { key: 2, displayName: 'GROUP_THREE', value: 'GROUP_THREE' },
    { key: 3, displayName: 'GROUP_SIX', value: 'GROUP_SIX' },
    { key: 4, displayName: 'TWO_D', value: 'TWO_D' },
  ],
  dialogVisible: false,
  fakeDialogVisible: false,
  isFake: false,
})

const startDate = convertStartDate(new Date())
const endDate = convertDate(new Date())

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function convertStartDate(date) {
  return moment(date)
    .startOf('day')
    .format('YYYY-MM-DD')
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  winStatus: null,
  winPrize: null,
  recordTime: [startDate, endDate],
  siteId: 8,
})

const form = reactive({
  number: null,
  recordTime: null,
  memberName: null,
  promoCode: null,
})

const fakeForm = reactive({
  number: null,
  recordTime: null,
  memberName: null,
  promoCode: null,
})

let privi = []

function resetQuery() {
  request.winStatus = null
  request.winPrize = null
  request.recordTime = [startDate, endDate]
}

async function loadRecords() {
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
      query.recordTime = query.recordTime.join(',')
    }
  }
  const { data: ret } = await getUefaLotteryRecords(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadRecords()
  }
}

async function loadPrivi() {
  const { data: ret } = await getUefaLotteryPrivilege();
  privi = ret;
}

function showDialog(isFake) {
  uiControl.isFake = isFake
  if (isFake) {
    if (fakeLotteryForm.value) {
      fakeLotteryForm.value.resetFields()
    }
    fakeForm.recordTime = startDate
    uiControl.fakeDialogVisible = true
  } else {
    if (lotteryForm.value) {
      lotteryForm.value.resetFields()
    }
    form.recordTime = startDate
    uiControl.dialogVisible = true
  }
}

const loginNameValidator = async(rule, value, callback) => {
  const { data: bal } = await getMemberBalanceByLoginNameSite(value, request.siteId);
  if (bal === null || bal === undefined) {
    callback(new Error(t('message.memberNotInSite')));
  }
  callback();
};

const fakeFormRules = reactive({
  number: [required(t('message.validateResultNumber'))],
  memberName: [required(t('message.validateLoginNameRequired'))],
  recordTime: [required(t('message.validateRecordTimeRequired'))],
  promoCode: [required(t('message.validatePrivilegeRequired'))]
});

const formRules = reactive({
  number: [required(t('message.validateResultNumber'))],
  memberName: [required(t('message.validateLoginNameRequired')), { validator: loginNameValidator, trigger: "blur" }],
  recordTime: [required(t('message.validateRecordTimeRequired'))],
  promoCode: [required(t('message.validatePrivilegeRequired'))]
});

function addLotteryRecord() {
  if (uiControl.isFake) {
    fakeLotteryForm.value.validate(async valid => {
      if (valid) {
        await addFakeRecord(fakeForm)
        uiControl.fakeDialogVisible = false
        await loadRecords()
        ElMessage({ message: t('message.addSuccess'), type: 'success' })
      }
    })
  } else {
    lotteryForm.value.validate(async valid => {
      if (valid) {
        await addRecord(form)
        uiControl.dialogVisible = false
        await loadRecords()
        ElMessage({ message: t('message.addSuccess'), type: 'success' })
      }
    })
  }
}

onMounted(async () => {
  loadRecords()
  loadPrivi()
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}
</style>
