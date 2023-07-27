<template>
  <div class="roles-main">
    <div class="header-container" />
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        size="mini"
        :resizable="true"
        :data="page.records"
        row-key="id"
        v-loading="page.loading"
      >
        <el-table-column prop="loginName" :label="t('fields.affiliateInfo')" align="left" min-width="150">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <div>{{ t('fields.account') }}:
              <router-link :to="`/affiliate/details/${scope.row.affiliateId}`">
                <el-link type="primary">{{ scope.row.loginName }}</el-link>
              </router-link>
            </div>
            <div>{{ t('fields.month') }}: {{ convertDate(scope.row.recordTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.depositBettingAmount')" align="left" min-width="150">
          <template #default="scope">
            <div>{{ t('fields.deposit') }}: $
              <span
                v-formatter="{data: scope.row.depositAmount, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.bet') }}: $
              <span
                v-formatter="{data: scope.row.bet, type: 'money'}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.withdrawPayoutBonus')" align="left" min-width="150">
          <template #default="scope">
            <div>
              {{ t('fields.withdraw') }}: $
              <span
                v-formatter="{data: scope.row.withdrawAmount, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.payout') }}: $
              <span
                v-formatter="{data: scope.row.payout, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.bonus') }}: $
              <span
                v-formatter="{data: scope.row.bonus, type: 'money'}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.memberInfo')" align="left" min-width="150">
          <template #default="scope">
            <div>{{ t('fields.activePlayer') }}: {{ scope.row.activePlayer }}</div>
            <div>{{ t('fields.ftd') }}: {{ scope.row.ftdMember }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.subtotal')" align="left" min-width="150">
          <template #default="scope">
            <div>
              {{ t('fields.adjustment') }}: $
              <span
                v-formatter="{data: scope.row.adjustment, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.profit') }}: $
              <span
                v-formatter="{data: scope.row.memberProfit, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.downlineProfit') }}: $
              <span
                v-formatter="{data: scope.row.downlienProfit, type: 'money'}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.commissionPercent')" align="left" min-width="200">
          <template #default="scope">
            <div>{{ t('fields.commissionRate') }}: {{ scope.row.memberCommissionRate * 100 }} %</div>
            <div>{{ t('fields.downlineCommissionRate') }}: {{ scope.row.downlineCommissionRate * 100 }} %</div>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.commission')" align="left" min-width="200">
          <template #default="scope">
            <div>
              {{ t('fields.memberCommission') }}: $
              <span
                v-formatter="{data: scope.row.memberCommissionProfit, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.downlineCommission') }}: $
              <span
                v-formatter="{data: scope.row.downlineCommissionProfit, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.clearingSum') }}: $
              <span
                v-formatter="{data: scope.row.clearingSum, type: 'money'}"
              />
            </div>
            <div>
              {{ t('fields.totalCommission') }}: $
              <span
                v-formatter="{data: scope.row.totalCommissionProfit, type: 'money'}"
              />
            </div>
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
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router'
import { hasPermission } from "../../../../utils/util";
import moment from 'moment';
import { getAffiliateMonthSummaryDetail } from '../../../../api/affiliate-record';
import { useI18n } from "vue-i18n";

// eslint-disable-next-line
const { t } = useI18n();
function convertDate(date) {
  return moment(date).format('YYYY-MM');
}
const request = reactive({
  size: 20,
  current: 1
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

async function loadRecord() {
  const route = useRoute()
  const id = route.params.id;
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getAffiliateMonthSummaryDetail(id, query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
};

onMounted(async() => {
  await loadRecord();
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

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}
</style>
