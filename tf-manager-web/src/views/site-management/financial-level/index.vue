<template>
  <div class="roles-main">
    <div class="header-container" v-if="hasRole(['TENANT','ADMIN'])">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px;"
          @focus="loadSites"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadFinancial">
          {{ t('fields.search') }}
        </el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button> -->
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:financial:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:financial:del']"
          @click="removeFinancial()"
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
      width="680px"
    >
      <el-form
        ref="financialForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.name')" prop="name">
          <el-input v-model="form.name" style="width: 350px;" maxlength="20" />
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId" v-if="!hasRole(['TENANT'])">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadSites"
            @change="handleNextLevelFilter()"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.level')" prop="level">
          <el-input-number
            type="number"
            v-model.number="form.level"
            :min="0"
            :controls="false"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item class="el-form-item--level-color" :label="t('fields.color')" prop="levelColor">
          <el-input v-model="form.levelColor" style="width: 250px;" disabled />
          <el-color-picker v-model="form.levelColor" style="margin-left: 4px;" />
        </el-form-item>
        <el-form-item :label="t('fields.maxDailyWithdraw')" prop="dayWithdrawMax">
          <el-input
            v-model="form.dayWithdrawMax"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item :label="t('fields.dayWithdrawCount')" prop="dayWithdrawCount">
          <el-input-number
            type="number"
            v-model.number="form.dayWithdrawCount"
            :min="0"
            :max="99999999999"
            :controls="false"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item :label="t('fields.nextLevel')" prop="nextLevel">
          <el-select
            v-model="form.nextLevel"
            size="small"
            :placeholder="t('fields.nextLevel')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            clearable
            @change="handleChangeLevel()"
            @clear="handleClearNextLevel()"
          >
            <el-option
              v-for="item in list.nextLevel"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.nextLevelPoint')" prop="nextLevelPoint">
          <el-input
            v-model="form.nextLevelPoint"
            style="width: 350px;"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" v-if="!hasRole(['SUB_TENANT'])" />
      <el-table-column prop="name" :label="t('fields.name')" width="150" />
      <el-table-column prop="level" :label="t('fields.level')" width="100" />
      <el-table-column prop="levelColor" :label="t('fields.color')" width="150">
        <template #default="scope">
          <div class="level-color" :style="{backgroundColor: scope.row.levelColor}" />
        </template>
      </el-table-column>
      <el-table-column prop="dayWithdrawMax" :label="t('fields.maxDailyWithdraw')" width="180" />
      <el-table-column prop="dayWithdrawCount" :label="t('fields.dayWithdrawCount')" width="180" />
      <el-table-column prop="nextLevelName" :label="t('fields.nextLevel')" width="150">
        <template #default="scope">
          <span v-if="scope.row.nextLevelName !== null && scope.row.nextLevelName !== ''">{{ scope.row.nextLevelName }}</span>
          <span v-if="scope.row.nextLevelName === null || scope.row.nextLevelName === ''">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="nextLevelPoint" :label="t('fields.nextLevelPoint')" width="150">
        <template #default="scope">
          <span v-if="scope.row.nextLevelPoint !== null && scope.row.nextLevelPoint !== ''">{{ scope.row.nextLevelPoint }}</span>
          <span v-if="scope.row.nextLevelPoint === null || scope.row.nextLevelPoint === ''">-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="siteName"
        :label="t('fields.site')"
        width="120"
        v-if="!hasRole(['SUB_TENANT']) && !hasRole(['TENANT'])"
      />
      <el-table-column prop="createTime" :label="t('fields.createTime')" />
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column :label="t('fields.action')" align="right" v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:financial:update']) || hasPermission(['sys:financial:del']))">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:financial:update']" @click="showEdit(scope.row)" />
          <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:financial:del']" @click="removeFinancial(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>

import { computed, nextTick, reactive, ref, watch } from "vue";
import { isNumeric, numericOnly, required } from "../../../utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { getSiteListSimple } from "../../../api/site";
import { createFinancialLevel, deleteFinancialLevel, getFinancialLevelList, updateFinancialLevel } from "../../../api/financial-level";
import { hasRole, hasPermission } from "../../../utils/util";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const request = reactive({
  siteId: null
});

