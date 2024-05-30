<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="mini"
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
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRedirect">
          {{ t('fields.search') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')"
                   v-permission="['sys:redirect:create']"
        >
          {{ t('fields.add') }}
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
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="type" :label="t('fields.type')" min-width="250">
        <template #default="scope">
          <span v-if="scope.row.type === 'GAME'">{{ t('fields.gameCode') }}</span>
          <span v-else-if="scope.row.type === 'PROMO'">{{ t('fields.promo') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" :label="t('fields.code')" min-width="250" />
      <el-table-column prop="platform" :label="t('fields.platform')" min-width="180">
        <template #default="scope">
          <span v-if="scope.row.platform">{{ scope.row.platform }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="t('fields.status')"
        width="150"
        v-if="hasPermission(['sys:redirect:update'])"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeRedirectStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        fixed="right"
        width="350"
      >
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:redirect:update']" @click="showEdit(scope.row)" />
          <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:redirect:del']" @click="removeRedirect(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      class="pagination"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadRedirect"
      @size-change="loadRedirect"
    />
  </div>

  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="1000px"
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
          @change="form.platform = null"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.type')" prop="type">
        <el-select
          v-model="form.type"
          size="small"
          :placeholder="t('fields.type')"
          class="filter-item"
          style="width: 350px;"
          default-first-option
        >
          <el-option
            v-for="item in uiControl.type"
            :key="item.key"
            :label="t('fields.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.code')" prop="code">
        <el-select
          v-if="form.type === 'PROMO'"
          v-model="form.code"
          size="small"
          :placeholder="t('fields.code')"
          class="filter-item"
          style="width: 350px;"
          default-first-option
          @focus="loadPrivileges"
        >
          <el-option
            v-for="item in privileges.list"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        <el-input v-else v-model="form.code" style="width: 350px;" maxlength="100" />
      </el-form-item>
      <el-form-item v-if="form.type === 'GAME'" :label="t('fields.platform')" prop="platform">
        <el-select
          v-model="form.platform"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 350px;"
          default-first-option
          @focus="loadPlatform"
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
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
import { hasRole, hasPermission } from "@/utils/util";
import { getSiteListSimple } from "@/api/site";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getRedirect, createRedirect, updateRedirect, updateRedirectStatus, deleteRedirect } from "@/api/redirect";
import { getPlatformsBySite } from "@/api/platform";
import { getActivePrivilegeInfoBySiteId } from "@/api/privilege-info"
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const formRef = ref(null);
const selectedId = ref(null);
const platforms = reactive({
  list: []
})
const privileges = reactive({
  list: []
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  type: [
    { key: 0, displayName: 'gameCode', value: 'GAME' },
    { key: 1, displayName: 'promo', value: 'PROMO' }
  ]
});

const request = reactive({
  size: 20,
  current: 1,
  siteId: null
});

const sites = reactive({
  list: []
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const form = reactive({
  siteId: null,
  type: null,
  code: null,
  platform: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  type: [required(t('message.validateTypeRequired'))],
  code: [required(t('message.validateCodeRequired'))],
});

async function loadRedirect() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getRedirect(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

async function loadPlatform() {
  const { data: platform } = await getPlatformsBySite(form.siteId);
  platforms.list = platform;
}

async function loadPrivileges() {
  const { data: privilege } = await getActivePrivilegeInfoBySiteId(form.siteId);
  privileges.list = privilege;
}

function showDialog(type) {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  if (type === "CREATE") {
    form.siteId = request.siteId;
    uiControl.dialogTitle = t('fields.addRedirect');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editRedirect');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(redirect) {
  debugger;
  showDialog('EDIT');
  nextTick(() => {
    for (const key in redirect) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = redirect[key];
      }
    }
    selectedId.value = redirect.id;
  });
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await createRedirect(form);
      uiControl.dialogVisible = false;
      await loadRedirect();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  formRef.value.validate(async valid => {
    if (valid) {
      await updateRedirect(selectedId.value, form)
      uiControl.dialogVisible = false
      await loadRedirect()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function removeRedirect(id) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteRedirect(id)
    await loadRedirect()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function changeRedirectStatus(id, status) {
  await updateRedirectStatus(id, status)
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

.param-label {
  display: inline-block;
  width: 100px;
  margin-top: 5px;
  margin-left: 5px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}

.param-input {
  width: 170px;
  margin-left: 5px;
  margin-right: 15px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}
</style>
