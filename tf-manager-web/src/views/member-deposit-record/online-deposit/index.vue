<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.depositDate"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px;margin-left: 5px;display: none"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>

        <!-- <el-select
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
        </el-select> -->
        <el-input v-model="request.loginName" style="width: 200px; margin-left: 10px" size="small" maxlength="50" :placeholder="t('fields.loginName')" />
        <el-input v-model="request.serialNumber" style="width: 300px; margin-left: 10px" size="small" maxlength="50" :placeholder="t('fields.serialNo')" />
        <el-input v-model="request.thirdSerialNumber" style="width: 300px; margin-left: 10px" size="small" maxlength="50" :placeholder="t('fields.thirdSerialNo')" />
        <el-select
          v-model="request.sort"
          size="small"
          :placeholder="t('fields.sorting')"
          class="filter-item"
          style="width: 210px;margin-left:10px"
        >
          <el-option
            v-for="item in uiControl.sortList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRecord()" :disabled="page.loading">
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>
    <div>
      <span style="font-size: small;margin-top: 10px;margin-right:10px">
        {{ t('fields.historyRecord') }}
      </span>
      <el-switch
        v-model="request.doris"
      />
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
        <el-table-column v-permission="['sys:deposit:column:third']" prop="cardAccount" :label="t('fields.thirdParty')" align="center" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.cardAccount === null">-</span>
            <span v-if="scope.row.cardAccount !== null">{{ scope.row.cardAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="100">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="realName" :label="t('fields.realName')" align="center" min-width="110">
          <template #default="scope">
            <span v-if="scope.row.realName === null">-</span>
            <span v-if="scope.row.realName !== null">
              {{ scope.row.realName.replace(/,/g, ' ') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="financial" :label="t('fields.financialLevel')" align="center" min-width="110">
          <template #default="scope">
            <span :style="{color: scope.row.financialColor}">{{ scope.row.financial }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="depositAmount" :label="t('fields.depositAmount')" align="center" min-width="120">
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.depositAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="depositDate" :label="t('fields.depositDate')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.depositDate === null">-</span>
            <span
              v-if="scope.row.depositDate !== null"
              v-formatter="{data: scope.row.depositDate, timeZone: timeZone, type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="finishDate" :label="t('fields.finishDate')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.finishDate === null">-</span>
            <span
              v-if="scope.row.finishDate !== null"
              v-formatter="{data: scope.row.finishDate, timeZone: timeZone, type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="110">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'SUCCESS' || scope.row.status === 'SUPPLEMENT_SUCCESS'" type="success">{{ t('depositStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-if="scope.row.status === 'CLOSED'" type="danger">{{ t('depositStatus.' + scope.row.status) }}</el-tag>
            <el-tag v-if="scope.row.status === 'PENDING'">{{ t('depositStatus.' + scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="request.siteId !== 5" prop="localCurrencyAmount" :label="t('fields.localCurrencyAmount')" align="center" min-width="180">
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.localCurrencyAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column v-if="request.siteId !== 5" prop="currencyRate" :label="t('fields.currencyRate')" align="center" min-width="100" />
        <el-table-column v-if="request.siteId !== 5" prop="paymentType" :label="t('fields.paymentType')" align="center" min-width="110" />
        <el-table-column prop="privilegesName" :label="t('fields.privilege')" align="center" min-width="110">
          <template #default="scope">
            <span v-if="scope.row.privilegesName === null">-</span>
            <span v-if="scope.row.privilegesName !== null">{{ scope.row.privilegesName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="vip" :label="t('fields.vipLevel')" align="center" min-width="80" />
        <el-table-column prop="currency" :label="t('fields.currency')" align="center" min-width="80" />

        <el-table-column prop="clientType" :label="t('fields.clientType')" align="center" min-width="110" />
        <el-table-column prop="walletType" :label="t('fields.walletType')" align="center" min-width="110" />
        <el-table-column prop="updateBy" :label="t('fields.updateBy')" align="center" min-width="110">
          <template #default="scope">
            <span v-if="scope.row.updateBy === null">-</span>
            <span v-if="scope.row.updateBy !== null">{{ scope.row.updateBy }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          min-width="300"
          fixed="right"
          v-if="hasPermission(['sys:deposit:check'])"
        >
          <template #default="scope">
            <el-button :disabled="scope.row.status !== 'PENDING'" size="mini" type="primary" v-permission="['sys:deposit:check']" @click="showDialog('SUPPLEMENT',scope.row)">{{ t('fields.supplement') }}</el-button>
            <el-button :disabled="scope.row.status !== 'PENDING'" size="mini" type="danger" v-permission="['sys:deposit:check']" @click="showDialog('CANCEL',scope.row)">{{ t('fields.cancel') }}</el-button>
            <el-button :disabled="scope.row.status !== 'PENDING' || scope.row.paymentType !== 'OFFLINE'" size="mini" type="success" v-permission="['sys:deposit:edit-amount']" @click="showDialog('EDIT_AMOUNT',scope.row)">{{ t('fields.edit') }}</el-button>
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
      <div class="table-footer" v-permission="['sys:onlinedeposit:summary']">
        <span>{{ t('fields.noOfDepositTimes') }}</span>
        <span style="margin-left: 10px">{{ page.total }}</span>
        <span style="margin-left: 30px">{{ t('fields.totalDepositAmount') }}</span>
        <span style="margin-left: 10px">$ </span>
        <span v-formatter="{data: page.totalAmount, type: 'money'}" />
      </div>
    </el-card>

    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form v-if="uiControl.dialogType === 'SUPPLEMENT'" ref="supplementForm" :model="suppForm" :rules="suppFormRule" :inline="true" size="small" label-width="180px">
        <el-form-item :label="t('fields.depositAmount')">
          <el-input v-model="suppForm.depositAmount" style="width: 250px" maxlength="50" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.localCurrencyAmount')">
          <el-input v-model="suppForm.localCurrencyAmount" style="width: 250px" maxlength="50" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.currencyRate')">
          <el-input v-model="suppForm.currencyRate" style="width: 250px" maxlength="50" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.thirdSerialNo')" prop="thirdSerialNumber">
          <el-input v-model="suppForm.thirdSerialNumber" style="width: 250px" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.supplementAmount')" prop="supplementAmount" v-permission="['sys:onlinedeposit:supplement']">
          <el-input v-model="suppForm.supplementAmount" style="width: 250px" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input type="textarea" :rows="6" v-model="suppForm.remark" style="width: 250px" :maxlength="hasPermission(['sys:onlinedeposit:supplement']) ? 85 : 100" show-word-limit />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false;">{{ t('fields.cancel') }}</el-button>
          <el-button :disabled="clicked.deposit" type="primary" @click="deposit()">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'CANCEL'" ref="cancelDepositForm" :model="cancelForm" :rules="cancelFormRule" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.cancelRemark')" prop="remark">
          <el-input type="textarea" :rows="6" v-model="cancelForm.remark" style="width: 250px" maxlength="100" show-word-limit />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false;">{{ t('fields.cancel') }}</el-button>
          <el-button :disabled="clicked.cancel" type="primary" @click="cancel()">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'EDIT_AMOUNT'" ref="editAmountForm" :model="editForm" :rules="editFormRule" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.amount')" prop="amount">
          <el-input v-model="editForm.amount" type="money" style="width: 250px;" maxlength="11" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false;">{{ t('fields.cancel') }}</el-button>
          <el-button :disabled="clicked.cancel" type="primary" @click="editAmount()">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';

// import moment from 'moment';
import { cancelDeposit, getDepositRecord, supplementDeposit, editDeposit } from '../../../api/member-deposit-record';
import { required } from '../../../utils/validate';
import { hasPermission } from '../../../utils/util';
import { useI18n } from "vue-i18n";
import { TENANT } from "../../../store/modules/user/action-types";
import { getSiteListSimple } from "../../../api/site";
import { useStore } from '../../../store';
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"
const { t } = useI18n();
const supplementForm = ref(null);
const cancelDepositForm = ref(null);
const editAmountForm = ref(null);
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const clicked = reactive({
  deposit: false,
  cancel: false
});

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "SUPPLEMENT",
  status: [
    // 隐藏其他 status
    { key: 1, displayName: "PENDING", value: "PENDING" }
  ],
  sortList: [
    { label: t('fields.byDepositDateDesc'), value: 1 },
    { label: t('fields.byDepositDateAsc'), value: 2 },
  ],
});

const siteList = reactive({
  list: []
});
let timeZone = null;

const startDate = new Date();
startDate.setDate(startDate.getDate() - 3);
const defaultStartDate = convertDateToStart(startDate);
const defaultEndDate = convertDateToEnd(new Date());
const request = reactive({
  size: 20,
  current: 1,
  depositDate: [defaultStartDate, defaultEndDate],
  status: "PENDING",
  serialNumber: null,
  loginName: null,
  siteId: null,
  thirdSerialNumber: null,
  sort: 1,
  doris: false
});

const suppForm = reactive({
  id: null,
  depositDate: null,
  serialNumber: null,
  thirdSerialNumber: null,
  supplementAmount: null,
  remark: null,
  siteId: null,
  depositAmount: null,
  localCurrencyAmount: null,
  currencyRate: null
});

const cancelForm = reactive({
  id: null,
  depositDate: null,
  remark: null,
  siteId: null,
});

const editForm = reactive({
  id: null,
  amount: null,
  siteId: null,
})

const suppFormRule = reactive({
  thirdSerialNumber: [required(t('message.validateThirdSerialNumberRequired'))],
  remark: [required(t('message.validateRemarkRequired'))]
});

const cancelFormRule = reactive({
  remark: [required(t('message.validateRemarkRequired'))]
});

const editFormRule = reactive({
  amount: [required(t('message.valiedateAmountRequired'))]
});

// function disabledDate(time) {
//   return time.getTime() <= moment(new Date()).subtract(1, 'weeks').format('x') || time.getTime() > new Date().getTime();
// }

function resetQuery() {
  request.depositDate = [defaultStartDate, defaultEndDate];
  request.status = null;
  request.serialNumber = null;
  request.loginName = null;
  request.thirdSerialNumber = null;
  request.siteId = store.state.user.siteId
  request.sort = 1
};

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  totalAmount: 0
});

async function loadRecord() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  if (request.depositDate !== null) {
    if (request.depositDate.length === 2) {
      // if (isHistoryRecord(request.depositDate[0])) {
      //   request.doris = true;
      // }
      query.depositDate = JSON.parse(JSON.stringify(request.depositDate));
      query.depositDate[0] = formatInputTimeZone(query.depositDate[0], timeZone);
      query.depositDate[1] = formatInputTimeZone(query.depositDate[1], timeZone);
      query.depositDate = query.depositDate.join(',')
    }
  }
  const { data: ret } = await getDepositRecord(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  if (page.records.length !== 0) {
    page.totalAmount = ret.sums.depositAmount;
  } else {
    page.totalAmount = 0;
  }
  request.doris = ret.sums.useDoris;
  page.loading = false;
};

async function showDialog(type, row) {
  if (type === "SUPPLEMENT") {
    if (supplementForm.value) {
      supplementForm.value.resetFields();
    }
    suppForm.siteId = request.siteId;
    suppForm.id = row.id;
    suppForm.depositDate = row.depositDate;
    suppForm.serialNumber = row.serialNumber;
    suppForm.supplementAmount = Number(row.localCurrencyAmount).toFixed(2);
    suppForm.currencyRate = row.currencyRate;
    suppForm.depositAmount = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(Number(row.depositAmount));
    suppForm.localCurrencyAmount = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(Number(row.localCurrencyAmount));
    uiControl.dialogTitle = t('fields.supplementDeposit');
  } else if (type === "CANCEL") {
    if (cancelDepositForm.value) {
      cancelDepositForm.value.resetFields();
    }
    cancelForm.siteId = request.siteId;
    cancelForm.id = row.id;
    cancelForm.depositDate = row.depositDate;
    uiControl.dialogTitle = t('fields.cancelDeposit');
  } else if (type === "EDIT_AMOUNT") {
    if (editAmountForm.value) {
      editAmountForm.value.resetFields();
    }
    editForm.siteId = request.siteId;
    editForm.id = row.id;
    editForm.depositDate = row.depositDate;
    uiControl.dialogTitle = t('fields.editAmount');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
};

function deposit() {
  supplementForm.value.validate(async (valid) => {
    if (valid) {
      clicked.deposit = true;
      await supplementDeposit(suppForm);
      uiControl.dialogVisible = false;
      clicked.deposit = false;
      await loadRecord();
      ElMessage({ message: t('message.depositSuccess'), type: "success" });
    }
  });
}

function cancel() {
  cancelDepositForm.value.validate(async (valid) => {
    if (valid) {
      clicked.cancel = true;
      await cancelDeposit(cancelForm);
      uiControl.dialogVisible = false;
      clicked.cancel = false;
      await loadRecord();
      ElMessage({ message: t('fields.cancelDepositSuccess'), type: "success" });
    }
  });
}

function editAmount() {
  editAmountForm.value.validate(async (valid) => {
    if (valid) {
      clicked.edit = true;
      await editDeposit(editForm);
      uiControl.dialogVisible = false;
      clicked.edit = false;
      await loadRecord();
      ElMessage({ message: t('fields.editAmountSuccess'), type: "success" });
    }
  });
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

onMounted(async() => {
  await loadSites();
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  loadRecord();
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
</style>