const financialForm = ref(null);
const sites = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const form = reactive({
  id: null,
  name: null,
  siteId: null,
  level: null,
  levelColor: null,
  dayWithdrawMax: null,
  dayWithdrawCount: null,
  nextLevel: null,
  nextLevelPoint: null
});

const list = reactive({
  nextLevel: [],
});

const formRules = reactive({
  name: [required(t('message.validateNameRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  level: [required(t('message.validateLevelRequired')), numericOnly(t('message.validateNumberOnly'))],
  levelColor: [required(t('message.validateColorRequired'))],
  dayWithdrawMax: [required(t('message.validateMaxDailyWithdrawRequired')), isNumeric(t('message.validateNumberOnly'))],
  dayWithdrawCount: [required(t('message.validateDayWithdrawCountRequired')), numericOnly(t('message.validateNumberOnly'))],
});

let chooseFinancial = [];

function handleSelectionChange(val) {
  chooseFinancial = val;
  if (chooseFinancial.length === 0) {
    uiControl.removeBtn = true;
  } else if (chooseFinancial.length === 1) {
    uiControl.removeBtn = false;
  } else {
    uiControl.removeBtn = false;
  }
}

function handleChangeLevel() {
  page.records.forEach(financial => {
    if (financial.id === form.nextLevel) {
      form.level = financial.level - 1;
      form.siteId = financial.siteId;
    }
  })
}

function handleClearNextLevel() {
  form.level = 0;
  form.nextLevel = null;
  list.nextLevel = page.records;
}

function handleNextLevelFilter() {
  if (!hasRole(['TENANT'])) {
    list.nextLevel = page.records;
    const newRecord = list.nextLevel.filter((element) => {
      return element.siteId === form.siteId
    });
    list.nextLevel = newRecord;
  }
}

async function loadFinancial() {
  page.loading = true;
  const { data: ret } = await getFinancialLevelList(request);
  page.records = ret;
  page.loading = false;
  list.nextLevel = ret;
}

function showDialog(type) {
  if (financialForm.value) {
    financialForm.value.resetFields();
  }
  if (type === "CREATE") {
    form.id = null;
    uiControl.dialogTitle = t('fields.addFinancialLevel');
    list.nextLevel = page.records;
    handleNextLevelFilter();
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editFinancialLevel');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(financial) {
  showDialog("EDIT");
  list.nextLevel = page.records;
  nextTick(() => {
    for (const key in financial) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = financial[key];
      }
    }
    if (financial.nextLevel === 0) {
      form.nextLevel = null;
    }
    if (financial.nextLevelPoint === 0) {
      form.nextLevelPoint = null;
    }
    const newRecord = list.nextLevel.filter((element) => {
      return element.name !== form.name && element.siteId === form.siteId
    });
    list.nextLevel = newRecord;
    handleChangeLevel();
  });
}

function create() {
  financialForm.value.validate(async (valid) => {
    if (valid) {
      await createFinancialLevel(form);
      uiControl.dialogVisible = false;
      await loadFinancial();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  financialForm.value.validate(async (valid) => {
    if (valid) {
      await updateFinancialLevel(form);
      uiControl.dialogVisible = false;
      await loadFinancial();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function removeFinancial(financial) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (financial) {
      await deleteFinancialLevel([financial.id]);
    } else {
      await deleteFinancialLevel(chooseFinancial.map(a => a.id));
    }
    await loadFinancial();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  } else if (uiControl.dialogType === "EDIT") {
    edit();
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
  request.siteId = site[0].id;
}

watch(() => request.siteId, () => {
  form.siteId = request.siteId
})
onMounted(async () => {
  if (hasRole(['TENANT', 'ADMIN'])) {
    await loadSites();
    await loadFinancial();
    if (LOGIN_USER_TYPE.value === TENANT.value) {
      site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
      request.siteId = site.value.id;
    }
  }
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-form-item--level-color:deep .el-form-item__content {
  display: flex !important;
}

.level-color {
  width: 30px;
  height: 30px;
}
</style>
