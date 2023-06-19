<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.selectedDateType"
          size="small"
          :placeholder="t('fields.dateType')"
          class="filter-item"
          style="width: 180px"
          @change="updateDateType"
        >
          <el-option
            v-for="item in uiControl.selectedDateType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-if="request.selectedDateType === 0"
          v-model="request.depositDate"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px;margin-left: 5px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-date-picker
          v-else
          v-model="request.finishDate"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px;margin-left: 5px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="request.loginName" style="width: 200px; margin-left: 10px" size="small" maxlength="50"
                  :placeholder="t('fields.loginName')"
        />
        <el-input v-model="request.serialNumber" style="width: 300px; margin-left: 10px" size="small" maxlength="50"
                  :placeholder="t('fields.serialNo')"
        />
        <el-input v-model="request.thirdSerialNumber" style="width: 300px; margin-left: 10px" size="small"
                  maxlength="50" :placeholder="t('fields.thirdSerialNo')"
        />
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left:10px"
          default-first-option
          @focus="loadSites"
          @change="changeSite"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRecord()">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>

      <div class="btn-group">
        <el-button
          icon="el-icon-download"
          size="mini"
          type="primary"
          v-permission="['sys:deposit:export']"
          @click="exportExcel"
        >{{ t('fields.exportToExcel') }}
        </el-button>

        <el-button icon="el-icon-search" size="mini" type="primary" v-permission="['sys:deposit:list:advanced']" @click="showDialog('SEARCH')">
          {{ t('fields.advancedSearch') }}
        </el-button>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="600"
        size="small"
        :resizable="true"
        :data="page.records"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column prop="serialNumber" :label="t('fields.serialNo')" align="center" min-width="210" />
        <el-table-column prop="thirdSerialNumber" :label="t('fields.thirdSerialNo')" align="center" min-width="210" />
        <el-table-column prop="cardAccount" :label="t('fields.thirdParty')" align="center" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.cardAccount === null">-</span>
            <span v-if="scope.row.cardAccount !== null">{{ scope.row.cardAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="100">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link v-if="scope.row.memberType === 'AFFILIATE'" :to="`/affiliate/details/${scope.row.memberId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
            <router-link v-else :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="financial" :label="t('fields.financialLevel')" align="center" min-width="110" />
        <el-table-column prop="depositAmount" :label="t('fields.depositAmount')" align="center" min-width="120">
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.depositAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="depositDate" :label="t('fields.depositDate')" align="center" min-width="150" />
        <el-table-column prop="finishDate" :label="t('fields.finishDate')" align="center" min-width="150" />
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="110">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'SUCCESS' || scope.row.status === 'SUPPLEMENT_SUCCESS'" type="success">
              {{ t('depositStatus.' + scope.row.status) }}
            </el-tag>
            <el-tag v-if="scope.row.status === 'CLOSED'" type="danger">{{ t('depositStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-if="scope.row.status === 'PENDING'">{{ t('depositStatus.' + scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentType" :label="t('fields.paymentType')" align="center" min-width="110" />
        <el-table-column prop="privilegesName" :label="t('fields.privilege')" align="center" min-width="110">
          <template #default="scope">
            <span v-if="scope.row.privilegesName === null">-</span>
            <span v-if="scope.row.privilegesName !== null">{{ scope.row.privilegesName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="vip" :label="t('fields.vipLevel')" align="center" min-width="80">
          <template #default="scope">
            <span v-if="scope.row.vip === null">-</span>
            <span v-if="scope.row.vip !== null">{{ scope.row.vip }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="currency" :label="t('fields.currency')" align="center" min-width="80" />
        <el-table-column prop="localCurrencyAmount" :label="t('fields.localCurrencyAmount')" align="center" min-width="180">
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.localCurrencyAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="currencyRate" :label="t('fields.currencyRate')" align="center" min-width="100" />
        <el-table-column prop="clientType" :label="t('fields.clientType')" align="center" min-width="110" />
        <el-table-column prop="memberType" :label="t('fields.memberType')" align="center" min-width="110" />
        <el-table-column prop="updateBy" :label="t('fields.updateBy')" align="center" min-width="110">
          <template #default="scope">
            <span v-if="scope.row.updateBy === null">-</span>
            <span v-if="scope.row.updateBy !== null">{{ scope.row.updateBy }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadRecord"
        @size-change="loadRecord"
      />
      <div class="table-footer" v-permission="['sys:deposit:summary']">
        <span>{{ t('fields.noOfDepositTimes') }}</span>
        <span style="margin-left: 10px">{{ page.total }}</span>
        <span style="margin-left: 30px">{{ t('fields.totalDepositAmount') }}</span>
        <span style="margin-left: 10px">$ </span>
        <span v-formatter="{data: page.totalAmount, type: 'money'}" />
      </div>
    </el-card>

    <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.progressBarVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
    >
      <el-progress :text-inside="true" :stroke-width="26" :percentage="exportPercentage"
                   :color="uiControl.colors" v-if="exportPercentage !== 100"
      />
      <el-result
        icon="success"
        :title="t('fields.successfullyExport')"
        v-if="exportPercentage === 100"
      />
      <div class="dialog-footer">
        <el-button type="primary" :disabled="exportPercentage !== 100"
                   @click="uiControl.progressBarVisible = false"
        >{{ t('fields.done') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="800px">
      <el-form v-if="uiControl.dialogType === 'SEARCH'" ref="searchForm" :model="request" :rules="searchFormRule"
               :inline="true" size="small" label-width="150px"
      >
        <el-form-item v-if="request.selectedDateType === 0" :label="t('fields.depositDate')" prop="depositDate">
          <el-date-picker
            v-model="request.depositDate"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="small"
            type="daterange"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            style="width: 560px"
            :shortcuts="shortcuts"
            :disabled-date="disabledDate"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item v-else :label="t('fields.finishDate')" prop="finishDate">
          <el-date-picker
            v-model="request.finishDate"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="small"
            type="daterange"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            style="width: 560px"
            :shortcuts="shortcuts"
            :disabled-date="disabledDate"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item :label="t('fields.serialNo')" prop="serialNumber">
          <el-input v-model="request.serialNumber" style="width: 560px" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input v-model="request.loginName" style="width: 200px" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-select
            clearable
            v-model="request.status"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="width: 200px"
          >
            <el-option
              v-for="item in uiControl.status"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.financialLevel')" prop="financialId">
          <el-select
            v-model="request.financialId"
            size="small"
            :placeholder="t('fields.financialLevel')"
            class="filter-item"
            style="width: 200px;"
            default-first-option
            @focus="loadFinancialLevels"
          >
            <el-option
              v-for="item in financialList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.vipLevel')" prop="vipId">
          <el-select
            v-model="request.vipId"
            size="small"
            :placeholder="t('fields.vipLevel')"
            class="filter-item"
            style="width: 200px;"
            default-first-option
            @focus="loadVips"
          >
            <el-option
              v-for="item in vipList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.privilege')" prop="privilegeName">
          <el-select
            v-model="request.privilegeName"
            size="small"
            :placeholder="t('fields.privilege')"
            class="filter-item"
            style="width: 200px"
            default-first-option
          >
            <el-option
              v-for="item in priviList.list"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.accountHolder')" prop="cardAccount">
          <el-input v-model="request.cardAccount" style="width: 200px" maxlength="20" />
        </el-form-item>
        <el-form-item :label="t('fields.depositAmount')" prop="depositAmount">
          <el-input v-model="request.minDepositAmount" style="width: 265px; margin-right: 10px;" maxlength="10" />
          -
          <el-input v-model="request.maxDepositAmount" style="width: 265px; margin-left: 10px;" maxlength="10" />
        </el-form-item>
        <el-form-item :label="t('fields.paymentType')" prop="paymentType">
          <el-select
            v-model="request.paymentType"
            size="small"
            :placeholder="t('fields.paymentType')"
            class="filter-item"
            style="width: 200px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.payType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.clientType')" prop="clientType">
          <el-select
            v-model="request.clientType"
            size="small"
            :placeholder="t('fields.clientType')"
            class="filter-item"
            style="width: 200px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.clientType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.transactionTime')" prop="transactionTime">
          <el-select
            v-model="request.transactionTime"
            size="small"
            :placeholder="t('fields.transactionTime')"
            class="filter-item"
            style="width: 200px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.timeList"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.thirdPartyName')" prop="thirdPartyName">
          <el-select
            v-model="request.thirdPartyName"
            size="small"
            :placeholder="t('fields.thirdPartyName')"
            class="filter-item"
            style="width: 200px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.thirdPartyNameList"
              :key="item.paymentName"
              :label="item.paymentName"
              :value="item.paymentName"
            />
          </el-select>
        </el-form-item>

        <div class="dialog-footer">
          <el-button @click="resetQuery()">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="advancedSearch()">{{ t('fields.search') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { getVipList } from '../../../api/vip';
import { getFinancialLevels } from '../../../api/financial-level';
import { getDepositRecord, getTotalDepositAmount } from '../../../api/member-deposit-record';
import { getSystemPaymentListForDeposit } from '../../../api/system-payment';
import { hasPermission } from '../../../utils/util';
import { useStore } from '../../../store'
import { getAllPrivilegeInfo, getAllPrivilegeInfoBySiteId } from '../../../api/privilege-info';
import { useI18n } from "vue-i18n";
import { TENANT } from "../../../store/modules/user/action-types";
import { getSiteListSimple } from "../../../api/site";

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)
const siteId = ref(null);
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const searchForm = ref(null);
const vipList = reactive({
  list: []
});
const financialList = reactive({
  list: []
});
const priviList = reactive({
  list: []
});

const siteList = reactive({
  list: []
});

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date();
      const start = new Date();
      return [start, end];
    }
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'days').format('x'));
      end.setTime(moment(end).subtract(1, 'days').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('week').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'weeks').startOf('week').format('x'));
      end.setTime(moment(end).subtract(1, 'weeks').endOf('week').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('month').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'months').startOf('month').format('x'));
      end.setTime(moment(end).subtract(1, 'months').endOf('month').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.last3Months'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(2, 'months').startOf('month').format('x'));
      return [start, end];
    }
  }
];

const uiControl = reactive({
  dialogVisible: false,
  progressBarVisible: false,
  dialogTitle: "",
  dialogType: "SEARCH",
  status: [
    { key: 1, displayName: t('depositStatus.PENDING'), value: "PENDING" },
    { key: 2, displayName: t('depositStatus.SUCCESS'), value: "SUCCESS" },
    { key: 3, displayName: t('depositStatus.SUPPLEMENT_SUCCESS'), value: "SUPPLEMENT_SUCCESS" },
    { key: 4, displayName: t('depositStatus.CLOSED'), value: "CLOSED" }
  ],
  payType: [
    { key: 1, displayName: "BANK", value: "BANK" },
    { key: 2, displayName: "OFFLINE", value: "OFFLINE" }
  ],
  clientType: [
    { key: 1, displayName: "WEB", value: "WEB" },
    { key: 2, displayName: "H5", value: "H5" },
    { key: 3, displayName: "IOS", value: "IOS" },
    { key: 4, displayName: "ANDROID", value: "ANDROID" }
  ],
  timeList: [
    { key: 0, displayName: "ALL", value: "0" },
    { key: 1, displayName: "Within 1 minute", value: "60" },
    { key: 2, displayName: "Within 5 minutes", value: "300" },
    { key: 3, displayName: "Within 10 minutes", value: "600" },
    { key: 4, displayName: "Within 15 minutes", value: "900" },
    { key: 5, displayName: "Within 20 minutes", value: "1200" },
    { key: 6, displayName: "Within 25 minutes", value: "1500" },
    { key: 7, displayName: "Within 30 minutes", value: "1800" },
    { key: 8, displayName: "Within 35 minutes", value: "2100" },
    { key: 9, displayName: "Within 40 minutes", value: "2400" },
    { key: 10, displayName: "Within 45 minutes", value: "2700" },
    { key: 11, displayName: "Within 50 minutes", value: "3000" },
    { key: 12, displayName: "Within 55 minutes", value: "3300" },
    { key: 13, displayName: "Within 60 minutes", value: "3600" }
  ],
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 }
  ],
  selectedDateType: [
    { key: 0, displayName: t('dateType.depositDate'), value: 0 },
    { key: 1, displayName: t('dateType.finishDate'), value: 1 },
  ]
});

const startDate = new Date();
startDate.setDate(startDate.getDate() - 2);
const defaultStartDate = convertDate(startDate);
const defaultEndDate = convertDate(new Date());

const exportPercentage = ref(0);

const EXPORT_HEADER = ['ID', 'Serial Number', 'Third Serial Number', 'Third Party', 'Login Name', 'Member Type', 'Financial Level', 'VIP Level',
  'Deposit Amount', 'Currency', 'Local Currency Amount', 'Currency Rate', 'Deposit Date', 'Finish Date', 'Status', 'Privilege', 'Payment Type',
  'Client Type', 'Update By'];

const request = reactive({
  size: 20,
  current: 1,
  selectedDateType: uiControl.selectedDateType[0].value,
  depositDate: [defaultStartDate, defaultEndDate],
  finishDate: [],
  status: null,
  serialNumber: null,
  loginName: null,
  thirdSerialNumber: null,
  financialId: null,
  vipId: null,
  privilegeName: null,
  minDepositAmount: null,
  maxDepositAmount: null,
  cardAccount: null,
  transactionTime: uiControl.timeList[0].value,
  thirdPartyName: null,
  siteId: null
});

const validateDepositAmount = (rule, value, callback) => {
  if (request.maxDepositAmount !== null && request.maxDepositAmount - request.minDepositAmount < 0) {
    callback(new Error(t('message.maxGreaterThanMin')));
  }
  callback();
};

const searchFormRule = reactive({
  depositAmount: [{ validator: validateDepositAmount, trigger: "blur" }]
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

function resetQuery() {
  if (searchForm.value) {
    searchForm.value.resetFields();
  }
  request.selectedDateType = uiControl.selectedDateType[0].value;
  request.depositDate = [defaultStartDate, defaultEndDate];
  request.finishDate = [];
  request.status = null;
  request.serialNumber = null;
  request.loginName = null;
  request.thirdSerialNumber = null;
  request.financialId = financialList.list[0].id;
  request.vipId = vipList.list[0].id;
  request.privilegeName = null;
  request.minDepositAmount = null;
  request.maxDepositAmount = null;
  request.cardAccount = null;
  request.thirdPartyName = uiControl.thirdPartyNameList[0].paymentName;
  request.transactionTime = uiControl.timeList[0].value;
  uiControl.dialogVisible = false;
  request.siteId = siteList.list[0].id;
};

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  totalAmount: 0
});

async function loadVips() {
  const { data: vip } = await getVipList();
  vipList.list = vip;
  vipList.list.unshift({
    id: 0,
    name: "ALL"
  });

  if (!request.vipId) {
    request.vipId = vipList.list[0].id;
  }
};

async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels({ siteId: siteId.value });
  financialList.list = financial;
  financialList.list.unshift({
    id: 0,
    name: "ALL"
  });

  if (!request.financialId) {
    request.financialId = financialList.list[0].id;
  }
};

async function loadPrivilegeInfos(siteId) {
  if (siteId) {
    const { data: privilegeInfo } = await getAllPrivilegeInfoBySiteId(siteId);
    priviList.list = privilegeInfo;
  } else {
    const { data: privilegeInfo } = await getAllPrivilegeInfo();
    priviList.list = privilegeInfo;
  }
}

async function advancedSearch() {
  searchForm.value.validate(async (valid) => {
    if (valid) {
      await loadRecord();
    }
  });
};

function updateDateType() {
  if (request.selectedDateType === 0) {
    request.depositDate = [defaultStartDate, defaultEndDate];
    request.finishDate = [];
  } else {
    request.finishDate = [defaultStartDate, defaultEndDate];
    request.depositDate = [];
  }
}

function checkQuery() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.depositDate !== null) {
    if (request.depositDate.length === 2) {
      query.depositDate = request.depositDate.join(",");
    }
  }

  if (request.finishDate !== null) {
    if (request.finishDate.length === 2) {
      query.finishDate = request.finishDate.join(",");
    }
  }

  if (request.transactionTime === "0") {
    query.transactionTime = null;
  }

  if (request.thirdPartyName === "ALL") {
    query.thirdPartyName = null;
  }
  return query;
}

