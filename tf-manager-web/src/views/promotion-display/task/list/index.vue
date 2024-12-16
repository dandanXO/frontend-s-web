<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          clearable
          filterable
          v-model="request.privilegeId"
          size="small"
          class="filter-item"
          style="width: 250px;"
          default-first-option
          :placeholder="t('fields.privilegeName')"
          @focus="loadRequestPrivilegeList"
        >
          <el-option
            v-for="item in privilegeList.requestList"
            :key="item.id"
            :label="item.alias !== null ? item.alias : item.name"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.code"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.taskCode')"
        />
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.taskName')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('taskStatus.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadTask"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group" v-if="!hasRole(['SUB_TENANT'])">
        <el-button icon="el-icon-plus" size="mini" type="primary" v-permission="['sys:task:add']" @click="showDialog('CREATE')">{{ t('fields.add') }}</el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:task:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >{{ t('fields.edit') }}</el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:task:del']"
          @click="removeTask()"
          :disabled="uiControl.removeBtn"
        >{{ t('fields.delete') }}</el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="720px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.privilegeName')" prop="privilegeId">
          <el-select
            clearable
            filterable
            v-model="form.privilegeId"
            size="small"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            :placeholder="t('fields.privilegeName')"
            @focus="loadFormPrivilegeList"
          >
            <el-option
              v-for="item in privilegeList.formList"
              :key="item.id"
              :label="item.alias !== null ? item.alias : item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.taskName')" prop="name">
          <el-input v-model="form.name" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.taskCode')" prop="code">
          <el-input v-model="form.code" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            v-model="form.sequence"
            controls-position="right"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item :label="t('fields.taskRules')" prop="rules">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.rules"
            style="width: 350px"
            :placeholder="t('fields.taskRules')"
            maxlength="500"
            show-word-limit
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
      <el-table-column type="selection" width="55" />
      <el-table-column prop="sequence" :label="t('fields.sequence')" width="80" />
      <el-table-column prop="privilegeName" :label="t('fields.privilegeName')" width="150">
        <template #default="scope">
          <span v-if="scope.row.privilegeName">{{ scope.row.privilegeName }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="t('fields.taskName')" width="150" />
      <el-table-column prop="code" :label="t('fields.taskCode')" width="150" />
      <el-table-column prop="status" :label="t('fields.state')" width="180">
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.status"
            size="mini"
            @change="changestatus(scope.row.id, scope.row.siteId, scope.row.status)"
          >
            <el-radio-button :value-key="item.value" v-for="item in uiControl.status" :label="item.value" :key="item.key">{{ t('taskStatus.' + item.displayName) }}</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column prop="rules" :label="t('fields.taskRules')" width="300">
        <template #default="scope">
          <div v-if="scope.row.rules && scope.row.rules.length < 50">
            {{ scope.row.rules }}
          </div>
          <div v-else-if="scope.row.rules">
            <span style="cursor: pointer; color: dark;" @click="openModal(t('fields.taskRules'), scope.row.rules)">{{ scope.row.rules.substr(0,50) + "..." }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')" min-width="200">
        <template #default="scope">
          <span
            v-if="scope.row.createTime"
            v-formatter="{data: scope.row.createTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" min-width="200">
        <template #default="scope">
          <span
            v-if="scope.row.updateTime"
            v-formatter="{data: scope.row.updateTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')">
        <template #default="scope">
          <span v-if="scope.row.updateBy">{{ scope.row.updateBy }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="right" v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:task:update'])|| hasPermission(['sys:task:del']))" min-width="150">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:task:update']" @click="showEdit(scope.row)" />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:task:del']"
            @click="removeTask(scope.row)"
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
    <el-dialog
      v-model="uiControl.rulesDialogVisible"
      :title="uiControl.rulesDialogTitle"
      width="580px"
    >
      {{ uiControl.rulesDialogContent }}
    </el-dialog>
  </div>
</template>

<script setup>

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { createTask, updateTask, getTask, updateTaskState, deleteTask } from "@/api/task";
import { getActivePrivilegeInfoBySiteId } from '@/api/privilege-info'
import { getSiteListSimple } from "@/api/site";
import { hasRole, hasPermission } from "@/utils/util";
import { useI18n } from "vue-i18n";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";

const store = useStore();
const { t } = useI18n();
const formRef = ref(null);
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const siteList = reactive({
  list: []
});
const privilegeList = reactive({
  formList: [],
  requestList: []
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  status: [
    { key: 1, displayName: "ACTIVE", value: "ACTIVE" },
    { key: 2, displayName: "EXPIRED", value: "EXPIRED" }
  ],
  rulesDialogVisible: false,
  rulesDialogTitle: null,
  rulesDialogContent: null
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 30,
  current: 1,
  status: null,
  siteId: null,
  privilegeId: null,
  code: null,
  name: null
});

const form = reactive({
  id: null,
  siteId: null,
  privilegeId: null,
  name: null,
  code: null,
  sequence: 1,
  rules: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  name: [required(t('message.validateTaskNameRequired'))],
  code: [required(t('message.validateTaskCodeRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  rules: [required(t('message.validateTaskRulesRequired'))],
});

let chooseTask = [];

function resetQuery() {
  request.status = null;
  request.siteId = store.state.user.siteId
  request.privilegeId = null;
  request.code = null;
  request.name = null;
}

function handleSelectionChange(val) {
  chooseTask = val;
  if (chooseTask.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (chooseTask.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

async function loadTask() {
  page.loading = true;
  const { data: ret } = await getTask(request);
  page.pages = ret.pages;
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadTask();
}

function showDialog(type) {
  if (type === "CREATE") {
    if (formRef.value) {
      formRef.value.resetFields();
    }
    form.id = null;
    form.siteId = request.siteId;
    uiControl.dialogTitle = t('fields.addTask');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editTask');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(task) {
  showDialog("EDIT");
  if (!task) {
    task = chooseTask[0];
  }
  nextTick(() => {
    for (const key in task) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = task[key];
      }
    }
  });
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await createTask(form);
      uiControl.dialogVisible = false;
      await loadTask();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await updateTask(form.id, form);
      uiControl.dialogVisible = false;
      await loadTask();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function changestatus(id, siteId, state) {
  await updateTaskState(id, siteId, state);
}

async function removeTask(task) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (task) {
      await deleteTask([task.id]);
    } else {
      await deleteTask(chooseTask.map(a => a.id));
    }
    await loadTask();
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
  siteList.list = site;
}

async function loadFormPrivilegeList() {
  const { data: list } = await getActivePrivilegeInfoBySiteId(form.siteId)
  privilegeList.formList = list
  form.privilegeId = null
}

async function loadRequestPrivilegeList() {
  const { data: list } = await getActivePrivilegeInfoBySiteId(request.siteId)
  privilegeList.requestList = list
  request.privilegeId = null
}

function openModal(title, content) {
  uiControl.rulesDialogVisible = true
  uiControl.rulesDialogTitle = title
  uiControl.rulesDialogContent = content
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = store.state.user.siteId
  }
  await loadRequestPrivilegeList()
  await loadTask();
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
</style>
