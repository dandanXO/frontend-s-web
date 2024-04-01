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
        <el-input
          v-model="request.loginName"
          size="small"
          :placeholder="t('fields.loginName')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadJobs()">
          {{ t('fields.search') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')"
                   v-permission="['sys:affiliate:recount:add']"
        >
          {{ t('fields.add') }}
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
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input v-model="form.loginName" style="width: 350px;" maxlength="30" />
        </el-form-item>
        <el-form-item :label="t('fields.month')" prop="month">
          <el-date-picker
            v-model="form.month"
            type="month"
            placeholder="Select month"
            style="width: 350px;"
            format="YYYY/MM"
            value-format="YYYY-MM"
            :disabled-date="disabledDate"
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
              v-loading="page.loading"
              style="width: 100%"
    >
      <el-table-column prop="site" :label="t('fields.site')" :min-width="20" />
      <el-table-column prop="affiliateName" :label="t('fields.loginName')" :min-width="20" />
      <el-table-column prop="start" :label="t('fields.startTime')" :min-width="20" />
      <el-table-column prop="end" :label="t('fields.endTime')" :min-width="20" />
      <el-table-column prop="status" :label="t('fields.status')" :min-width="20">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'WAIT'" size="mini">
            {{ scope.row.status }}
          </el-tag>
          <el-tag
            v-if="scope.row.status === 'FINISH'"
            type="success"
            size="mini"
          >
            {{ scope.row.status }}
          </el-tag>
          <el-tag
            v-if="scope.row.affiliateStatus === 'ERROR'"
            type="danger"
            size="mini"
          >
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="150" />
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

import { computed, onMounted, reactive, ref } from "vue";
import { hasRole } from "../../../utils/util";
import { required } from "../../../utils/validate";
import { ElMessage } from "element-plus";
import { getJobs, addJob } from "../../../api/affiliate-recalculate";
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
  loginName: null,
  month: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  loginName: [required(t('message.validateLoginNameRequired'))],
  month: [required(t('message.validateMonthRequired'))],
});

async function loadJobs() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getJobs(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadJobs();
}

function showDialog(type) {
  if (type === "CREATE") {
    if (affiliateCommissionForm.value) {
      affiliateCommissionForm.value.resetFields();
    }
    form.siteId = siteList.list[0].id;
    uiControl.dialogTitle = t('fields.add');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

/**
* 新增公告
*/
function create() {
  affiliateCommissionForm.value.validate(async (valid) => {
    if (valid) {
      await addJob(form);
      uiControl.dialogVisible = false;
      await loadJobs();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

function disabledDate(time) {
  return (
    time.getTime() > new Date().getTime()
  )
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = siteList.list[0].id;
  }
  await loadJobs();
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
