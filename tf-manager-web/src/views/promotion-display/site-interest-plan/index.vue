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
        <el-input
          v-model="request.title"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.title')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 150px"
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
          @click="loadSiteInterestPlan"
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
          v-permission="['sys:site-interest-plan:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:site-interest-plan:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:site-interest-plan:del']"
          @click="removeLimit()"
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
      :close-on-press-escape="false"
    >
      <el-form
        ref="planForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="170px"
      >
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="form.title" style="width: 350px" :readonly="uiControl.editVisible" />
        </el-form-item>

        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @change="handleChangeSite"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.planOdds')" prop="odds">
          <el-input-number v-model="form.odds" :min="1" :max="100" style="width: 150px;" />
        </el-form-item>
        <el-form-item :label="t('fields.planDays')" prop="days">
          <el-input-number v-model="form.days" style="width: 150px;" />
        </el-form-item>
        <el-form-item :label="t('fields.planLimitMin')" prop="limitMin">
          <el-input-number v-model="form.limitMin" style="width: 150px;" />
        </el-form-item>
        <el-form-item :label="t('fields.planLimitMax')" prop="limitMax">
          <el-input-number v-model="form.limitMax" style="width: 150px;" />
        </el-form-item>
        <el-form-item :label="t('fields.planTimeLimit')" prop="timeLimit">
          <el-input-number v-model="form.timeLimit" style="width: 150px;" />
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sort">
          <el-input-number v-model="form.sort" style="width: 150px;" />
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
      <el-table-column
        type="selection"
        width="55"
        v-if="!hasRole(['SUB_TENANT'])"
      />
      <el-table-column prop="title" :label="t('fields.title')" min-width="150" />
      <el-table-column prop="odds" :label="t('fields.planOdds')" min-width="50">
        <template #default="scope">
          {{ Math.round(scope.row.odds * 100) }}%
        </template>
      </el-table-column>
      <el-table-column prop="days" :label="t('fields.planDays')" min-width="50" />
      <el-table-column prop="limitMin" :label="t('fields.planLimitMin')" min-width="150" />
      <el-table-column prop="limitMax" :label="t('fields.planLimitMax')" min-width="150" />
      <el-table-column prop="timeLimit" :label="t('fields.planTimeLimit')" min-width="150" />
      <el-table-column prop="status" :label="t('fields.status')" min-width="150" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{data: scope.row.updateTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:site-interest-plan:update']) || hasPermission(['sys:site-interest-plan:del']) )"
      >
        <template #default="scope">

          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:site-interest-plan:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:site-interest-plan:del']"
            @click="removeLimit(scope.row)"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSiteInterestPlan, createSiteInterestPlan, updateSiteInterestPlan, deleteSiteInterestPlan } from '../../../api/site-interest-plan';
import { getSiteListSimple } from '../../../api/site'
import { hasRole, hasPermission } from '../../../utils/util'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const planForm = ref(null)

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  importDialogVisible: false,
  messageVisible: false,
  editVisible: false,
  status: [
    { key: 1, displayName: "OPEN", value: "OPEN" },
    { key: 2, displayName: "CLOSE", value: "CLOSE" },
    { key: 3, displayName: "TEST", value: "TEST" }
  ]
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
// const importedPage = reactive({
//   pages: 0,
//   records: [],
//   loading: false,
//   size: 10,
//   current: 1,
//   buttonLoading: false,
// })
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  title: null,
  status: null
})

const form = reactive({
  id: null,
  siteId: null,
  title: null,
  odds: null,
  days: 0,
  limitMin: 0,
  limitMax: 0,
  timeLimit: 0,
  sort: 0,
  status: '',
})

const formRules = reactive({
  title: [required(t('message.validateLoginNameRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  odds: [required(t('message.validateMinDayRegLimitRequired'))],
  days: [required(t('message.validateMaxDayRegLimitRequired'))],
  limitMin: [required(t('message.validateDayRegProbabilityRequired'))],
  limitMax: [required(t('message.validateMinDayDepositAmountRequired'))],
  sort: [required(t('message.validateMaxDayDepositAmountRequired'))],
  status: [required(t('message.validateDayDepositAmountProbabilityRequired'))],
})

const sites = reactive({
  list: [],
})

let chooseMember = []

function resetQuery() {
  request.loginName = null
  request.siteId = site.value ? site.value.id : null;
}

function handleSelectionChange(val) {
  chooseMember = val
  if (chooseMember.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseMember.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadSiteInterestPlan() {
  page.loading = true
  const { data: ret } = await getSiteInterestPlan(request)
  page.pages = ret.pages
  // ret.records.forEach(data => {
  //   data.timeZone = store.state.user.sites.find(e => e.siteName === data.siteName) !== undefined
  //     ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
  //     : null
  // });
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

function changePage(page) {
  request.current = page
  loadSiteInterestPlan()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (planForm.value) {
      planForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.addGame')
    uiControl.editVisible = false;
    form.id = null
    form.title = ''
    form.odds = 0
    form.limitMin = 0
    form.limitMax = 0
    form.timeLimit = 0
    form.sort = 0
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editGame')
    uiControl.editVisible = true
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(plan) {
  showDialog('EDIT')

  nextTick(() => {
    for (const key in plan) {
      if (Object.keys(form).find(k => k === key)) {
      }
      form[key] = plan[key]
    }
    if (form.odds !== null) {
      var oddsPercent = form.odds * 100
      form.odds = +oddsPercent
    }
  })
}

function create() {
  planForm.value.validate(async valid => {
    if (valid) {
      if (form.limitMin > form.limitMax) {
        ElMessage({
          message: t('message.dailyMinRegLimitCannotExceedMax'),
          type: "error"
        });
        return;
      }
      if (form.odds !== null) {
        var oddsPercent = form.odds / 100
        form.odds = +oddsPercent
      }
      await createSiteInterestPlan(form)
      uiControl.dialogVisible = false
      await loadSiteInterestPlan()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  planForm.value.validate(async valid => {
    if (valid) {
      if (form.limitMin > form.limitMax) {
        ElMessage({
          message: t('message.dailyMinRegLimitCannotExceedMax'),
          type: "error"
        });
        return;
      }
      if (form.odds !== null) {
        var oddsPercent = form.odds / 100
        form.odds = +oddsPercent
      }
      await updateSiteInterestPlan(form)
      uiControl.dialogVisible = false
      await loadSiteInterestPlan()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeLimit(plan) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (plan) {
      await deleteSiteInterestPlan([plan.id])
    } else {
      await deleteSiteInterestPlan(chooseMember.map(u => u.id))
    }
    await loadSiteInterestPlan()
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

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = sites.list[0].id;
  }
  form.siteId = request.siteId
  await loadSiteInterestPlan();
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
.grid-container {
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  transition: transform 0.5s;
}

.grid-item .el-image:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.grid-item.selected {
  box-shadow: 0 4px 8px rgba(12, 20, 242, 0.12), 0 0 6px rgba(12, 20, 242, 0.12);
  border: 1px solid blue;
}

.image-info {
  margin: 10px;
}

.image-info .el-row {
  margin-top: 10px;
}

.preview {
  width: 200px;
  height: 200px;
}

.smallPreview {
  width: 100px;
  height: 100px;
}

.info-table{
  width:100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 18px;
}

</style>
<style lang="scss">
.info-table td{
  padding: 10px 5px;
}
</style>
