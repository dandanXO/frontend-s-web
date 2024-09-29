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
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.affiliateName"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.affiliateName')"
        />
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 250px"
          :editable="false"
          :clearable="false"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadDummyRecord">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:affiliate-dummy:add']"
          @click="showDialog('CREATE')"
          v-if="!hasRole(['SUB_TENANT'])"
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
      <el-table-column prop="recordTime" :label="t('fields.recordTime')" min-width="150">
        <template #default="scope">
          <span v-if="scope.row.recordTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-else
            v-formatter="{
              data: scope.row.recordTime,
              formatter: 'YYYY-MM-DD',
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="150" />
      <el-table-column prop="affiliateName" :label="t('fields.affiliateName')" min-width="150" />
      <el-table-column prop="affiliateCode" :label="t('fields.affiliateCode')" min-width="120" />
      <el-table-column prop="depositAmount" :label="t('fields.depositAmount')" align="center" min-width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.depositAmount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="withdrawAmount" :label="t('fields.withdrawAmount')" align="center" min-width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.withdrawAmount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="bonus" :label="t('fields.bonus')" align="center" min-width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="adjustment" :label="t('fields.adjustment')" align="center" min-width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.adjustment, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="bet" :label="t('fields.betAmount')" align="center" min-width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bet, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="validBet" :label="t('fields.validBet')" align="center" min-width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.validBet, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="payout" :label="t('fields.payout')" align="center" min-width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.payout, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="rebateAmount" :label="t('fields.rebateAmount')" align="center" min-width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.rebateAmount, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        :label="t('fields.operate')"
        align="center"
        width="250"
        v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:affiliate-dummy:update']) || hasPermission(['sys:affiliate-dummy:del']))"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:affiliate-dummy:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:affiliate-dummy:del']"
            @click="removeRecord(scope.row)"
          />
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
      @current-change="loadDummyRecord"
      @size-change="loadDummyRecord"
    />
  </div>
  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="1200px"
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
      <el-form-item :label="t('fields.recordTime')" prop="recordTime">
        <el-date-picker
          v-model="form.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="date"
          :placeholder="t('fields.recordTime')"
          style="width: 350px"
          :editable="false"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item :label="t('fields.site')" prop="siteId" v-if="!hasRole(['TENANT'])">
        <el-select
          v-model="form.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 350px;"
          default-first-option
          @focus="loadSites"
          :disabled="uiControl.dialogType === 'EDIT'"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.loginName')" prop="loginName">
        <el-input v-model="form.loginName" style="width: 350px;" maxlength="50" :disabled="uiControl.dialogType === 'EDIT'" />
      </el-form-item>
      <el-form-item :label="t('fields.affiliateName')" prop="affiliateName" v-if="uiControl.dialogType === 'EDIT'">
        <el-input v-model="form.affiliateName" style="width: 350px;" maxlength="50" :disabled="uiControl.dialogType === 'EDIT'" />
      </el-form-item>
      <el-form-item :label="t('fields.depositAmount')" prop="depositAmount">
        <el-input v-model="form.depositAmount" style="width: 350px" maxlength="11" @keypress="restrictDecimalInput($event, 'depositAmount')" />
      </el-form-item>
      <el-form-item :label="t('fields.withdrawAmount')" prop="withdrawAmount">
        <el-input v-model="form.withdrawAmount" style="width: 350px" maxlength="11" @keypress="restrictDecimalInput($event, 'withdrawAmount')" />
      </el-form-item>
      <el-form-item :label="t('fields.bonus')" prop="bonus">
        <el-input v-model="form.bonus" style="width: 350px" maxlength="11" @keypress="restrictDecimalInput($event, 'bonus')" />
      </el-form-item>
      <el-form-item :label="t('fields.adjustment')" prop="adjustment">
        <el-input v-model="form.adjustment" style="width: 350px" maxlength="11" @keypress="restrictDecimalInput($event, 'adjustment')" />
      </el-form-item>
      <el-form-item :label="t('fields.rebateAmount')" prop="rebateAmount">
        <el-input v-model="form.rebateAmount" style="width: 350px" maxlength="11" @keypress="restrictDecimalInput($event, 'rebateAmount')" />
      </el-form-item>
      <el-form-item :label="t('fields.platformDetails')" prop="platforms">
        <div v-for="(item, index) in platformsParam" :key="index">
          <el-row>
            <span class="param-label">{{ t('fields.platform') }}:</span>
            <el-select
              v-model="item.platform"
              size="small"
              :placeholder="t('fields.platform')"
              class="param-input"
              style="margin-left: 5px; width: 200px;"
            >
              <el-option
                v-for="item in platform.list"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-row>

          <span class="param-label">{{ t('fields.betAmount') }}:</span>
          <el-input class="param-input" v-model="item.bet" />

          <span class="param-label">{{ t('fields.validBet') }}:</span>
          <el-input class="param-input" v-model="item.validBet" />

          <span class="param-label">{{ t('fields.payout') }}:</span>
          <el-input class="param-input" v-model="item.payout" />
          
          <el-button v-if="index === platformsParam.length - 1" icon="el-icon-plus" size="mini" type="primary"
                     @click="addParam()" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-if="platformsParam.length > 0" icon="el-icon-remove" size="mini" type="danger"
                     @click="delParam(index)" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
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
import { getSiteListSimple } from "@/api/site";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getDummyRecords, getPlatformDummyRecords, createDummyRecord, updateDummyRecord, deleteDummyRecord } from "@/api/affiliate-dummy";
import { getPlatformsBySite } from '@/api/platform';
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { hasRole, hasPermission } from '@/utils/util'
import moment from 'moment';

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const formRef = ref(null);
const site = ref(null);
const platformsParam = ref([]);

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

