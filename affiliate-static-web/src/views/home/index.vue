<template>
  <div class="roles-main">
    <el-card style="margin-top: 20px;" v-loading="uiControl.loading">
      <el-row>
        <el-date-picker
          v-model="request.recordTime"
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
          @change="loadSummary"
        />
      </el-row>
      <el-row class="summary">
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1ed6ba">
            <Icon :icon="money20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.bet') }}</div>
            <span class="card-panel-num">
              $ <span v-formatter="{data: summary[0].bet,type: 'money'}" />
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1fa8db">
            <Icon :icon="receiptMoney20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.winLoss') }}</div>
            <span class="card-panel-num">
              $ <span v-formatter="{data: summary[0].win,type: 'money'}" />
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#db1f55">
            <Icon :icon="moneyCalculator20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.profit') }}</div>
            <span class="card-panel-num">
              $ <span v-formatter="{data: summary[0].profit,type: 'money'}" />
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="purple">
            <Icon :icon="peopleAdd20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.newUsers') }}</div>
            <span class="card-panel-num">
              {{ summary[0].registerMemberCount }}
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1ed6ba">
            <Icon :icon="peopleCheckmark20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.activeUsers') }}</div>
            <span class="card-panel-num">
              {{ summary[0].activeMemberCount }}
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1fa8db">
            <Icon :icon="money20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.deposit') }}</div>
            <span class="card-panel-num">
              $ <span v-formatter="{data: summary[0].depositAmount,type: 'money'}" />
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#db1f55">
            <Icon :icon="moneyHand20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.withdraw') }}</div>
            <span class="card-panel-num">
              $ <span v-formatter="{data: summary[0].withdrawAmount,type: 'money'}" />
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="purple">
            <Icon :icon="giftCardMoney20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.bonus') }}</div>
            <span class="card-panel-num">
              $ <span v-formatter="{data: summary[0].bonus,type: 'money'}" />
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1ed6ba">
            <Icon :icon="peopleMoney20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.firstDepositUsers') }}</div>
            <span class="card-panel-num">
              {{ summary[0].ftdMemberCount }}
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1fa8db">
            <Icon :icon="personMoney20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.amountOfFirstDeposit') }}</div>
            <span class="card-panel-num">
              $ <span v-formatter="{data: summary[0].ftdAmount,type: 'money'}" />
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#db1f55">
            <Icon :icon="peopleTeam20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ t('fields.visitsNo') }}</div>
            <span class="card-panel-num">
              {{ summary[0].visitsNo }}
            </span>
          </div>
        </el-card>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import money20Filled from '@iconify-icons/fluent/money-20-filled'
import receiptMoney20Filled from '@iconify-icons/fluent/receipt-money-20-filled'
import moneyCalculator20Filled from '@iconify-icons/fluent/money-calculator-20-filled'
import peopleAdd20Filled from '@iconify-icons/fluent/people-add-20-filled'
import peopleCheckmark20Filled from '@iconify-icons/fluent/people-checkmark-20-filled'
import moneyHand20Filled from '@iconify-icons/fluent/money-hand-20-filled'
import giftCardMoney20Filled from '@iconify-icons/fluent/gift-card-money-20-filled'
import peopleMoney20Filled from '@iconify-icons/fluent/people-money-20-filled'
import personMoney20Filled from '@iconify-icons/fluent/person-money-20-filled'
import peopleTeam20Filled from '@iconify-icons/fluent/people-team-20-filled'
import { useStore } from "@/store";
import { onMounted, reactive } from '@vue/runtime-core'
import moment from 'moment'
import { dashboardSummary } from '../../api/affiliate-summary'
import { useI18n } from "vue-i18n";
const store = useStore();
// eslint-disable-next-line
const { t } = useI18n();
const uiControl = reactive({
  loading: false,
});

const currentDate = convertDate(new Date());

const request = reactive({
  recordTime: [currentDate, currentDate]
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
      start.setTime(moment(start).startOf('isoWeek').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'weeks').startOf('isoWeek').format('x'));
      end.setTime(moment(end).subtract(1, 'weeks').endOf('isoWeek').format('x'));
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

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(1, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

const summary = reactive([{
  id: 0,
  affiliateId: 0,
  loginName: null,
  depositAmount: 0,
  withdrawAmount: 0,
  bet: 0,
  win: 0,
  payout: 0,
  ftdMemberCount: 0,
  activeMemberCount: 0,
  registerMemberCount: 0,
  ftdAmount: 0,
  profit: 0,
  visitsNo: 0
}]);

async function resetSummary() {
  summary[0].depositAmount = 0;
  summary[0].withdrawAmount = 0;
  summary[0].bet = 0;
  summary[0].win = 0;
  summary[0].payout = 0;
  summary[0].ftdMemberCount = 0;
  summary[0].activeMemberCount = 0;
  summary[0].registerMemberCount = 0;
  summary[0].ftdAmount = 0;
  summary[0].profit = 0;
  summary[0].visitsNo = 0;
}

async function loadSummary() {
  uiControl.loading = true;
  const query = {};
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(",");
    }
  }
  query.siteId = store.state.user.siteId;
  const { data: ret } = await dashboardSummary(store.state.user.id, query);
  await resetSummary();
  Object.keys({ ...ret }).forEach(field => {
    if (ret[field]) {
      summary[0][field] = ret[field];
    }
  });
  uiControl.loading = false;
}

onMounted(() => {
  loadSummary();
})
</script>

<style scoped>
.summary {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.summary .box-card {
  flex: 1;
  flex-wrap: wrap;
}

.referral-link {
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.box-card i {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  border-radius: 5px;
  padding: 10px;
  width: 80px;
  height: 80px;
}

.card-panel-description {
  font-weight: 700;
  margin-left: 0;
}

.card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
  text-align: right;
}

.card-panel-description .card-panel-link-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}

.card-panel-description .card-panel-num {
  font-size: 20px;
  float: right;
}

.btn-group {
  margin-top: 15px;
  display: flex;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1200px) {
  .affiliate-info {
    grid-template-columns: repeat(1, 1fr);
  }

  .column {
    margin-top: 20px;
  }
}
</style>
