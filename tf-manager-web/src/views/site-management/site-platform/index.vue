<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px"
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
          clearable
          v-model="request.platformId"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 200px; margin-left: 5px"
          @focus="loadPlatforms"
          filterable
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadSitePlatform"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="siteName" :label="t('fields.siteName')" min-width="150" />
      <el-table-column prop="platformName" :label="t('fields.platformName')" min-width="150" />
      <el-table-column prop="alias" :label="t('fields.alias')" min-width="150">
        <template #default="scope">
          <span v-if="scope.row.alias === null">-</span>
          <span v-else>{{ scope.row.alias }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" min-width="280">
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.status"
            size="mini"
            style="width: 300px"
            @change="updateState(scope.row.id, scope.row.status)"
          >
            <el-radio-button label="OPEN">OPEN</el-radio-button>
            <el-radio-button label="CLOSE">CLOSE</el-radio-button>
            <el-radio-button label="TEST">TEST</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column prop="underMaintenance" :label="t('fields.underMaintenance')" width="140">
        <template #default="scope">
          <el-switch
            v-model="scope.row.underMaintenance"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="
              updateUnderMaintenance(scope.row.id, scope.row.underMaintenance)
            "
          />
        </template>
      </el-table-column>
      <el-table-column prop="maintenanceStartTime" :label="t('fields.maintenanceStartTime')" min-width="180">
        <template #default="scope">
          <span v-if="scope.row.maintenanceStartTime === null">-</span>
          <span
            v-else
            v-formatter="{
              data: scope.row.maintenanceStartTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="maintenanceEndTime" :label="t('fields.maintenanceEndTime')" min-width="180">
        <template #default="scope">
          <span v-if="scope.row.maintenanceEndTime === null">-</span>
          <span
            v-else
            v-formatter="{
              data: scope.row.maintenanceEndTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="latestFetchBetRecordTime"
        :label="t('fields.latestFetchBetRecordTime')"
        align="center"
        min-width="190"
      >
        <template #default="scope">
          <span v-if="scope.row.latestFetchBetRecordTime === null">-</span>
          <span
            v-if="scope.row.latestFetchBetRecordTime !== null"
            v-formatter="{
              data: scope.row.latestFetchBetRecordTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" min-width="150" />
      <el-table-column
        prop="updateTime"
        :label="t('fields.updateTime')"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="center" fixed="right" width="100" v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:site-platform:update:alias'])">
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:site-platform:update:alias']"
            @click="showEdit(scope.row)"
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
  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="680px"
    @close="loadSitePlatform()"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="200px"
    >
      <el-form-item :label="t('fields.maintenanceTime')" prop="maintenanceTime" v-if="uiControl.dialogType === 'MAINTENANCE'">
        <el-date-picker
          type="datetimerange"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          v-model="form.maintenanceTime"
          style="width: 350px;"
        />
      </el-form-item>
      <el-form-item :label="t('fields.alias')" prop="alias" v-if="uiControl.dialogType === 'ALIAS'">
        <el-input
          style="width: 350px"
          v-model="form.alias"
          :placeholder="t('fields.alias')"
        />
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
        <el-button v-if="uiControl.dialogType === 'MAINTENANCE'" type="primary" @click="maintenance">{{ t('fields.confirm') }}</el-button>
        <el-button v-if="uiControl.dialogType === 'ALIAS'" type="primary" @click="updatePlatformAlias">{{ t('fields.confirm') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getSitePlatformList,
  updateStatus,
  updateMaintenance,
  updateAlias
} from '../../../api/site-platform'
import { getSiteListSimple } from '../../../api/site'
import { getPlatformNames } from '../../../api/platform'
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { ElMessage } from 'element-plus';
import { required } from '../../../utils/validate';
import { hasRole, hasPermission } from '../../../utils/util'

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const formRef = ref(null);

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'MAINTENANCE'
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  platformId: null,
})

const form = reactive({
  id: null,
  underMaintenance: null,
  maintenanceTime: [],
  alias: null
})

const sites = reactive({
  list: [],
})

const platforms = reactive({
  list: [],
})

const formRules = reactive({
  maintenanceTime: [required(t('message.validateMaintenanceTimeRequired'))],
  alias: [required(t('message.validateAliasRequired'))]
})

function resetQuery() {
  request.siteId = site.value ? site.value.id : null
  request.platformId = null
}

async function loadSitePlatform() {
  page.loading = true
  const { data: ret } = await getSitePlatformList(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  sites.list = ret
}

async function loadPlatforms() {
  const { data: ret } = await getPlatformNames()
  platforms.list = ret
}

function changePage(page) {
  request.current = page
  loadSitePlatform()
}

async function updateState(id, status) {
  await updateStatus(id, status);
  await loadSitePlatform();
}

async function updatePlatformAlias() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await updateAlias(form.id, form.alias);
      uiControl.dialogVisible = false;
      await loadSitePlatform();
      ElMessage({ message: t('message.updateSuccess'), type: 'success' })
    }
  })
}

function showDialog(type) {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  if (type === 'MAINTENANCE') {
    uiControl.dialogTitle = t('fields.updateMaintenanceTime')
  } else if (type === 'ALIAS') {
    uiControl.dialogTitle = t('fields.updateAlias')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function updateUnderMaintenance(id, underMaintenance) {
  form.id = id
  form.underMaintenance = underMaintenance;
  if (underMaintenance) {
    showDialog("MAINTENANCE");
  } else {
    const formSubmit = {};
    formSubmit.underMaintenance = underMaintenance;
    await updateMaintenance(id, formSubmit);
    await loadSitePlatform();
    ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  }
}

async function maintenance() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const formSubmit = {};
      formSubmit.underMaintenance = form.underMaintenance;
      if (form.maintenanceTime && form.maintenanceTime.length === 2) {
        formSubmit.maintenanceStartTime = form.maintenanceTime[0];
        formSubmit.maintenanceEndTime = form.maintenanceTime[1];
      }

      await updateMaintenance(form.id, formSubmit);
      uiControl.dialogVisible = false;
      await loadSitePlatform();
      ElMessage({ message: t('message.updateSuccess'), type: 'success' })
    }
  })
}

async function showEdit(row) {
  form.id = row.id;
  showDialog('ALIAS');
}

onMounted(async() => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadSitePlatform()
  await loadPlatforms()
})
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
