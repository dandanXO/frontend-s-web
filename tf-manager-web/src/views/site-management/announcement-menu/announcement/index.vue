<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.title"
          size="small"
          style="width: 200px;"
          :placeholder="t('fields.title')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.announcementState"
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
          @click="loadAnnouncement"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:annou:add']"
          @click="showDialog('CREATE')"
          v-if="!hasRole(['SUB_TENANT'])"
        >{{ t('fields.add') }}</el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          @click="showEdit()"
          v-permission="['sys:annou:update']"
          :disabled="uiControl.editBtn"
          v-if="!hasRole(['SUB_TENANT'])"
        >{{ t('fields.edit') }}</el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:annou:del']"
          @click="removeAnnouncement()"
          :disabled="uiControl.removeBtn"
          v-if="!hasRole(['SUB_TENANT'])"
        >{{ t('fields.delete') }}</el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="announcementForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="form.title" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.type')" prop="type">
          <el-select
            v-model="form.type"
            :placeholder="t('fields.announcementType')"
            style="width: 350px;"
            filterable
            default-first-option
            @focus="loadActiveAnnouncementType"
          >
            <el-option
              v-for="item in announcementTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'CREATE'" :label="t('fields.state')" prop="status">
          <el-radio v-model="form.status" label="true">active</el-radio>
          <el-radio v-model="form.status" label="false">disable</el-radio>
        </el-form-item>
        <el-form-item :label="t('fields.endDate')" prop="dueDate">
          <el-date-picker
            type="date"
            value-format="YYYY-MM-DD"
            v-model="form.dueDate"
            style="width: 350px;"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item :label="t('fields.content')" prop="content">
          <el-input
            type="textarea"
            v-model="form.content"
            :rows="6"
            style="width: 350px;"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            type="number"
            v-model.number="form.sequence"
            :min="0"
            style="width: 350px"
            @keypress="restrictInput($event)"
            controls-position="right"
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
      <el-table-column type="selection" width="55" v-if="!hasRole(['SUB_TENANT'])" />
      <el-table-column prop="title" :label="t('fields.title')" width="200" />
      <el-table-column prop="announcementType" :label="t('fields.announcementType')" width="200" />
      <el-table-column prop="sequence" :label="t('fields.sequence')" width="200" />
      <el-table-column prop="status" :label="t('fields.state')" width="150" v-if="hasPermission(['sys:annou:update:state'])">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeAnnouncementState(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')" />
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column prop="dueDate" :label="t('fields.endDate')" />
      <el-table-column :label="t('fields.operate')" align="right" v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:annou:update'])|| hasPermission(['sys:annou:del']))">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:annou:update']" @click="showEdit(scope.row)" />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:annou:del']"
            @click="removeAnnouncement(scope.row)"
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

import { nextTick, onMounted, reactive, ref } from "vue";
import { required } from "../../../../utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { createAnnouncement, updateAnnouncement, getAnnouncement, updateAnnouncementState, deleteAnnouncement } from "../../../../api/announcement";
import { getActiveAnnouncementType } from "../../../../api/announcement-type";
import { hasRole, hasPermission } from "../../../../utils/util";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const announcementForm = ref(null);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  announcementState: [
    { key: 1, displayName: "active", value: true },
    { key: 2, displayName: "disable", value: false }
  ]
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 30,
  current: 1,
  title: null,
  status: null
});

const form = reactive({
  id: null,
  title: null,
  type: null,
  status: "true",
  dueDate: null,
  content: null,
  sequence: null
});

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  type: [required(t('message.validateAnnouncementTypeRequired'))],
  dueDate: [required(t('message.validateEndDateRequired'))],
  content: [required(t('message.validateContentRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
});

let chooseAnnouncement = [];
const announcementTypeList = ref([]);

function disabledDate(time) {
  return time.getTime() <= Date.now()
}

function resetQuery() {
  request.title = null;
  request.status = null;
}

function handleSelectionChange(val) {
  chooseAnnouncement = val;
  if (chooseAnnouncement.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (chooseAnnouncement.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

async function loadAnnouncement() {
  page.loading = true;
  const { data: ret } = await getAnnouncement(request);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

async function loadActiveAnnouncementType() {
  const { data: type } = await getActiveAnnouncementType();
  announcementTypeList.value = type;
}

function changePage(page) {
  request.current = page;
  loadAnnouncement();
}

function showDialog(type) {
  if (type === "CREATE") {
    if (announcementForm.value) {
      announcementForm.value.resetFields();
      form.status = "true";
    }
    uiControl.dialogTitle = t('fields.addAnnouncement');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editAnnouncement');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(announcement) {
  showDialog("EDIT");
  if (!announcement) {
    announcement = chooseAnnouncement[0];
  }
  nextTick(() => {
    for (const key in announcement) {
      if (Object.keys(form).find(k => k === key)) {
        if (key === 'dueDate') {
          form[key] = String(announcement[key]).slice(0, 10);
        } else {
          form[key] = announcement[key];
        }
      }
    }
    console.log(form)
  });
}

/**
 * 新增公告
 */
function create() {
  announcementForm.value.validate(async (valid) => {
    form.id = null;
    if (valid) {
      await createAnnouncement(form);
      uiControl.dialogVisible = false;
      await loadAnnouncement();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

/**
 * 编辑公告
 */
function edit() {
  announcementForm.value.validate(async (valid) => {
    if (valid) {
      await updateAnnouncement(form);
      uiControl.dialogVisible = false;
      await loadAnnouncement();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function changeAnnouncementState(id, state) {
  await updateAnnouncementState(id, state);
}

async function removeAnnouncement(announcement) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (announcement) {
      await deleteAnnouncement([announcement.id]);
    } else {
      await deleteAnnouncement(chooseAnnouncement.map(a => a.id));
    }
    await loadAnnouncement();
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
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

onMounted(() => {
  loadAnnouncement();
  loadActiveAnnouncementType();
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
</style>
