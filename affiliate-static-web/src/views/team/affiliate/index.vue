<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.downlineAffiliate') }}</span>
        </div>
      </template>
      <div class="inputs-wrap">
        <el-date-picker
          v-model="request.regTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          class="input-small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input class="input-small" v-model="request.loginName" maxlength="50" :placeholder="t('fields.loginName')" />
        <div class="grp-btn">
          <el-button icon="el-icon-search" type="primary" @click="loadDownlineAffiliates()" size="mini">
            {{ $t('fields.search') }}
          </el-button>
          <el-button size="mini" type="warning" @click="resetQuery()">
            {{ $t('fields.reset') }}
          </el-button>
        </div>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          @click="showDialog('CREATE')"
        >
          {{ $t('fields.add') }}
        </el-button>
      </div>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="150" />
        <el-table-column prop="affiliateCode" :label="t('fields.affiliateCode')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">{{ scope.row.affiliateCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="affiliateLevel" :label="t('fields.affiliateLevel')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.affiliateLevel === null">-</span>
            <span v-if="scope.row.affiliateLevel !== null">{{ scope.row.affiliateLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="commission" :label="t('fields.commission')" align="center" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.commission === null">0 %</span>
            <span v-if="scope.row.commission !== null">{{ scope.row.commission * 100 }} %</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="revenueShare" :label="t('fields.revenueShare')" align="center" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.revenueShare === null">0 %</span>
            <span v-if="scope.row.revenueShare !== null">{{ scope.row.revenueShare * 100 }} %</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="downlineMember" :label="t('fields.totalDownlineMember')" align="center" min-width="160">
          <template #default="scope">
            <span v-if="scope.row.downlineMember === null">-</span>
            <span v-if="scope.row.downlineMember !== null">{{ scope.row.downlineMember }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="downlineAffiliate" :label="t('fields.totalDownlineAffiliate')" align="center" min-width="160">
          <template #default="scope">
            <span v-if="scope.row.downlineAffiliate === null">-</span>
            <span v-if="scope.row.downlineAffiliate !== null">{{ scope.row.downlineAffiliate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="affiliateStatus" :label="t('fields.affiliateStatus')" align="center" min-width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.affiliateStatus === 'APPLY'" size="mini">{{ scope.row.affiliateStatus }}</el-tag>
            <el-tag v-if="scope.row.affiliateStatus === 'NORMAL'" type="success" size="mini">{{ scope.row.affiliateStatus }}</el-tag>
            <el-tag v-if="scope.row.affiliateStatus === 'DISABLE'" type="danger" size="mini">{{ scope.row.affiliateStatus }}</el-tag>
            <el-tag v-if="scope.row.affiliateStatus === null" type="info" size="mini">-</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="site" :label="t('fields.site')" align="center" min-width="120" />
        <el-table-column prop="balance" :label="t('fields.balance')" align="center" min-width="120">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.balance,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="regTime" :label="t('fields.registerTime')" align="center" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.regTime === null">-</span>
            <span
              v-if="scope.row.regTime !== null"
              v-formatter="{data: scope.row.regTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="totalDeposit" :label="t('fields.totalDeposit')" align="center" min-width="120">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.totalDeposit,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="totalWithdraw" :label="t('fields.totalWithdraw')" align="center" min-width="120">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.totalWithdraw,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.operate')" min-width="150" align="center" fixed="right">
          <template #default="scope">
            <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit(scope.row)" />
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
    </el-card>

    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form v-if="uiControl.dialogType === 'CREATE'" ref="createForm" :model="cForm" :rules="cFormRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="cForm.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            :disabled="true"
          >
            <el-option
              :key="site.id"
              :label="site.siteName"
              :value="site.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.affiliateCode')" prop="affiliateCode">
          <el-input v-model="cForm.affiliateCode" style="width: 350px;" maxlength="11" :disabled="true" />
        </el-form-item>
        <el-form-item :label="t('fields.affiliateLevel')" prop="affiliateLevel">
          <el-select
            v-model="cForm.affiliateLevel"
            size="small"
            :placeholder="t('fields.affiliateLevel')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in uiControl.affiliateLevel"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input v-model="cForm.loginName" style="width: 350px;" maxlength="11" />
        </el-form-item>
        <el-form-item :label="t('fields.password')" prop="password">
          <el-input v-model="cForm.password" type="password" style="width: 350px;" maxlength="11" />
        </el-form-item>
        <el-form-item :label="t('fields.reenterPassword')" prop="reEnterPassword">
          <el-input v-model="cForm.reEnterPassword" type="password" style="width: 350px;" maxlength="11" />
        </el-form-item>
        <el-form-item :label="t('fields.telephone')" prop="telephone">
          <el-input v-model="cForm.telephone" style="width: 350px;" maxlength="20" />
        </el-form-item>
        <el-form-item :label="t('fields.email')" prop="email">
          <el-input v-model="cForm.email" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.commission')" prop="commission">
          <el-input v-model="cForm.commission" style="width: 350px;" :maxlength="uiControl.commissionMax" @keypress="restrictCommissionDecimalInput($event)" />
        </el-form-item>
        <!-- <el-form-item :label="t('fields.revenueShare')" prop="revenueShare">
          <el-input v-model="cForm.revenueShare" style="width: 350px;" :maxlength="uiControl.revenueMax" @keypress="restrictRevenueDecimalInput($event)" />
        </el-form-item> -->
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ $t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="addAffiliate">{{ $t('fields.confirm') }}</el-button>
        </div>
      </el-form>

      <el-form v-if="uiControl.dialogType === 'EDIT'" ref="editForm" :model="eForm" :rules="eFormRules" :inline="true" size="small" label-width="200px">
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input v-model="eForm.loginName" style="width: 250px" maxlength="50" :disabled="true" />
        </el-form-item>
        <el-form-item :label="t('fields.affiliateCode')" prop="affiliateCode">
          <el-input v-model="eForm.affiliateCode" style="width: 250px" maxlength="50" :disabled="true" />
        </el-form-item>
        <el-form-item :label="t('fields.commissionRate')" prop="commission">
          <el-input v-model="eForm.commission" style="width: 250px" :maxlength="uiControl.commissionMax" @keypress="restrictCommissionDecimalInput($event)" />
        </el-form-item>
        <!-- <el-form-item :label="t('fields.revenueShareRate')" prop="revenueShare">
          <el-input v-model="eForm.revenueShare" style="width: 250px" :maxlength="uiControl.revenueMax" @keypress="restrictRevenueDecimalInput($event)" />
        </el-form-item> -->
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible=false">{{ $t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="editAffiliate()">{{ $t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useStore } from "@/store";
import moment from 'moment';
import { getAffiliateDownline, regsterAffiliate, editAffiliateCommission, getAffiliateInfo } from '../../../api/affiliate';
import { getSite } from '../../../api/site';
import { email, required, size } from "../../../utils/validate";
import { ElMessage } from 'element-plus';
import { useI18n } from "vue-i18n";

const store = useStore();
const { t } = useI18n();
const createForm = ref(null);
const editForm = ref(null);
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: '',
  commissionMax: 2,
  revenueMax: 2,
  affiliateLevel: [
    { key: 1, displayName: "AFFILIATE", value: "AFFILIATE" },
    { key: 2, displayName: "SUPER AFFILIATE", value: "SUPER_AFFILIATE" },
    { key: 3, displayName: "MASTER AFFILIATE", value: "MASTER_AFFILIATE" },
    { key: 4, displayName: "CHIEF AFFILIATE", value: "CHIEF_AFFILIATE" }
  ]
});

const site = ref(null);
const affInfo = ref(null);
const defaultDate = convertDate(new Date());

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
  }
];

const request = reactive({
  regTime: [defaultDate, defaultDate],
  loginName: null,
  size: 20,
  current: 1
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const cForm = reactive({
  id: null,
  loginName: null,
  password: null,
  reEnterPassword: null,
  telephone: null,
  email: null,
  siteId: null,
  affiliateLevel: null,
  affiliateCode: null,
  commission: 0,
  // revenueShare: 0
});

const eForm = reactive({
  id: null,
  loginName: null,
  affiliateCode: null,
  commission: null,
  // revenueShare: null
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

const validatePassword = (rule, value, callback) => {
  if (value !== "" && cForm.reEnterPassword !== "") {
    createForm.value.validateField("reEnterPassword");
  }
  callback();
};

const validateReEnterPassword = (rule, value, callback) => {
  if (value !== cForm.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  }
  callback();
};

const validateCommission = (rule, value, callback) => {
  if (value !== "" &&
    ((cForm.commission < 0 || cForm.commission > 1) ||
    (eForm.commission < 0 || eForm.commission > 1))) {
    callback(new Error(t('message.validateCommission')))
  }
  callback();
};

// const validateRevenue = (rule, value, callback) => {
//   if (value !== "" &&
//     ((cForm.revenueShare < 0 || cForm.revenueShare > 1) ||
//     (eForm.revenueShare < 0 || eForm.revenueShare > 1))) {
//     callback(new Error(t('message.validateRevenueShare')))
//   }
//   callback();
// };

const cFormRules = reactive({
  affiliateLevel: [required(t('message.requiredAffiliateLevel'))],
  loginName: [required(t('message.requiredLoginName')), size(6, 12, t('message.length6To12'))],
  password: [required(t('message.requiredPassword')), size(6, 12, t('message.length6To12')), { validator: validatePassword, trigger: "blur" }],
  reEnterPassword: [required(t('message.reenterPassword')), { validator: validateReEnterPassword, trigger: "blur" }],
  telephone: [required(t('message.requiredTelephone'))],
  email: [required(t('message.requiredEmail')), email(t('message.emailFormat'))],
  commission: [required(t('message.requiredCommission')), { validator: validateCommission, trigger: "blur" }],
  // revenueShare: [{ validator: validateRevenue, trigger: "blur" }]
});

const eFormRules = reactive({
  commission: [required(t('message.requiredCommission')), { validator: validateCommission, trigger: "blur" }],
  // revenueShare: [{ validator: validateRevenue, trigger: "blur" }]
});

function restrictCommissionDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) && charCode !== 46
  ) {
    event.preventDefault();
  }

  if (
    (eForm.commission !== null &&
    eForm.commission.toString().indexOf('.') > -1) ||
    (cForm.commission !== null &&
    cForm.commission.toString().indexOf('.') > -1)
  ) {
    if (charCode === 46) {
      event.preventDefault();
    }
    uiControl.commissionMax = 4;
  } else if (eForm.commission === "1" || cForm.commission === "1") {
    uiControl.commissionMax = 1;
  } else {
    uiControl.commissionMax = 2;
  }
}

// function restrictRevenueDecimalInput(event) {
//   var charCode = event.which ? event.which : event.keyCode
//   if (
//     (charCode < 48 || charCode > 57) && charCode !== 46
//   ) {
//     event.preventDefault();
//   }

//   if (
//     (eForm.revenueShare !== null &&
//     eForm.revenueShare.toString().indexOf('.') > -1) ||
//     (cForm.revenueShare !== null &&
//     cForm.revenueShare.toString().indexOf('.') > -1)
//   ) {
//     if (charCode === 46) {
//       event.preventDefault();
//     }
//     uiControl.revenueMax = 4;
//   } else if (eForm.revenueShare === "1" || cForm.revenueShare === "1") {
//     uiControl.revenueMax = 1;
//   } else {
//     uiControl.revenueMax = 2;
//   }
// }

function resetQuery() {
  request.regTime = [defaultDate, defaultDate];
  request.loginName = null;
}

async function loadDownlineAffiliates() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.regTime !== null) {
    if (request.regTime.length === 2) {
      query.regTime = request.regTime.join(",");
    }
  }
  query.siteId = site.value.id;
  query.memberTypes = "AFFILIATE";
  const { data: ret } = await getAffiliateDownline(store.state.user.id, query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadDownlineAffiliates();
  }
}

function showDialog(type) {
  if (createForm.value) {
    createForm.value.resetFields();
  }
  if (editForm.value) {
    editForm.value.resetFields();
  }
  if (type === 'CREATE') {
    cForm.siteId = site.value.id;
    cForm.affiliateCode = affInfo.value.affiliateCode;
    uiControl.dialogTitle = t('fields.createAffiliate');
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editAffiliate');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(affiliate) {
  showDialog('EDIT');
  nextTick(() => {
    for (const key in affiliate) {
      if (Object.keys(eForm).find(k => k === key)) {
        eForm[key] = affiliate[key];
      }
    }
  });
}

async function addAffiliate() {
  createForm.value.validate(async (valid) => {
    if (valid) {
      await regsterAffiliate(cForm);
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.addSuccess'), type: 'success' });
      await loadDownlineAffiliates();
    }
  });
}

async function editAffiliate() {
  editForm.value.validate(async valid => {
    if (valid) {
      const form = {};
      form.commission = eForm.commission;
      // form.revenueShare = eForm.revenueShare;
      await editAffiliateCommission(eForm.id, form);
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.editSuccess'), type: 'success' });
      await loadDownlineAffiliates();
    }
  });
}

async function loadSite() {
  const { data: s } = await getSite(store.state.user.siteId);
  site.value = s;
}

async function loadAffiliateInfo() {
  const { data: a } = await getAffiliateInfo(store.state.user.id);
  affInfo.value = a;
}

onMounted(async() => {
  await loadSite();
  await loadAffiliateInfo();
  await loadDownlineAffiliates();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.btn-group {
  margin-top: 15px;
  margin-left: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

.inputs-wrap {
  margin: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  .input-small {
    width: 100%;
    max-width: 200px;
    &.el-range-editor--small.el-input__inner {
      max-width: 300px;
    }
  }
  .btn-grp {
    display: flex;
  }
}

@media (max-width: 768px) {
  .inputs-wrap {
    flex-direction: column;
    gap: 10px;
    .el-input--small {
      width: 100% !important;
      max-width: unset !important;
      margin: 0 !important;
      .el-button {
        margin: 0 !important;
      }
    }
    .input-small {
      max-width: unset;
      width: 100%;
    &.el-range-editor--small.el-input__inner {
      max-width: unset;
    }
    }
  }
}
</style>