const defaultDate = convertDate(new Date());

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true
});

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  loginName: null,
  affiliateName: null,
  recordTime: [defaultDate, defaultDate]
});

const sites = reactive({
  list: []
});

const platform = reactive({
  list: []
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const form = reactive({
  recordTime: defaultDate,
  siteId: null,
  memberId: null,
  loginName: null,
  affiliateId: null,
  affiliateName: null,
  depositAmount: 0,
  withdrawAmount: 0,
  bonus: 0,
  adjustment: 0,
  bet: 0,
  validBet: 0,
  payout: 0,
  rebateAmount: 0,
  platforms: null
});

const validatePlatforms = (rule, value, callback) => {
  const param = JSON.parse(constructParam())
  if (param.platforms[0].platform && (!param.platforms[0].bet || !param.platforms[0].validBet || !param.platforms[0].payout)) {
    callback(new Error(t('message.validatePlatformDetailsRequired')))
  }

  const platforms = param.platforms.map(p => p.platform);
  platforms.forEach(platform => {
    if (platforms.indexOf(platform) !== platforms.lastIndexOf(platform)) {
      callback(new Error(t('message.validatePlatformSelected')))
    }
  })
  callback()
}

const formRules = reactive({
  recordTime: [required(t('message.validateRecordTimeRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  loginName: [required(t('message.validateLoginNameRequired'))],
  depositAmount: [required(t('message.validateDepositAmountRequired'))],
  withdrawAmount: [required(t('message.validateWithdrawAmountRequired'))],
  bonus: [required(t('message.validateBonusRequired'))],
  adjustment: [required(t('message.validateAdjustmentRequired'))],
  rebateAmount: [required(t('message.validateRebateAmountRequired'))],
  platforms: [{ validator: validatePlatforms, trigger: 'blur' }]
});

async function loadDummyRecord() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });

  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  const { data: ret } = await getDummyRecords(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

async function loadPlatformDummyRecord(query) {
  platformsParam.value = []
  const { data: ret } = await getPlatformDummyRecords(query);
  nextTick(() => {
    if (ret) {
      ret.forEach(obj => {
        const json = {}
        Object.entries(obj).forEach(([key, value]) => {
          json[key] = value;
        })
        platformsParam.value.push(json)
      })
    }
  })
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

async function loadPlatform() {
  const { data: ret } = await getPlatformsBySite(site.value.id);
  platform.list = ret;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.loginName = null;
  request.affiliateName = null;
  request.recordTime = [defaultDate, defaultDate];
}

function restrictDecimalInput(event, field) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (form[field] !== null && form[field].toString().indexOf('.') > -1) {
    if (charCode === 46) {
      event.preventDefault()
    }
  }
}

function showDialog(type) {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  if (type === 'CREATE') {
    form.siteId = request.siteId;
    uiControl.dialogTitle = t('fields.add');
    if (platformsParam.value.length === 0) {
      addParam()
    }
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.edit');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

async function showEdit(record) {
  showDialog('EDIT');
  nextTick(() => {
    for (const key in record) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = record[key];
      }
    }
  });
  await loadPlatformDummyRecord();
  addParam();
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create();
  } else if (uiControl.dialogType === 'EDIT') {
    edit();
  }
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const platformJson = [];
      Object.values(platformsParam.value).forEach((item) => {
        if (item && item.platform) {
          platformJson.push(item);
        }
      });
      form.platforms = JSON.stringify(platformJson);
      await createDummyRecord(form);
      uiControl.dialogVisible = false;
      await loadDummyRecord();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const platformJson = [];
      Object.values(platformsParam.value).forEach((item) => {
        if (item && item.platform) {
          platformJson.push(item);
        }
      });
      form.platforms = JSON.stringify(platformJson);
      await updateDummyRecord(form);
      uiControl.dialogVisible = false;
      await loadDummyRecord();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
}

async function removeRecord(record) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteDummyRecord(record)
    await loadDummyRecord()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function addParam() {
  platformsParam.value.push({
    platform: null,
    bet: null,
    validBet: null,
    payout: null
  })
}

function delParam(index) {
  platformsParam.value.splice(index, 1);
  if (platformsParam.value.length === 0) {
    addParam()
  }
}

function constructParam() {
  const json = {};
  const platformJson = [];
  Object.values(platformsParam.value).forEach((item) => {
    if (item) {
      platformJson.push(item);
    }
  });

  json.platforms = platformJson;
  return JSON.stringify(json);
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadPlatform();
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

.param-input {
  width: 170px;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 15px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}
</style>
