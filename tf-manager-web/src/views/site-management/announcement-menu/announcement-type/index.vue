<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px;"
          :placeholder="t('fields.name')"
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
            v-for="item in uiControl.announcementTypeState"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="changeSiteSearch"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-if="uiControl.showSiteTypeSearch === true"
          v-model="request.siteType"
          size="small"
          class="filter-item"
          :placeholder="t('fields.siteType')"
          style="width: 120px;margin-left:5px"
        >
          <el-option
            v-for="item in siteType.list"
            :key="item.value"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAnnouncementType"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group" v-if="!hasRole(['SUB_TENANT'])">
        <el-button icon="el-icon-plus" size="mini" type="primary" v-permission="['sys:annou:type:add']" @click="showDialog('CREATE')">{{ t('fields.add') }}</el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:annou:type:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >{{ t('fields.edit') }}</el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:annou:type:del']"
          @click="removeAnnouncementType()"
          :disabled="uiControl.removeBtn"
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
        ref="announcementTypeForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.name')" prop="name">
          <el-input v-model="form.name" style="width: 350px;" maxlength="20" />
        </el-form-item>
        <el-form-item v-if="uiControl.dialogType === 'CREATE'" :label="t('fields.state')" prop="status">
          <el-radio v-model="form.status" label="true">active</el-radio>
          <el-radio v-model="form.status" label="false">disable</el-radio>
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            v-if="uiControl.dialogType === 'CREATE'"
            type="number"
            v-model.number="form.sequence"
            :min="1"
            :max="page.records.length + 1"
            style="width: 350px;"
            @keyup="checkNumberInput()"
            @keypress="restrictInput($event)"
            controls-position="right"
          />
          <el-input-number
            v-if="uiControl.dialogType === 'EDIT'"
            type="number"
            v-model.number="form.sequence"
            :min="1"
            :max="page.records.length"
            style="width: 350px;"
            @keyup="checkNumberInput()"
            @keypress="restrictInput($event)"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @change="changeSite"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.siteType')" prop="siteType" v-if="uiControl.showSiteType === true">
          <el-select
            v-model="form.siteType"
            size="small"
            class="filter-item"
            :placeholder="t('fields.siteType')"
            style="width: 350px"
          >
            <el-option
              v-for="item in siteType.list"
              :key="item.value"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
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
      <el-table-column prop="site" :label="t('fields.site')" width="200" />
      <el-table-column prop="name" :label="t('fields.name')" width="200" />
      <el-table-column prop="sequence" :label="t('fields.sequence')" width="200" />
      <el-table-column prop="status" :label="t('fields.state')" width="150">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeAnnouncementTypeState(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{data: scope.row.createTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column :label="t('fields.operate')" align="right" v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:annou:type:update'])|| hasPermission(['sys:annou:type:del']))">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:annou:type:update']" @click="showEdit(scope.row)" />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:annou:type:del']"
            @click="removeAnnouncementType(scope.row)"
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

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { required } from "../../../../utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { createAnnouncementType, updateAnnouncementType, getAnnouncementType, updateAnnouncementTypeState, deleteAnnouncementType } from "../../../../api/announcement-type";
import { getSiteListSimple } from "../../../../api/site";
import { hasRole, hasPermission } from "../../../../utils/util";
import { useI18n } from "vue-i18n";
import { useStore } from '../../../../store';
import { isVnm } from '@/utils/site'
import { TENANT } from "../../../../store/modules/user/action-types";

const store = useStore();
const { t } = useI18n();
const announcementTypeForm = ref(null);
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const siteList = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  announcementTypeState: [
    { key: 1, displayName: "active", value: true },
    { key: 2, displayName: "disable", value: false }
  ],
  showSiteType: false,
  showSiteTypeSearch: false,
});

const siteType = reactive({
  list: [
    { displayName: t('siteType.main'), value: 'main' },
    { displayName: t('siteType.slot'), value: 'slot' },
  ],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  status: null,
  siteType: null,
  siteId: null,
});

const form = reactive({
  id: null,
  name: null,
  sequence: null,
  siteId: null,
  siteType: null,
  status: "true",
});

const formRules = reactive({
  name: [required(t('message.validateNameRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  siteId: [required(t('message.validateSiteRequired'))]
});

let chooseAnnouncementType = [];

function resetQuery() {
  request.name = null;
  request.status = null;
  request.siteId = site.value ? site.value.id : null;
  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
  } else {
    uiControl.showSiteTypeSearch = false;
  }
  request.siteType = "main"
}

async function changeSiteSearch() {
  request.siteType = 'main'
  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
  } else {
    uiControl.showSiteTypeSearch = false;
  }
}

async function changeSite() {
  form.siteType = 'main'
  if (isVnm(form.siteId)) {
    uiControl.showSiteType = true;
  } else {
    uiControl.showSiteType = false;
  }
}

function handleSelectionChange(val) {
  chooseAnnouncementType = val;
  if (chooseAnnouncementType.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (chooseAnnouncementType.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

async function loadAnnouncementType() {
  page.loading = true;
  const { data: ret } = await getAnnouncementType(request);
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
  loadAnnouncementType();
}

function showDialog(type) {
  if (type === "CREATE") {
    if (announcementTypeForm.value) {
      announcementTypeForm.value.resetFields();
    }
    form.status = "true";
    form.sequence = page.records.length + 1;
    form.siteId = siteList.list[0].id;
    form.id = null;
    form.siteType = "main"
    if (isVnm(form.siteId)) {
      uiControl.showSiteType = true;
    } else {
      uiControl.showSiteType = false;
    }
    uiControl.dialogTitle = t('fields.addAnnouncementType');
    form.siteType = "main";
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editAnnouncementType');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(announcementType) {
  showDialog("EDIT");
  if (!announcementType) {
    announcementType = chooseAnnouncementType[0];
  }
  nextTick(() => {
    for (const key in announcementType) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = announcementType[key];
      }
    }
    if (isVnm(form.siteId)) {
      uiControl.showSiteType = true;
    } else {
      uiControl.showSiteType = false;
    }
  });
}

/**
 * 新增公告类型
 */
function create() {
  announcementTypeForm.value.validate(async (valid) => {
    if (valid) {
      await createAnnouncementType(form);
      uiControl.dialogVisible = false;
      await loadAnnouncementType();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

/**
 * 编辑公告类型
 */
function edit() {
  announcementTypeForm.value.validate(async (valid) => {
    if (valid) {
      await updateAnnouncementType(form);
      uiControl.dialogVisible = false;
      await loadAnnouncementType();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function changeAnnouncementTypeState(id, state) {
  await updateAnnouncementTypeState(id, state);
}

async function removeAnnouncementType(announcementType) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (announcementType) {
      await deleteAnnouncementType([announcementType.id]);
    } else {
      await deleteAnnouncementType(chooseAnnouncementType.map(a => a.id));
    }
    await loadAnnouncementType();
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

function checkNumberInput() {
  if (form.sequence < 1) {
    form.sequence = 1;
  }

  if (uiControl.dialogType === "CREATE") {
    if (form.sequence > page.records.length + 1) {
      form.sequence = page.records.length + 1;
    }
  } else if (uiControl.dialogType === "EDIT") {
    if (form.sequence > page.records.length) {
      form.sequence = page.records.length;
    }
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

onMounted(async () => {
  await loadSites();
  request.siteId = siteList.list[0].id;
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }

  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
  } else {
    uiControl.showSiteTypeSearch = false;
  }

  request.siteType = "main";
  loadAnnouncementType();
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
