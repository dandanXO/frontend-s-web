<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search" v-if="hasRole(['ADMIN'])">
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
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadAffiliateCommission()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')"
                   v-permission="['sys:affiliate-commission:create']"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit()" :disabled="uiControl.editBtn"
                   v-permission="['sys:affiliate-commission:update']"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button icon="el-icon-remove" size="mini" type="danger" @click="removeAffiliateCommission()"
                   :disabled="uiControl.removeBtn"
                   v-permission="['sys:affiliate-commission:del']"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form ref="affiliateCommissionForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
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
        <el-form-item :label="t('fields.schemaName')" prop="schemeName">
          <el-input v-model="form.schemeName" style="width: 350px;" maxlength="30" />
        </el-form-item>
        <el-form-item :label="t('fields.activePlayer')" prop="activePlayer">
          <el-input-number type="number" v-model.number="form.activePlayer" :min="0"
                           style="width: 350px;" @keypress="restrictInput($event)" controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('fields.netProfit')" prop="netProfit">
          <el-input-number type="number" v-model.number="form.netProfit" :min="0"
                           style="width: 350px;" @keypress="restrictNetProfitDecimalInput($event)" controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('fields.commission')" prop="commission">
          <el-input-number type="number" v-model.number="form.commission" :precision="2" :step="0.01" :min="0" :max="1"
                           style="width: 350px;" @keypress="restrictCommissionDecimalInput($event)" controls-position="right"
          />
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
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="site" :label="t('fields.site')" width="150" />
      <el-table-column prop="schemeName" :label="t('fields.schemaName')" width="150" />
      <el-table-column prop="activePlayer" :label="t('fields.activePlayer')" width="150" />
      <el-table-column prop="netProfit" :label="t('fields.netProfit')" width="150" />
      <el-table-column prop="commission" :label="t('fields.commission')" width="150">
        <template #default="scope">
          <span v-if="scope.row.commission === null">0 %</span>
          <span v-if="scope.row.commission !== null">{{ (scope.row.commission * 100).toFixed(2) }} %</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{data: scope.row.updateTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        fixed="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:affiliate-commission:update'])|| hasPermission(['sys:affiliate-commission:del']))"
      >
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:affiliate-commission:update']" @click="showEdit(scope.row)" />
          <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:affiliate-commission:del']" @click="removeAffiliateCommission(scope.row)" />
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
import { createAffiliateCommission, updateAffiliateCommission, getAffiliateCommission, deleteAffiliateCommission } from "../../../api/site-affiliate-commission";
import { getSiteListSimple } from "../../../api/site";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const affiliateCommissionForm = ref(null);
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
  schemeName: null,
  activePlayer: null,
  netProfit: null,
  commission: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  schemeName: [required(t('message.validateSchemaNameRequired'))],
  activePlayer: [required(t('message.validateActivePlayerRequired'))],
  netProfit: [required(t('message.validateNetProfitRequired'))],
  commission: [required(t('message.validateCommissionRequired'))]
});

let chooseCommission = [];
function handleSelectionChange(val) {
  chooseCommission = val;
  if (chooseCommission.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (chooseCommission.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

async function loadAffiliateCommission() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getAffiliateCommission(query);
  page.pages = ret.pages;
  ret.records.forEach(data => {
    data.timeZone = siteList.list.find(e => e.siteName === data.site) !== undefined
      ? siteList.list.find(e => e.siteName === data.site).timeZone
      : null
  });
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadAffiliateCommission();
}

function resetQuery() {
  request.siteId = site.value ? site.value.id : null;
}

function showDialog(type) {
  if (type === "CREATE") {
    if (affiliateCommissionForm.value) {
      affiliateCommissionForm.value.resetFields();
    }
    form.siteId = siteList.list[0].id;
    uiControl.dialogTitle = t('fields.addAffiliateCommission');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editAffiliateCommission');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(affiliateCommission) {
  showDialog("EDIT");
  if (!affiliateCommission) {
    affiliateCommission = chooseCommission[0];
  }
  nextTick(() => {
    for (const key in affiliateCommission) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = affiliateCommission[key];
      }
    }
  });
}

/**
* 新增公告
*/
function create() {
  affiliateCommissionForm.value.validate(async (valid) => {
    if (valid) {
      await createAffiliateCommission(form);
      uiControl.dialogVisible = false;
      await loadAffiliateCommission();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

/**
* 编辑公告
*/
function edit() {
  affiliateCommissionForm.value.validate(async (valid) => {
    if (valid) {
      await updateAffiliateCommission(form);
      uiControl.dialogVisible = false;
      await loadAffiliateCommission();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function removeAffiliateCommission(affiliateCommission) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (affiliateCommission) {
      await deleteAffiliateCommission([affiliateCommission.id]);
    } else {
      await deleteAffiliateCommission(chooseCommission.map(a => a.id));
    }
    await loadAffiliateCommission();
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

function restrictNetProfitDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) && charCode !== 46
  ) {
    event.preventDefault();
  }

  if (
    form.netProfit !== null &&
    form.netProfit.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault();
    }
  }
}

function restrictCommissionDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) && charCode !== 46
  ) {
    event.preventDefault();
  }

  if (
    form.commission !== null &&
    form.commission.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault();
    }
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
  await loadAffiliateCommission();
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
