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
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadMemberRebateRules()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')"
                   v-permission="['sys:member-rebate-rule:create']"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit()" :disabled="uiControl.editBtn"
                   v-permission="['sys:member-rebate-rule:update']"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button icon="el-icon-remove" size="mini" type="danger" @click="removeMemberRebateRule()"
                   :disabled="uiControl.removeBtn"
                   v-permission="['sys:member-rebate-rule:del']"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form ref="memberRebateRuleForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-if="uiControl.dialogType === 'CREATE'"
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
          <el-select
            v-if="uiControl.dialogType === 'EDIT'"
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            disabled
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
          <el-input
            v-if="uiControl.dialogType === 'CREATE'"
            v-model="form.loginName"
            size="small"
            :placeholder="t('fields.loginName')"
            class="filter-item"
            style="width: 350px;"
          />
          <el-input v-if="uiControl.dialogType === 'EDIT'" v-model="form.loginName" class="filter-item" style="width: 350px" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.gameType')" prop="gameType">
          <el-select
            v-if="uiControl.dialogType === 'CREATE'"
            v-model="form.gameType"
            value-key="id"
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @focus="loadGameTypes"
          >
            <el-option
              v-for="item in gameTypes.list"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-input v-if="uiControl.dialogType === 'EDIT'" v-model="form.gameType" class="filter-item" style="width: 350px" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.rebatePercentage')" prop="rebatePercentage">
          <el-input-number type="number" v-model.number="form.rebatePercentage" :precision="2" :step="0.01" :min="0" :max="10"
                           style="width: 350px;" @keypress="restrictInput($event)" controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('fields.maxRebate')" prop="maxRebate">
          <el-input-number type="number" v-model.number="form.maxRebate" :precision="2" :step="100" :min="0"
                           style="width: 350px;" @keypress="restrictInput($event)" controls-position="right"
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
              :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="siteName" :label="t('fields.site')" width="150" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="150" />
      <el-table-column prop="gameType" :label="t('fields.gameType')" width="150" />
      <el-table-column prop="rebatePercentage" :label="t('fields.rebatePercentage')" width="150" />
      <el-table-column prop="maxRebate" :label="t('fields.maxRebate')" width="150" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150">
        <template #default="scope">
          <span v-if="scope.row.updateBy === null">-</span>
          <span v-else>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150">
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
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:member-rebate-rule:update'])|| hasPermission(['sys:member-rebate-rule:del']))"
      >
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:member-rebate-rule:update']" @click="showEdit(scope.row)" />
          <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:member-rebate-rule:del']" @click="removeMemberRebateRule(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { hasRole, hasPermission } from "../../../utils/util";
import { required } from "../../../utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { createMemberRebateRule, updateMemberRebateRule, getMemberRebateRule, deleteMemberRebateRule } from "../../../api/member-rebate-rule";
import { getSiteListSimple } from "../../../api/site";
import { getGameTypes } from '../../../api/game'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const memberRebateRuleForm = ref(null);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true
});
const siteList = reactive({
  list: [],
});
const gameTypes = reactive({
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
  loginName: null,
  gameType: null,
  rebatePercentage: null,
  maxRebate: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  loginName: [required(t('message.validateLoginNameRequired'))],
  gameType: [required(t('message.validateGameTypeRequired'))],
  rebatePercentage: [required(t('message.validateRebatePercentageRequired'))],
  maxRebate: [required(t('message.validateMaxRebateRequired'))]
});

let chooseRule = [];
function handleSelectionChange(val) {
  chooseRule = val;
  if (chooseRule.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (chooseRule.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

async function loadMemberRebateRules() {
  page.loading = true;
  const requestCopy = { ...request };
  const { data: ret } = await getMemberRebateRule(requestCopy);
  page.records = ret.records;
  page.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.loading = false;
}

function resetQuery() {
  request.siteId = site.value ? site.value.id : null;
}

function showDialog(type) {
  if (type === "CREATE") {
    if (memberRebateRuleForm.value) {
      memberRebateRuleForm.value.resetFields();
    }
    form.siteId = siteList.list[0].id;
    uiControl.dialogTitle = t('fields.addMemberRebateRule');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editMemberRebateRule');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(memberRebateRule) {
  loadSites();
  showDialog("EDIT");
  if (!memberRebateRule) {
    memberRebateRule = chooseRule[0];
  }
  nextTick(() => {
    for (const key in memberRebateRule) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = memberRebateRule[key];
      }
    }
  });
}

/**
* 新增公告
*/
function create() {
  memberRebateRuleForm.value.validate(async (valid) => {
    if (valid) {
      await createMemberRebateRule(form);
      uiControl.dialogVisible = false;
      await loadMemberRebateRules();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

/**
* 编辑公告
*/
function edit() {
  memberRebateRuleForm.value.validate(async (valid) => {
    if (valid) {
      await updateMemberRebateRule(form);
      uiControl.dialogVisible = false;
      await loadMemberRebateRules();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function removeMemberRebateRule(memberRebateRule) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (memberRebateRule) {
      await deleteMemberRebateRule([memberRebateRule.id]);
    } else {
      await deleteMemberRebateRule(chooseRule.map(a => a.id));
    }
    await loadMemberRebateRules();
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
  if (charCode < 46 || charCode === 47 || charCode > 57) {
    event.preventDefault();
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

async function loadGameTypes() {
  const { data: ret } = await getGameTypes()
  gameTypes.list = ret
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = siteList.list[0].id;
  }
  await loadMemberRebateRules();
  await loadGameTypes();
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
