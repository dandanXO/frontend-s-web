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
        <el-date-picker
          v-model="request.startTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="daterange"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 280px; margin-left: 10px;"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
          @change="loadGameQuizTitle"
        />
        <el-input
          v-model="request.quizTitle"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.quizTitle')"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
          @focus="loadSites"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('status.gameQuizAnswer.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadGameQuizOccasion">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:privi:game-quiz-occasion:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="680px"
    >
      <el-form
        ref="gameQuizOccasionForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-row>
          <el-form-item :label="t('fields.site')" prop="siteName">
            <span>{{ form.siteName }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.loginName')" prop="loginName">
            <span>{{ form.loginName }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.quizTitle')" prop="quizTitle">
            <span>{{ form.quizTitle }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.selectedOccasion')" prop="selectedOccasion">
            <span>{{ form.selectedOccasion }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.bonus')" prop="bonus">
            $ <span v-formatter="{data: form.bonus, type: 'money'}" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.status')" prop="status">
            <el-radio-group v-model="form.status" size="mini" style="width: 300px">
              <el-radio-button
                v-for="item in uiControl.status"
                :key="item.key"
                :label="item.value"
                size="small"
              >{{ t('status.gameQuizAnswer.' + item.displayName) }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="updateStatus">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      v-loading="page.loading"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="quizTitle" :label="t('fields.quizTitle')" width="280" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" width="180" />
      <el-table-column prop="status" :label="t('fields.status')" width="140">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'PENDING'" size="mini">{{ t('status.gameQuizAnswer.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'CANCEL'" type="danger" size="mini">{{ t('status.gameQuizAnswer.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'WIN'" type="success" size="mini">{{ t('status.gameQuizAnswer.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'LOSE'" type="warning" size="mini">{{ t('status.gameQuizAnswer.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="selectedOccasion" :label="t('fields.selectedOccasion')" width="200">
        <template #default="scope">
          <span v-if="scope.row.selectedOccasion === null">-</span>
          <span v-else>{{ scope.row.selectedOccasion }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bonus" :label="t('fields.bonus')" width="200">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="center" v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:privi:game-quiz-occasion:update'])">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            v-permission="['sys:privi:game-quiz-occasion:update']"
            @click="showUpdate(scope.row)"
            style="cursor: pointer"
          >
            {{ t('fields.updateStatus') }}
          </el-button>
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
      @current-change="loadGameQuizOccasion"
      @size-change="loadGameQuizOccasion"
    />
  </div>
  <el-dialog
    :title="t('fields.exportToExcel')"
    v-model="uiControl.messageVisible"
    append-to-body
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <span>{{ t('message.requestExportToExcelDone1') }}</span>
    <router-link :to="`/site-management/download-manager`">
      <el-link type="primary">
        {{ t('menu.DownloadManager') }}
      </el-link>
    </router-link>
    <span>{{ t('message.requestExportToExcelDone2') }}</span>
  </el-dialog>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { required } from "@/utils/validate";
import { ElMessage } from "element-plus";
import { getSiteListSimple } from "@/api/site";
import { hasRole, hasPermission } from "@/utils/util";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getGameQuizOccasions, updateGameQuizOccasions, getGameQuizOccasionsForExport } from "@/api/game-quiz";
import { getShortcuts } from "@/utils/datetime";
import moment from "moment";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  quizTitle: null,
  loginName: null,
  status: null,
  startTime: [convertStartDate(new Date()), convertDate(new Date())]
});

const gameQuizOccasionForm = ref(null);
const sites = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "UPDATE",
  removeBtn: true,
  status: [
    { key: 1, displayName: 'PENDING', value: 'PENDING' },
    { key: 2, displayName: 'CANCEL', value: 'CANCEL' },
    { key: 3, displayName: 'WIN', value: 'WIN' },
    { key: 4, displayName: 'LOSE', value: 'LOSE' }
  ],
  messageVisible: false
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
  siteName: null,
  loginName: null,
  quizTitle: null,
  selectedOccasion: null,
  bonus: null,
  status: null
});

const formRules = reactive({
  status: [required(t('message.validateStatusRequired'))]
});

async function loadGameQuizOccasion() {
  page.loading = true;
  const query = checkQuery()
  const { data: ret } = await getGameQuizOccasions(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

function showDialog(type) {
  if (gameQuizOccasionForm.value) {
    gameQuizOccasionForm.value.resetFields();
  }
  if (type === "UPDATE") {
    uiControl.dialogTitle = t('fields.updateStatus');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showUpdate(occasion) {
  showDialog('UPDATE');
  nextTick(() => {
    for (const key in occasion) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = occasion[key];
        if (key === 'siteId') {
          form.siteName = sites.list.find(s => s.id === occasion[key]).siteName;
        }
      }
    }
  });
}

function updateStatus() {
  gameQuizOccasionForm.value.validate(async (valid) => {
    if (valid) {
      await updateGameQuizOccasions(form.id, form.status);
      uiControl.dialogVisible = false;
      await loadGameQuizOccasion();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.quizTitle = null;
  request.status = null;
  request.loginName = null;
  request.startTime = [convertStartDate(new Date()), convertDate(new Date())];
}

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.startTime !== null) {
    if (request.startTime.length === 2) {
      query.startTime = request.startTime.join(",");
    }
  }
  const siteCode = sites.list.find(e => e.id === request.siteId).siteCode
  query.promoCode = siteCode.toLowerCase() + '-fifa-quiz-2025-occasion'
  return query;
}

async function requestExportExcel() {
  const query = checkQuery()
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await getGameQuizOccasionsForExport(query)
  if (ret) {
    uiControl.messageVisible = true
  }
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

.el-form-item--level-color:deep(.el-form-item__content) {
  display: flex !important;
}
</style>
