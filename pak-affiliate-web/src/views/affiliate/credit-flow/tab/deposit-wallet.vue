<template>
  <el-form @submit.prevent>
    <div class="inputs-wrap">
      <el-row :gutter="20">
        <el-col :xl="6" :lg="6" :md="10">
          <el-form-item :label="t('fields.creditFlowType') + ' :'">
            <el-select
              size="normal"
              v-model="type.selectedType"
              :placeholder="t('fields.all')"
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in type.getType"
                :key="item"
                :value="item"
                :label="t(`creditFlowType.${item}`)"
              >
                {{ $t(`creditFlowType.${item}`) }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="7" :lg="8" :md="14">
          <el-form-item :label="t('fields.creditFlowDate') + ' :'">
            <el-date-picker
              v-model="request.date"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="normal"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="6">
          <div class="btn-grp">
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="loadCreditFlow()"
              size="normal"
            >
              {{ $t('fields.search') }}
            </el-button>
            <el-button size="normal" type="primary" plain @click="resetQuery()">
              {{ $t('fields.reset') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-form>
  <table style="width: 98%; margin: 0 auto" cellpadding="0" cellspacing="0" border="0" class="custom-table">
    <thead>
      <tr>
        <th scope="col">{{ t('fields.creditFlowId') }}</th>
        <th scope="col">{{ t('fields.creditFlowDate') }}</th>
        <th scope="col">{{ t('fields.serialNumber') }}</th>
        <th scope="col">{{ t('fields.creditFlowType') }}</th>
        <th scope="col">{{ t('fields.creditFlowAmount') }}</th>
        <th scope="col">{{ t('fields.creditFlowBalance') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in page.records" :key="item.id">
        <td :data-label="t('fields.creditFlowId')">{{ item.id }}</td>
        <td :data-label="t('fields.creditFlowDate')">
          <span v-if="item.date === null">-</span>
          <span v-if="item.date !== null" v-formatter="{ data: item.date, type: 'date'}" />
        </td>
        <td :data-label="t('fields.serialNumber')">{{ item.serialNumber }}</td>
        <td :data-label="t('fields.creditFlowType')">{{ $t(`creditFlowType.${item.type}`) }}</td>
        <td :data-label="t('fields.creditFlowAmount')">{{ item.amount }}</td>
        <td :data-label="t('fields.creditFlowBalance')">{{ item.balance }}</td>
      </tr>
    </tbody>
  </table>
  <emptyComp v-if="page.records.length === 0" />
  <el-pagination
    class="pagination"
    @current-change="changePage"
    layout="prev, pager, next"
    :page-size="request.size"
    :page-count="page.pages"
    :current-page="request.current"
  />
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import emptyComp from '@/components/empty'
import moment from 'moment'

import { getCreditFlow } from '../../../../api/affiliate-credit-flow'

const store = useStore()
const { t } = useI18n()

const type = reactive({
  selectedType: null,
  getType: [
    'DEPOSIT_WALLET_DEPOSIT',
    'DEPOSIT_WALLET_AFFILIATE_DEPOSIT',
    'DEPOSIT_WALLET_AMOUNT_ADJUST',
  ],
})

const request = reactive({
  siteId: null,
  affiliateId: null,
  category: null,
  type: null,
  date: null,
  size: 20,
  current: 1,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

async function loadCreditFlow() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  if (request.date != null) {
    if (request.date.length === 2) {
      query.date = request.date.join(',')
    }
  } else {
    query.date = null
  }

  query.affiliateId = store.state.user.id
  query.siteId = store.state.user.siteId
  query.category = 'DEPOSIT'
  query.size = 20

  const { data: ret } = await getCreditFlow(query)

  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function handleSelectChange() {
  request.type = type.selectedType
}

function resetQuery() {
  request.type = null
  request.date = null
  type.selectedType = null
  loadCreditFlow()
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadCreditFlow()
  }
}

onMounted(() => {
  loadCreditFlow()
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.grid-item {
  height: 110px;
  position: relative;
  border: 1px solid #f2f2f6;
  border-radius: 8px;
  padding: 20px;
}

.grid-item-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;

  span {
    font-size: 16px;
    font-weight: 600;
    color: #afb3c8;
  }
}

.grid-item-value {
  font-size: 16px;
  font-weight: 700;
}
</style>
