<template>
  <div class="roles-main">
    <div class="header-container" v-if="hasRole(['TENANT','ADMIN'])">
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
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 200px; margin-left: 5px;"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="request.loginName" size="small" style="width: 200px; margin-left: 5px;" :placeholder="t('fields.loginName')" />
        <el-button style="margin-left: 20px; margin-left: 5px;" icon="el-icon-search" size="mini" type="success" @click="loadVerificationList(false)">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" style="margin-left: 20px; margin-left: 5px;" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="800px"
    >
      <el-form
        ref="verificationForm"
        :model="form"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-row justify="space-evenly" style="margin-bottom: 10px">
          <el-col :span="12">
            <el-card style="width: 340px; margin-left: 30px">
              <img
                :src="idPhotoPath + request.siteId + '/' + form.idImgPath"
                class="image"
              >
              <div style="margin-top: 5px; text-align: center;">
                <span style="font-weight: bold">ID Photo</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card style="width: 340px">
              <img
                :src="idPhotoPath + request.siteId + '/' + form.idHoldImgPath"
                class="image"
              >
              <div style="margin-top: 5px; text-align: center;">
                <span style="font-weight: bold">Hold ID Photo</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input v-model="form.loginName" style="width: 350px;" maxlength="20" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="site">
          <el-input v-model="form.siteName" style="width: 350px;" maxlength="20" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.id') + ' ' + t('fields.type')" prop="idType">
          <el-input v-model="form.idType" style="width: 350px;" maxlength="20" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.idNumber')" prop="idNumber">
          <el-input v-model="form.idNumber" style="width: 350px;" maxlength="20" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.createTime')" prop="createTime">
          <el-input v-model="form.createTime" style="width: 350px;" maxlength="20" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-select
            v-model="form.status"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.status"
              :key="item.key"
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
      highlight-current-row
      @selection-change="handleSelectionChange"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="siteName" :label="t('fields.site')" width="150" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="150" />
      <el-table-column prop="idType" :label="t('fields.id') + ' ' + t('fields.type')" width="150" />
      <el-table-column prop="idNumber" :label="t('fields.idNumber')" width="200" />
      <el-table-column prop="status" :label="t('fields.status')" width="200" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200" />
      <el-table-column prop="verifyBy" :label="t('fields.verifyBy')" width="200" />
      <el-table-column prop="verifyTime" :label="t('fields.verifyTime')" width="200" />
      <el-table-column :label="t('fields.action')">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:idVerify:update']" @click="showEdit(scope.row)" />
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

import { computed, nextTick, reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { getSiteListSimple } from "../../../api/site";
import { getIDVerificationList, updateVerificationStatus } from "../../../api/id-verification";
import { hasRole } from "../../../utils/util";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const LOGIN_USER_NAME = computed(() => store.state.user.name);
const site = ref(null);
const idPhotoPath = process.env.VUE_APP_IMAGE + '/ID/';
const request = reactive({
  siteId: null,
  status: null,
  loginName: null,
  size: 30,
  current: 1,
});

const verificationForm = ref(null);
const sites = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true,
  status: [
    { key: 1, displayName: t('fields.feedbackStatusPending'), value: "PENDING" },
    { key: 2, displayName: t('fields.feedbackStatusSuccess'), value: "SUCCESS" },
    { key: 3, displayName: t('fields.fail'), value: "FAILED" }
  ]
});
const page = reactive({
  pages: 0,
  records: [],
  pagingState: '',
  loading: false
});

function resetQuery() {
  request.siteId = sites.list[0].id;
  request.status = null;
  request.loginName = null;
  request.size = 30;
  request.current = 0;
  page.pages = 0;
  page.records = [];
  page.pagingState = '';
  page.loading = false;
}

const form = reactive({
  id: null,
  loginName: null,
  memberId: null,
  siteName: null,
  idType: null,
  idNumber: null,
  createTime: null,
  status: null,
  verifyBy: null,
  verifyTime: null,
  idImgPath: null,
  idHoldImgPath: null,
});

let chooseFinancial = [];

function handleSelectionChange(val) {
  chooseFinancial = val;
  if (chooseFinancial.length === 0) {
    uiControl.removeBtn = true;
  } else if (chooseFinancial.length === 1) {
    uiControl.removeBtn = false;
  } else {
    uiControl.removeBtn = false;
  }
}

function checkQuery(initial) {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });

  if (initial === true && request.status === null) {
    query.status = uiControl.status[0].value;
  }

  if (request.current < 1) {
    request.current = 1;
  }

  return query;
}

async function loadVerificationList(initial) {
  page.loading = true;
  const query = checkQuery(initial);

  query.pagingState = page.pagingState;
  const { data: ret } = await getIDVerificationList(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadVerificationList(false);
  }
}

function showDialog() {
  if (verificationForm.value) {
    verificationForm.value.resetFields();
  }
  uiControl.dialogTitle = t('menu.ID Verification');
  uiControl.dialogVisible = true;
}

function showEdit(record) {
  showDialog();
  nextTick(() => {
    for (const key in record) {
      if (Object.keys(form).find(k => k === key)) {
        console.log("form[key] = " + form[key] + ", record[key] = " + record[key]);
        form[key] = record[key];
      }
    }
  });
}

function submit() {
  verificationForm.value.validate(async (valid) => {
    if (valid) {
      form.verifyBy = LOGIN_USER_NAME;
      console.log("form.memberId = " + form.memberId);
      await updateVerificationStatus(form);
      uiControl.dialogVisible = false;
      await loadVerificationList(false);
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
  request.siteId = site[0].id;
}

watch(() => request.siteId, () => {
  form.siteId = request.siteId
})
onMounted(async () => {
  if (hasRole(['TENANT', 'ADMIN'])) {
    await loadSites();
    await loadVerificationList(true);
    if (LOGIN_USER_TYPE.value === TENANT.value) {
      site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
      request.siteId = site.value.id;
    }
  }
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

.el-form-item--level-color:deep .el-form-item__content {
  display: flex !important;
}

.level-color {
  width: 30px;
  height: 30px;
}

.image {
  width: 300px;
  height: 200px;
  display: block;
}
</style>
