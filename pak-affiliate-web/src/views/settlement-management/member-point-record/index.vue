<template>
  <div class="page-container">
    <div class="panel-item">
      <div>
        <el-form @submit.prevent>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item :label="t('fields.type') + ' :'">
                <el-select clearable v-model="request.type" size="small" :placeholder="t('fields.type')"
                  class="filter-item">
                  <el-option :label="t('fields.all')" value="" />
                  <el-option :label="t('fields.rebate')" value="EARN" />
                  <el-option :label="t('fields.redeem')" value="REDEEM" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item :label="t('fields.loginName') + ' :'">
                <el-input v-model="request.loginName" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="t('fields.recordTime') + ' :'">
                <el-date-picker v-model="request.recordTime" format="DD/MM/YYYY" value-format="YYYY-MM-DD" size="normal"
                  type="daterange" range-separator=":" :start-placeholder="t('fields.startDate')"
                  :end-placeholder="t('fields.endDate')" :shortcuts="shortcuts" :disabled-date="disabledDate"
                  :editable="false" :clearable="false" :default-time="defaultTime" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button style="margin-left: 20px" icon="el-icon-search" size="normal" type="success"
                @click="loadRecords()">
                {{ t('fields.search') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="overflow:scroll">
        <table cellpadding="0" cellspacing="0" border class="custom-table">
          <thead>
            <tr>
              <th scope="col">{{ t('fields.loginName') }}</th>
              <th scope="col">{{ t('fields.type') }}</th>
              <th scope="col">{{ t('fields.pointAmount') }}</th>
              <th scope="col">{{ t('fields.status') }}</th>
              <th scope="col">{{ t('fields.afterBalance') }}</th>
              <th scope="col">{{ t('fields.recordTime') }}</th>
            </tr>
          </thead>
          <tbody v-if="page.loading || page.records.length === 0">
            <tr>
              <td colspan="7">
                <Loading v-if="page.loading" />
                <emptyComp v-else-if="page.records.length === 0" />
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="page.records.length > 0">
            <tr v-for="item in page.records" :key="item.id">
              <td>
                {{ item.memberName }}
              </td>
              <td :class="item.type === 'EARN' ? 'bgGreen textGreen' : 'bgRed textRed'">
                {{ item.type === 'EARN' ? t('fields.rebate') : t('fields.redeem') }}
              </td>
              <td :class="item.type === 'EARN' ? 'bgGreen textGreen' : 'bgRed textRed'">
                {{ formatMoney(item.rebateAmount) }}
              </td>
              <td>
                {{ item.status }}
              </td>
              <td>
                {{
                  formatMoney(item.afterBalance)
                }}
              </td>
              <td class="bgYellow textGreen" v-formatter="{ data: item.recordTime, type: 'date' }">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import Loading from '@/components/loading/Loading.vue'
import { formatMoney } from '@/utils/format-money'
import { getMemberPointRecordList } from '@/api/affiliate-report'
import moment from "moment";
import emptyComp from '@/components/empty';

const { t } = useI18n()

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [convertStartDate(new Date()), convertDate(new Date())],
  loginName: null,
  type: '',
})

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD');
}

function formatDate(date) {
  if (date === null || date.length === 0) {
    return "-"
  } else {
    return date[0] + "-" + zeroPad(date[1]) + "-" + zeroPad(date[2]) + " " + zeroPad(date[3]) + ":" + zeroPad(date[4]) + ":" + zeroPad(date[5])
  }
}

function zeroPad(num) {
  return String(num).padStart(2, '0')
}

async function loadRecords() {
  page.loading = true;
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  query.recordTime = query.recordTime.join(',')
  const { data: ret } = await getMemberPointRecordList(query)
  page.records = ret.records
  page.pages = ret.pages
  page.total = ret.total
  page.loading = false
}
</script>

<style lang="scss" scoped></style>
