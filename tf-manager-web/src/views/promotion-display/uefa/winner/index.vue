<template>
  <div class="roles-main">
    <div class="header-container">
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
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadUefaWinner">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:uefa-winner:add']"
          @click="showDialog('CREATE')"
          v-if="!hasRole(['SUB_TENANT'])"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          @click="showEdit()"
          v-permission="['sys:uefa-winner:update']"
          :disabled="uiControl.editBtn"
          v-if="!hasRole(['SUB_TENANT'])"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:uefa-winner:del']"
          @click="removeWinner()"
          :disabled="uiControl.removeBtn"
          v-if="!hasRole(['SUB_TENANT'])"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      v-loading="page.loading"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        type="selection"
        width="55"
        v-if="!hasRole(['SUB_TENANT'])"
      />
      <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="150" />
      <el-table-column prop="matchTitle" :label="t('fields.title')" min-width="200" />
      <el-table-column prop="bonus" :label="t('fields.bonus')" align="center" min-width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bonus,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" min-width="150">
        <template #default="scope">
          <span v-if="scope.row.createBy !== null">{{ scope.row.createBy }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')" min-width="200">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-else
            v-formatter="{
              data: scope.row.createTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" min-width="150">
        <template #default="scope">
          <span v-if="scope.row.updateBy !== null">{{ scope.row.updateBy }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" min-width="200">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-else
            v-formatter="{
              data: scope.row.createTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        :label="t('fields.operate')"
        align="center"
        width="250"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:uefa-winner:update']) || hasPermission(['sys:uefa-winner:del']))"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:uefa-winner:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:uefa-winner:del']"
            @click="removeWinner(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      class="pagination"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadUefaWinner"
      @size-change="loadUefaWinner"
    />
  </div>
  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="780px"
  >
    <el-form
      v-if="uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'"
      ref="formRef"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="200px"
    >
      <el-form-item :label="t('fields.site')" prop="siteId" v-if="!hasRole(['TENANT'])">
        <el-select
          v-model="form.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 350px;"
          default-first-option
          @focus="loadSites"
          :disabled="uiControl.dialogType === 'EDIT'"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.loginName')" prop="loginName">
        <el-input v-model="form.loginName" style="width: 350px;" maxlength="50" />
      </el-form-item>
      <el-form-item :label="t('fields.title')" prop="matchTitle">
        <el-input v-model="form.matchTitle" style="width: 350px;" maxlength="100" />
      </el-form-item>
      <el-form-item :label="t('fields.bonus')" prop="bonus">
          <el-input v-model="form.bonus" style="width: 350px" maxlength="11" @keypress="restrictInput($event)" />
        </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
      </div>
    </el-form>
    <el-form
      v-if="uiControl.dialogType === 'SCORE'"
      ref="scoreFormRef"
      :model="scoreForm"
      :rules="scoreFormRules"
      :inline="true"
      size="small"
      label-width="200px"
    >
      <el-form-item :label="t('fields.site')" prop="siteId" v-if="!hasRole(['TENANT'])">
        <el-select
          v-model="scoreForm.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 350px;"
          default-first-option
          disabled
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.total')" prop="total">
        <el-input v-model="scoreForm.total" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
      </el-form-item>
      <el-form-item :label="t('fields.win')" prop="win">
        <el-input v-model="scoreForm.win" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
      </el-form-item>
      <el-form-item :label="t('fields.loss')" prop="loss">
        <el-input v-model="scoreForm.loss" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
      </el-form-item>
      <el-form-item :label="t('fields.draw')" prop="draw">
        <el-input v-model="scoreForm.draw" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
      </el-form-item>
      <el-form-item :label="t('fields.goalScored')" prop="goalScored">
        <el-input v-model="scoreForm.goalScored" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
      </el-form-item>
      <el-form-item :label="t('fields.goalAgainst')" prop="goalAgainst">
        <el-input v-model="scoreForm.goalAgainst" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
      </el-form-item>
      <el-form-item :label="t('fields.goalDifference')" prop="goalDifference">
        <el-input v-model="scoreForm.goalDifference" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
      </el-form-item>
      <el-form-item :label="t('fields.score')" prop="score">
        <el-input v-model="scoreForm.score" style="width: 350px" maxlength="5" @keypress="restrictInput($event)" />
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { getSiteListSimple } from "@/api/site";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getUefaWinner, createUefaWinner, updateUefaWinner, deleteUefaWinner } from "@/api/uefa-winner";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { hasRole, hasPermission } from '@/utils/util'

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const formRef = ref(null);
const site = ref(null);
let chooseWinner = []

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true
});

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  loginName: null
});

const sites = reactive({
  list: []
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const form = reactive({
  id: null,
  siteId: null,
  loginName: null,
  matchTitle: null,
  bonus: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  loginName: [required(t('message.validateLoginNameRequired'))],
  matchTitle: [required(t('message.validateTitleRequired'))],
  bonus: [required(t('message.validateBonusRequired'))]
});

async function loadUefaWinner() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getUefaWinner(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.loginName = null;
}

function handleSelectionChange(val) {
  chooseWinner = val
  if (chooseWinner.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseWinner.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

function restrictInput(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

function showDialog(type) {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  if (type === 'CREATE') {
    form.id = null;
    form.siteId = request.siteId;
    uiControl.dialogTitle = t('fields.add');
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.edit');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(winner) {
  showDialog('EDIT');
  if (!winner) {
    winner = chooseWinner[0]
  }
  nextTick(() => {
    for (const key in winner) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = winner[key];
      }
    }
  });
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create();
  } else if (uiControl.dialogType === 'EDIT') {
    edit();
  }
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await createUefaWinner(form);
      uiControl.dialogVisible = false;
      await loadUefaWinner();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await updateUefaWinner(form.id, form);
      uiControl.dialogVisible = false;
      await loadUefaWinner();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
}

async function removeWinner(winner) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (winner) {
      await deleteUefaWinner([winner.id])
    } else {
      await deleteUefaWinner(chooseWinner.map(a => a.id))
    }
    await loadUefaWinner()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
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

.el-form-item--level-color:deep .el-form-item__content {
  display: flex !important;
}
</style>