async function loadRecord() {
  uiControl.dialogVisible = false;
  page.loading = true;

  const query = checkQuery();
  const { data: ret } = await getDepositRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  if (page.records.length !== 0) {
    const { data: amount } = await getTotalDepositAmount(query);
    page.totalAmount = amount;
  } else {
    page.totalAmount = 0;
  }
  page.loading = false;
};

async function showDialog(type) {
  if (type === "SEARCH") {
    uiControl.dialogTitle = t('fields.advancedSearch');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
};

async function exportExcel() {
  uiControl.progressBarVisible = true;
  const query = checkQuery();
  const { data: ret } = await getDepositRecord(query);
  const exportData = [EXPORT_HEADER];
  const maxLength = [];

  pushRecordToData(ret.records, exportData);
  exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  query.current = ret.current;

  while (query.current < ret.pages) {
    query.current += 1;
    const { data: ret } = await getDepositRecord(query);
    pushRecordToData(ret.records, exportData);
    exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  }
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  exportData.map(data => {
    Object.keys(data).map(key => {
      const value = data[key];

      maxLength[key] = typeof value === 'number'
        ? (maxLength[key] >= 10 ? maxLength[key] : 10)
        : (maxLength[key] >= value.length + 2 ? maxLength[key] : value.length + 2);
    });
  });
  const wsCols = maxLength.map(w => { return { width: w } });
  ws['!cols'] = wsCols;
  const wb = XLSX.utils.book_new();
  wb.SheetNames.push('Deposit_Record');
  wb.Sheets.Deposit_Record = ws;
  XLSX.writeFile(wb, "deposit_record.xlsx");
  exportPercentage.value = 100;
}

function pushRecordToData(records, exportData) {
  records.forEach(item => {
    delete item.memberId;
    delete item.thirdParty
  })
  const data = records.map(record => Object.values(record).map(item => !item || item === '' ? '-' : item));
  exportData.push(...data);
}

async function loadThirdParty() {
  const { data: ret } = await getSystemPaymentListForDeposit()
  uiControl.thirdPartyNameList = ret.records
  uiControl.thirdPartyNameList.unshift({
    id: 0,
    paymentName: "ALL"
  });

  if (!request.thirdPartyName) {
    request.thirdPartyName = uiControl.thirdPartyNameList[0].paymentName;
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  if (LOGIN_USER_SITEID.value != null) {
    siteId.value = LOGIN_USER_SITEID.value
    loadPrivilegeInfos(siteId.value);
  } else {
    loadPrivilegeInfos();
  }
  loadFinancialLevels();
  loadVips();
  loadRecord();
  loadThirdParty();
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
  display: inline-flex;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}
</style>
