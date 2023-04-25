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
          />
          <el-select
            clearable
            v-model="request.commissionStatus"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="width: 120px; margin-left: 5px"
          >
            <el-option
              v-for="item in uiControl.commissionStatus"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="font-size: small">{{ t('fields.minActiveMemberCount') }}</span>
          <el-input-number v-model="request.activePlayer" style="width: 100px; margin-left: 10px" size="small"
                           maxlength="5" :label="t('fields.activeMember')"
          />
          <span style="font-size: small; margin-left: 20px">{{ t('fields.minTotalCommission') }}</span>
          <el-input
            v-model="request.totalCommissionProfit"
            style="width: 100px; margin-left: 20px"
            size="small"
            class="mx-4"
            input="number"
            :min="0"
            controls-position="right"
          />
          <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadRecord()">
            {{ t('fields.search') }}
          </el-button>
          <el-button size="mini" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
          <el-button
            icon="el-icon-download"
            size="mini"
            type="primary"
            v-permission="['sys:affiliate:month-summary:export']"
            @click="exportExcel"
          >{{ t('fields.exportToExcel') }}
          </el-button>
          <el-button
            size="mini"
            type="warning"
            :disabled="uiControl.settlementBtn"
            v-permission="['sys:affiliate:month-summary:settle']"
            @click="settlement()"
          >{{ t('fields.settlement') }}
          </el-button>
        </div>
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
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        size="mini"
        :resizable="true"
        :data="page.records"
        row-key="id"
        v-loading="page.loading"
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :empty-text="t('fields.noData')"
      >
        <el-table-column type="selection" width="55" :selectable="toClear" />
        <el-table-column prop="loginName" :label="t('fields.affiliateInfo')" align="left" min-width="200">
          <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
            <span style="display: inline-block">
              Account:
              <router-link :to="`/affiliate/details/${scope.row.affiliateId}`">
                <el-link type="primary">{{ scope.row.loginName }}</el-link>
              </router-link>
              <div />
              Month: {{ convertDateMinusOneMonth(scope.row.recordTime) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" align="left" min-width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'UNCLEAR' && scope.row.totalCommissionProfit > 0" type="danger">{{ scope.row.status }}</el-tag>
            <el-tag v-else-if="scope.row.status === 'CLEARING' && scope.row.totalCommissionProfit > 0" type="warning">{{ scope.row.status }}</el-tag>
            <el-tag v-else-if="scope.row.status === 'CLEARED' && scope.row.totalCommissionProfit > 0" type="success">{{ scope.row.status }}</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.depositBettingAmount')" align="left" min-width="160">
          <template #default="scope">
            <div>Deposit: $
              <span
                v-formatter="{data: scope.row.depositAmount, type: 'money'}"
              />
            </div>
            <div>
              Bet: $
              <span
                v-formatter="{data: scope.row.bet, type: 'money'}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.withdrawPayoutBonus')" align="left" min-width="170">
          <template #default="scope">
            <div>
              Withdraw: $
              <span
                v-formatter="{data: scope.row.withdrawAmount, type: 'money'}"
              />
            </div>
            <div>
              Payout: $
              <span
                v-formatter="{data: scope.row.payout, type: 'money'}"
              />
            </div>
            <div>
              Bonus: $
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
                v-formatter="{data: scope.row.downlineProfit, type: 'money'}"
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
        <el-table-column prop="loginName" :label="t('fields.details')" align="left" min-width="120">
          <template #default="scope" v-if="hasPermission(['sys:affiliate:month-summary'])">
            <router-link :to="`/affiliate/month-summary-details/${scope.row.affiliateId}`">
              <el-link type="primary">{{ t('fields.details') }}</el-link>
            </router-link>
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
import { onMounted, reactive, ref } from 'vue';
import { hasRole, hasPermission } from "../../../utils/util";
import moment from 'moment';
import { getAffiliateMonthSummary, getSummariesForExport, updateSettlementState } from '../../../api/affiliate-record';
import { getSiteListSimple } from "../../../api/site";
import * as XLSX from "xlsx-js-style";
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const siteList = reactive({
  list: []
});
let chooseAffiliate = [];
const uiControl = reactive({
  dialogVisible: false,
  progressBarVisible: false,
  dialogTitle: "",
  dialogType: "SEARCH",
  settlementBtn: true,
  commissionStatus: [
    { key: 1, displayName: "Unclear", value: "UNCLEAR" },
    { key: 2, displayName: "Clearing", value: "CLEARING" },
    { key: 3, displayName: "Cleared", value: "CLEARED" }
  ]
});
const site = ref(null);
const defaultQueryMonth = convertDate(moment(new Date()).subtract(1, 'months'));

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  month: defaultQueryMonth,
  loginName: null,
  commissionStatus: null,
  activePlayer: 0,
  totalCommissionProfit: 0,
});

