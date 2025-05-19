<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <el-tabs v-model="activeName" style="margin: 0 20px;">
        <el-tab-pane :label="t('fields.data')" name="data">
          <div class="custom-table-wrapper">
            <table cellspacing="0" border class="custom-table">
              <thead>
                <tr>
                  <th scope="col" colspan="2">
                  </th>
                  <th scope="col">{{ t('fields.today') }}</th>
                  <th scope="col">{{ t('fields.tomorrow') }}</th>
                  <th scope="col">{{ t('fields.thisWeek') }}</th>
                  <th scope="col">{{ t('fields.lastWeek') }}</th>
                  <th scope="col">{{ t('fields.thisMonth') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowspan="3">{{ t('fields.member') }}</td>
                  <td>{{ t('fields.login') }}</td>
                  <td>{{ data.today.loginCount }}</td>
                  <td>{{ data.yesterday.loginCount }}</td>
                  <td>{{ data.thisWeek.loginCount }}</td>
                  <td>{{ data.lastWeek.loginCount }}</td>
                  <td>{{ data.thisMonth.loginCount }}</td>
                </tr>
                <tr>
                  <td>{{ t('fields.ftd') }}</td>
                  <td>{{ data.today.ftdCount }}</td>
                  <td>{{ data.yesterday.ftdCount }}</td>
                  <td>{{ data.thisWeek.ftdCount }}</td>
                  <td>{{ data.lastWeek.ftdCount }}</td>
                  <td>{{ data.thisMonth.ftdCount }}</td>
                </tr>
                <tr>
                  <td>{{ t('fields.register') }}</td>
                  <td>{{ data.today.newMemberCount }}</td>
                  <td>{{ data.yesterday.newMemberCount }}</td>
                  <td>{{ data.thisWeek.newMemberCount }}</td>
                  <td>{{ data.lastWeek.newMemberCount }}</td>
                  <td>{{ data.thisMonth.newMemberCount }}</td>
                </tr>
                <tr>
                  <td rowspan="2">{{ t('fields.bonus') }}</td>
                  <td>{{ t('fields.bonusAmount') }}</td>
                  <td>{{ data.today.bonus }}</td>
                  <td>{{ data.yesterday.bonus }}</td>
                  <td>{{ data.thisWeek.bonus }}</td>
                  <td>{{ data.lastWeek.bonus }}</td>
                  <td>{{ data.thisMonth.bonus }}</td>
                </tr>
                <tr>
                  <td>{{ t('fields.bonusCount') }}</td>
                  <td>{{ data.today.bonusCount }}</td>
                  <td>{{ data.yesterday.bonusCount }}</td>
                  <td>{{ data.thisWeek.bonusCount }}</td>
                  <td>{{ data.lastWeek.bonusCount }}</td>
                  <td>{{ data.thisMonth.bonusCount }}</td>
                </tr>
                <tr>
                  <td rowspan="3">{{ t('fields.bet') }}</td>
                  <td>{{ t('fields.validBet') }}</td>
                  <td>{{ data.today.bet }}</td>
                  <td>{{ data.yesterday.bet }}</td>
                  <td>{{ data.thisWeek.bet }}</td>
                  <td>{{ data.lastWeek.bet }}</td>
                  <td>{{ data.thisMonth.bet }}</td>
                </tr>
                <tr>
                  <td>{{ t('fields.payout') }}</td>
                  <td>{{ data.today.payout }}</td>
                  <td>{{ data.yesterday.payout }}</td>
                  <td>{{ data.thisWeek.payout }}</td>
                  <td>{{ data.lastWeek.payout }}</td>
                  <td>{{ data.thisMonth.payout }}</td>
                </tr>
                <tr>
                  <td>{{ t('fields.betCount') }}</td>
                  <td>{{ data.today.payout - data.today.bet }}</td>
                  <td>{{ data.yesterday.payout - data.yesterday.bet }}</td>
                  <td>{{ data.thisWeek.payout - data.thisWeek.bet }}</td>
                  <td>{{ data.lastWeek.payout - data.lastWeek.bet }}</td>
                  <td>{{ data.thisMonth.payout - data.thisMonth.bet }}</td>
                </tr>
                <tr>
                  <td rowspan="2">{{ t('fields.deposit') }}</td>
                  <td>{{ t('fields.depositAmount') }}</td>
                  <td>{{ data.today.depositAmount }}</td>
                  <td>{{ data.yesterday.depositAmount }}</td>
                  <td>{{ data.thisWeek.depositAmount }}</td>
                  <td>{{ data.lastWeek.depositAmount }}</td>
                  <td>{{ data.thisMonth.depositAmount }}</td>
                </tr>
                <tr>
                  <td>{{ t('fields.depositCount') }}</td>
                  <td>{{ data.today.depositCount }}</td>
                  <td>{{ data.yesterday.depositCount }}</td>
                  <td>{{ data.thisWeek.depositCount }}</td>
                  <td>{{ data.lastWeek.depositCount }}</td>
                  <td>{{ data.thisMonth.depositCount }}</td>
                </tr>
                <tr>
                  <td rowspan="2">{{ t('fields.withdraw') }}</td>
                  <td>{{ t('fields.withdrawAmount') }}</td>
                  <td>{{ data.today.withdrawAmount }}</td>
                  <td>{{ data.yesterday.withdrawAmount }}</td>
                  <td>{{ data.thisWeek.withdrawAmount }}</td>
                  <td>{{ data.lastWeek.withdrawAmount }}</td>
                  <td>{{ data.thisMonth.withdrawAmount }}</td>
                </tr>
                <tr>
                  <td>{{ t('fields.withdrawCount') }}</td>
                  <td>{{ data.today.withdrawCount }}</td>
                  <td>{{ data.yesterday.withdrawCount }}</td>
                  <td>{{ data.thisWeek.withdrawCount }}</td>
                  <td>{{ data.lastWeek.withdrawCount }}</td>
                  <td>{{ data.thisMonth.withdrawCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { getDashboardDataByMonth } from '../../api/dashboard'
import moment from 'moment'

const store = useStore()
const { t } = useI18n()
const activeName = ref('data')

const page = reactive({
  pages: 0,
  loading: false,
})

const data = reactive({
  today: {
    loginCount: 0,
    ftdCount: 0,
    newMemberCount: 0,
    bonus: 0,
    bonusCount: 0,
    bet: 0,
    payout: 0,
    depositAmount: 0,
    depositCount: 0,
    withdrawAmount: 0,
    withdrawCount: 0,
  },
  yesterday: {
    loginCount: 0,
    ftdCount: 0,
    newMemberCount: 0,
    bonus: 0,
    bonusCount: 0,
    bet: 0,
    payout: 0,
    depositAmount: 0,
    depositCount: 0,
    withdrawAmount: 0,
    withdrawCount: 0,
  },
  thisWeek: {
    loginCount: 0,
    ftdCount: 0,
    newMemberCount: 0,
    bonus: 0,
    bonusCount: 0,
    bet: 0,
    payout: 0,
    depositAmount: 0,
    depositCount: 0,
    withdrawAmount: 0,
    withdrawCount: 0,
  },
  lastWeek: {
    loginCount: 0,
    ftdCount: 0,
    newMemberCount: 0,
    bonus: 0,
    bonusCount: 0,
    bet: 0,
    payout: 0,
    depositAmount: 0,
    depositCount: 0,
    withdrawAmount: 0,
    withdrawCount: 0,
  },
  thisMonth: {
    loginCount: 0,
    ftdCount: 0,
    newMemberCount: 0,
    bonus: 0,
    bonusCount: 0,
    bet: 0,
    payout: 0,
    depositAmount: 0,
    depositCount: 0,
    withdrawAmount: 0,
    withdrawCount: 0,
  },
})

function convertDate() {
  return moment().endOf('month').format('YYYY-MM-DD');
}

function convertStartDate(date) {
  return moment().startOf('month').format('YYYY-MM-DD');
}

async function loadDashboardData() {
  page.loading = true
  const query = {}
  query.recordTime = [convertStartDate(), convertDate()].join(',')

  const { data: ret } = await getDashboardDataByMonth(query)
  const today = moment().format('YYYY-MM-DD');
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  const thisWeekStart = moment().startOf('week').format('YYYY-MM-DD');
  const thisWeekEnd = moment().endOf('week').format('YYYY-MM-DD');
  const lastWeekStart = moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD');
  const lastWeekEnd = moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');
  
  data.today = ret.filter(item => item.recordTime === today)
                  .reduce((sum, item)=> ({
                    loginCount: sum.loginCount + item.loginCount,
                    ftdCount: sum.ftdCount + item.ftdCount,
                    newMemberCount: sum.newMemberCount + item.newMemberCount,
                    bonus: sum.bonus + item.bonus,
                    bonusCount: sum.bonusCount + item.bonusCount,
                    bet: sum.bet + item.bet,
                    payout: sum.payout + item.payout,
                    depositAmount: sum.depositAmount + item.depositAmount,
                    depositCount: sum.depositCount + item.depositCount,
                    withdrawAmount: sum.withdrawAmount + item.withdrawAmount,
                    withdrawCount: sum.withdrawCount + item.withdrawCount,
                  }), { loginCount: 0, ftdCount: 0, newMemberCount: 0, bonus: 0, bonusCount: 0,
                    bet: 0, payout: 0, depositAmount: 0, depositCount: 0, withdrawAmount: 0, withdrawCount: 0 })
  data.yesterday = ret.filter(item => item.recordTime === yesterday)
                  .reduce((sum, item)=> ({
                    loginCount: sum.loginCount + item.loginCount,
                    ftdCount: sum.ftdCount + item.ftdCount,
                    newMemberCount: sum.newMemberCount + item.newMemberCount,
                    bonus: sum.bonus + item.bonus,
                    bonusCount: sum.bonusCount + item.bonusCount,
                    bet: sum.bet + item.bet,
                    payout: sum.payout + item.payout,
                    depositAmount: sum.depositAmount + item.depositAmount,
                    depositCount: sum.depositCount + item.depositCount,
                    withdrawAmount: sum.withdrawAmount + item.withdrawAmount,
                    withdrawCount: sum.withdrawCount + item.withdrawCount,
                  }), { loginCount: 0, ftdCount: 0, newMemberCount: 0, bonus: 0, bonusCount: 0,
                    bet: 0, payout: 0, depositAmount: 0, depositCount: 0, withdrawAmount: 0, withdrawCount: 0 })
  data.thisWeek = ret.filter(item => item.recordTime >= thisWeekStart && item.recordTime <= thisWeekEnd)
                  .reduce((sum, item)=> ({
                    loginCount: sum.loginCount + item.loginCount,
                    ftdCount: sum.ftdCount + item.ftdCount,
                    newMemberCount: sum.newMemberCount + item.newMemberCount,
                    bonus: sum.bonus + item.bonus,
                    bonusCount: sum.bonusCount + item.bonusCount,
                    bet: sum.bet + item.bet,
                    payout: sum.payout + item.payout,
                    depositAmount: sum.depositAmount + item.depositAmount,
                    depositCount: sum.depositCount + item.depositCount,
                    withdrawAmount: sum.withdrawAmount + item.withdrawAmount,
                    withdrawCount: sum.withdrawCount + item.withdrawCount,
                  }), { loginCount: 0, ftdCount: 0, newMemberCount: 0, bonus: 0, bonusCount: 0,
                    bet: 0, payout: 0, depositAmount: 0, depositCount: 0, withdrawAmount: 0, withdrawCount: 0 })
  data.lastWeek = ret.filter(item => item.recordTime >= lastWeekStart && item.recordTime <= lastWeekEnd)
                  .reduce((sum, item)=> ({
                    loginCount: sum.loginCount + item.loginCount,
                    ftdCount: sum.ftdCount + item.ftdCount,
                    newMemberCount: sum.newMemberCount + item.newMemberCount,
                    bonus: sum.bonus + item.bonus,
                    bonusCount: sum.bonusCount + item.bonusCount,
                    bet: sum.bet + item.bet,
                    payout: sum.payout + item.payout,
                    depositAmount: sum.depositAmount + item.depositAmount,
                    depositCount: sum.depositCount + item.depositCount,
                    withdrawAmount: sum.withdrawAmount + item.withdrawAmount,
                    withdrawCount: sum.withdrawCount + item.withdrawCount,
                  }), { loginCount: 0, ftdCount: 0, newMemberCount: 0, bonus: 0, bonusCount: 0,
                    bet: 0, payout: 0, depositAmount: 0, depositCount: 0, withdrawAmount: 0, withdrawCount: 0 })
  data.thisMonth = ret.reduce((sum, item)=> ({
                    loginCount: sum.loginCount + item.loginCount,
                    ftdCount: sum.ftdCount + item.ftdCount,
                    newMemberCount: sum.newMemberCount + item.newMemberCount,
                    bonus: sum.bonus + item.bonus,
                    bonusCount: sum.bonusCount + item.bonusCount,
                    bet: sum.bet + item.bet,
                    payout: sum.payout + item.payout,
                    depositAmount: sum.depositAmount + item.depositAmount,
                    depositCount: sum.depositCount + item.depositCount,
                    withdrawAmount: sum.withdrawAmount + item.withdrawAmount,
                    withdrawCount: sum.withdrawCount + item.withdrawCount,
                  }), { loginCount: 0, ftdCount: 0, newMemberCount: 0, bonus: 0, bonusCount: 0,
                    bet: 0, payout: 0, depositAmount: 0, depositCount: 0, withdrawAmount: 0, withdrawCount: 0 })
  
  console.log(data)
  console.log(thisWeekStart)
  console.log(thisWeekEnd)
  console.log(lastWeekStart)
  console.log(lastWeekEnd)
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style lang="scss" scoped>
.roles-main {
  height: inherit;
}
.custom-table tr:hover > td {
  background: none !important;
}

.custom-table {
  table-layout: fixed;
}

.el-card {
  padding-bottom: 20px;
}

.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}
.el-button {
  margin-bottom: 10px;
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
      height: 40px;
      max-width: 300px;
    }
  }
  .btn-grp {
    display: flex;
  }
}
</style>

<style lang="scss">
@media (max-width: 768px) {
  .el-dialog {
    width: 100%;
  }
}
</style>
