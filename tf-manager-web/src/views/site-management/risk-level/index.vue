<template>
  <div class="roles-main">
    <div class="header-container" v-if="hasRole(['TENANT','ADMIN'])">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRiskLevel()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')"
                   v-permission="['sys:risk:create']"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit()" :disabled="uiControl.editBtn"
                   v-permission="['sys:risk:update']"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button icon="el-icon-remove" size="mini" type="danger" @click="removeRiskLevel()"
                   :disabled="uiControl.removeBtn"
                   v-permission="['sys:risk:del']"
        >
          {{ t('fields.delete') }}
        </el-button></div>
    </div>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form ref="riskLevelForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadSites"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.level')" prop="level">
          <el-input-number type="number" v-model.number="form.level" :min="0" :max="20"
                           style="width: 350px;" @keypress="restrictInput($event)" controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('fields.name')" prop="levelName">
          <el-input v-model="form.levelName" style="width: 350px;" maxlength="30" />
        </el-form-item>
        <el-form-item class="el-form-item--level-color" :label="t('fields.color')" prop="levelColor">
          <el-input v-model="form.levelColor" style="width: 250px;" disabled />
          <el-color-picker v-model="form.levelColor" style="margin-left: 4px;" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table :data="page.records" ref="table"
              row-key="id"
              size="small"
              highlight-current-row
              @selection-change="handleSelectionChange"
              v-loading="page.loading"
              :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="level" :label="t('fields.level')" width="150" />
      <el-table-column prop="levelColor" :label="t('fields.color')" width="150">
        <template #default="scope">
          <div class="level-color" :style="{backgroundColor: scope.row.levelColor}" />
        </template>
      </el-table-column>
      <el-table-column prop="levelName" :label="t('fields.name')" width="150" />
      <el-table-column prop="siteName" :label="t('fields.site')" width="150" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        fixed="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:risk:update'])|| hasPermission(['sys:risk:del']))"
      >
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:risk:update']" @click="showEdit(scope.row)" />
          <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:risk:del']" @click="removeRiskLevel(scope.row)" />
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
  </div>
</template>

<script setup>

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { hasRole, hasPermission } from "../../../utils/util";
import { required } from "../../../utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { createRiskLevel, updateRiskLevel, getRiskLevel, deleteRiskLevel } from "../../../api/risk-level";
import { getSiteListSimple } from "../../../api/site";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const riskLevelForm = ref(null);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true
});
const siteList = reactive({
  list: []
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  siteId: null,
  size: 30,
  current: 1
});

const form = reactive({
  id: null,
  siteId: null,
  level: null,
  levelName: null,
  levelColor: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  level: [required(t('message.validateLevelRequired'))],
  levelName: [required(t('message.validateLevelNameRequired'))],
  levelColor: [required(t('message.validateColorRequired'))]
});

let chooseRiskLevel = [];

function handleSelectionChange(val) {
  chooseRiskLevel = val;
  if (chooseRiskLevel.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (chooseRiskLevel.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

async function loadRiskLevel() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getRiskLevel(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadRiskLevel();
}

function resetQuery() {
  request.siteId = site.value ? site.value.id : null;
}

function showDialog(type) {
  if (type === "CREATE") {
    if (riskLevelForm.value) {
      riskLevelForm.value.resetFields();
    }
    form.siteId = siteList.list[0].id;
    uiControl.dialogTitle = t('fields.addRiskLevel');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editRiskLevel');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(riskLevel) {
  showDialog("EDIT");
  if (!riskLevel) {
    riskLevel = chooseRiskLevel[0];
  }
  nextTick(() => {
    for (const key in riskLevel) {
      if (Object.keys(form).find(k => k === key)) {
        if (key === 'endDate') {
          form[key] = String(riskLevel[key]).slice(0, 10);
        } else {
          form[key] = riskLevel[key];
        }
      }
    }
  });
}

/**
 * 新增公告
 */
function create() {
  riskLevelForm.value.validate(async (valid) => {
    if (valid) {
      form.id = null;
      await createRiskLevel(form);
      uiControl.dialogVisible = false;
      await loadRiskLevel();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

/**
 * 编辑公告
 */
function edit() {
  riskLevelForm.value.validate(async (valid) => {
    if (valid) {
      await updateRiskLevel(form);
      uiControl.dialogVisible = false;
      await loadRiskLevel();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function removeRiskLevel(riskLevel) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (riskLevel) {
      await deleteRiskLevel([riskLevel.id]);
    } else {
      await deleteRiskLevel(chooseRiskLevel.map(a => a.id));
    }
    await loadRiskLevel();
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

function restrictInput(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadRiskLevel();
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

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
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
