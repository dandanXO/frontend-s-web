<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <div>
          <el-input v-model="request.loginName" style="width: 200px; margin-bottom: 10px;" size="small" maxlength="50"
                    :placeholder="t('fields.loginName')"
          />
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
          <el-date-picker
            v-model="request.month"
            format="MM/YYYY"
            value-format="YYYY-MM"
            size="small"
            type="month"
            style="width: 200px; margin-left: 10px"
            :editable="false"
            :clearable="false"
            :disabled-date="disabledDate"
            :placeholder="t('fields.month')"
          />
          <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadSettlement()">
            {{ t('fields.search') }}
          </el-button>
          <el-button size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
        </div>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        size="mini"
        :resizable="true"
        :data="page.records"
        row-key="id"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column prop="month" :label="t('fields.month')" align="left" min-width="120">
          <template #default="scope">
            {{ convertDate(scope.row.recordTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="left" min-width="120" />
        <el-table-column prop="status" :label="t('fields.status')" align="left" min-width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'PAY'" type="warning" size="mini">{{ t('status.settlement.' + scope.row.status) }}</el-tag>
            <el-tag v-else type="success" size="mini">{{ t('status.settlement.' + scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.checkBy')" align="left" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.checkBy === null">-</span>
            <span v-else>{{ scope.row.checkBy }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.checkTime')" align="left" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.checkTime === null">-</span>
            <span v-else>{{ scope.row.checkTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.finalSum')" align="left" min-width="140">
          <template #default="scope">
            <div>$
              <span
                v-formatter="{data: scope.row.finalSum, type: 'money'}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.payBy')" align="left" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.payBy === null">-</span>
            <span v-else>{{ scope.row.payBy }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.payTime')" align="left" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.payTime === null">-</span>
            <span v-else>{{ scope.row.payTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          fixed="right"
          width="350"
          v-if="!hasRole(['SUB_TENANT']) && (
            hasPermission(['sys:affiliate:settle:pay-to-checking']) ||
            hasPermission(['sys:affiliate:settle:pay-cleared']))"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="danger"
              v-permission="['sys:affiliate:settle:check-remove']"
              @click="toChecking(scope.row)"
              v-if="scope.row.status === 'PAY'"
            >
              {{ t('fields.toChecking') }}
            </el-button>
            <el-button
              size="mini"
              type="success"
              v-permission="['sys:affiliate:settle:check-to-pay']"
              @click="confirmPayment(scope.row)"
              v-if="scope.row.status === 'PAY'"
            >
              {{ t('fields.confirmPay') }}
            </el-button>
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
        @current-change="loadSettlement"
        @size-change="loadSettlement"
      />
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { hasRole, hasPermission } from "../../../utils/util";
import moment from 'moment';
import { confirmPay, getAffiliateSettlementPay, updatetoChecking } from '../../../api/affiliate-settlement';
import { getSiteListSimple } from "../../../api/site";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from 'element-plus';
import { useStore } from '../../../store';
import { TENANT } from '../../../store/modules/user/action-types';

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const siteList = reactive({
  list: []
});
const site = ref(null);
const defaultQueryMonth = convertDate(moment(new Date()).subtract(1, 'months'));

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  month: defaultQueryMonth,
  loginName: null
});

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

function convertDate(date) {
  return moment(date).format('YYYY-MM');
}

function disabledDate(time) {
  return time.getTime() >= moment(new Date()).startOf('month').format('x');
}

function resetQuery() {
  request.month = defaultQueryMonth;
  request.loginName = null;
  request.siteId = site.value ? site.value.id : siteList.list[0].id;
};

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

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

async function loadSettlement() {
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getAffiliateSettlementPay(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
};

async function toChecking(check) {
  ElMessageBox.confirm(
    t('message.confirmToChecking'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await updatetoChecking(check.id);
    await loadSettlement();
    ElMessage({ message: t('message.settlementToChecking'), type: "success" });
  });
}

async function confirmPayment(pay) {
  ElMessageBox.confirm(
    t('message.confirmSettlement'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await confirmPay(pay.id);
    await loadSettlement();
    ElMessage({ message: t('message.settled'), type: "success" });
  });
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadSettlement();
});

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
  margin-bottom: 10px;
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