const EXPORT_HEADER = ['Aff Info', 'Inflow Related', 'Outflow Related', 'Member Related', 'Subtotal', 'Share Ratio', 'Commission'];

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

function convertDate(date) {
  return moment(date).format('YYYY-MM');
}

function convertDateMinusOneMonth(date) {
  return moment(date).subtract(1, 'months').format('YYYY-MM');
}

function disabledDate(time) {
  return time.getTime() >= moment(new Date()).startOf('month').format('x');
}

function resetQuery() {
  request.month = defaultQueryMonth;
  request.loginName = null;
  request.activePlayer = 0;
  request.totalCommissionProfit = 0;
  request.commissionStatus = null;
  request.siteId = site.value ? site.value.id : null;
};

function handleSelectionChange(val) {
  chooseAffiliate = val;
  if (chooseAffiliate.length === 0) {
    uiControl.settlementBtn = true;
  } else {
    uiControl.settlementBtn = false;
  }
}

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

async function loadRecord() {
  uiControl.dialogVisible = false;
  page.loading = true;
  const query = checkQuery();
  const { data: ret } = await getAffiliateMonthSummary(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
};

async function exportExcel() {
  uiControl.progressBarVisible = true;
  const query = checkQuery();
  query.current = 1;
  const { data: ret } = await getSummariesForExport(query);
  const exportData = [["Aff_Month_Report(" + request.month + ")"], EXPORT_HEADER];
  const maxLength = [];
  const exportPercentage = ref(0);

  pushRecordToData(ret.records, exportData);
  exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  query.current = ret.current;

  while (query.current < ret.pages) {
    query.current += 1;
    const { data: ret } = await getSummariesForExport(query);
    pushRecordToData(ret.records, exportData);
    exportPercentage.value = Math.round(ret.current / (ret.pages + 1) * 100);
  }

  const ws = XLSX.utils.aoa_to_sheet(exportData);
  const merge = [{ s: { r: 0, c: 0 }, e: { r: 0, c: EXPORT_HEADER.length } }];
  ws["!merges"] = merge;

  const style = { alignment: { horizontal: "center" } };
  ws.A1.s = style;

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
  wb.SheetNames.push('Affiliate_List');
  wb.Sheets.Affiliate_List = ws;
  const filename = "Aff_Month_Report(" + request.month + ").xlsx"
  XLSX.writeFile(wb, filename);
  exportPercentage.value = 100;
}

function mapRecord(record) {
  const exportRowFormat = reactive({
    affInfo: null,
    inflowRelated: null,
    outflowRelated: null,
    memberRelated: null,
    subtotal: null,
    shareRatio: null,
    commission: null
  });

  exportRowFormat.affInfo = "Account: " + record.loginName + "  \nMonth:" + request.month;
  exportRowFormat.inflowRelated = "Deposit: " + record.depositAmount + "  \nBet: " + record.bet;
  exportRowFormat.outflowRelated = "Withdraw: " + record.withdrawAmount + "  \nPayout: " + record.payout + "  \nPromo: " + record.bonus;
  exportRowFormat.memberRelated = "Active Member: " + record.activePlayer + "  \nFTD: " + record.ftdMember;
  exportRowFormat.subtotal = "Profit: " + record.memberProfit + "  \nDownline Profit: " + record.downlineProfit;
  exportRowFormat.shareRatio = "Commission Rate: " + record.memberCommissionRate * 100 + "%" + "  \nDownline Commission Rate: " + record.downlineCommissionRate * 100 + "%";
  exportRowFormat.commission = "Member Commission: " + record.memberCommissionProfit + "  \nDownline Commission: " + record.downlineCommissionProfit + "  \nUnsettlement: " + record.clearingSum + "  \nTotal:" + record.totalCommissionProfit;
  return exportRowFormat;
}

function pushRecordToData(records, exportData) {
  const data = records.map(record => Object.values(mapRecord(record)).map(item => item !== 0 && (!item || item === '') ? '-' : item));
  exportData.push(...data);
}

function toClear(row, index) {
  return row.status === 'UNCLEAR' && row.totalCommissionProfit > 0;
}

async function settlement(affiliate) {
  ElMessageBox.confirm(
    t('message.confirmSettlement'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (affiliate) {
      await updateSettlementState([affiliate.id], "CLEARING");
    } else {
      await updateSettlementState(chooseAffiliate.map(a => a.id), "CLEARING");
    }
    await loadRecord();
    ElMessage({ message: t('message.settlementToChecking'), type: "success" });
  });
}

onMounted(async() => {
  await loadSites();
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
</style>
