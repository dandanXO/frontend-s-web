<template>
  <div class="roles-main">
    <div class="header-container" v-if="hasRole(['TENANT','ADMIN'])">
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')"
                   v-permission="['sys:site:ip:create']"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit()" :disabled="uiControl.editBtn"
                   v-permission="['sys:site:ip:update']"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button icon="el-icon-remove" size="mini" type="danger" @click="removeIpLabel()"
                   :disabled="uiControl.removeBtn"
                   v-permission="['sys:site:ip:del']"
        >
          {{ t('fields.delete') }}
        </el-button></div>
    </div>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form ref="ipLabelForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
        <el-form-item label="Ip" prop="ip">
          <el-input v-model="form.ip" style="width: 350px;" maxlength="30" />
        </el-form-item>
        <el-form-item class="el-form-item--level-color" :label="t('fields.color')" prop="color">
          <el-input v-model="form.color" style="width: 250px;" disabled />
          <el-color-picker v-model="form.color" style="margin-left: 4px;" />
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input v-model="form.remark" style="width: 350px;" maxlength="100" />
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
      <el-table-column prop="ip" label="IP" width="150" />
      <el-table-column prop="color" :label="t('fields.color')" width="150">
        <template #default="scope">
          <div class="level-color" :style="{backgroundColor: scope.row.color}" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="t('fields.remark')" width="200" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="150" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="150" />
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        fixed="right"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:site:ip:update'])|| hasPermission(['sys:site:ip:del']))"
      >
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:site:ip:update']" @click="showEdit(scope.row)" />
          <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:site:ip:del']" @click="removeIpLabel(scope.row)" />
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

import { nextTick, onMounted, reactive, computed, ref } from "vue";
import { hasRole, hasPermission } from "../../../utils/util";
import { required } from "../../../utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { createIpLabel, updateIpLabel, getIpLabel, deleteIpLabel } from "../../../api/ip-label";
import { getSiteListSimple } from '../../../api/site'
import { useI18n } from "vue-i18n";
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const ipLabelForm = ref(null);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true
});

const siteList = reactive({
  list: [],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 30,
  current: 1,
  siteId: 0
});

const form = reactive({
  id: null,
  ip: null,
  color: null,
  remark: null,
  siteId: null
});

const formRules = reactive({
  ip: [required(t('message.validateIpRequired'))],
  color: [required(t('message.validateColorRequired'))],
  remark: [required(t('message.validateRemarkRequired'))],
});

let chooseIpLabel = [];

function handleSelectionChange(val) {
  chooseIpLabel = val;
  if (chooseIpLabel.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (chooseIpLabel.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

async function loadIpLabel() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getIpLabel(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadIpLabel();
}

function showDialog(type) {
  if (type === "CREATE") {
    if (ipLabelForm.value) {
      ipLabelForm.value.resetFields();
    }
    form.siteId = request.siteId;
    uiControl.dialogTitle = t('fields.addIpLabel');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editIpLabel');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(ipLabel) {
  showDialog("EDIT");
  if (!ipLabel) {
    ipLabel = chooseIpLabel[0];
  }
  nextTick(() => {
    for (const key in ipLabel) {
      if (Object.keys(form).find(k => k === key)) {
        if (key === 'endDate') {
          form[key] = String(ipLabel[key]).slice(0, 10);
        } else {
          form[key] = ipLabel[key];
        }
      }
    }
  });
}
/**
* 新增公告
*/
function create() {
  ipLabelForm.value.validate(async (valid) => {
    if (valid) {
      form.id = null
      await createIpLabel(form);
      uiControl.dialogVisible = false;
      await loadIpLabel();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

/**
* 编辑公告
*/
function edit() {
  ipLabelForm.value.validate(async (valid) => {
    if (valid) {
      await updateIpLabel(form);
      uiControl.dialogVisible = false;
      await loadIpLabel();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function removeIpLabel(ipLabel) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (ipLabel) {
      await deleteIpLabel([ipLabel.id]);
    } else {
      await deleteIpLabel(chooseIpLabel.map(a => a.id));
    }
    await loadIpLabel();
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
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

onMounted(async() => {
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  await loadIpLabel();
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

.el-form-item--level-color:deep(.el-form-item__content) {
  display: flex !important;
}

.level-color {
  width: 30px;
  height: 30px;
}
</style>
