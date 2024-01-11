<template>
  <div class="header-container" style="margin-bottom: 20px;">
    <div class="search">
      <el-date-picker
        v-model="request.betTime"
        format="DD/MM/YYYY"
        value-format="YYYY-MM-DD"
        size="small"
        type="daterange"
        range-separator=":"
        :start-placeholder="t('fields.startDate')"
        :end-placeholder="t('fields.endDate')"
        style="width: 380px"
        :shortcuts="shortcuts"
        :disabled-date="disabledDate"
        :editable="false"
        :clearable="false"
      />
      <el-button
        style="margin-left: 10px"
        icon="el-icon-search"
        size="mini"
        type="primary"
        @click="loadPlatformSummaryList()"
      >
        {{ t('fields.search') }}
      </el-button>
    </div>
  </div>

  <div class="tables-container-wrap1">
    <!-- <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">报表总览</span>
        </div>
      </template>
      <el-descriptions size="small" class="margin-top" :column="2" border>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              充值
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="example"
                style="height: 16px;width: 16px;"
              />
              提现
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              利润
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
          :column="2"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              总投注
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
          :column="2"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              总中奖
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
          :column="2"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              奖励
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
          :column="2"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              总返点
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
          :column="2"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              首充金额
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
          :column="2"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              首充人数
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
          :column="2"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              其他
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
          :column="2"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              总计
            </div>
          </template>
          <span>Test</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card> -->
    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.gameConsolidateReport') }}</span>
        </div>
      </template>
      <el-descriptions
        size="small"
        v-for="(item, index) in platform.sitePlatform"
        :key="index"
        :title="item.gameType"
        :column="2"
        class="margin-top"
        style="margin-bottom: 20px;"
        border
      >
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
          v-for="(list, i) in item.list[0]"
          :key="i"
        >
          <template #label>
            <div>
              {{ list.platformName }}
            </div>
          </template>
          <span>{{ list.bet }} / {{ list.payout }}</span>
        </el-descriptions-item>
        <!-- Add an additional empty el-descriptions-item when there are exactly three records -->
        <el-descriptions-item
          v-if="item.list[0].length % 2 !== 0"
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <!-- Placeholder label for the additional empty el-descriptions-item -->
            </div>
          </template>
          <span />
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        size="small"
        :title="t('fields.total')"
        :column="2"
        class="margin-top"
        style="margin-bottom: 20px;"
        border
      >
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              {{ t('fields.thirdPartyTotalBet') }}
            </div>
          </template>
          <span>{{ platform.totalBet }}</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              {{ t('fields.thirdPartyTotalPayout') }}
            </div>
          </template>
          <span>{{ platform.totalPayout }}</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              {{ t('fields.thirdPartyTotalWin') }}
            </div>
          </template>
          <span>{{ platform.totalWin }}</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div />
          </template>
          <span />
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { defineProps, onMounted, reactive } from 'vue'
import moment from 'moment'
import { memberDailyPlatformSummary } from '../../../../../api/member-daily-summary'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const props = defineProps({
  mbrId: {
    type: String,
    required: true,
  },
})

const platform = reactive({
  sitePlatform: [],
  totalBet: 0,
  totalWin: 0,
  totalPayout: 0,
})

const route = useRoute()
const site = reactive({
  id: route.query.site,
})

const date = new Date()
const defaultStartDate = convertStartDate(date)
const defaultEndDate = convertDate(date)

const request = reactive({
  siteId: site.id,
  memberId: props.mbrId,
  startDate: defaultStartDate,
  endDate: defaultEndDate,
  betTime: [defaultStartDate, defaultEndDate],
})

async function loadPlatformSummaryList() {
  const query = {}
  query.siteId = site.id
  query.memberId = props.mbrId
  query.startDate = defaultStartDate
  query.endDate = defaultEndDate

  if (request.betTime !== null) {
    if (request.betTime.length === 2) {
      query.betTime = JSON.parse(JSON.stringify(request.betTime))
      query.startDate = moment(query.betTime[0]).format('YYYY-MM-DD')
      query.endDate = moment(query.betTime[1]).format('YYYY-MM-DD')
      query.betTime = query.betTime.join(',')
    }
  } else {
    console.log('Test Bet Time Null')
  }
  const { data: ret } = await memberDailyPlatformSummary(query)

  // Group items by gameType using reduce
  const groupedByGameType = ret.reduce((acc, item) => {
    const { gameType, list } = item

    if (!acc[gameType]) {
      acc[gameType] = { gameType, list: [] }
    }

    // Add the item to the gameList
    acc[gameType].list.push(list)

    return acc
  }, {})

  const getTotalBet = ret.reduce((sum, item) => {
    if (item.list && item.list.length > 0) {
      sum += item.list.reduce((betSum, list) => betSum + list.bet, 0)
    }
    return Math.ceil(sum)
  }, 0)

  const getTotalPayout = ret.reduce((sum, item) => {
    if (item.list && item.list.length > 0) {
      sum += item.list.reduce((payoutSum, list) => payoutSum + list.payout, 0)
    }
    return Math.ceil(sum)
  }, 0)

  const getTotalWinLose = ret.reduce((sum, item) => {
    if (item.list && item.list.length > 0) {
      sum += item.list.reduce((winLoseSum, list) => winLoseSum + list.win, 0)
    }
    return Math.ceil(sum)
  }, 0)

  console.log('getTotalBet : ', getTotalBet)
  // Convert the object back to an array
  const resultArray = Object.values(groupedByGameType)

  platform.sitePlatform = resultArray
  platform.totalBet = getTotalBet
  platform.totalPayout = getTotalPayout
  platform.totalWin = getTotalWinLose

  console.log('gameType : ', resultArray)
}

// function calendarChange(date) {
//   if (date !== null) {
//     const betTime = JSON.parse(JSON.stringify(date))
//     request.startDate = moment(betTime[0]).format('YYYY-MM-DD')
//     request.endDate = moment(betTime[1]).format('YYYY-MM-DD')
//     request.betTime = request.betTime.join(',')
//   }
// }

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function convertStartDate(date) {
  return moment(date)
    .startOf('day')
    .format('YYYY-MM-DD')
}

onMounted(async () => {
  await loadPlatformSummaryList()
})
</script>

<style lang="scss">
.member-label {
  width: 150px;

  div {
    display: flex;
    align-items: center;
  }
}

.member-context {
  width: 35%;
}

.member-context-red {
  background: #ff0000;
  color: white;
}
</style>

<style lang="scss" scoped>
.tables-container-wrap1 {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .info-card {
    margin-bottom: 10px;
  }
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

::v-deep {
  .el-tabs__content {
    padding: 0;
  }
}

.platform {
  display: flex;
  text-align: center;
  width: fit-content;
  flex: 1;

  * {
    // add back paddings supposed to be present 1
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .label {
    background-color: #f5f7fa;
    width: 73px;
  }

  .plat-ctrl {
    flex: 1;
  }
}

::v-deep([class^='el-table']) {
  .cell,
  .remove-padding {
    padding: 0 !important;
  }

  .remove-padding {
    .cell {
      display: flex;
    }
  }
}

.balance {
  padding: 3px 50px;
  border: solid 1px #dcdfe6;
  background-color: #e9ecef;
  border-radius: 5px;
  display: inline-block;
}

.platform-balance {
  padding: 5px;
  display: inline-block;
}

.level-color {
  width: 30px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.refresh-btn {
  margin-left: 20px;
}

.refresh-platform-btn {
  margin-left: 5px;
  display: inline-block;
}
</style>
