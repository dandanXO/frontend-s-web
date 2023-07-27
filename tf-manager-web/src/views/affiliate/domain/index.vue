<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input v-model="request.affiliateName" size="small" style="width: 200px;" :placeholder="t('fields.loginName')" />
        <el-select
          v-if="hasRole(['ADMIN'])"
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
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadAffiliateDomains()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" v-permission="['sys:affiliate-domain:add']" @click="showDialog('CREATE')">
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.affiliateDomainList') }}</span>
        </div>
      </template>

      <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
        <el-form v-if="uiControl.dialogType === 'CREATE'" ref="memberForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
          <el-form-item :label="t('fields.site')" prop="siteId">
            <el-select
              v-model="form.siteId"
              size="small"
              :placeholder="t('fields.site')"
              class="filter-item"
              style="width: 350px"
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
          <el-form-item :label="t('fields.affiliateName')" prop="affiliateName">
            <el-input v-model="form.affiliateName" style="width: 350px;" maxlength="11" />
          </el-form-item>
          <el-form-item :label="t('fields.way')" prop="way">
            <el-select
              v-model="form.way"
              size="small"
              :placeholder="t('fields.way')"
              class="filter-item"
              style="width: 350px"
            >
              <el-option
                v-for="item in uiControl.way"
                :key="item.key"
                :label="item.displayName"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.domain')" prop="domain">
            <el-input v-model="form.domain" style="width: 350px;" maxlength="100" />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
            <el-button type="primary" @click="addAffiliateDomain">{{ t('fields.confirm') }}</el-button>
          </div>
        </el-form>
        <el-form v-if="uiControl.dialogType === 'EDIT'" ref="memberForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
          <el-form-item :label="t('fields.site')" prop="siteId">
            <el-select
              v-model="form.siteId"
              size="small"
              :placeholder="t('fields.site')"
              class="filter-item"
              style="width: 350px"
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
          <el-form-item :label="t('fields.affiliateName')" prop="affiliateName">
            <el-input v-model="form.affiliateName" style="width: 350px;" maxlength="11" disabled />
          </el-form-item>
          <el-form-item :label="t('fields.way')" prop="way">
            <el-select
              v-model="form.way"
              size="small"
              :placeholder="t('fields.way')"
              class="filter-item"
              style="width: 350px"
            >
              <el-option
                v-for="item in uiControl.way"
                :key="item.key"
                :label="item.displayName"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.domain')" prop="domain">
            <el-input v-model="form.domain" style="width: 350px;" maxlength="100" />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
            <el-button type="primary" @click="editAffiliateDomain">{{ t('fields.confirm') }}</el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-table :data="page.records" ref="table"
                v-loading="page.loading"
                row-key="id"
                size="mini"
                :resizable="true"
                highlight-current-row
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="affiliateName" :label="t('fields.affiliateName')" width="180">
          <template #default="scope" v-if="hasPermission(['sys:affiliate:detail'])">
            <router-link :to="`details/${scope.row.affiliateId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.affiliateName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="domain" :label="t('fields.domain')" width="200" />
        <el-table-column prop="way" :label="t('fields.way')" width="200">
          <template #default="scope">
            <span v-if="scope.row.way === 'PC'">{{ t('fields.pcWay') }}</span>
            <span v-else>{{ t('fields.mobileWay') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" :label="t('fields.createBy')" width="200" />
        <el-table-column prop="createTime" :label="t('fields.createTime')" width="200" />
        <el-table-column
          :label="t('fields.operate')"
          align="right"
          fixed="right"
          v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:affiliate-domain:update'])|| hasPermission(['sys:affiliate-domain:del']))"
        >
          <template #default="scope">
            <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:affiliate-domain:update']" @click="showEdit(scope.row)" />
            <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:affiliate-domain:del']" @click="removeAffiliateDomain(scope.row.id)" />
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
    </el-card>
  </div>
</template>

<script setup>

import { reactive, ref, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { required } from "../../../utils/validate";
import {
  getAffiliateDomains,
  createAffiliateDomain,
  delAffiliateDomain,
  updateAffiliateDomain
} from "../../../api/affiliate-domain";
import { getSiteListSimple } from "../../../api/site";
import { hasPermission, hasRole } from '../../../utils/util'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const memberForm = ref(null);
const table = ref(null);
const siteList = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  way: [
    { key: 1, displayName: t('fields.pcWay'), value: "PC" },
    { key: 2, displayName: t('fields.mobileWay'), value: "MOBILE" }
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
  affiliateName: null,
  domain: null,
  siteId: null
});

const form = reactive({
  id: null,
  siteId: null,
  affiliateName: null,
  domain: null,
  way: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  affiliateName: [required(t('message.validateAffiliateNameRequired'))],
  way: [required(t('message.validateWayRequired'))],
  domain: [required(t('message.validateDomainRequired'))],
});

function resetQuery() {
  request.affiliateName = null;
  request.siteId = siteList.list[0].id;
}

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  return query;
}

async function loadAffiliateDomains() {
  page.loading = true;
  uiControl.searchDialogVisible = false;
  const query = checkQuery();
  let result = {};
  result = await getAffiliateDomains(query);

  page.pages = result.data.pages;
  page.records = result.data.records;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadAffiliateDomains();
  }
}

function showEdit(affiliateDomain) {
  showDialog("EDIT");
  nextTick(() => {
    for (const key in affiliateDomain) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = affiliateDomain[key];
      }
    }
  });
}

function showDialog(type) {
  if (type === "CREATE") {
    form.id = null;
    form.siteId = siteList.list[0].id;
    form.affiliateName = null;
    form.way = null;
    form.domain = null;
    uiControl.dialogTitle = t('fields.addAffiliateDomain');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editAffiliateDomain');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function addAffiliateDomain() {
  memberForm.value.validate(async (valid) => {
    if (valid) {
      await createAffiliateDomain(form);
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.addSuccess'), type: "success" });
      await loadAffiliateDomains();
    }
  });
}

function editAffiliateDomain() {
  memberForm.value.validate(async (valid) => {
    if (valid) {
      await updateAffiliateDomain(form);
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.editSuccess'), type: "success" });
      if (page.records.length !== 0) {
        await loadAffiliateDomains();
      }
    }
  });
}

async function removeAffiliateDomain(id) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await delAffiliateDomain(id);
    await loadAffiliateDomains();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

onMounted(async () => {
  await loadSites();
  request.siteId = siteList.list[0].id;
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

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}
</style>
